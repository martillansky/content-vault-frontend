"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useVaultsContents } from "../subgraph/hooks/Content";
import { Content } from "../subgraph/types/Content.types";

interface Wallet {
  address: string;
  role: string;
}

interface Vault {
  id: string;
  name: string;
  description: string;
  wallets: Wallet[];
}

interface VaultContextType {
  vault: Vault | null;
  //updateVault: (data: { name: string; description: string }) => Promise<void>;
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
  /* const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); */

  const { data: contentResponse, isLoading: isLoadingContent } =
    useVaultsContents(vaultId || "");

  const contentFormatterToVault = (content: Content[]) => {
    if (!content || content.length === 0) {
      return {
        id: "",
        name: "",
        description: "",
        wallets: [],
      };
    }

    // Get the first content item to extract vault information
    const firstContent = content[0];

    // Extract fields from the content
    const fields = firstContent.fields || [];

    // Helper function to find a field value by key
    const getFieldValue = (key: string): string => {
      const field = fields.find((f) => f.key === key);
      return field ? field.value : "";
    };

    return {
      id: firstContent.id || "",
      name: getFieldValue("name") || "Untitled Vault",
      description: getFieldValue("description") || "",
      wallets: [], // We don't have wallet information in the Content type
    };
  };
  useEffect(() => {
    if (contentResponse?.contentStoredWithMetadata_collection) {
      const content = contentResponse.contentStoredWithMetadata_collection;
      const vaultData = contentFormatterToVault(content);

      // Create a vault object from the content data
      const vaultObject: Vault = {
        id: vaultId || "",
        name: vaultData.name || "Untitled Vault",
        description: vaultData.description || "",
        wallets: vaultData.wallets || [],
      };

      setVault(vaultObject);
    }
  }, [contentResponse, vaultId]);

  /* const updateVault = async (data: { name: string; description: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implement actual vault update logic
      if (vault) {
        setVault({
          ...vault,
          ...data,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update vault");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }; */

  return (
    <VaultContext.Provider
      value={{
        vault,
        //updateVault,
        isLoading: /* isLoading ||  */ isLoadingContent,
        error: null,
        setVaultId,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}

export function useVault() {
  const context = useContext(VaultContext);
  if (context === undefined) {
    throw new Error("useVault must be used within a VaultProvider");
  }
  return context;
}
