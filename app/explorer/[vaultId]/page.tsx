"use client";

import FileExplorer from "@/app/components/FileExplorer";
import LoadingComponent from "@/app/components/LoadingComponent";
import { useAppKitAccount } from "@reown/appkit/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function VaultExplorerPage() {
  const { vaultId } = useParams();
  const router = useRouter();
  const { isConnected } = useAppKitAccount();

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
          Vault Explorer
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Browse and manage your vault contents
        </p>
      </div>
      <FileExplorer vaultId={vaultId as string} />
    </div>
  );
}
