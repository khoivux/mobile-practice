import { Account, Student, Score, ScoreView } from '../entities/StudentEntities';
import { AppDB } from './AppDB';

export const DAO = {
  // ---------------- ACCOUNT ----------------
  insertAccount: async (account: Account) => {
    const db = await AppDB.getInstance();
    const result = await db.runAsync(
      'INSERT OR REPLACE INTO Accounts (username, password, role) VALUES (?, ?, ?)',
      [account.username, account.password || '', account.role]
    );
    return result.changes > 0;
  },

  login: async (u: string, p: string): Promise<Account | null> => {
    const db = await AppDB.getInstance();
    const result = await db.getFirstAsync<Account>(
      'SELECT * FROM Accounts WHERE username = ? AND password = ?',
      [u, p]
    );
    return result;
  },

  // ---------------- STUDENT ----------------
  insertStudent: async (student: Student) => {
    const db = await AppDB.getInstance();
    const result = await db.runAsync(
      'INSERT OR REPLACE INTO Students (code, name, className) VALUES (?, ?, ?)',
      [student.code, student.name, student.className]
    );
    return result.changes > 0;
  },

  updateStudent: async (student: Student) => {
    const db = await AppDB.getInstance();
    const result = await db.runAsync(
      'UPDATE Students SET name = ?, className = ? WHERE code = ?',
      [student.name, student.className, student.code]
    );
    return result.changes > 0;
  },

  deleteStudent: async (code: string) => {
    const db = await AppDB.getInstance();
    const result = await db.runAsync('DELETE FROM Students WHERE code = ?', [code]);
    return result.changes > 0;
  },

  getAllStudents: async (): Promise<Student[]> => {
    const db = await AppDB.getInstance();
    return await db.getAllAsync<Student>('SELECT * FROM Students');
  },

  getStudentByCode: async (code: string): Promise<Student | null> => {
    const db = await AppDB.getInstance();
    return await db.getFirstAsync<Student>('SELECT * FROM Students WHERE code = ?', [code]);
  },

  // ---------------- SCORE ----------------
  insertScore: async (score: Score) => {
    const db = await AppDB.getInstance();
    const result = await db.runAsync(
      'INSERT INTO Scores (codeStudent, subject, score) VALUES (?, ?, ?)',
      [score.codeStudent, score.subject, score.score]
    );
    return result.changes > 0;
  },

  getScores: async (): Promise<ScoreView[]> => {
    const db = await AppDB.getInstance();
    return await db.getAllAsync<ScoreView>(
      `SELECT st.name, s.subject, s.score 
       FROM Scores s JOIN Students st 
       ON s.codeStudent = st.code`
    );
  }
};
