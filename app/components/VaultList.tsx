"use client";

import { useVaults } from "@/app/subgraph/hooks/Vaults";
import { VaultCreated } from "@/app/subgraph/types/Vaults.types";
import {
  ArrowRightIcon,
  FolderIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { useAppKitAccount } from "@reown/appkit/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { sampleVaults } from "../mockData/mockData";
import LoadingComponent from "./LoadingComponent";

interface VaultListProps {
  address?: string;
}

const VaultList: React.FC<VaultListProps> = ({ address }) => {
  const router = useRouter();
  const { isConnected, address: connectedAddress } = useAppKitAccount();
  const { data: vaultsResponse, isLoading } = useVaults(
    address || connectedAddress || ""
  );
  const [selectedVault, setSelectedVault] = useState<string | null>(null);

  const handleVaultClick = (vaultId: string) => {
    setSelectedVault(vaultId);
  };

  const handleVaultSelect = (vaultId: string) => {
    router.push(`/explorer/${vaultId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-300">
          Please connect your wallet to view vaults
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingComponent text="Loading vaults..." />;
  }

  const vaults: VaultCreated[] = sampleVaults.concat(
    vaultsResponse?.vaultCreateds || []
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Your Vaults
        </h2>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 shadow-sm hover:shadow-md">
          <FolderIcon className="h-5 w-5" />
          <span>Create New Vault</span>
        </button>
      </div>
      {vaults.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-8 text-center">
          <FolderIcon className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            No Vaults Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            You don't have any vaults yet. Create your first vault to get
            started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vaults.map((vault: VaultCreated) => (
            <div
              key={vault.tokenId}
              onClick={() => handleVaultClick(vault.tokenId)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg">
                    <FolderIcon className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {vault.name || `Vault ${vault.tokenId}`}
                  </h3>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVaultSelect(vault.tokenId);
                  }}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <ArrowRightIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {vault.description || "No description available"}
              </p>
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Created: {formatDate(vault.blockTimestamp)}</span>
                <span className="flex items-center">
                  <LockClosedIcon className="h-4 w-4 mr-1" />
                  Private
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VaultList;
