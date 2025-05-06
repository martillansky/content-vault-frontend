"use client";

import { useTheme } from "@/context/ThemeContext";
import {
  ArrowDownOnSquareIcon,
  ArrowLeftIcon,
  ArrowLeftOnRectangleIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import {
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
  useDisconnect,
} from "@reown/appkit/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import dragonflyVault from "../../public/images/dragonfly-vault-transparent.png";
import BackgroundTexture from "./BackgroundTexture";
import TooltipComponent from "./TooltipComponent";

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
  const { theme, toggleTheme } = useTheme();
  useAppKitNetwork();
  const { open } = useAppKit();
  const router = useRouter();

  // Debug network name
  React.useEffect(() => {
    if (caipNetwork) {
      console.log("Network name:", caipNetwork.name);
    }
  }, [caipNetwork]);

  const handleBack = () => {
    router.push(backButtonPath);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <BackgroundTexture />
      <nav className="bg-gray-50/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <button
                  onClick={handleBack}
                  className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  title={backButtonLabel}
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
              )}
              <div className="flex-shrink-0 flex items-center">
                <div className="relative w-12 h-12 mr-4 rounded-full from-purple-900/20 via-indigo-900/10 to-blue-900/20 p-1">
                  <Image
                    src={dragonflyVault}
                    alt="Libélula Space Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Libélula Space
                </h1>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Decentralized Content Management
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {address && (
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full text-sm text-blue-700 dark:text-blue-300 flex items-center">
                    {address}
                    {caipNetwork && (
                      <div className="inline-flex items-center ml-2 group relative">
                        <Image
                          src={`/images/chains/${caipNetwork.name
                            .toLowerCase()
                            .replace(/\s+/g, "-")}.svg`}
                          alt={caipNetwork.name}
                          width={20}
                          height={20}
                          className="ml-1.5"
                        />
                        <TooltipComponent>{caipNetwork.name}</TooltipComponent>
                      </div>
                    )}
                  </div>
                  <div className="group relative">
                    <button
                      onClick={() => open({ view: "Networks" })}
                      className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                      <ArrowDownOnSquareIcon className="h-5 w-5" />
                    </button>
                    <TooltipComponent>Change Network</TooltipComponent>
                  </div>
                  <div className="group relative">
                    <button
                      onClick={async () => await disconnect()}
                      className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                      <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                    </button>
                    <TooltipComponent>Disconnect Wallet</TooltipComponent>
                  </div>
                  <div className="group relative">
                    <button
                      onClick={toggleTheme}
                      className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                      {theme === "light" ? (
                        <MoonIcon className="h-5 w-5" />
                      ) : (
                        <SunIcon className="h-5 w-5" />
                      )}
                    </button>
                    <TooltipComponent>
                      {`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                    </TooltipComponent>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="relative bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
