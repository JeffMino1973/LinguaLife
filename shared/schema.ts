import { z } from "zod";
import { pgTable, varchar, text, integer, timestamp, json, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Vocabulary word/phrase with translations
export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  pronunciation: string;
  exampleSentence: string;
  exampleTranslation: string;
  imageUrl?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

// Life skills scenario
export interface Scenario {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  icon: string;
  vocabulary: VocabularyItem[];
}

// User progress tracking
export interface UserProgress {
  userId: string;
  language: string;
  completedScenarios: string[];
  masteredWords: string[];
  currentStreak: number;
  lastStudyDate: string;
  totalWordsLearned: number;
}

// Quiz question
export interface QuizQuestion {
  id: string;
  type: "multiple-choice" | "fill-blank" | "matching";
  question: string;
  options?: string[];
  correctAnswer: string;
  vocabularyId: string;
}

// Quiz result
export interface QuizResult {
  scenarioId: string;
  difficulty: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

// Zod schemas for validation
export const vocabularyItemSchema = z.object({
  id: z.string(),
  word: z.string(),
  translation: z.string(),
  pronunciation: z.string(),
  exampleSentence: z.string(),
  exampleTranslation: z.string(),
  imageUrl: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
});

export const progressUpdateSchema = z.object({
  scenarioId: z.string().optional(),
  wordId: z.string().optional(),
  action: z.enum(["complete-scenario", "master-word", "update-streak"]),
});

export const quizSubmitSchema = z.object({
  scenarioId: z.string(),
  difficulty: z.string(),
  score: z.number(),
  totalQuestions: z.number(),
});

export type ProgressUpdate = z.infer<typeof progressUpdateSchema>;
export type QuizSubmit = z.infer<typeof quizSubmitSchema>;

// Drizzle Database Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("student"),
  parentId: integer("parent_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const scenarios = pgTable("scenarios", {
  id: varchar("id", { length: 100 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull().default(""),
  icon: varchar("icon", { length: 100 }).notNull(),
  language: varchar("language", { length: 50 }).notNull(),
});

export const vocabularyItems = pgTable("vocabulary_items", {
  id: varchar("id", { length: 100 }).primaryKey(),
  scenarioId: varchar("scenario_id", { length: 100 }).notNull(),
  word: varchar("word", { length: 255 }).notNull(),
  translation: varchar("translation", { length: 255 }).notNull(),
  pronunciation: varchar("pronunciation", { length: 255 }).notNull(),
  exampleSentence: text("example_sentence").notNull(),
  exampleTranslation: text("example_translation").notNull(),
  imageUrl: text("image_url"),
  difficulty: varchar("difficulty", { length: 20 }).notNull(),
  language: varchar("language", { length: 50 }).notNull(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  language: varchar("language", { length: 50 }).notNull(),
  completedScenarios: json("completed_scenarios").$type<string[]>().notNull().default([]),
  masteredWords: json("mastered_words").$type<string[]>().notNull().default([]),
  currentStreak: integer("current_streak").notNull().default(0),
  lastStudyDate: varchar("last_study_date", { length: 20 }).notNull(),
  totalWordsLearned: integer("total_words_learned").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  badgeType: varchar("badge_type", { length: 100 }).notNull(),
  badgeName: varchar("badge_name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
});

export const reviewSchedule = pgTable("review_schedule", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  vocabularyId: varchar("vocabulary_id", { length: 100 }).notNull(),
  language: varchar("language", { length: 50 }).notNull(),
  easeFactor: integer("ease_factor").notNull().default(250),
  interval: integer("interval").notNull().default(0),
  repetitions: integer("repetitions").notNull().default(0),
  nextReviewDate: timestamp("next_review_date").notNull(),
  lastReviewedAt: timestamp("last_reviewed_at"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertScenarioSchema = createInsertSchema(scenarios);
export const insertVocabularyItemSchema = createInsertSchema(vocabularyItems);
export const insertUserProgressSchema = createInsertSchema(userProgress).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAchievementSchema = createInsertSchema(achievements).omit({ id: true, earnedAt: true });
export const insertReviewScheduleSchema = createInsertSchema(reviewSchedule).omit({ id: true, lastReviewedAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type DbScenario = typeof scenarios.$inferSelect;
export type InsertScenario = z.infer<typeof insertScenarioSchema>;
export type DbVocabularyItem = typeof vocabularyItems.$inferSelect;
export type InsertVocabularyItem = z.infer<typeof insertVocabularyItemSchema>;
export type DbUserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type ReviewSchedule = typeof reviewSchedule.$inferSelect;
export type InsertReviewSchedule = z.infer<typeof insertReviewScheduleSchema>;
