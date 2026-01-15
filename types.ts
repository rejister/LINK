
import { Part } from "@google/genai";

export type ChatMessage = {
  id: string;
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
  urls?: { uri: string; title?: string }[];
  category?: Category;
  subCategory?: SubCategory;
  originalProblem?: string; // For solutions related to a specific problem
};

export type Category = '観光' | '医療' | '防災' | '教育' | 'その他';
export type SubCategory = '自然' | '文化' | 'イベント' | '介護' | '健康増進' | '避難' | 'インフラ' | '学校' | '生涯学習' | 'その他';

export type ProblemTag = {
  category: Category;
  subCategory: SubCategory;
};

export type ProblemCategoryStats = {
  [key in Category]: {
    count: number;
    subCategories: {
      [key in SubCategory]?: number;
    };
  };
};

export type QuizQuestion = {
  id: string; // Unique ID for the question
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  category: Category;
  subCategory: SubCategory;
};

export type DynamicQuiz = {
  id: string;
  title: string;
  questions: QuizQuestion[];
  basedOnProblem?: string; // Original problem text it was generated from
  category?: Category;
  subCategory?: SubCategory;
};

export type CommunityLink = {
  id: string;
  title: string;
  description: string;
  url: string;
  category: Category;
  subCategory?: SubCategory;
};

export type GeminiPart = Part; // Alias for clarity

export enum AppView {
  CHAT = 'chat',
  QUIZ = 'quiz',
  DASHBOARD = 'dashboard',
  COMMUNITY = 'community',
  LEARNING_STATS = 'learning_stats', // New view for learning statistics
}