import { Vault__factory } from "@/app/types"; // Typechain
import { Contract, Signer, TransactionResponse } from "ethers";
import { getVaultAddress } from "./utils";

export async function storeContent(
  signer: Signer,
  tokenId: number,
  encryptedCID: string,
  isCIDEncrypted: boolean,
  metadata: string
) {
  const contract = Vault__factory.connect(getVaultAddress(), signer);
  const tx = await contract.storeContentWithMetadata(
    tokenId,
    encryptedCID,
    isCIDEncrypted,
    metadata,
    {}
  );

  // Wait for transaction confirmation using the provider
  if (!signer.provider) {
    throw new Error("Signer has no provider");
  }

  // Use type assertion to access the hash property
  const txResponse = tx as unknown as TransactionResponse;
  const receipt = await signer.provider.waitForTransaction(txResponse.hash);
  return receipt;
}
