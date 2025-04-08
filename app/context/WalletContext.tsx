"use client";

import { useRouter } from "next/navigation";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [address, setAddress] = useState<string | null>(null);
  const router = useRouter();

  // Check if wallet is already connected on mount
  useEffect(() => {
    // In a real app, you would check if the wallet is connected
    // For demo purposes, we'll check localStorage
    const storedAddress = localStorage.getItem("walletAddress");
    if (storedAddress) {
      setAddress(storedAddress);
      setIsConnected(true);
    }
  }, []);

  const connectWallet = () => {
    // In a real app, you would connect to the wallet provider (MetaMask, etc.)
    // For demo purposes, we'll simulate a connection
    const mockAddress =
      "0x" +
      Math.random().toString(16).substring(2, 10) +
      "..." +
      Math.random().toString(16).substring(2, 6);

    setAddress(mockAddress);
    setIsConnected(true);
    localStorage.setItem("walletAddress", mockAddress);

    // Use setTimeout to avoid routing issues
    setTimeout(() => {
      router.push("/vaults");
    }, 0);
  };

  const disconnectWallet = () => {
    setAddress(null);
    setIsConnected(false);
    localStorage.removeItem("walletAddress");

    // Use setTimeout to avoid routing issues
    setTimeout(() => {
      router.push("/");
    }, 0);
  };

  return (
    <WalletContext.Provider
      value={{ isConnected, address, connectWallet, disconnectWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
};
