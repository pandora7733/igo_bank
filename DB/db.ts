// DB/db.ts
import Database from 'better-sqlite3';
import path from 'path';

// DB 파일 경로 설정 (루트에 있는 igobank.db)
const dbPath = path.join(process.cwd(), 'igobank.db');

const db = new Database(dbPath, { 
    verbose: process.env.NODE_ENV !== 'production' ? console.log : undefined 
});

// 성능 최적화를 위한 설정 (WAL 모드)
db.pragma('journal_mode = WAL');

export default db;