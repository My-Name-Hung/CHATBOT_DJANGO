export type Role = 'user' | 'assistant';

export interface Message {
  role: Role;
  content: string;
  timestamp?: string;
}

export interface User {
  id: string;
  email: string;
  createdAt?: string;
}

export interface ChatHistory {
  id: string;
  userId: string;
  createdAt: string;
  messages: Message[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
}