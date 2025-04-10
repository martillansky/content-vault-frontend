"use client";

import { useAppKitAccount } from "@reown/appkit/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import FileExplorer from "../components/FileExplorer";
import { useVaultsContents } from "../subgraph/hooks/Content";

export default function ExplorerPage() {
  const { isConnected } = useAppKitAccount();
  const router = useRouter();
  const searchParams = useSearchParams();
  const vaultId = searchParams.get("vault");

  const { data: contents } = useVaultsContents(vaultId ?? "");

  // Use useEffect for navigation to avoid hook rendering issues
  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    } else if (!vaultId) {
      router.push("/vaults");
    }
  }, [isConnected, vaultId, router]);

  // If wallet is not connected or no vault is selected, show a loading state while redirecting
  if (!isConnected || !vaultId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            {!isConnected
              ? "Redirecting to connect wallet..."
              : "Redirecting to vaults..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Vault: {vaultId}
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Browse and manage your vault contents
        </p>
      </div>

      <FileExplorer
        contents={contents?.contentStoredWithMetadata_collection ?? []}
      />
    </div>
  );
}
