import { TransactionResponse } from "ethers";
import { useAccount, useWalletClient } from "wagmi";
import { getSignerAndContract, getTransactionReceipt } from "../utils/utils";

export function useStoreContentWithMetadata() {
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();

  const submitContent = async (
    tokenId: number,
    encryptedCID: string,
    isCIDEncrypted: boolean,
    metadata: string
  ) => {
    const { signer, contract } = await getSignerAndContract(
      walletClient!,
      address!
    );

    const tx = await contract.storeContentWithMetadata(
      tokenId,
      encryptedCID,
      isCIDEncrypted,
      metadata,
      {}
    );

    return getTransactionReceipt(signer, tx as unknown as TransactionResponse);
  };

  return { submitContent };
}
