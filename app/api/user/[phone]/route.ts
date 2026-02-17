import { NextRequest, NextResponse } from "next/server";
import db from "@/DB/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ phone: string }> }
) {
  try {
    // 1. URL 파라미터에서 전화번호 추출
    const { phone } = await params;

    // 2. DB에서 해당 전화번호를 가진 사용자 조회
    // 보안상 비밀번호나 계좌 잔액은 제외하고 이름과 ID만 선택합니다.
    const user = db.prepare(`
      SELECT id, username 
      FROM users 
      WHERE phone = ?
    `).get(phone) as { id: number; username: string };

    // 3. 사용자가 존재하지 않는 경우
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: "해당 전화번호로 등록된 사용자가 없습니다." 
        }, 
        { status: 404 }
      );
    }

    // 4. 성공 응답 (ID는 문자열로 변환하여 일관성 유지)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id.toString(),
        username: user.username
      }
    });

  } catch (error) {
    console.error("User API Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "서버 내부 오류가 발생했습니다." 
      }, 
      { status: 500 }
    );
  }
}