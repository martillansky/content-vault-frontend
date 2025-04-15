import { TransactionResponse } from "@ethersproject/providers";
import { useAccount } from "wagmi";
import { getSignerAndContract, getTransactionReceipt } from "../utils/utils";

export function useCreateSchema() {
  const { address } = useAccount();

  const submitSchema = async (schemaCIDHex: string) => {
    const { signer, contract } = await getSignerAndContract(address!);

    const tx = await contract.setSchema(schemaCIDHex);

    return getTransactionReceipt(signer, tx as unknown as TransactionResponse);
  };

  return { submitSchema };
}
