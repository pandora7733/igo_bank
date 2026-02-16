"use client"

import Image from "next/image"
import { useRouter } from "next/navigation";
import { signin } from "@/app/actions/auth";
import { useActionState } from "react";

export default function SignIn() {
  const [state, formAction, isPending] = useActionState(signin, null);

  const router = useRouter();
  const onClick = () => {
    router.push("/Auth/signup");
  }

  return (
    <div className="grid grid-cols-2 h-screen">
      {/* 왼쪽 구역: 로그인 테마로 문구 수정 */}
      <div className="bg-gradient-to-b from-green-700 to-emerald-500 p-6 flex flex-col items-center text-white">
        <div className="grow flex flex-col items-center justify-center">
          <h1 className="font-bold mb-10 text-5xl text-center">Welcome Back!</h1>
          <div className="relative w-40 h-40 mb-6 border-4 border-white/20 rounded-full overflow-hidden bg-white shadow-xl">
            <Image src="/image/IGOBANK_logo.png" alt="IGOBANK logo" fill className="object-contain p-4" />
          </div>
          <h1 className="text-2xl mb-6 font-bold tracking-wider">IGO BANK</h1>
          <p className="text-center max-w-sm opacity-90 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias nisi et, nihil tempora assumenda ipsam animi libero ex incidunt! Autem pariatur nulla labore eaque odio. Repellendus numquam laboriosam ipsum quidem?
          </p>
        </div>
        <footer className="py-4 opacity-60 text-sm">© 2026 IGO BANK</footer>
      </div>

      {/* 오른쪽 구역: 로그인 폼으로 변경 */}
      <div className="bg-white p-10 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold mb-2 text-gray-800">Sign In</h1>
          <p className="text-gray-500 mb-10">Access your IGO BANK account.</p>

          <form action={formAction} className="space-y-8">
            {/* Phone Input */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 group-focus-within:text-green-600 transition-colors">
                Phone
              </label>
              <input
                name="phone"
                type="tel" 
                className="block w-full border-b-2 border-gray-200 py-2 text-xl focus:outline-none focus:border-green-500 transition-all placeholder:text-gray-300 text-gray-800"
                placeholder="010-0000-0000"
              />
            </div>

            {/* Password Input */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 group-focus-within:text-green-600 transition-colors">
                Password
              </label>
              <input 
                name="password"
                type="password" 
                className="block w-full border-b-2 border-gray-200 py-2 text-xl focus:outline-none focus:border-green-500 transition-all placeholder:text-gray-300 text-gray-800"
                placeholder="••••••••"
              />
              {/* 비밀번호 찾기 링크 (UX 추가) */}
              {/* <div className="text-right mt-2">
                <button type="button" className="text-xs text-gray-400 hover:text-green-600 transition-colors">
                  Forgot password?
                </button>
              </div> */}
            </div>
            {state?.error && (
              <p className="text-red-500 text-sm font-medium">{state.error}</p>
            )}
            {/* Buttons */}
            <div className="pt-6 flex flex-col gap-4">
              {/* 메인 로그인 버튼 */}
              <button 
                type="submit" 
                disabled={isPending}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 transition-all active:scale-[0.98]"
              >
                {isPending ? "loading" : "login"}
              </button>

              {/* 하단 안내 문구 및 회원가입 버튼 */}
              <div className="w-full py-2 text-center text-gray-500 font-medium">
                Don't have an account?{' '}
                <button 
                  onClick={onClick}
                  type="button" 
                  className="text-green-600 underline underline-offset-4 hover:text-green-700 transition-colors font-bold ml-1"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}