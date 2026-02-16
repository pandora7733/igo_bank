"use server";

import db from "@/DB/db";
import { getSession } from "../lib/session";

export async function getDashboardData() {
  const session = await getSession();
  
  if (!session) return null;

  try {
    // 1. 유저 정보와 해당 유저의 계좌 정보를 JOIN으로 가져옵니다.
    // 회원가입 시 계좌가 하나 생성되므로, 첫 번째 계좌를 가져옵니다.
    const userData = db.prepare(`
      SELECT u.username, a.account_number, a.balance 
      FROM users u 
      JOIN accounts a ON u.id = a.owner_id 
      WHERE u.id = ?
    `).get(session.userId) as { username: string; account_number: string; balance: number };

    // 2. 최근 거래 내역도 가져옵니다. (현재는 빈 배열이겠지만 미리 준비)
    const transactions = db.prepare(`
      SELECT * FROM transactions 
      WHERE sender_id = (SELECT id FROM accounts WHERE owner_id = ?) 
         OR receiver_id = (SELECT id FROM accounts WHERE owner_id = ?)
      ORDER BY timestamp DESC LIMIT 5
    `).all(session.userId, session.userId);

    return {
      user: userData,
      transactions: transactions
    };
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    return null;
  }
}