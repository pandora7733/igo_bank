"use server";

import db from "@/DB/db";
import { getSession } from "../lib/session";
import { error } from "console";

// export async function getDashboardData() {
//   const session = await getSession();
  
//   if (!session) return null;

//   try {
//     // 1. 유저 정보와 해당 유저의 계좌 정보를 JOIN으로 가져옵니다.
//     // 회원가입 시 계좌가 하나 생성되므로, 첫 번째 계좌를 가져옵니다.
//     const userData = db.prepare(`
//       SELECT u.username, a.account_number, a.balance 
//       FROM users u 
//       JOIN accounts a ON u.id = a.owner_id 
//       WHERE u.id = ?
//     `).get(session.userId) as { username: string; account_number: string; balance: number };

//     // 2. 최근 거래 내역도 가져옵니다. (현재는 빈 배열이겠지만 미리 준비)
//     const transactions = db.prepare(`
//       SELECT * FROM transactions 
//       WHERE sender_id = (SELECT id FROM accounts WHERE owner_id = ?) 
//          OR receiver_id = (SELECT id FROM accounts WHERE owner_id = ?)
//       ORDER BY timestamp DESC LIMIT 5
//     `).all(session.userId, session.userId);

//     return {
//       user: userData,
//       transactions: transactions
//     };
//   } catch (error) {
//     console.error("Dashboard data fetch error:", error);
//     return null;
//   }
// }

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