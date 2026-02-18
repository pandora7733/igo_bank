import { getDashboardData } from "../actions/dashboard";
import { redirect } from "next/navigation";
import DashboardClient from "../components/DashboardClient";

export default async function DashboardPage() {
  // 1. 서버에서 DB 데이터 조회 (async 가능)
  const data = await getDashboardData();

  if (!data) {
    redirect("/Auth/signin");
  }

  // 2. 클라이언트 컴포넌트에게 데이터 전달
  return <DashboardClient user={data.user} transactions={data.transactions} />;
}