"use client";

import { useAppKitAccount } from "@reown/appkit/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import VaultList from "../components/VaultList";
import { sampleVaults } from "../mockData/mockData";
import { useVaultsGQL } from "../subgraph/hooks/Vaults";

export default function VaultsPage() {
  const { isConnected, address } = useAppKitAccount();
  const router = useRouter();

  const { data, isLoading } = useVaultsGQL(address ?? "");

  // Use useEffect for navigation to avoid hook rendering issues
  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  // If wallet is not connected, show a loading state while redirecting
  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Redirecting to connect wallet...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Content Vaults
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Access and manage your decentralized content vaults
        </p>
      </div>

      <VaultList
        //vaultCreateds={sampleVaults.concat(data?.vaultCreateds ?? [])}
        vaultCreateds={data?.vaultCreateds ?? []}
      />
    </div>
  );
}
