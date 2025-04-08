"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import VaultList from "../components/VaultList";
import { useWallet } from "../context/WalletContext";

// Sample data for demonstration
const sampleVaults = [
  {
    id: "vault1",
    name: "Personal Documents",
    description: "Important personal documents and certificates",
    owner: "0x1234...5678",
    lastAccessed: "2024-04-08",
    itemCount: 12,
  },
  {
    id: "vault2",
    name: "Project Files",
    description: "Work-related documents and project files",
    owner: "0x1234...5678",
    lastAccessed: "2024-04-07",
    itemCount: 8,
  },
  {
    id: "vault3",
    name: "Media Library",
    description: "Photos, videos, and other media files",
    owner: "0x1234...5678",
    lastAccessed: "2024-04-06",
    itemCount: 24,
  },
  {
    id: "vault4",
    name: "Shared Documents",
    description: "Documents shared with team members",
    owner: "0xabcd...efgh",
    lastAccessed: "2024-04-05",
    itemCount: 15,
  },
];

export default function VaultsPage() {
  const { isConnected } = useWallet();
  const router = useRouter();

  // Use useEffect for navigation to avoid hook rendering issues
  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  // If wallet is not connected, show a loading state while redirecting
  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Redirecting to connect wallet...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Content Vaults
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Access and manage your decentralized content vaults
        </p>
      </div>

      <VaultList vaults={sampleVaults} />
    </div>
  );
}
