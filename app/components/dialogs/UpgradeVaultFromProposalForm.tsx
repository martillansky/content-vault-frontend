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
}

export default function UpgradeVaultFromProposalForm({
  onClose,
  onSuccess,
  vault,
}: FormProps) {
  const { isConnected } = useAppKitAccount();
  const { chainId } = useAccount();
  const { upgradeVaultFromProposal, useVotingPower } =
    useUpgradeVaultFromProposal();
  const { data: votingPower, isLoading } = useVotingPower(
    Number(vault.chainId),
    vault.tokenContract
  );
  const onChain = chainId === Number(vault.chainId);
  const [isOpen, setIsOpen] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await upgradeVaultFromProposal(vault.proposalId, Number(vault.chainId));
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
    return <LoadingComponent text="Checking voting power..." />;
  }

  if (!isOpen) {
    return null;
  }

  const icon = <SparklesIcon className="h-6 w-6 text-blue-500 mr-2" />;
  const submitButtonIcon = <ShieldCheckIcon className="h-5 w-5" />;

  return (
    <BaseForm
      title="Upgrade Vault from Proposal"
      icon={icon}
      onClose={handleClose}
      onSubmit={handleSubmit}
      submitButtonText="Upgrade Vault"
      submitButtonIcon={submitButtonIcon}
      submitButtonDisabled={!onChain}
      maxWidth="2xl"
      isLoading={isLoading}
      loadingText="Upgrading your vault..."
      error={errors.submit}
    >
      <div className="space-y-4">
        {votingPower && (
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
              Voting Power
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Your voting power on this proposal is{" "}
              {votingPower.formattedBalance} {votingPower.symbol} on{" "}
              {votingPower.chainName}
            </p>
          </div>
        )}
        {!onChain && (
          <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
            <div className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">
              <div className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">
                Switch to {votingPower?.chainName} to upgrade vault.
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseForm>
  );
}
