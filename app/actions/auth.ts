"use server";

import db from "@/DB/db";
import bcrypt from "bcryptjs";
import { createSession, deleteSession } from "../lib/session";
import { redirect } from "next/navigation";

/**
 * 회원가입 (Signup)
 */
export async function signup(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;

  if (!username || !phone || !password) {
    return { error: "모든 필드를 입력해주세요." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // 트랜잭션 정의: 사용자 생성 + 계좌 생성이 동시에 성공해야 함
    const executeSignup = db.transaction(() => {
      // 1. 사용자 삽입
      const userStmt = db.prepare(
        "INSERT INTO users (username, phone, password) VALUES (?, ?, ?)"
      );
      const userResult = userStmt.run(username, phone, hashedPassword);
      const userId = userResult.lastInsertRowid;

      // 2. 랜덤 10자리 계좌번호 생성 및 삽입
      const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      const accountStmt = db.prepare(
        "INSERT INTO accounts (account_number, balance, owner_id) VALUES (?, ?, ?)"
      );
      accountStmt.run(accountNumber, 0, userId);

      return { userId: Number(userId), phone };
    });

    // 트랜잭션 실행
    const newUser = executeSignup();

    // 3. 세션 생성
    await createSession(newUser.userId, newUser.phone);
    
  } catch (error: any) {
    console.error("Signup Error:", error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return { error: "이미 등록된 전화번호입니다." };
    }
    return { error: "회원가입 중 서버 오류가 발생했습니다." };
  }

  redirect("/Auth/signin");
}

/**
 * 로그인 (Signin)
 */
export async function signin(prevState: any, formData: FormData) {
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;

  if (!phone || !password) {
    return { error: "전화번호와 비밀번호를 입력해주세요." };
  }

  try {
    // 1. 사용자 조회 (get은 한 줄의 데이터만 가져옴)
    const user = db.prepare("SELECT * FROM users WHERE phone = ?").get(phone) as any;

    if (!user) {
      return { error: "계정이 존재하지 않거나 비밀번호가 틀렸습니다." };
    }

    // 2. 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { error: "계정이 존재하지 않거나 비밀번호가 틀렸습니다." };
    }

    // 3. 세션 생성
    await createSession(user.id, user.phone);

  } catch (error) {
    console.error("Signin Error:", error);
    return { error: "로그인 처리 중 서버 오류가 발생했습니다." };
  }

  redirect("/dashboard");
}

/**
 * 로그아웃 (Logout)
 */
export async function logout() {
  await deleteSession();
  redirect("/Auth/signin");
}