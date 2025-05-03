"use client";

import {
  ArrowRightIcon,
  EyeIcon,
  FolderIcon,
  LockClosedIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import {
  VaultCreated,
  VaultFromProposal,
  VaultGranted,
} from "../../lib/subgraph/types/UserData.types";
import { formatTimestampShort } from "../utils/dataFormaters";
import { Permissions } from "./VaultList";

interface VaultCardProps {
  vault: VaultCreated | VaultGranted | VaultFromProposal;
  isGrantedAccess?: boolean;
  isVaultFromProposal?: boolean;
  onVaultClick: (vaultId: string) => void;
  onVaultSelect: (vaultId: string) => void;
  onPermissionClick?: (vaultId: string) => void;
}

const VaultCard: React.FC<VaultCardProps> = ({
  vault,
  isGrantedAccess = false,
  isVaultFromProposal = false,
  onVaultClick,
  onVaultSelect,
  onPermissionClick,
}) => {
  const hasPermission =
    (isGrantedAccess || isVaultFromProposal) && "permission" in vault;
  const maxLength = 300;
  const vaultDescriptionCleaned =
    vault.description.length > maxLength
      ? vault.description.substring(0, maxLength) + " (...)"
      : vault.description;
  return (
    <div
      onClick={() => onVaultClick(vault.tokenId)}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 hover:scale-[1.02]"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div
            className={`p-2 rounded-lg ${
              isGrantedAccess
                ? "bg-blue-100 dark:bg-blue-900/30"
                : "bg-yellow-100 dark:bg-yellow-900/30"
            }`}
          >
            <FolderIcon
              className={`h-6 w-6 ${
                isGrantedAccess
                  ? "text-blue-500 dark:text-blue-400"
                  : "text-yellow-500 dark:text-yellow-400"
              }`}
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {vault.name || `Vault ${vault.tokenId}`}
          </h3>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onVaultSelect(vault.tokenId);
          }}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowRightIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {vaultDescriptionCleaned || "No description available"}
      </p>
      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>Created: {formatTimestampShort(vault.blockTimestamp)}</span>
        <span className="flex items-center">
          {hasPermission ? (
            vault.permission === Permissions.VIEWER ? (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onPermissionClick?.(vault.tokenId);
                }}
                className="relative group flex items-center cursor-pointer"
              >
                <EyeIcon className="h-4 w-4 mr-1 text-green-500" />
                Viewer
                {isVaultFromProposal && (
                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-600 text-white text-sm px-2 py-1 rounded shadow-lg whitespace-nowrap transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                    Upgrade to Contributor
                  </div>
                )}
              </div>
            ) : (
              <>
                <PencilIcon className="h-4 w-4 mr-1 text-blue-500" />
                Contributor
              </>
            )
          ) : (
            <>
              <LockClosedIcon className="h-4 w-4 mr-1" />
              Private
            </>
          )}
        </span>
      </div>
    </div>
  );
};

export default VaultCard;
