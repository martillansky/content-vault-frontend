"use client";

import { useUpgradeVaultFromProposal } from "@/lib/contracts/hooks/useUpgradeVaultFromProposal";
import { ShieldCheckIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useAppKitAccount } from "@reown/appkit/react";
import { useState } from "react";
import { useAccount } from "wagmi";
import LoadingComponent from "../LoadingComponent";
import BaseForm from "./BaseForm";

interface FormProps {
  onClose?: () => void;
  onSuccess: () => void;
  vault: {
    chainId: string;
    tokenContract: string;
    proposalId: string;
  };
  txHash: string | null;
}

export default function RelayPermissionForm({
  onClose,
  onSuccess,
  vault,
  txHash,
}: FormProps) {
  const { isConnected } = useAppKitAccount();
  const { chainId } = useAccount();
  const { getSignaturesAndRelayCrosschainUpgrade } =
    useUpgradeVaultFromProposal();

  const onChain = chainId === Number(vault.chainId);
  const [isOpen, setIsOpen] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!txHash) {
        throw new Error("No transaction hash provided");
      }
      setIsLoading(true);
      await getSignaturesAndRelayCrosschainUpgrade(txHash);
      setIsLoading(false);
      setIsOpen(false);
      if (onSuccess) {
        onSuccess();
      }
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Upgrade failed:", error);
      setErrors({ submit: "Failed to upgrade vault. Please try again." });
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-300">
          Please connect your wallet to upgrade the vault
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <LoadingComponent text="Relaying crosschain permission upgrade..." />
    );
  }

  if (!isOpen) {
    return null;
  }

  const icon = <SparklesIcon className="h-6 w-6 text-blue-500 mr-2" />;
  const submitButtonIcon = <ShieldCheckIcon className="h-5 w-5" />;

  return (
    <BaseForm
      title="Relay Crosschain Upgrade Permission"
      icon={icon}
      onClose={handleClose}
      onSubmit={handleSubmit}
      submitButtonText="Relay Upgrade"
      submitButtonIcon={submitButtonIcon}
      submitButtonDisabled={onChain}
      maxWidth="2xl"
      isLoading={isLoading}
      loadingText="Relaying upgrade permission..."
      error={errors.submit}
    >
      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
            Why do I need to relay?
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            Upgrading the permission for this proposal is a cross-chain
            operation, as the token that grants voting power is native to a
            foreign chain whose bridge requires manual relaying to reach the
            target chain — Libélula&apos;s home chain. This is a standard
            requirement for some cross-chain operations and is the final step
            before the upgrade can be completed.
          </p>
        </div>
      </div>
    </BaseForm>
  );
}
