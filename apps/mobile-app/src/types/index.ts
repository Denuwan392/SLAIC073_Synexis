export interface Message {
  id: string;
  content: string;
  sender: User;
  timestamp: Date;
}

export interface User {
  id: string;
  name: string;
  language: 'Sinhala' | 'Tamil' | 'English';
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}