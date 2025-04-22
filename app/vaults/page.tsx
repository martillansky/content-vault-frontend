"use client";

import LoadingComponent from "@/app/components/LoadingComponent";
import { useAppKitAccount } from "@reown/appkit/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function VaultsPage() {
  const { isConnected, address } = useAppKitAccount();
  const router = useRouter();

  // Redirect to the appropriate page
  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    } else if (address) {
      router.push(`/vaults/${address}`);
    }
  }, [isConnected, address, router]);

  // Show loading state while redirecting
  return (
    <LoadingComponent
      text={
        !isConnected
          ? "Redirecting to connect wallet..."
          : "Redirecting to your vaults..."
      }
    />
  );
}
