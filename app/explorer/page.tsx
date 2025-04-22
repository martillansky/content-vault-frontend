"use client";

import LoadingComponent from "@/app/components/LoadingComponent";
import { useAppKitAccount } from "@reown/appkit/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function ExplorerPage() {
  const { isConnected } = useAppKitAccount();
  const router = useRouter();

  // Redirect to vaults page
  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    } else {
      router.push("/vaults");
    }
  }, [isConnected, router]);

  // Show loading state while redirecting
  return (
    <LoadingComponent
      text={
        !isConnected
          ? "Redirecting to connect wallet..."
          : "Redirecting to vaults..."
      }
    />
  );
}
