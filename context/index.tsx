"use client";

import { projectId, wagmiAdapter } from "@/lib/reown";
import { gnosisChiado } from "@/lib/reown/chains";
import { mainnet, sepolia } from "@reown/appkit/networks";
import { createAppKit } from "@reown/appkit/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, type ReactNode } from "react";
import {
  cookieToInitialState,
  useAccount,
  WagmiProvider,
  type Config,
} from "wagmi";
import Providers from "./Providers";
import ServerContent from "./ServerContent";
import { VaultProvider } from "./VaultContext";

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Set up metadata
const metadata = {
  name: "ContentVault",
  description: "Content Vault",
  url: "https://contentvault.reown.com", // origin must match domain & subdomain
  icons: ["https://assets.reown.com/reown-profile-pic.png"],
};

// Create the modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, sepolia, gnosisChiado],
  defaultNetwork: sepolia,
  metadata: metadata,
  features: {
    analytics: true, // Optional - defaults to Cloud configuration
    connectMethodsOrder: ["wallet"],
  },
  enableNetworkSwitch: true,
});

// Define props interface
interface ContextProviderProps {
  children: ReactNode;
  cookies: string | null;
}

// Add WalletChangeHandler component
function WalletChangeHandler() {
  const { address } = useAccount();
  const router = useRouter();
  const [isInitialMount, setIsInitialMount] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }

    // Clear all queries before navigation
    queryClient.clear();
    // Navigate to home page
    router.push("/");
  }, [address, isInitialMount, router, queryClient]);

  return null;
}

function ContextProvider({ children, cookies }: ContextProviderProps) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <Providers>
        <WalletChangeHandler />
        <ServerContent />
        <VaultProvider>{children}</VaultProvider>
      </Providers>
    </WagmiProvider>
  );
}

export default ContextProvider;
