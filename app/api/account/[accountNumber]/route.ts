import { NextRequest, NextResponse } from "next/server";
import db from "@/DB/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ accountNumber: string }> }
) {
  try {
    // 1. 동적 파라미터에서 계좌번호 추출
    const { accountNumber } = await params;

    // 2. DB에서 정보 조회 (인증 과정 생략)
    // users와 accounts 테이블을 조인하여 필요한 정보를 한 번에 가져옵니다.
    const account = db.prepare(`
      SELECT 
        u.id, 
        u.username, 
        a.account_number, 
        a.balance, 
        a.created_at
      FROM accounts a
      JOIN users u ON a.owner_id = u.id
      WHERE a.account_number = ?
    `).get(accountNumber) as { 
      id: number; 
      username: string; 
      account_number: string; 
      balance: number; 
      created_at: string; 
    };

    // 3. 계좌가 존재하지 않을 경우의 처리
    if (!account) {
      return NextResponse.json(
        { 
          success: false, 
          message: "해당 계좌번호를 찾을 수 없습니다." 
        }, 
        { status: 404 }
      );
    }

    // 4. 요청하신 포맷으로 최종 데이터 반환
    return NextResponse.json({
      success: true,
      account: {
        id: account.id.toString(),
        username: account.username,
        account_number: account.account_number,
        balance: account.balance,
        created_at: account.created_at
      }
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "서버 내부 오류가 발생했습니다." 
      }, 
      { status: 500 }
    );
  }
}