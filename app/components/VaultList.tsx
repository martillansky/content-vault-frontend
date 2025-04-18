"use client";

import { useUserData } from "@/lib/subgraph/hooks/UserData";

import { FolderIcon, UserIcon } from "@heroicons/react/24/outline";
import { useAppKitAccount } from "@reown/appkit/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
//import { sampleVaults } from "../mockData/mockData";
import {
  VaultCreated,
  VaultGranted,
} from "../../lib/subgraph/types/UserData.types";
import CreateVaultForm from "./dialogs/CreateVaultForm";
import LoadingComponent from "./LoadingComponent";
import VaultCard from "./VaultCard";

export enum Permissions {
  VIEWER = 1,
  CONTRIBUTOR = 2,
}
interface VaultListProps {
  address?: string;
}

const VaultList: React.FC<VaultListProps> = ({ address }) => {
  const router = useRouter();
  const { isConnected, address: connectedAddress } = useAppKitAccount();

  const { data: userData, isLoading: userDataLoading } = useUserData(
    address || connectedAddress || ""
  );
  //const [selectedVault, setSelectedVault] = useState<string | null>(null);
  const [showCreateVaultForm, setShowCreateVaultForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"your" | "granted">("your");

  const handleVaultClick = (vaultId: string) => {
    //setSelectedVault(vaultId);
    console.log("vaultId", vaultId);
  };

  const handleVaultSelect = (vaultId: string) => {
    router.push(`/explorer/${vaultId}`);
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

  if (userDataLoading) {
    return <LoadingComponent text="Loading vaults..." />;
  }

  const vaults: VaultCreated[] = userData?.userDatas[0]?.vaultsCreated || [];
  const grantedVaults: VaultGranted[] =
    userData?.userDatas[0]?.vaultAccessesGranted.map((vault) => ({
      ...vault.accessRegistry.vaultCreated,
      permission: vault.permission,
    })) || [];

  return (
    <div className="space-y-6">
      {showCreateVaultForm && (
        <CreateVaultForm onClose={() => setShowCreateVaultForm(false)} />
      )}

      {/* Tab Navigation */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setActiveTab("your")}
            className={`flex items-center px-4 py-2 rounded-md ${
              activeTab === "your"
                ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <FolderIcon className="h-5 w-5 mr-2" />
            Your Vaults
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("granted")}
            className={`flex items-center px-4 py-2 rounded-md ${
              activeTab === "granted"
                ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <UserIcon className="h-5 w-5 mr-2" />
            Granted Access Vaults
          </button>
        </div>
        {activeTab === "your" && (
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 shadow-sm hover:shadow-md"
            onClick={() => setShowCreateVaultForm(true)}
          >
            <FolderIcon className="h-5 w-5" />
            <span>Create New Vault</span>
          </button>
        )}
      </div>

      {/* Your Vaults Tab */}
      {activeTab === "your" && (
        <>
          {vaults.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-8 text-center">
              <FolderIcon className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No Vaults Found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                You do not have any vaults yet. Create your first vault to get
                started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vaults.map((vault: VaultCreated) => (
                <VaultCard
                  key={vault.tokenId}
                  vault={vault}
                  onVaultClick={handleVaultClick}
                  onVaultSelect={handleVaultSelect}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Granted Access Vaults Tab */}
      {activeTab === "granted" && (
        <>
          {grantedVaults.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-8 text-center">
              <UserIcon className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No Granted Access Vaults
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                You do not have access to any vaults granted by other users.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {grantedVaults.map((vault: VaultGranted) => (
                <VaultCard
                  key={vault.tokenId}
                  vault={vault}
                  isGrantedAccess={true}
                  onVaultClick={handleVaultClick}
                  onVaultSelect={handleVaultSelect}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VaultList;
