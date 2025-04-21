import { Metadata } from "@/app/utils/dataFormaters";
import { TransactionResponse } from "@ethersproject/providers";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { signTypedData } from "../utils/eip712";
import { getSignerAndContract, getTransactionReceipt } from "../utils/utils";

// EIP-712 type definitions
const types = {
  MetadataHash: [
    { name: "metadata", type: "string" },
    { name: "tokenId", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
  ],
};

export function useStoreContentWithMetadata() {
  const { address } = useAccount();

  const submitContent = async (
    tokenId: number,
    encryptedCID: string,
    isCIDEncrypted: boolean,
    metadata: Metadata,
    signMetadata: boolean
  ) => {
    const { signer, contract } = await getSignerAndContract(address!);
    const metadataString = JSON.stringify(metadata);

    let tx;
    if (signMetadata) {
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      const vaultOwner = await contract.getVaultOwner(tokenId);
      const nonce = await contract.getNonce(vaultOwner);

      const domain = {
        name: "Vault",
        version: "1",
        chainId: await signer.getChainId(),
        verifyingContract: contract.address,
      };

      const message = {
        metadata: metadataString,
        tokenId,
        nonce: nonce.toNumber(),
        deadline,
      };

      const signature = await signTypedData(signer, domain, types, message);

      tx = await contract.storeContentWithMetadataSigned(
        tokenId,
        ethers.utils.arrayify(encryptedCID),
        isCIDEncrypted,
        metadataString,
        deadline,
        ethers.utils.arrayify(signature),
        {}
      );
    } else {
      tx = await contract.storeContentWithMetadata(
        tokenId,
        ethers.utils.arrayify(encryptedCID),
        isCIDEncrypted,
        metadataString,
        {}
      );
    }

    return getTransactionReceipt(signer, tx as TransactionResponse);
  };

  return { submitContent };
}
