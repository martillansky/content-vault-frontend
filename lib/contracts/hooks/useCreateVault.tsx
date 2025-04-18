import { TransactionResponse } from "@ethersproject/providers";
import { useAccount } from "wagmi";
import { getSignerAndContract, getTransactionReceipt } from "../utils/utils";

export function useCreateVault() {
  const { address } = useAccount();

  const submitVault = async (
    tokenId: number,
    name: string,
    description: string
  ) => {
    const { signer, contract } = await getSignerAndContract(address!);

    const tx = await contract.createVault(tokenId, name, description);

    return getTransactionReceipt(signer, tx as unknown as TransactionResponse);
  };

  return { submitVault };
}
