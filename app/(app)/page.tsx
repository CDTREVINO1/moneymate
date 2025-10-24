import { headers as getHeaders } from "next/headers.js";
import { getPayload } from "payload";
import config from "@/payload.config";
import SpendingChart from "@/components/ui/SpendingChart";
import { getTransactionsByUserId } from "@/lib/transactions";
import Home from "@/components/ui/Home";

export default async function HomePage() {
  const headers = await getHeaders();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers });

  if (!user) return <Home />;

  const transactions = await getTransactionsByUserId(user.id);

  return (
    <div>
      <SpendingChart transactions={transactions} />
    </div>
  );
}
