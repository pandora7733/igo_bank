"use client"

import { ArrowUp, ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";

export default function TransactionsClient({ user, transactions }: any) {
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
    <div>
      <h2 className="text-2xl font-bold text-gray-800">Transactions</h2>
      <p className="text-gray-600 my-4">View your transaction history here.</p>
      <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <div>
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
        </div>
      </section>
    </div>
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