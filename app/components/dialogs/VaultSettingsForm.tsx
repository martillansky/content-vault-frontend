"use client";

import { useVaultContext } from "@/context/VaultContext";
import { useGrantAccess } from "@/lib/contracts/hooks/useGrantAccess";
import { useUpgradePermission } from "@/lib/contracts/hooks/useUpgradePermission";
import { AccessRegistry } from "@/lib/subgraph/types/VaultData.types";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { useAppKitAccount } from "@reown/appkit/react";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import LoadingComponent from "../LoadingComponent";
import { Permissions } from "../VaultList";
import BaseForm from "./BaseForm";
import GrantAccessForm from "./GrantAccessForm";
import RevokeAccessForm from "./RevokeAccessForm";
import TransferOwnershipForm from "./TransferOwnershipForm";
import UpgradeAccessForm from "./UpgradeAccessForm";
import WalletAccessTable, { RoleTypes } from "./WalletAccessTable";
interface VaultSettingsFormProps {
  onClose: () => void;
}

export default function VaultSettingsForm({ onClose }: VaultSettingsFormProps) {
  const { address } = useAppKitAccount();
  const { grantAccess } = useGrantAccess();
  const { upgradePermission } = useUpgradePermission();
  const { vault, isLoading, error } = useVaultContext();
  const queryClient = useQueryClient();
  const [showGrantAccess, setShowGrantAccess] = useState(false);
  const [showTransferOwnership, setShowTransferOwnership] = useState(false);
  const [showUpgradeAccess, setShowUpgradeAccess] = useState(false);
  const [showRevokeAccess, setShowRevokeAccess] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "access">("general");

  const wallets = useMemo(() => {
    if (!vault) return [];

    return [
      {
        address: vault.owner,
        role: "owner" as RoleTypes,
        grantedAt: vault.createdAt,
      },
    ].concat(
      vault.accessRegistries.map((registry: AccessRegistry) => ({
        address: registry.vaultAccessGranted.to,
        role:
          registry.vaultAccessGranted.permission.permission ===
          Permissions.CONTRIBUTOR
            ? "contributor"
            : ("viewer" as RoleTypes),
        grantedAt: registry.vaultAccessGranted.blockTimestamp,
      }))
    );
  }, [vault]);

  const handleGrantAccess = async (
    wallets: Array<{ address: string; role: "contributor" | "viewer" }>,
    requireSignature: boolean
  ) => {
    try {
      const tokenId = Number(vault?.id);

      if (wallets.length === 1) {
        await grantAccess(
          wallets[0].address,
          tokenId,
          wallets[0].role,
          requireSignature
        );
      } else if (wallets.length > 1) {
        if (!requireSignature) {
          // TODO: Implement batch grant access logic
        } else {
          // TODO: Implement signature batch grant access logic
        }
      }
      setShowGrantAccess(false);
      queryClient.invalidateQueries({
        queryKey: ["vaultData", vault!.id],
      });
    } catch (error) {
      console.error("Error granting access:", error);
    }
  };

  const handleTransferOwnership = async (
    newOwner: string,
    requireSignature: boolean
  ) => {
    try {
      console.log(
        "FormVaultSettings: handleTransferOwnership called with:",
        newOwner,
        requireSignature
      );

      // TODO: Implement transfer ownership logic
      console.log(
        "Transferring ownership to:",
        newOwner,
        "with signature:",
        requireSignature
      );

      // Add a delay to simulate the transfer process
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log(
        "FormVaultSettings: Transfer ownership completed, closing form"
      );
      setShowTransferOwnership(false);
    } catch (error) {
      console.error("Error transferring ownership:", error);
    }
  };

  const handleCloseSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  const handleUpgradeAccess = (walletAddress: string) => {
    setSelectedWallet(walletAddress);
    setShowUpgradeAccess(true);
  };

  const handleRevokeAccess = (walletAddress: string) => {
    setSelectedWallet(walletAddress);
    setShowRevokeAccess(true);
  };

  const confirmUpgradeAccess = async () => {
    if (!selectedWallet) return;

    try {
      await upgradePermission(Number(vault?.id), selectedWallet);

      queryClient.invalidateQueries({
        queryKey: ["vaultData", vault!.id],
      });
      setShowUpgradeAccess(false);
      setSelectedWallet(null);
    } catch (error) {
      console.error("Error upgrading access:", error);
      throw error; // Re-throw to be caught by the dialog component
    }
  };

  const confirmRevokeAccess = async () => {
    if (!selectedWallet) return;

    try {
      // TODO: Implement revoke access logic
      console.log("Revoking access for:", selectedWallet);
      // Add a delay to simulate the revoke process
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowRevokeAccess(false);
      setSelectedWallet(null);
    } catch (error) {
      console.error("Error revoking access:", error);
      throw error; // Re-throw to be caught by the dialog component
    }
  };

  if (isLoading) {
    return <LoadingComponent text="Loading vault settings..." />;
  }

  if (showTransferOwnership) {
    return (
      <TransferOwnershipForm
        existingWallets={wallets?.map((w) => w.address) || []}
        onCancel={() => {
          console.log("TransferOwnershipForm: onCancel called");
          setShowTransferOwnership(false);
        }}
        onTransferOwnership={handleTransferOwnership}
      />
    );
  }

  if (showGrantAccess) {
    return (
      <GrantAccessForm
        existingWallets={wallets?.map((w) => w.address) || []}
        onCancel={() => setShowGrantAccess(false)}
        onGrantAccess={handleGrantAccess}
      />
    );
  }

  if (showUpgradeAccess && selectedWallet) {
    return (
      <UpgradeAccessForm
        walletAddress={selectedWallet}
        onClose={() => {
          setShowUpgradeAccess(false);
          setSelectedWallet(null);
        }}
        onConfirm={confirmUpgradeAccess}
      />
    );
  }

  if (showRevokeAccess && selectedWallet) {
    return (
      <RevokeAccessForm
        walletAddress={selectedWallet}
        onClose={() => {
          setShowRevokeAccess(false);
          setSelectedWallet(null);
        }}
        onConfirm={confirmRevokeAccess}
      />
    );
  }

  return (
    <BaseForm
      title="Vault Settings"
      icon={<ShieldCheckIcon className="h-6 w-6" />}
      onClose={onClose}
      noCancelButton={true}
      onSubmit={handleCloseSettings}
      submitButtonText="Close"
      maxWidth="full"
      isLoading={isLoading}
      loadingText="Closing..."
      error={error || undefined}
    >
      {/* Tab Navigation */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`flex items-center px-4 py-2 rounded-md ${
              activeTab === "general"
                ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <Cog6ToothIcon className="h-5 w-5 mr-2" />
            General Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("access")}
            className={`flex items-center px-4 py-2 rounded-md ${
              activeTab === "access"
                ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <UserPlusIcon className="h-5 w-5 mr-2" />
            Access Management
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`p-2 rounded-full ${
              activeTab === "general"
                ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            disabled={activeTab === "general"}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("access")}
            className={`p-2 rounded-full ${
              activeTab === "access"
                ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            disabled={activeTab === "access"}
          >
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* General Vault Info Tab */}
        {activeTab === "general" && (
          <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Vault Information
              </h3>
              <div className="mt-5 space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      readOnly
                      defaultValue={vault?.name}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                      placeholder="Enter vault name"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      readOnly
                      defaultValue={vault?.description}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                      placeholder="Enter vault description"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="owner"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Owner
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="owner"
                      value={vault?.owner}
                      readOnly
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 shadow-sm sm:text-sm dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Access Management Tab */}
        {activeTab === "access" && (
          <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Access Management
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
                <p>
                  Manage who has access to your vault and their permissions.
                </p>
              </div>
              <div className="mt-5">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Wallet Access
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowGrantAccess(true)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <UserPlusIcon className="h-4 w-4 mr-1" />
                    Grant Access
                  </button>
                </div>
                <WalletAccessTable
                  walletAccess={wallets}
                  isOwner={
                    address?.toLowerCase() === vault!.owner.toLowerCase()
                  }
                  onUpgradeAccess={handleUpgradeAccess}
                  onRevokeAccess={handleRevokeAccess}
                  onTransferOwnership={() => setShowTransferOwnership(true)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseForm>
  );
}
