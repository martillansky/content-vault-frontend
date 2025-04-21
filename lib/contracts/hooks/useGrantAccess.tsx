import { TransactionResponse } from "@ethersproject/providers";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { signTypedData } from "../utils/eip712";
import { getSignerAndContract, getTransactionReceipt } from "../utils/utils";

// EIP-712 type definitions
const types = {
  PermissionGrant: [
    { name: "to", type: "address" },
    { name: "tokenId", type: "uint256" },
    { name: "permission", type: "uint8" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
  ],
};

export function useGrantAccess() {
  const { address } = useAccount();

  const grantAccess = async (
    addressToGrantAccess: string,
    tokenId: number,
    role: "owner" | "contributor" | "viewer",
    signing: boolean
  ) => {
    const { signer, contract } = await getSignerAndContract(address!);

    const permission =
      role === "contributor"
        ? await contract.PERMISSION_WRITE()
        : role === "viewer"
        ? await contract.PERMISSION_READ()
        : await contract.PERMISSION_NONE();

    let tx;
    if (signing) {
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
        to: addressToGrantAccess,
        tokenId,
        permission,
        nonce: nonce.toNumber(),
        deadline,
      };

      const signature = await signTypedData(signer, domain, types, message);

      tx = await contract.grantAccessWithSignature(
        addressToGrantAccess,
        tokenId,
        permission,
        deadline,
        ethers.utils.arrayify(signature),
        {}
      );
    } else {
      tx = await contract.grantAccess(
        addressToGrantAccess,
        tokenId,
        permission
      );
    }

    return getTransactionReceipt(signer, tx as unknown as TransactionResponse);
  };

  return { grantAccess };
}
