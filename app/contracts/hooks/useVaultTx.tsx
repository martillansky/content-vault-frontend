import { storeContent } from "@/app/contracts/txs/vaultTx";
import { ethers, Signer } from "ethers";
import { useAccount, useWalletClient } from "wagmi";

export function useVaultTx() {
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();

  const getSigner = async () => {
    if (!walletClient) return null;
    const provider = new ethers.BrowserProvider(walletClient);
    return await provider.getSigner(address);
  };

  const submitContent = async (
    tokenId: number,
    encryptedCID: string,
    isCIDEncrypted: boolean,
    metadata: string
  ) => {
    if (!address) throw new Error("Wallet not connected");

    const signer = await getSigner();

    return storeContent(
      signer as Signer,
      tokenId,
      encryptedCID,
      isCIDEncrypted,
      metadata
    );
  };

  return { submitContent };
}
