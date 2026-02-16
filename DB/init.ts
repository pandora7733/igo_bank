// DB/init.ts
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// 1. DB 연결 (파일이 없으면 자동 생성됨)
const db = new Database('igobank.db', { verbose: console.log });

try {
    // 2. schema.sql 파일 읽기
    // 파일 경로가 다를 경우 path.join을 사용해 정확히 지정하세요.
    const schemaPath = path.join(__dirname, './SQL/schema.sql'); 
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // 3. 읽어온 SQL 실행
    db.exec(schema);
    
    console.log("✅ schema.sql로부터 테이블 생성 완료!");
} catch (err) {
    console.error("❌ DB 초기화 중 에러 발생:", err);
} finally {
    db.close();
}