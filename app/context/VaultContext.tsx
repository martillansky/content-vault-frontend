"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useVaultData } from "../subgraph/hooks/VaultData";
interface Vault {
  id: string;
  name: string;
  description: string;
  createdAt: string;
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
  const [vaultId, setVaultId] = useState<string | null>(null);
  const [vault, setVault] = useState<Vault | null>(null);
  const { data: vaultData, isLoading: isLoadingContent } = useVaultData(
    vaultId || ""
  );

  useEffect(() => {
    if (vaultData?.vaultCreateds && vaultData?.vaultCreateds?.length > 0) {
      const content = vaultData?.vaultCreateds[0];
      const vaultObject: Vault = {
        id: vaultId || "",
        name: content.name || "Untitled Vault",
        description: content.description || "",
        createdAt: content.blockTimestamp || "",
      };

      setVault(vaultObject);
    }
  }, [vaultData, vaultId]);

  return (
    <VaultContext.Provider
      value={{
        vault,
        isLoading: isLoadingContent,
        error: null,
        setVaultId,
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
