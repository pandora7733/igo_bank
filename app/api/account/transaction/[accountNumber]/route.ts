import { NextRequest, NextResponse } from "next/server";
import db from "@/DB/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ accountNumber: string }> }
) {
  try {
    const { accountNumber } = await params;

    // 1. 먼저 해당 계좌번호가 존재하는지 확인하고 ID를 가져옵니다.
    const account = db.prepare("SELECT id FROM accounts WHERE account_number = ?").get(accountNumber) as { id: number };

    if (!account) {
      return NextResponse.json(
        { success: false, message: "계좌를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 2. 해당 계좌 ID가 보내는 사람(sender_id)이거나 받는 사람(receiver_id)인 모든 내역 조회
    // 시간순(최신순)으로 정렬합니다.
    const transactions = db.prepare(`
      SELECT 
        id,
        type,
        amount,
        sender_id,
        receiver_id,
        timestamp
      FROM transactions
      WHERE sender_id = ? OR receiver_id = ?
      ORDER BY timestamp DESC
    `).all(account.id, account.id);

    // 3. 결과 반환
    return NextResponse.json({
      success: true,
      account_number: accountNumber,
      total_count: transactions.length,
      transactions: transactions
    });

  } catch (error) {
    console.error("Transaction API Error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}