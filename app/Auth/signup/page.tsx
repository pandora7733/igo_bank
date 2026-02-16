"use client"

import Image from "next/image";
import { useActionState } from "react";
import { signup } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

export default function signUp() {
  // state: 액션의 반환값 (에러 메시지 등), formAction: 폼에 연결할 함수
  const [state, formAction, isPending] = useActionState(signup, null);
  
  const router = useRouter();
  const onClick = () => {
    router.push("/Auth/signin");
  }

  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="bg-gradient-to-b from-green-700 to-emerald-500 p-6 flex flex-col items-center text-white">
        <div className="grow flex flex-col items-center justify-center">
          <h1 className="font-bold mb-10 text-5xl">Welcome to</h1>
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

      <div className="bg-white p-10 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold mb-2 text-gray-800">Create your account</h1>
          <p className="text-gray-500 mb-10">Start your journey with IGO BANK today.</p>

          <form action={formAction} className="space-y-8">
            {/* Name Input */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 group-focus-within:text-green-600 transition-colors">
                Name
              </label>
              <input 
                name="username"
                type="text"
                className="block w-full border-b-2 border-gray-200 py-2 text-xl focus:outline-none focus:border-green-500 transition-all placeholder:text-gray-300 text-gray-800"
                placeholder="Enter your full name"
              />
            </div>

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
            </div>
            {/* 서버에서 리턴한 에러 메시지 표시 */}
            {state?.error && (
              <p className="text-red-500 text-sm font-medium">{state.error}</p>
            )}
            {/* Buttons */}
            <div className="pt-6 flex flex-col gap-4">
              {/* 메인 회원가입 버튼 */}
              <button 
                type="submit"
                disabled={isPending}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 transition-all active:scale-[0.98]"
              >
                {isPending ? "loading" : "signup"}
              </button>

              {/* 하단 안내 문구 및 로그인 버튼 */}
              <div className="w-full py-2 text-center text-gray-500 font-medium">
                Already have an account?{' '}
                <button 
                  onClick={onClick}
                  type="button" 
                  className="text-green-600 underline underline-offset-4 hover:text-green-700 transition-colors font-bold ml-1"
                >
                  Sign In
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}