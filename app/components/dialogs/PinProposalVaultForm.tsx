"use client";

import { useCreateVault } from "@/lib/contracts/hooks/useCreateVault";
import { useSnapshotProposalData } from "@/lib/snapshot-subgraph/hooks/SnapshotProposalData";
import { ShieldCheckIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useAppKitAccount } from "@reown/appkit/react";
import { useCallback, useEffect, useRef, useState } from "react";
import LoadingComponent from "../LoadingComponent";
import BaseForm from "./BaseForm";

interface FormProps {
  onClose?: () => void;
  onSuccess: () => void;
}

export default function PinProposalVaultForm({
  onClose,
  onSuccess,
}: FormProps) {
  const { isConnected } = useAppKitAccount();
  const { submitVault } = useCreateVault();
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [proposalId, setProposalId] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: snapshotProposalData, isLoading: snapshotProposalDataLoading } =
    useSnapshotProposalData(proposalId);

  const validateForm = (proposalId: string) => {
    const newErrors: Record<string, string> = {};

    if (!proposalId.trim()) {
      newErrors.name = "Snapshot proposal ID is required";
    }

    if (proposalId.length !== 66) {
      newErrors.name = "Snapshot proposal ID must be 66 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateSnapshotProposalVault = useCallback(async () => {
    if (snapshotProposalData) {
      setIsLoading(true);

      try {
        await submitVault(
          snapshotProposalData!.proposal.title,
          snapshotProposalData!.proposal?.body || ""
        );

        // Close the dialog after successful creation
        setIsOpen(false);
        if (onSuccess) {
          onSuccess();
        }
        if (onClose) {
          onClose();
        }
      } catch (error) {
        console.error("Vault creation failed:", error);
        setErrors({ submit: "Failed to create vault. Please try again." });
      } finally {
        setIsLoading(false);
      }
    }
  }, [snapshotProposalData]);

  useEffect(() => {
    if (snapshotProposalData && !isLoading) {
      handleCreateSnapshotProposalVault();
    }
  }, [snapshotProposalData, handleCreateSnapshotProposalVault]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const proposalIdLocal = inputRef.current?.value || "";

    if (!validateForm(proposalIdLocal)) {
      return;
    }

    setProposalId(proposalIdLocal);
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
          Please connect your wallet to create a vault
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingComponent text="Creating Snapshot Proposal Vault..." />;
  }

  if (snapshotProposalDataLoading) {
    return <LoadingComponent text="Loading snapshot proposal data..." />;
  }

  if (!isOpen) {
    return null;
  }

  const icon = <SparklesIcon className="h-6 w-6 text-blue-500 mr-2" />;
  const submitButtonIcon = <ShieldCheckIcon className="h-5 w-5" />;

  return (
    <BaseForm
      title="Pin Snapshot Proposal Vault"
      icon={icon}
      onClose={handleClose}
      onSubmit={handleSubmit}
      submitButtonText="Pin Snapshot Proposal Vault"
      submitButtonIcon={submitButtonIcon}
      maxWidth="2xl"
      isLoading={isLoading}
      loadingText="Pinning your snapshot proposal vault..."
      error={errors.submit}
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Snapshot Proposal ID
          </label>
          <input
            type="text"
            id="name"
            name="name"
            ref={inputRef}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.name
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
            placeholder="Enter Snapshot proposal ID"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.name}
            </p>
          )}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
            Snapshot Proposal Vaults
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
            <li>• Snapshot proposal vaults are pinned to your account</li>
            <li>
              • Contributions on the vault will deppend on your voting power on
              the proposal
            </li>
            <li>
              • Minting an ERC1155 (crosschain) token to contribute on these
              vaults is subject to the proposal strategies
            </li>
          </ul>
        </div>
      </div>
    </BaseForm>
  );
}
