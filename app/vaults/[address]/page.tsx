"use client";

import LoadingComponent from "@/app/components/LoadingComponent";
import VaultList from "@/app/components/VaultList";
import { useAppKitAccount } from "@reown/appkit/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WalletVaultsPage() {
  const { address } = useParams();
  const router = useRouter();
  const { isConnected, address: connectedAddress } = useAppKitAccount();

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return <LoadingComponent text="Redirecting to connect wallet..." />;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Content Vaults
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Access and manage your decentralized content vaults
        </p>
      </div>

      <VaultList address={address as string} />
    </div>
  );
}
