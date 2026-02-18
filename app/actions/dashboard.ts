"use server";

import db from "@/DB/db";
import { getSession } from "../lib/session";
import { error } from "console";

export async function getDashboardData() {
  const session = await getSession();
  if (!session) return null;

  try {
    // 1. 유저 및 계좌 정보
    const user = db.prepare(`
      SELECT u.username, a.id as account_id, a.account_number, a.balance 
      FROM users u 
      JOIN accounts a ON u.id = a.owner_id 
      WHERE u.id = ?
    `).get(session.userId) as any;

    // 2. 최근 거래 내역 조회 (상대방 이름 포함)
    // 이 쿼리는 내 계좌가 보낸이(sender)이거나 받은이(receiver)인 경우를 모두 가져옵니다.
    const transactions = db.prepare(`
      SELECT 
        t.*,
        CASE 
          WHEN t.type = 'DEPOSIT' THEN '나에게 입금'
          WHEN t.type = 'WITHDRAWAL' THEN '현금 출금'
          WHEN t.sender_id = ? THEN (SELECT u.username FROM users u JOIN accounts a ON u.id = a.owner_id WHERE a.id = t.receiver_id) || '님에게 송금'
          WHEN t.receiver_id = ? THEN (SELECT u.username FROM users u JOIN accounts a ON u.id = a.owner_id WHERE a.id = t.sender_id) || '님으로부터 입금'
          ELSE '거래'
        END as display_name
      FROM transactions t
      WHERE t.sender_id = ? OR t.receiver_id = ?
      ORDER BY t.timestamp DESC 
      LIMIT 10
    `).all(user.account_id, user.account_id, user.account_id, user.account_id);

    return { user, transactions };
  } catch (error) {
    console.error("Fetch dashboard data error:", error);
    return null;
  }
}

export async function depositMoney(amount:number) {
  const session = await getSession();
  if (!session) return { error: "로그인이 필요합니다." };

  try {
    const transaction = db.transaction(() => {
      // 1. 유저의 계좌 잔액 업데이트
      const updateStmt = db.prepare(`
        UPDATE accounts 
        SET balance = balance + ? 
        WHERE owner_id = ?
      `);
      updateStmt.run(amount, session.userId);

      // 2. 거래 내역(Transactions)에 입금 기록 추가
      const account = db.prepare("SELECT id FROM accounts WHERE owner_id = ?").get(session.userId) as { id: number };
      const historyStmt = db.prepare(`
        INSERT INTO transactions (type, amount, receiver_id, timestamp)
        VALUES ('DEPOSIT', ?, ?, DATETIME('now', 'localtime'))
      `);
      historyStmt.run(amount, account.id);

      return true;
    });
    
    transaction();
    return { success: true};
  } catch (error) {
    console.log("Deposit Error:", error);
    return { error: "입금 처리 중 오류가 발생했습니다."};
  }
}


export async function transferMoney(targetAccountNumber: string, amount: number) {
  const session = await getSession();
  if (!session) return { error: "로그인이 필요합니다." };

  try {
    const result = db.transaction(() => {
      // 1. 내 계좌 정보 및 잔액 확인
      const myAccount = db.prepare("SELECT id, balance FROM accounts WHERE owner_id = ?").get(session.userId) as any;
      
      if (!myAccount) throw new Error("내 계좌를 찾을 수 없습니다.");
      if (myAccount.balance < amount) throw new Error("잔액이 부족합니다.");

      // 2. 상대방 계좌 존재 확인
      const targetAccount = db.prepare("SELECT id FROM accounts WHERE account_number = ?").get(targetAccountNumber) as any;
      
      if (!targetAccount) throw new Error("존재하지 않는 계좌번호입니다.");
      if (targetAccount.id === myAccount.id) throw new Error("본인 계좌로는 이체할 수 없습니다.");

      // 3. 내 잔액 차감
      db.prepare("UPDATE accounts SET balance = balance - ? WHERE id = ?").run(amount, myAccount.id);

      // 4. 상대방 잔액 증액
      db.prepare("UPDATE accounts SET balance = balance + ? WHERE id = ?").run(amount, targetAccount.id);

      // 5. 거래 내역 기록 (TRANSFER 타입)
      db.prepare(`
        INSERT INTO transactions (type, amount, sender_id, receiver_id, timestamp)
        VALUES ('TRANSFER', ?, ?, ?, DATETIME('now', 'localtime'))
      `).run(amount, myAccount.id, targetAccount.id);

      return { success: true };
    })();

    return result;
  } catch (error: any) {
    console.error("Transfer Error:", error);
    // 에러 메시지를 사용자에게 친절하게 전달
    return { error: error.message || "이체 중 오류가 발생했습니다." };
  }
}

export async function getRecentTransfers() {
  const session = await getSession();
  if (!session) return null;

  try {
    // 1. 먼저 현재 로그인한 유저의 '계좌 ID'를 가져옵니다.
    const myAccount = db.prepare(`
      SELECT id FROM accounts WHERE owner_id = ?
    `).get(session.userId) as { id: number };

    if (!myAccount) return { transferLog: [] };

    // 2. 내가 보냈던(TRANSFER) 상대방들의 정보를 중복 없이 최신순으로 가져오기
    const transferLog = db.prepare(`
        SELECT DISTINCT 
            a.account_number, 
            u.username,
            MAX(t.timestamp) as last_transfer
        FROM transactions t
        JOIN accounts a ON t.receiver_id = a.id
        JOIN users u ON a.owner_id = u.id
        WHERE t.sender_id = ? AND t.type = 'TRANSFER'
        GROUP BY a.account_number
        ORDER BY last_transfer DESC
        LIMIT 5
    `).all(myAccount.id) as any[];

    return { 
      success: true,
      transferLog: transferLog 
    };
  } catch (error) {
    console.error("Fetch recent transfers error:", error);
    return { success: false, transferLog: [], error: "데이터를 불러오지 못했습니다." };
  }
}