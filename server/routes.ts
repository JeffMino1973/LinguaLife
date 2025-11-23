import type { Express } from "express";
import { createServer, type Server } from "http";
import { dbStorage as storage } from "./db-storage";
import { progressUpdateSchema, quizSubmitSchema } from "@shared/schema";
import { registerAuthRoutes, getCurrentUserId, getCurrentUserIdOrDefault } from "./auth-routes";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register authentication routes
  registerAuthRoutes(app);

  app.get("/api/scenarios/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const language = (req.query.language as string) || "spanish";
      
      const scenario = await storage.getScenario(id, language);
      
      if (!scenario) {
        return res.status(404).json({ error: "Scenario not found" });
      }

      res.json(scenario);
    } catch (error) {
      console.error("Error fetching scenario:", error);
      res.status(500).json({ error: "Failed to fetch scenario" });
    }
  });

  app.get("/api/scenarios", async (req, res) => {
    try {
      const language = (req.query.language as string) || "spanish";
      const scenarios = await storage.getAllScenarios(language);
      res.json(scenarios);
    } catch (error) {
      console.error("Error fetching scenarios:", error);
      res.status(500).json({ error: "Failed to fetch scenarios" });
    }
  });

  app.get("/api/progress/:language", async (req, res) => {
    try {
      const { language } = req.params;
      // Allow unauthenticated access for backward compatibility (defaults to demo user)
      const userId = getCurrentUserIdOrDefault(req);
      const progress = await storage.getProgress(userId, language);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  app.post("/api/progress", async (req, res) => {
    try {
      const validated = progressUpdateSchema.parse(req.body);
      const language = (req.query.language as string) || "spanish";
      // Require authentication for mutations
      const userId = getCurrentUserId(req);
      
      const current = await storage.getProgress(userId, language);
      
      if (validated.action === "master-word" && validated.wordId) {
        if (!current.masteredWords.includes(validated.wordId)) {
          current.masteredWords.push(validated.wordId);
          current.totalWordsLearned += 1;
        }
      } else if (validated.action === "complete-scenario" && validated.scenarioId) {
        if (!current.completedScenarios.includes(validated.scenarioId)) {
          current.completedScenarios.push(validated.scenarioId);
        }
      } else if (validated.action === "update-streak") {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
        if (current.lastStudyDate === yesterday) {
          current.currentStreak += 1;
        } else if (current.lastStudyDate !== today) {
          current.currentStreak = 1;
        }
        
        current.lastStudyDate = today;
      }

      const updated = await storage.updateProgress(userId, language, current);
      res.json(updated);
    } catch (error: any) {
      if (error.message === "Authentication required") {
        return res.status(401).json({ error: "Authentication required" });
      }
      console.error("Error updating progress:", error);
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.post("/api/quiz/submit", async (req, res) => {
    try {
      const validated = quizSubmitSchema.parse(req.body);
      const language = (req.query.language as string) || "spanish";
      // Require authentication for mutations
      const userId = getCurrentUserId(req);
      
      await storage.submitQuiz(userId, language, {
        ...validated,
        completedAt: new Date().toISOString(),
      });

      const updated = await storage.getProgress(userId, language);
      res.json(updated);
    } catch (error: any) {
      if (error.message === "Authentication required") {
        return res.status(401).json({ error: "Authentication required" });
      }
      console.error("Error submitting quiz:", error);
      res.status(400).json({ error: "Invalid request" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
