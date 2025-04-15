"use client";

import {
  ArrowDownOnSquareIcon,
  ArrowLeftIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import {
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
  useDisconnect,
} from "@reown/appkit/react";
import { useRouter } from "next/navigation";
import React from "react";

interface CommonLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  backButtonLabel?: string;
  backButtonPath?: string;
}

export default function CommonLayout({
  children,
  showBackButton = false,
  backButtonLabel = "Back to Vaults",
  backButtonPath = "/vaults",
}: CommonLayoutProps) {
  const { address } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const { caipNetwork } = useAppKitNetwork();
  useAppKitNetwork();
  const { open } = useAppKit();
  const router = useRouter();

  const handleBack = () => {
    router.push(backButtonPath);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <button
                  onClick={handleBack}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  title={backButtonLabel}
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
              )}
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Content Vault
                </h1>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Decentralized Content Management
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {address && (
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full text-sm text-blue-800 dark:text-blue-300">
                    {address}
                    {caipNetwork && ` (${caipNetwork.name})`}
                  </div>
                  <button
                    onClick={() => open({ view: "Networks" })}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    title="Change Network"
                  >
                    <ArrowDownOnSquareIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={async () => await disconnect()}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    title="Disconnect Wallet"
                  >
                    <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
