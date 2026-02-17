"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Send, ArrowUp, ArrowDown } from "lucide-react";
import DepositModal from "./DepositModal";
import { useRouter } from "next/navigation";
import TransferModal from "./TransferModal";

export default function DashboardClient({ user, transactions }: any) {
  const router = useRouter();
  const viewAll = () => {
    router.push("/dashboard/transactions")
  }
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const getTypeName = (type: string) => {
    switch (type) {
      case "DEPOSIT": return "입금";
      case "WITHDRAWAL": return "출금";
      case "TRANSFER": return "이체";
      default: return "기타";
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="space-y-8">
      {/* 상단 헤더 */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Hello, {user.username}님!</h2>
          <p className="text-gray-500">오늘도 안전한 금융 생활 되세요.</p>
        </div>
        <div className="w-12 h-12 bg-green-100 rounded-full border-2 border-green-500 flex items-center justify-center font-bold text-green-700">
          {user.username[0]}
        </div>
      </header>

      {/* 대시보드 카드 섹션 */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl p-8 text-white shadow-lg shadow-green-100 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-white/80 text-lg mb-2 font-medium">Main Account</p>
            <h3 className="text-4xl font-bold mb-8">₩ {user.balance.toLocaleString()}</h3>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsDepositOpen(true)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-2 rounded-xl transition-all font-medium"
              >
                Deposit
              </button>
              <button 
                onClick={() => setIsTransferOpen(true)}
                className="bg-white text-green-700 px-6 py-2 rounded-xl shadow-md transition-all font-medium"
              >
                Transfer
              </button>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full" />
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <h4 className="font-bold text-gray-700">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <ActionButton icon={<PlusCircle className="text-green-600" />} label="New Card" />
            <ActionButton icon={<Send className="text-blue-600" />} label="Bill Pay" />
          </div>
        </div>
      </div>

      {/* 최근 거래 내역 섹션 */}
      <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Recent Transactions</h3>
          <button 
            onClick={viewAll}
            className="text-sm text-green-600 font-semibold hover:underline"
          >View All</button>
        </div>
        <div className="space-y-4">
            {transactions.map((tx: any) => {
              const isExpense = tx.sender_id === user.account_id;
              
              return (
                <TransactionItem
                  key={tx.id}
                  name={`${getTypeName(tx.type)} - ${tx.display_name}`}
                  // 마운트 전에는 빈 문자열 혹은 고정된 형식만 보여줌
                  date={isMounted ? new Date(tx.timestamp).toLocaleString() : ""} 
                  amount={`${isExpense ? "-" : "+"}₩ ${tx.amount.toLocaleString()}`}
                  type={isExpense ? "expense" : "income"}
                />
              );
            })}
        </div>
      </section>

      <DepositModal 
        isOpen={isDepositOpen} 
        onClose={() => setIsDepositOpen(false)} 
      />

      <TransferModal 
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
      />
    </div>
  );
}

// 기존 보조 컴포넌트들을 이 파일 하단에 그대로 둡니다.
function ActionButton({ icon, label }: { icon: any, label: string }) {
  return (
    <button className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-50 rounded-2xl hover:bg-green-50 transition-colors border border-transparent hover:border-green-100">
      {icon}
      <span className="text-xs font-semibold text-gray-600">{label}</span>
    </button>
  );
}
function TransactionItem({ name, date, amount, type }: { name: string, date: string, amount: string, type: 'income' | 'expense' }) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-gray-100">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
          {type === 'income' ? <ArrowDown size={16} className="text-green-600" /> : <ArrowUp size={16} className="text-red-600" />}
        </div>
        <div>
          <p className="font-bold text-gray-800">{name}</p>
          <p className="text-xs text-gray-400">{date}</p>
        </div>
      </div>
      <p className={`font-bold ${type === 'income' ? 'text-green-600' : 'text-gray-800'}`}>
        {amount}
      </p>
    </div>
  );
}