import { db } from "./db";
import { userProgress, vocabularyItems, scenarios, users, User, DbUserProgress, DbVocabularyItem, DbScenario } from "@shared/schema";
import type { UserProgress, Scenario, VocabularyItem, QuizResult } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  async getProgress(userId: string, language: string): Promise<UserProgress> {
    // For demo-user, use ID 1 (we'll create this user if it doesn't exist)
    const userIdNum = userId === "demo-user" ? 1 : parseInt(userId);
    
    const [existing] = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userIdNum), eq(userProgress.language, language)))
      .limit(1);

    if (existing) {
      return {
        userId: userId,
        language: existing.language,
        completedScenarios: existing.completedScenarios as string[],
        masteredWords: existing.masteredWords as string[],
        currentStreak: existing.currentStreak,
        lastStudyDate: existing.lastStudyDate,
        totalWordsLearned: existing.totalWordsLearned,
      };
    }

    const newProgress: UserProgress = {
      userId,
      language,
      completedScenarios: [],
      masteredWords: [],
      currentStreak: 0,
      lastStudyDate: new Date().toISOString().split('T')[0],
      totalWordsLearned: 0,
    };

    await db.insert(userProgress).values({
      userId: userIdNum,
      language,
      completedScenarios: [],
      masteredWords: [],
      currentStreak: 0,
      lastStudyDate: newProgress.lastStudyDate,
      totalWordsLearned: 0,
    });

    return newProgress;
  }

  async updateProgress(userId: string, language: string, update: Partial<UserProgress>): Promise<UserProgress> {
    const userIdNum = userId === "demo-user" ? 1 : parseInt(userId);
    const current = await this.getProgress(userId, language);

    const updated: UserProgress = {
      ...current,
      ...update,
      userId,
      language,
    };

    // Only update fields that are provided to avoid NULL overwrites
    const updateData: any = { updatedAt: new Date() };
    if (update.completedScenarios !== undefined) updateData.completedScenarios = updated.completedScenarios;
    if (update.masteredWords !== undefined) updateData.masteredWords = updated.masteredWords;
    if (update.currentStreak !== undefined) updateData.currentStreak = updated.currentStreak;
    if (update.lastStudyDate !== undefined) updateData.lastStudyDate = updated.lastStudyDate;
    if (update.totalWordsLearned !== undefined) updateData.totalWordsLearned = updated.totalWordsLearned;

    await db
      .update(userProgress)
      .set(updateData)
      .where(and(eq(userProgress.userId, userIdNum), eq(userProgress.language, language)));

    return updated;
  }

  async getScenario(scenarioId: string, language: string): Promise<Scenario | undefined> {
    const [scenario] = await db
      .select()
      .from(scenarios)
      .where(and(eq(scenarios.id, scenarioId), eq(scenarios.language, language)))
      .limit(1);

    if (!scenario) {
      return undefined;
    }

    const vocabItems = await db
      .select()
      .from(vocabularyItems)
      .where(and(eq(vocabularyItems.scenarioId, scenarioId), eq(vocabularyItems.language, language)));

    const vocabulary: VocabularyItem[] = vocabItems.map((item) => ({
      id: item.id,
      word: item.word,
      translation: item.translation,
      pronunciation: item.pronunciation,
      exampleSentence: item.exampleSentence,
      exampleTranslation: item.exampleTranslation,
      imageUrl: item.imageUrl || undefined,
      difficulty: item.difficulty as "beginner" | "intermediate" | "advanced",
    }));

    return {
      id: scenario.id,
      title: scenario.title,
      description: scenario.description,
      imageUrl: scenario.imageUrl,
      icon: scenario.icon,
      vocabulary,
    };
  }

  async getAllScenarios(language: string): Promise<Scenario[]> {
    const allScenarios = await db
      .select()
      .from(scenarios)
      .where(eq(scenarios.language, language));

    const result: Scenario[] = [];

    for (const scenario of allScenarios) {
      const vocabItems = await db
        .select()
        .from(vocabularyItems)
        .where(and(eq(vocabularyItems.scenarioId, scenario.id), eq(vocabularyItems.language, language)));

      const vocabulary: VocabularyItem[] = vocabItems.map((item) => ({
        id: item.id,
        word: item.word,
        translation: item.translation,
        pronunciation: item.pronunciation,
        exampleSentence: item.exampleSentence,
        exampleTranslation: item.exampleTranslation,
        imageUrl: item.imageUrl || undefined,
        difficulty: item.difficulty as "beginner" | "intermediate" | "advanced",
      }));

      result.push({
        id: scenario.id,
        title: scenario.title,
        description: scenario.description,
        imageUrl: scenario.imageUrl,
        icon: scenario.icon,
        vocabulary,
      });
    }

    return result;
  }

  async submitQuiz(userId: string, language: string, result: QuizResult): Promise<void> {
    const current = await this.getProgress(userId, language);

    if (!current.completedScenarios.includes(result.scenarioId) && result.score >= result.totalQuestions * 0.7) {
      current.completedScenarios.push(result.scenarioId);
    }

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (current.lastStudyDate === yesterday) {
      current.currentStreak += 1;
    } else if (current.lastStudyDate !== today) {
      current.currentStreak = 1;
    }

    current.lastStudyDate = today;

    await this.updateProgress(userId, language, current);
  }
}

export const dbStorage = new DatabaseStorage();
