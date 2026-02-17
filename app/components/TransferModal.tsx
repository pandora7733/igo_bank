"use client";

import { useState } from "react";
import { transferMoney } from "@/app/actions/dashboard";
import { useRouter } from "next/navigation";

export default function TransferModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [targetAccount, setTargetAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handleTransfer = async () => {
    setError(""); // 에러 초기화
    const numAmount = Number(amount);

    // [검증 로직]
    if (!targetAccount || targetAccount.length < 5) {
      setError("정확한 계좌번호를 입력해주세요.");
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("이체할 금액을 정확히 입력해주세요.");
      return;
    }

    setIsPending(true);
    const result = await transferMoney(targetAccount, numAmount);
    setIsPending(false);

    // 'success'라는 키가 result 객체 안에 있는지 확인 (타입 가드)
    if ("success" in result && result.success) {
      alert(`${numAmount.toLocaleString()}원 이체가 완료되었습니다.`);
      setTargetAccount("");
      setAmount("");
      onClose();
      router.refresh();
    } 
    // 'error'라는 키가 result 객체 안에 있는지 확인
    else if ("error" in result) {
      setError(result.error as string); 
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">송금하기</h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-500 ml-1">받는 분 계좌번호</label>
            <input
              type="text"
              value={targetAccount}
              onChange={(e) => setTargetAccount(e.target.value)}
              placeholder="계좌번호 입력"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-500 ml-1">이체 금액</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₩</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* 에러 메시지 영역 */}
        {error && (
          <p className="mt-4 text-red-500 text-sm font-medium text-center bg-red-50 py-2 rounded-lg">
            ⚠️ {error}
          </p>
        )}

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 font-bold transition"
          >
            취소
          </button>
          <button
            onClick={handleTransfer}
            disabled={isPending}
            className="flex-1 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 font-bold transition shadow-lg shadow-blue-100 disabled:bg-gray-400"
          >
            {isPending ? "이체 중..." : "이체하기"}
          </button>
        </div>
      </div>
    </div>
  );
}