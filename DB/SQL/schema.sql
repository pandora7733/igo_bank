-- 1. 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. 계좌 테이블
CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_number TEXT NOT NULL UNIQUE,
    balance REAL DEFAULT 0.0 CHECK(balance >= 0), -- 잔액은 0보다 작을 수 없음
    owner_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
);

-- 3. 거래 내역 테이블
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL, -- 'DEPOSIT(입금)', 'WITHDRAWAL(출금)', 'TRANSFER(이체/송금)'
    amount REAL NOT NULL CHECK(amount > 0),
    sender_id INTEGER, -- 출금/이체 시 사용 (입금 시 NULL 가능)
    receiver_id INTEGER, -- 입금/이체 시 사용 (출금 시 NULL 가능)
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES accounts (id),
    FOREIGN KEY (receiver_id) REFERENCES accounts (id)
);

-- 검색 성능 향상을 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_accounts_owner ON accounts(owner_id);
CREATE INDEX IF NOT EXISTS idx_transactions_sender ON transactions(sender_id);
CREATE INDEX IF NOT EXISTS idx_transactions_receiver ON transactions(receiver_id);