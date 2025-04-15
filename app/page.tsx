"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import LandingPage from "./components/LandingPage";
import LoadingComponent from "./components/LoadingComponent";

export default function Home() {
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();

  const router = useRouter();

  // Use useEffect for navigation to avoid hook rendering issues
  useEffect(() => {
    if (isConnected) {
      router.push("/vaults");
    }
  }, [isConnected, router]);

  // If wallet is connected, show a loading state while redirecting
  if (isConnected) {
    return <LoadingComponent text="Redirecting to your vaults..." />;
  }

  // Otherwise, show the landing page
  return <LandingPage onConnectWallet={() => open({ view: "Connect" })} />;
}
