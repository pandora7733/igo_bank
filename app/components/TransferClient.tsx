"use client";

import { useState } from "react";
import { transferMoney } from "@/app/actions/dashboard";
import { useRouter } from "next/navigation";

export default function TransferClient({ recentAccounts }: { recentAccounts: any[] }) {
  // 1. 상태 관리 (Modal 로직 계승)
  const [targetAccount, setTargetAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  // 2. 송금 실행 함수 (검증 로직 포함)
  const handleTransfer = async () => {
    setError(""); 
    const numAmount = Number(amount);

    // [검증 로직]
    if (!targetAccount || targetAccount.length < 5) {
      setError("정확한 계좌번호를 입력하거나 최근 계좌를 선택해주세요.");
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("이체할 금액을 정확히 입력해주세요.");
      return;
    }

    if (!confirm(`${targetAccount} 계좌로 ${numAmount.toLocaleString()}원을 송금하시겠습니까?`)) {
      return;
    }

    setIsPending(true);
    const result = await transferMoney(targetAccount, numAmount);
    setIsPending(false);

    if ("success" in result && result.success) {
      alert(`${numAmount.toLocaleString()}원 이체가 완료되었습니다.`);
      setTargetAccount("");
      setAmount("");
      router.push("/dashboard"); // 송금 후 대시보드로 이동
      router.refresh();
    } 
    else if ("error" in result) {
      setError(result.error as string); 
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-gray-800">송금하기</h2>
        <p className="text-gray-500 text-sm">빠르고 안전하게 마음을 전하세요.</p>
      </div>

      {/* 3. 최근 보낸 계좌 섹션 (기존 디자인 유지) */}
      {recentAccounts.length > 0 && (
        <section className="bg-white/50 p-4 rounded-3xl border border-gray-100">
          <p className="text-sm font-semibold text-gray-400 mb-4 ml-2 uppercase tracking-wider">최근 보낸 분</p>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {recentAccounts.map((acc: any) => (
              <button
                key={acc.account_number}
                onClick={() => {
                  setTargetAccount(acc.account_number);
                  setError(""); // 계좌 선택 시 에러 초기화
                }}
                className={`flex flex-col items-center min-w-[90px] gap-3 p-3 rounded-2xl transition-all ${
                  targetAccount === acc.account_number 
                  ? "bg-blue-50 border-blue-200 shadow-sm" 
                  : "hover:bg-white hover:shadow-md border border-transparent"
                }`}
              >
                <div className="w-14 h-14 bg-gradient-to-tr from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-600 border border-white shadow-inner">
                  {acc.username[0]}
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-800 truncate w-20">{acc.username}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 4. 송금 입력 폼 (Modal 디자인 + Client 레이아웃) */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-2 ml-1">받는 분 계좌번호</label>
            <input
              type="text"
              value={targetAccount}
              onChange={(e) => setTargetAccount(e.target.value)}
              placeholder="계좌번호 직접 입력"
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-700 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-500 mb-2 ml-1">이체 금액</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xl">₩</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full pl-12 pr-5 py-5 bg-gray-50 border border-gray-100 rounded-2xl text-2xl font-black text-gray-800 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* 에러 메시지 (Modal 스타일 유지) */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-500 text-sm font-medium py-3 px-4 rounded-xl flex items-center gap-2 animate-shake">
            <span>⚠️</span> {error}
          </div>
        )}

        <div className="pt-4">
          <button
            onClick={handleTransfer}
            disabled={isPending}
            className="w-full py-5 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-[1.5rem] font-black text-lg hover:bg-green-700 active:scale-[0.98] transition-all shadow-lg shadow-green-200 disabled:bg-gray-300 disabled:shadow-none"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                처리 중...
              </span>
            ) : (
              "송금하기"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}