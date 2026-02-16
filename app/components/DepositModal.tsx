"use client";

import { useState } from "react";
import { depositMoney } from "@/app/actions/dashboard";
import { useRouter } from "next/navigation";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handleDeposit = async () => {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert("올바른 금액을 입력해주세요.");
      return;
    }

    setIsPending(true);
    const result = await depositMoney(numAmount);
    setIsPending(false);

    if (result.success) {
      alert(`${numAmount.toLocaleString()}원이 입금되었습니다.`);
      setAmount(""); // 입력창 초기화
      onClose();     // 모달 닫기
      router.refresh(); // 대시보드 잔액 갱신을 위해 페이지 새로고침
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md text-center border border-gray-100">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">가상 입금</h2>
        <p className="text-gray-500 mb-6 text-sm">얼마를 입금하시겠습니까?</p>
        
        <div className="mb-6 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₩</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-xl font-bold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            autoFocus
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-4 py-4 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition font-bold"
          >
            취소
          </button>
          <button
            onClick={handleDeposit}
            disabled={isPending}
            className="flex-1 px-4 py-4 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition font-bold shadow-lg shadow-green-100 disabled:bg-gray-400"
          >
            {isPending ? "처리 중..." : "입금하기"}
          </button>
        </div>
      </div>
    </div>
  );
}