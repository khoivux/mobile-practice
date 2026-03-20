import * as SQLite from 'expo-sqlite';
import { Account, Score, Student } from '../models/StudentManagerTypes';

const DB_NAME = 'StudentDB.db';

export const initDB = async () => {
  const db = await SQLite.openDatabaseAsync(DB_NAME);

  // Create tables
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS Accounts (
      username TEXT PRIMARY KEY,
      password TEXT,
      role TEXT
    );
    CREATE TABLE IF NOT EXISTS Students (
      code TEXT PRIMARY KEY,
      name TEXT,
      className TEXT
    );
    CREATE TABLE IF NOT EXISTS Scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codeStudent TEXT,
      subject TEXT,
      score REAL
    );
  `);

  // Initial Seeding
  const adminCheck = await db.getFirstAsync<{count: number}>('SELECT count(*) as count FROM Accounts WHERE username = ?', ['admin']);
  if (adminCheck && adminCheck.count === 0) {
    await db.runAsync('INSERT INTO Accounts (username, password, role) VALUES (?, ?, ?)', ['admin', '123', 'admin']);
    
    await db.runAsync('INSERT INTO Students (code, name, className) VALUES (?, ?, ?)', ['B22DCCN588', 'To An An', 'NHOM1']);
    await db.runAsync('INSERT INTO Students (code, name, className) VALUES (?, ?, ?)', ['B22DCCN559', 'Lai Thi Ha', 'NHOM1']);

    await db.runAsync('INSERT INTO Scores(codeStudent, subject, score) VALUES (?, ?, ?)', ['B22DCCN588', 'PTUD cho TBDD', 8]);
    await db.runAsync('INSERT INTO Scores(codeStudent, subject, score) VALUES (?, ?, ?)', ['B22DCCN588', 'LTHDT', 5]);
    await db.runAsync('INSERT INTO Scores(codeStudent, subject, score) VALUES (?, ?, ?)', ['B22DCCN559', 'PTUD cho TBDD', 4]);
    
    console.log('Database seeded successfully');
  }

  return db;
};

export const DBHelper = {
  checkLogin: async (username: string, password: string): Promise<boolean> => {
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    const result = await db.getFirstAsync('SELECT * FROM Accounts WHERE username = ? AND password = ?', [username, password]);
    return result !== null;
  },

  getScores: async () => {
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    return await db.getAllAsync<Score>(`
      SELECT st.name as studentName, s.subject, s.score 
      FROM Scores s 
      JOIN Students st ON s.codeStudent = st.code
    `);
  },

  insertAccount: async (account: Account) => {
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    const result = await db.runAsync('INSERT INTO Accounts (username, password, role) VALUES (?, ?, ?)', [account.username, account.password || '', account.role]);
    return result.changes > 0;
  },

  insertStudent: async (student: Student) => {
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    const result = await db.runAsync('INSERT INTO Students (code, name, className) VALUES (?, ?, ?)', [student.code, student.name, student.className]);
    return result.changes > 0;
  },

  insertScore: async (codeStudent: string, subject: string, score: number) => {
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    const result = await db.runAsync('INSERT INTO Scores (codeStudent, subject, score) VALUES (?, ?, ?)', [codeStudent, subject, score]);
    return result.changes > 0;
  }
};
