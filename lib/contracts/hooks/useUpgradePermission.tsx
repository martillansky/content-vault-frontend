import { TransactionResponse } from "@ethersproject/providers";
import { useAccount } from "wagmi";
import { getSignerAndContract, getTransactionReceipt } from "../utils/utils";

export function useUpgradePermission() {
  const { address } = useAccount();

  const upgradePermission = async (vaultId: number, userAddress: string) => {
    const { signer, contract } = await getSignerAndContract(address!);

    const tx = await contract.upgradePermission(vaultId, userAddress);

    return getTransactionReceipt(signer, tx as unknown as TransactionResponse);
  };

  return { upgradePermission };
}
