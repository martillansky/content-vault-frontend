"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import FileExplorer from "../components/FileExplorer";
import { useWallet } from "../context/WalletContext";

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

export default function ExplorerPage() {
  const { isConnected } = useWallet();
  const router = useRouter();
  const searchParams = useSearchParams();
  const vaultId = searchParams.get("vault");

  // Use useEffect for navigation to avoid hook rendering issues
  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    } else if (!vaultId) {
      router.push("/vaults");
    }
  }, [isConnected, vaultId, router]);

  // If wallet is not connected or no vault is selected, show a loading state while redirecting
  if (!isConnected || !vaultId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            {!isConnected
              ? "Redirecting to connect wallet..."
              : "Redirecting to vaults..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Vault Explorer
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Browse and manage your vault contents
        </p>
      </div>

      <FileExplorer vaultId={vaultId} />
    </div>
  );
}
