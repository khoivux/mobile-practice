import * as SQLite from 'expo-sqlite';

const DB_NAME = 'StudentRoom.db';
let dbInstance: SQLite.SQLiteDatabase | null = null;
let initPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export const AppDB = {
  getInstance: async () => {
    if (dbInstance) return dbInstance;
    
    if (initPromise) return initPromise;

    initPromise = (async () => {
      const db = await SQLite.openDatabaseAsync(DB_NAME);
      
      // Create tables
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS Accounts (
          username TEXT PRIMARY KEY NOT NULL,
          password TEXT,
          role TEXT
        );
        CREATE TABLE IF NOT EXISTS Students (
          code TEXT PRIMARY KEY NOT NULL,
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

      // Initial Data Seeding (Room Pattern)
      const adminCount = await db.getFirstAsync<{count: number}>('SELECT count(*) as count FROM Accounts WHERE username = ?', ['admin']);
      if (adminCount && adminCount.count === 0) {
        await db.runAsync('INSERT INTO Accounts (username, password, role) VALUES (?, ?, ?)', ['admin', '123', 'admin']);
        await db.runAsync('INSERT INTO Students (code, name, className) VALUES (?, ?, ?)', ['B22DCCN588', 'To An An', 'NHOM1']);
        await db.runAsync('INSERT INTO Scores (codeStudent, subject, score) VALUES (?, ?, ?)', ['B22DCCN588', 'Android', 8]);
        console.log('Room Database Seeded Successfully');
      }

      dbInstance = db;
      return db;
    })();

    return initPromise;
  }
};
