
export type UserMode = "business" | "personal";

export interface FeedbackItem {
  message: string;
  valid: boolean;
  type?: 'success' | 'warning' | 'error';
}

export interface PasswordAnalysis {
  score: number;
  message: string;
  feedback: FeedbackItem[];
  suggestedPassword?: string; // Add this field for suggested password
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  analysis?: PasswordAnalysis;
}
