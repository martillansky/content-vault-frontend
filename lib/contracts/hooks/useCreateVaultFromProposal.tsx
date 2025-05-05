import { TransactionResponse } from "@ethersproject/providers";
import { useAccount } from "wagmi";
import { getSignerAndContract, getTransactionReceipt } from "../utils/utils";

export function useCreateVaultFromProposal() {
  const { address } = useAccount();

  const submitVaultFromProposal = async (
    proposalId: string,
    name: string,
    description: string
  ) => {
    const { signer, masterCrosschainGranter, proposalVaultManager, contract } =
      await getSignerAndContract(address!);

    // TODO: change the following mocked data. This is for testing purposes only.
    // Voting power derived from chainId and token contract should be read from
    // the strategies specified in the proposal.
    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID_CHIADO!;
    const tokenAddress =
      process.env.NEXT_PUBLIC_CHIADO_TOKEN_ADDRESS_CHAINLINK!;
    // ------------------------------------------------------------------------

    // We need to verify if the vault from the requested proposal has been already created
    // If it has, we should not create a new vault.
    // --- In that case, we should verify if the vault has been already pinned.
    // --- . --- If it has, we should not pin it again.
    // --- . --- If it has not, we should pin it.
    // ------------------------------------------------------------------------

    const tokenId = await proposalVaultManager.proposalIdToVault(proposalId);
    let tx: TransactionResponse;
    if (tokenId.toNumber() !== 0) {
      const wasPinnedForUser = await contract.hasGrantedPermission(
        tokenId,
        address!
      );
      if (!wasPinnedForUser) {
        tx = await proposalVaultManager.pinVaultFromProposal(proposalId, {
          gasLimit: 5_000_000,
        });
      } else {
        return;
      }
    } else {
      tx = await masterCrosschainGranter.createVaultFromProposal(
        proposalId,
        name,
        description,
        chainId,
        tokenAddress,
        {
          gasLimit: 5_000_000,
        }
      );
    }

    return getTransactionReceipt(signer, tx as unknown as TransactionResponse);
  };

  return { submitVaultFromProposal };
}
