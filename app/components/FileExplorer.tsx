"use client";

import {
  contentFormatter,
  formatTimestampShort,
} from "@/app/utils/dataFormaters";
import { useVaultContext } from "@/context/VaultContext";
import {
  decryptCIDFromHex,
  simpleCIDFromHex,
} from "@/lib/crypto/secureEncryption_Multiformats";
import { useVaultsContents } from "@/lib/subgraph/hooks/Content";
import { Content } from "@/lib/subgraph/types/Content.types";
import { retrieveEncryptionPassword } from "@/lib/supabase/userSecretsService";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  DocumentIcon,
  FolderIcon,
  LockClosedIcon,
  LockOpenIcon,
} from "@heroicons/react/24/outline";
import { useAppKitAccount } from "@reown/appkit/react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import ContentUploadForm from "./dialogs/ContentUploadForm";
import VaultSettingsForm from "./dialogs/VaultSettingsForm";
import LoadingComponent from "./LoadingComponent";
export interface FileNode {
  id: string;
  name: string;
  extension: string;
  description: string;
  metatype: "file" | "folder";
  children: FileNode[];
  type?: string;
  created?: string;
  isCIDEncrypted?: boolean;
}

interface FileExplorerProps {
  vaultId: string;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ vaultId }) => {
  const { isConnected, address } = useAppKitAccount();
  const { data: contentResponse, isLoading } = useVaultsContents(vaultId);
  const queryClient = useQueryClient();
  const { setVaultId, vault } = useVaultContext();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showVaultSettings, setShowVaultSettings] = useState(false);

  useEffect(() => {
    setVaultId(vaultId);
  }, [vaultId, setVaultId]);

  const content = useMemo(
    () => contentResponse?.contentStoredWithMetadata_collection || [],
    [contentResponse]
  );
  const vaultData = useMemo(() => contentFormatter(content), [content]);

  const formattedVaultName = useMemo(() => {
    const maxLength = 40;
    if (vault?.name) {
      if (vault.name.length > maxLength) {
        return vault.name.substring(0, maxLength) + "...";
      }
      return vault.name;
    }
    return "Vault " + vaultId + " (ERC-1155)";
  }, [vault, vaultId]);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const handleFileClick = (file: FileNode) => {
    setSelectedFile(file);
  };

  const handleFileDoubleClick = async (file: FileNode) => {
    if (file.metatype === "file") {
      try {
        const fileContent = content.find((c: Content) => c.id === file.id);
        if (!fileContent) return;

        if (!address) throw new Error("No wallet address found");
        const encryptedCID = fileContent.encryptedCID;
        let decryptedFile;
        if (!fileContent.isCIDEncrypted) {
          decryptedFile = simpleCIDFromHex(encryptedCID);
        } else {
          const password = await retrieveEncryptionPassword(vault!.owner);
          decryptedFile = await decryptCIDFromHex(encryptedCID, password);
        }

        window.open(
          `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/${decryptedFile}`,
          "_blank"
        );
      } catch (error) {
        console.error("Decryption failed:", error);
      }
    }
  };

  const handleVaultSettingsClick = () => {
    setShowVaultSettings(true);
  };

  const handleVaultSettingsClose = () => {
    setShowVaultSettings(false);
  };

  const renderTree = (node: FileNode, level: number = 0) => {
    const isExpanded = expandedFolders.has(node.id);
    const isFolder = node.metatype === "folder";
    const paddingLeft = `${level * 1.5}rem`;

    const contentIcon = node.isCIDEncrypted ? (
      <LockClosedIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
    ) : (
      <LockOpenIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
    );

    return (
      <div key={node.id} className="transition-all duration-200">
        <div
          className={`flex items-center py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer rounded-lg transition-colors ${
            selectedFile?.id === node.id ? "bg-blue-50 dark:bg-blue-900/20" : ""
          }`}
          style={{ paddingLeft }}
          onClick={() =>
            isFolder ? toggleFolder(node.id) : handleFileClick(node)
          }
          onDoubleClick={() => handleFileDoubleClick(node)}
        >
          {isFolder ? (
            <>
              {isExpanded ? (
                <ChevronDownIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronRightIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              )}
              <FolderIcon className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-2" />
            </>
          ) : (
            <>
              <div className="w-4" />
              {contentIcon}
            </>
          )}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {node.name}
          </span>
        </div>
        {isFolder && isExpanded && node.children && (
          <div className="transition-all duration-200">
            {node.children.map((child) => renderTree(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">
          Please connect your wallet to view files
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingComponent text="Loading vault contents..." />;
  }

  return (
    <>
      {showUploadForm && (
        <ContentUploadForm
          vaultId={vaultId}
          vaultOwner={vault!.owner}
          onClose={() => setShowUploadForm(false)}
          onSuccess={() => {
            // Refresh the contents
            queryClient.invalidateQueries({
              queryKey: ["content", vaultId],
            });
          }}
        />
      )}

      {showVaultSettings && (
        <VaultSettingsForm onClose={handleVaultSettingsClose} />
      )}

      <div className="flex justify-between items-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {formattedVaultName}
          </h1>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleVaultSettingsClick}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 shadow-sm hover:shadow-md"
          >
            <Cog6ToothIcon className="h-4 w-4 mr-1" />
            Vault Settings
          </button>

          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 shadow-sm hover:shadow-md"
            onClick={() => setShowUploadForm(true)}
          >
            <FolderIcon className="h-5 w-5" />
            <span>Create New Content</span>
          </button>
        </div>
      </div>
      {!content || content.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-8 text-center">
          <DocumentIcon className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            No contents found in this vault
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            You do not have any contents yet. Create your first content to get
            started.
          </p>
        </div>
      ) : (
        <div className="flex h-full">
          <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 overflow-y-auto p-4">
            <div className="space-y-1">{renderTree(vaultData)}</div>
          </div>
          <div className="w-2/3 p-6">
            {selectedFile ? (
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  {selectedFile.metatype === "folder" ? (
                    <FolderIcon className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />
                  ) : selectedFile.isCIDEncrypted ? (
                    <LockClosedIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <LockOpenIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                  )}
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {selectedFile.name}
                  </h2>
                </div>
                <div className="space-y-4">
                  {selectedFile.description && (
                    <div className="bg-white dark:bg-gray-700/50 p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Description
                      </p>
                      <p className="text-lg font-medium text-gray-800 dark:text-white">
                        {selectedFile.description}
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    {selectedFile.type && (
                      <div className="bg-white dark:bg-gray-700/50 p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Extension
                        </p>
                        <p className="text-lg font-medium text-gray-800 dark:text-white">
                          {selectedFile.extension}
                        </p>
                      </div>
                    )}
                    {selectedFile.created && (
                      <div className="bg-white dark:bg-gray-700/50 p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Created
                        </p>
                        <p className="text-lg font-medium text-gray-800 dark:text-white">
                          {formatTimestampShort(selectedFile.created)}
                        </p>
                      </div>
                    )}
                  </div>
                  {selectedFile.type && (
                    <div className="bg-white dark:bg-gray-700/50 p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Type
                      </p>
                      <p className="text-lg font-medium text-gray-800 dark:text-white capitalize">
                        {selectedFile.type}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <DocumentIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Select a file to view its details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FileExplorer;
