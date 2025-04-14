import { Vault__factory } from "@/app/types";
import { ethers, Signer, TransactionResponse } from "ethers";
import { WalletClient } from "viem";

export function getVaultAddress(): string {
  return process.env.NEXT_PUBLIC_VAULT_ADDRESS!;
}

export function toBytes(hex: string): string {
  return hex.startsWith("0x") ? hex : `0x${hex}`;
}

export async function getSignerAndContract(
  walletClient: WalletClient,
  address: string
) {
  if (!walletClient || !address) throw new Error("Wallet not connected");

  const signer: Signer | null = await getSigner(walletClient, address);

  if (!signer) throw new Error("Signer not found");

  const contract = Vault__factory.connect(getVaultAddress(), signer);
  return { signer, contract };
}

export const getSigner = async (
  walletClient: WalletClient,
  address: string
) => {
  if (!walletClient) return null;
  const provider = new ethers.BrowserProvider(walletClient);
  return await provider.getSigner(address);
};

export async function getTransactionReceipt(
  signer: Signer,
  tx: TransactionResponse
) {
  // Wait for transaction confirmation using the provider
  if (!signer.provider) {
    throw new Error("Signer has no provider");
  }

  // Use type assertion to access the hash property
  const txResponse = tx as unknown as TransactionResponse;
  const receipt = await signer.provider.waitForTransaction(txResponse.hash);
  return receipt;
}
