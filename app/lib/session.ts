import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// 1. 비밀 키 설정 (실제 서비스에서는 .env 파일에 보관하세요)
const secretKey = "igobank_secret_key_random_string"; // .env로 변경해야함
const encodedKey = new TextEncoder().encode(secretKey);

// 세션 데이터 타입 정의
export interface SessionPayload {
  userId: number;
  phone: string;
  expiresAt: Date;
}

/**
 * 세션 데이터 암호화 (JWT 생성)
 */
export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // 7일 유지
    .sign(encodedKey);
}

/**
 * 세션 데이터 복호화 (JWT 검증)
 */
export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    console.log("Failed to verify session");
    return null;
  }
}

/**
 * 세션 생성 및 쿠키 저장
 */
export async function createSession(userId: number, phone: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7일 후 만료
  const session = await encrypt({ userId, phone, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,     // 클라이언트 자바스크립트에서 접근 불가 (보안)
    secure: true,       // HTTPS에서만 전송
    expires: expiresAt,
    sameSite: "lax",    // CSRF 공격 방지
    path: "/dashboard",
  });
}

/**
 * 세션 삭제 (로그아웃)
 */
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

/**
 * 현재 세션 정보 가져오기 (서버 컴포넌트용)
 */
export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}