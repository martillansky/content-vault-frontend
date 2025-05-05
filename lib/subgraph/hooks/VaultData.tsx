import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { requestClientSepolia } from "../SubgraphClient";
import { VaultDataResponse } from "../types/VaultData.types";

const GET_VAULT_DATA = gql`
  query GetVaultData($tokenId: String!) {
    vaultCreateds(where: { tokenId: $tokenId }) {
      tokenId
      owner
      name
      description
      blockTimestamp
      accessRegistries {
        vaultAccessGranted {
          tokenId
          to
          permission {
            permission
          }
          blockTimestamp
        }
      }
    }
    vaultFromProposalCreateds(where: { tokenId: $tokenId }) {
      tokenId
      proposalId
      name
      description
      blockTimestamp
    }
  }
`;

export function useVaultData(tokenId: string) {
  return useQuery<VaultDataResponse>({
    queryKey: ["vaultData", tokenId],
    queryFn: async () => {
      if (!tokenId) return { vaultCreateds: [], vaultFromProposalCreateds: [] };
      return requestClientSepolia<VaultDataResponse>(GET_VAULT_DATA, {
        tokenId: tokenId,
      });
    },
    enabled: !!tokenId,
  });
}
