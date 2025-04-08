"use client";

import {
  ChevronDownIcon,
  ChevronRightIcon,
  DocumentIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";

interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  size?: number;
  lastModified?: string;
}

export interface FileExplorerProps {
  vaultId: string;
}

// Sample data structure
const sampleData = {
  id: "root",
  name: "Content Vault",
  type: "folder" as const,
  children: [
    {
      id: "folder1",
      name: "Documents",
      type: "folder" as const,
      children: [
        {
          id: "file1",
          name: "report.pdf",
          type: "file" as const,
          size: 1024,
          lastModified: "2024-04-08",
        },
        {
          id: "file2",
          name: "presentation.pptx",
          type: "file" as const,
          size: 2048,
          lastModified: "2024-04-07",
        },
      ],
    },
    {
      id: "folder2",
      name: "Images",
      type: "folder" as const,
      children: [
        {
          id: "file3",
          name: "photo.jpg",
          type: "file" as const,
          size: 3072,
          lastModified: "2024-04-06",
        },
      ],
    },
  ],
};

// Sample vault data mapping
const vaultDataMap: Record<string, any> = {
  vault1: {
    id: "root",
    name: "Personal Documents",
    type: "folder" as const,
    children: [
      {
        id: "folder1",
        name: "Certificates",
        type: "folder" as const,
        children: [
          {
            id: "file1",
            name: "birth_certificate.pdf",
            type: "file" as const,
            size: 1024,
            lastModified: "2024-04-08",
          },
          {
            id: "file2",
            name: "diploma.pdf",
            type: "file" as const,
            size: 2048,
            lastModified: "2024-04-07",
          },
        ],
      },
      {
        id: "folder2",
        name: "ID Documents",
        type: "folder" as const,
        children: [
          {
            id: "file3",
            name: "passport.jpg",
            type: "file" as const,
            size: 3072,
            lastModified: "2024-04-06",
          },
          {
            id: "file4",
            name: "drivers_license.pdf",
            type: "file" as const,
            size: 1536,
            lastModified: "2024-04-05",
          },
        ],
      },
    ],
  },
  vault2: {
    id: "root",
    name: "Project Files",
    type: "folder" as const,
    children: [
      {
        id: "folder1",
        name: "Designs",
        type: "folder" as const,
        children: [
          {
            id: "file1",
            name: "mockup.fig",
            type: "file" as const,
            size: 4096,
            lastModified: "2024-04-08",
          },
        ],
      },
      {
        id: "folder2",
        name: "Documents",
        type: "folder" as const,
        children: [
          {
            id: "file2",
            name: "specifications.docx",
            type: "file" as const,
            size: 2048,
            lastModified: "2024-04-07",
          },
        ],
      },
    ],
  },
  vault3: sampleData,
  vault4: {
    id: "root",
    name: "Shared Documents",
    type: "folder" as const,
    children: [
      {
        id: "folder1",
        name: "Team Reports",
        type: "folder" as const,
        children: [
          {
            id: "file1",
            name: "q1_report.pdf",
            type: "file" as const,
            size: 3072,
            lastModified: "2024-04-08",
          },
          {
            id: "file2",
            name: "q2_forecast.xlsx",
            type: "file" as const,
            size: 2048,
            lastModified: "2024-04-07",
          },
        ],
      },
    ],
  },
};

const FileExplorer: React.FC<FileExplorerProps> = ({ vaultId }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [vaultData, setVaultData] = useState<FileNode>(sampleData);
  const [vaultName, setVaultName] = useState<string>("Content Vault");

  // Set the vault data based on the vaultId
  React.useEffect(() => {
    if (vaultId && vaultDataMap[vaultId]) {
      setVaultData(vaultDataMap[vaultId]);
      setVaultName(vaultDataMap[vaultId].name);
    }
  }, [vaultId]);

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

  const handleFileDoubleClick = (file: FileNode) => {
    if (file.type === "file") {
      window.open(`/api/files/${file.id}`, "_blank");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const renderTree = (node: FileNode, level: number = 0) => {
    const isExpanded = expandedFolders.has(node.id);
    const isFolder = node.type === "folder";
    const paddingLeft = `${level * 1.5}rem`;

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
              <DocumentIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
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

  return (
    <div className="flex h-full">
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 overflow-y-auto p-4">
        <div className="space-y-1">{renderTree(vaultData)}</div>
      </div>
      <div className="w-2/3 p-6">
        {selectedFile ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              {selectedFile.type === "folder" ? (
                <FolderIcon className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />
              ) : (
                <DocumentIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
              )}
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {selectedFile.name}
              </h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Type
                  </p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                    {selectedFile.type}
                  </p>
                </div>
                {selectedFile.size && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Size
                    </p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                )}
              </div>
              {selectedFile.lastModified && (
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Last Modified
                  </p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {selectedFile.lastModified}
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
  );
};

export default FileExplorer;
