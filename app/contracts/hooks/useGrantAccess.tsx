import { TransactionResponse } from "@ethersproject/providers";
import { useAccount } from "wagmi";
import { getSignerAndContract, getTransactionReceipt } from "../utils/utils";

export function useGrantAccess() {
  const { address } = useAccount();

  const grantAccess = async (
    addressToGrantAccess: string,
    tokenId: number,
    role: "owner" | "contributor" | "viewer"
  ) => {
    const { signer, contract } = await getSignerAndContract(address!);

    const permission =
      role === "contributor"
        ? await contract.PERMISSION_WRITE()
        : role === "viewer"
        ? await contract.PERMISSION_READ()
        : await contract.PERMISSION_NONE();

    const tx = await contract.grantAccess(
      addressToGrantAccess,
      tokenId,
      permission,
      {}
    );

    return getTransactionReceipt(signer, tx as unknown as TransactionResponse);
  };

  return { grantAccess };
}
