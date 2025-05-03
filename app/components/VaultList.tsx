"use client";

import { useUserData } from "@/lib/subgraph/hooks/UserData";
import {
  VaultCreated,
  VaultFromProposal,
  VaultGranted,
} from "@/lib/subgraph/types/UserData.types";
import {
  FolderIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useAppKitAccount } from "@reown/appkit/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import CreateVaultForm from "./dialogs/CreateVaultForm";
import PinProposalVaultForm from "./dialogs/PinProposalVaultForm";
import UpgradeVaultFromProposalForm from "./dialogs/UpgradeVaultFromProposalForm";
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
  const queryClient = useQueryClient();
  //const [isLoading, setIsLoading] = useState(false);
  //const { submitVault } = useCreateVault();
  //const [proposalId, setProposalId] = useState<string>("");
  //const lastExecutedProposalData = useRef<string>("");

  const { data: userData, isLoading: userDataLoading } = useUserData(
    address || connectedAddress || ""
  );

  /* const { data: snapshotProposalData, isLoading: snapshotProposalDataLoading } =
    useSnapshotProposalData(proposalId);
 */
  /* 
  const proposalData = useMemo(
    () => snapshotProposalData?.proposal,
    [snapshotProposalData]
  );

  const handleSubmit = useCallback(async () => {
    if (proposalData && proposalData.id !== lastExecutedProposalData.current) {
      lastExecutedProposalData.current = proposalData.id;
      setIsLoading(true);
      await submitVault(proposalData!.title, proposalData?.body || "");
      setIsLoading(false);
    }
  }, [proposalData, submitVault]);

  useEffect(() => {
    handleSubmit();
  }, [handleSubmit]);
 */

  const [showCreateVaultForm, setShowCreateVaultForm] = useState(false);
  const [showPinProposalVaultForm, setShowPinProposalVaultForm] =
    useState(false);
  const [
    showUpgradeVaultFromProposalForm,
    setShowUpgradeVaultFromProposalForm,
  ] = useState(false);
  const [selectedVaultFromProposal, setSelectedVaultFromProposal] = useState<
    VaultFromProposal | undefined
  >();
  const [activeTab, setActiveTab] = useState<"your" | "granted" | "proposals">(
    "your"
  );

  const handlePermissionClick = (vault: VaultFromProposal) => {
    setSelectedVaultFromProposal(vault);
    setShowUpgradeVaultFromProposalForm(true);
  };

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

  const vaultsFromProposal: VaultFromProposal[] =
    userData?.userDatas[0]?.vaultsFromProposalPinned.map((vault) => ({
      ...vault.vaultFromProposal,
      permission: vault.permission,
    })) || [];

  return (
    <div className="space-y-6">
      {showCreateVaultForm && (
        <CreateVaultForm
          onClose={() => setShowCreateVaultForm(false)}
          onSuccess={() => {
            // Refresh the vault list after successful creation
            queryClient.invalidateQueries({
              queryKey: ["userData", address || connectedAddress || ""],
            });
          }}
        />
      )}
      {showPinProposalVaultForm && (
        <PinProposalVaultForm
          onClose={() => setShowPinProposalVaultForm(false)}
          onSuccess={() => {
            // Refresh the vault list after successful creation
            queryClient.invalidateQueries({
              queryKey: ["userData", address || connectedAddress || ""],
            });
          }}
        />
      )}
      {showUpgradeVaultFromProposalForm && (
        <UpgradeVaultFromProposalForm
          vault={selectedVaultFromProposal!}
          onClose={() => setShowUpgradeVaultFromProposalForm(false)}
          onSuccess={() => {
            // Refresh the vault list after successful creation
            queryClient.invalidateQueries({
              queryKey: ["userData", address || connectedAddress || ""],
            });
          }}
        />
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
          <button
            type="button"
            onClick={() => setActiveTab("proposals")}
            className={`flex items-center px-4 py-2 rounded-md ${
              activeTab === "proposals"
                ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <SparklesIcon className="h-5 w-5 mr-2" />
            Snapshot Proposal Vaults
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
        {activeTab === "proposals" && (
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 shadow-sm hover:shadow-md"
            onClick={() => setShowPinProposalVaultForm(true)}
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
            <span>Pin Snapshot Proposal Vault</span>
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
      {/* Snapshot Proposal Vaults Tab */}
      {activeTab === "proposals" && (
        <>
          {vaultsFromProposal.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-8 text-center">
              <SparklesIcon className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No Snapshot Proposal Vaults
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                You did not pin any snapshot proposal vaults yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vaultsFromProposal.map((vault: VaultFromProposal) => (
                <VaultCard
                  key={vault.tokenId}
                  vault={vault}
                  isVaultFromProposal={true}
                  onVaultClick={handleVaultClick}
                  onVaultSelect={handleVaultSelect}
                  onPermissionClick={() => handlePermissionClick(vault)}
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
