import { getDashboardData } from "@/app/actions/dashboard";
import { redirect } from "next/navigation";
import TransactionsClient from "@/app/components/TransactionsClient";

export default async function TransactionPage() {
  // 1. 서버에서 DB 데이터 조회 (async 가능)
  const data = await getDashboardData();

  if (!data) {
    redirect("/Auth/signin");
  }

  // 2. 클라이언트 컴포넌트에게 데이터 전달
  return <TransactionsClient user={data.user} transactions={data.transactions} />;
}