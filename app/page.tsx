"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import LandingPage from "./components/LandingPage";

export default function Home() {
  //export default function ClientInteractions() {
  const { open, close } = useAppKit();
  const { address, isConnected, caipAddress, status, embeddedWalletInfo } =
    useAppKitAccount();

  const router = useRouter();

  // Use useEffect for navigation to avoid hook rendering issues
  useEffect(() => {
    if (isConnected) {
      router.push("/vaults");
    }
  }, [isConnected, router]);

  // If wallet is connected, show a loading state while redirecting
  if (isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Redirecting to your vaults...
          </p>
        </div>
      </div>
    );
  }

  // Otherwise, show the landing page
  return <LandingPage onConnectWallet={() => open({ view: "Connect" })} />;
}
