export interface Account {
  username: string;
  password?: string;
  role: string;
}

export interface Student {
  code: string;
  name: string;
  className: string;
}

export interface Score {
  id: number;
  codeStudent: string;
  subject: string;
  score: number;
  studentName?: string; // For joined queries
}
