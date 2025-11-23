import type { UserProgress, Scenario, QuizResult } from "@shared/schema";

export interface IStorage {
  getProgress(userId: string, language: string): Promise<UserProgress>;
  updateProgress(userId: string, language: string, update: Partial<UserProgress>): Promise<UserProgress>;
  getScenario(scenarioId: string, language: string): Promise<Scenario | undefined>;
  getAllScenarios(language: string): Promise<Scenario[]>;
  submitQuiz(userId: string, language: string, result: QuizResult): Promise<void>;
}

export class MemStorage implements IStorage {
  private progress: Map<string, UserProgress>;

  constructor() {
    this.progress = new Map();
  }

  private getProgressKey(userId: string, language: string): string {
    return `${userId}-${language}`;
  }

  async getProgress(userId: string, language: string): Promise<UserProgress> {
    const key = this.getProgressKey(userId, language);
    const existing = this.progress.get(key);
    
    if (existing) {
      return existing;
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

    this.progress.set(key, newProgress);
    return newProgress;
  }

  async updateProgress(userId: string, language: string, update: Partial<UserProgress>): Promise<UserProgress> {
    const key = this.getProgressKey(userId, language);
    const current = await this.getProgress(userId, language);
    
    const updated: UserProgress = {
      ...current,
      ...update,
      userId,
      language,
    };

    this.progress.set(key, updated);
    return updated;
  }

  async getScenario(scenarioId: string, language: string): Promise<Scenario | undefined> {
    const { getScenarioVocabulary } = await import("./data/vocabulary");
    return getScenarioVocabulary(scenarioId, language);
  }

  async getAllScenarios(language: string): Promise<Scenario[]> {
    const { scenariosData } = await import("./data/vocabulary");
    return Object.values(scenariosData);
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

export const storage = new MemStorage();
