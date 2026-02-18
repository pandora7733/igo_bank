import { getRecentTransfers } from "@/app/actions/dashboard";
import TransferClient from "@/app/components/TransferClient";

export default async function TransferPage() {
    // app/dashboard/transfer/page.tsx 예시
  const data = await getRecentTransfers();

  return (
    <TransferClient 
      recentAccounts={data?.transferLog || []} 
    />
  );
}
