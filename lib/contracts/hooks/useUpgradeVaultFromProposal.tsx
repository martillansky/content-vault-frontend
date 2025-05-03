import { networks } from "@/lib/reown";
import { TransactionResponse } from "@ethersproject/providers";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { getSignerAndContract, getTransactionReceipt } from "../utils/utils";

// Minimal ERC-20 ABI for reading common properties
const erc20Abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
];

export function useUpgradeVaultFromProposal() {
  const { address, chainId } = useAccount();

  const checkVotingPower = async (_chainId: number, _tokenAddress: string) => {
    const chain = networks.find((chain) => chain.id === _chainId);
    if (!chain) {
      throw new Error("Chain not found");
    }
    const provider = new ethers.providers.JsonRpcProvider(
      chain.rpcUrls.default.http[0]
    );
    const contract = new ethers.Contract(_tokenAddress, erc20Abi, provider);

    // Read balance
    const balance = await contract.balanceOf(address);
    const symbol = await contract.symbol();
    const decimals = await contract.decimals();
    const formattedBalance = ethers.utils.formatUnits(balance, decimals);

    return { formattedBalance, symbol, chainName: chain.name };
  };

  const useVotingPower = (_chainId: number, _tokenAddress: string) => {
    return useQuery({
      queryKey: ["votingPower", _chainId, _tokenAddress, address],
      queryFn: () => checkVotingPower(_chainId, _tokenAddress),
      enabled: !!_chainId && !!_tokenAddress && !!address,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    });
  };

  const upgradeVaultFromProposal = async (
    proposalId: string,
    _chainId: number
  ) => {
    const { signer, foreignCrosschainGranter } = await getSignerAndContract(
      address!
    );

    if (chainId !== _chainId) {
      throw new Error("Chain ID does not match");
    }

    const tx: TransactionResponse =
      await foreignCrosschainGranter.upgradePermissionVaultFromProposal(
        proposalId,
        {
          gasLimit: 5_000_000,
        }
      );

    return getTransactionReceipt(signer, tx as unknown as TransactionResponse);
  };

  return { upgradeVaultFromProposal, useVotingPower };
}
