import path from 'path';
import fs from 'fs';

const isProd = process.env.NODE_ENV === 'production';
const isNextBuild = process.env.NEXT_PHASE === 'phase-production-build';

let db: any;

if (!isNextBuild) {
  const Database = require('better-sqlite3');
  
  let dbPath: string;
  if (isProd) {
    const resourcesPath = (process as any).resourcesPath;
    const dbDir = path.join(resourcesPath, 'DB');
    
    // 1. DB 폴더가 없으면 생성 (extraResources 사용 시 이미 존재할 확률 높음)
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    dbPath = path.join(dbDir, 'database.sqlite');
  } else {
    dbPath = path.join(process.cwd(), 'DB', 'database.sqlite');
  }

  db = new Database(dbPath);

  // 2. 테이블 자동 생성 로직 (여기에 필요한 모든 테이블 스키마를 추가하세요)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    -- 필요한 다른 테이블(계좌 등)도 여기에 추가 가능
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      accountNumber TEXT UNIQUE,
      balance INTEGER DEFAULT 0,
      FOREIGN KEY(userId) REFERENCES users(id)
    );
  `);
  
  console.log('Database and Tables are ready.');
} else {
  db = {
    prepare: () => ({ all: () => [], get: () => ({}), run: () => ({}) }),
    exec: () => {}
  };
}

export default db;