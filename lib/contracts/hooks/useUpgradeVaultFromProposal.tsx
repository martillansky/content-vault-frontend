import { networks } from "@/lib/reown";
import { gnosisChiado } from "@/lib/reown/chains";
import { TransactionResponse } from "@ethersproject/providers";
import { sepolia } from "@reown/appkit/networks";
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

const ambBridgeHelperAbi = [
  "function getSignatures(bytes _message) view returns (bytes)",
];

const ambBridgeSepoliaAbi = [
  "function executeSignatures(bytes _data, bytes _message)",
];

export function useUpgradeVaultFromProposal() {
  const { address, chainId } = useAccount();

  const getSignaturesAndRelayCrosschainUpgrade = async (_txHash: string) => {
    const { signer } = await getSignerAndContract(address!);

    const txRelay = await getTransactionReceipt(
      signer,
      _txHash as unknown as TransactionResponse
    );
    const data = txRelay.logs.at(1)?.data;

    const subEndChiado = 754; // 748 in case Gnosis mainnet;
    const _message = `0x${data?.substring(130, subEndChiado)}` as `0x${string}`;

    const ambBridgeHelperAddress =
      process.env.NEXT_PUBLIC_AMBBRIDGE_HELPER_CHIADO;
    if (!ambBridgeHelperAddress) {
      throw new Error("AMB Bridge Helper address not found");
    }
    const provider = new ethers.providers.JsonRpcProvider(
      gnosisChiado.rpcUrls.default.http[0]
    );
    const contract = new ethers.Contract(
      ambBridgeHelperAddress,
      ambBridgeHelperAbi,
      provider
    );

    // Read signatures
    const signatures = await contract.getSignatures(_message);

    const ambBridgeSepoliaAddress = process.env.NEXT_PUBLIC_HOME_BRIDGE_SEPOLIA;
    if (!ambBridgeSepoliaAddress) {
      throw new Error("AMB Bridge Sepolia address not found");
    }
    const providerSepolia = new ethers.providers.JsonRpcProvider(
      sepolia.rpcUrls.default.http[0]
    );
    const contractSepolia = new ethers.Contract(
      ambBridgeSepoliaAddress,
      ambBridgeSepoliaAbi,
      providerSepolia
    );

    // Relay on Sepolia
    const tx = await contractSepolia.executeSignatures(signatures, _message, {
      gasLimit: 5_000_000,
    });

    return getTransactionReceipt(signer, tx as unknown as TransactionResponse);
  };

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

  return {
    upgradeVaultFromProposal,
    useVotingPower,
    getSignaturesAndRelayCrosschainUpgrade,
  };
}
