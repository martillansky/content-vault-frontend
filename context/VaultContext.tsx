"use client";

import { useVaultData } from "@/lib/subgraph/hooks/VaultData";
import { AccessRegistry } from "@/lib/subgraph/types/VaultData.types";
import { useAppKitAccount } from "@reown/appkit/react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface Vault {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  owner: string;
  accessRegistries: AccessRegistry[];
}

interface VaultContextType {
  vault: Vault | null;
  isLoading: boolean;
  error: string | null;
  setVaultId: (id: string) => void;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

interface VaultProviderProps {
  children: ReactNode;
}

export function VaultProvider({ children }: VaultProviderProps) {
  const { address } = useAppKitAccount();
  const [vaultId, setVaultId] = useState<string | null>(null);
  const [vault, setVault] = useState<Vault | null>(null);
  const { data: vaultData, isLoading: isLoadingContent } = useVaultData(
    vaultId || ""
  );

  // Reset vault state when wallet changes
  useEffect(() => {
    setVaultId(null);
    setVault(null);
  }, [address]);

  // Update vault when vaultId changes
  useEffect(() => {
    if (!vaultId) {
      setVault(null);
      return;
    }
  }, [vaultId]);

  // Update vault when vaultData changes
  useEffect(() => {
    if (
      (!vaultData?.vaultCreateds || vaultData?.vaultCreateds?.length === 0) &&
      (!vaultData?.vaultFromProposalCreateds ||
        vaultData?.vaultFromProposalCreateds?.length === 0)
    ) {
      setVault(null);
      return;
    }

    const content =
      vaultData.vaultCreateds[0] || vaultData.vaultFromProposalCreateds[0];
    const vaultObject: Vault = {
      id: vaultId || "",
      name: content.name,
      description: content.description,
      createdAt: content.blockTimestamp,
      owner:
        content.owner ||
        process.env.NEXT_PUBLIC_MASTER_CROSSCHAIN_GRANTER_ADDRESS_SEPOLIA ||
        "",
      accessRegistries: content.accessRegistries || [],
    };

    setVault(vaultObject);
  }, [vaultData, vaultId]);

  const handleSetVaultId = (id: string) => {
    setVaultId(id);
  };

  return (
    <VaultContext.Provider
      value={{
        vault,
        isLoading: isLoadingContent,
        error: null,
        setVaultId: handleSetVaultId,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}

export function useVaultContext() {
  const context = useContext(VaultContext);
  if (context === undefined) {
    throw new Error("useVault must be used within a VaultProvider");
  }
  return context;
}
