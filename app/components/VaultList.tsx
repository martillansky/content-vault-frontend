"use client";

import {
  ArrowRightIcon,
  FolderIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface Vault {
  id: string;
  name: string;
  description: string;
  owner: string;
  lastAccessed: string;
  itemCount: number;
}

interface VaultListProps {
  vaults: Vault[];
}

const VaultList: React.FC<VaultListProps> = ({ vaults }) => {
  const router = useRouter();
  const [selectedVault, setSelectedVault] = useState<string | null>(null);

  const handleVaultClick = (vaultId: string) => {
    setSelectedVault(vaultId);
  };

  const handleVaultSelect = (vaultId: string) => {
    router.push(`/explorer?vault=${vaultId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Your Vaults
        </h2>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2">
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
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Create Your First Vault
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vaults.map((vault) => (
            <div
              key={vault.id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 ${
                selectedVault === vault.id
                  ? "ring-2 ring-blue-500"
                  : "hover:shadow-lg"
              }`}
              onClick={() => handleVaultClick(vault.id)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                      <FolderIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {vault.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                        {vault.description}
                      </p>
                    </div>
                  </div>
                  <LockClosedIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Owner
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {vault.owner}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Last Accessed
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {formatDate(vault.lastAccessed)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Items
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {vault.itemCount}
                    </span>
                  </div>
                </div>

                <button
                  className="mt-6 w-full py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVaultSelect(vault.id);
                  }}
                >
                  <span>Open Vault</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VaultList;
