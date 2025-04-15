import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { requestClient } from "../SubgraphClient";
import { VaultDataResponse } from "../types/VaultData.types";

const GET_VAULT_DATA = gql`
  query GetVaultData($tokenId: String!) {
    vaultCreateds(where: { tokenId: $tokenId }) {
      tokenId
      owner
      blockTimestamp
      accessRegistries {
        vaultAccessGranted {
          tokenId
          to
          permission
          blockTimestamp
        }
      }
    }
  }
`;

export function useVaultData(tokenId: string) {
  return useQuery<VaultDataResponse>({
    queryKey: ["vaultData", tokenId],
    queryFn: async () => {
      if (!tokenId) return { vaultCreateds: [] };
      return requestClient<VaultDataResponse>(GET_VAULT_DATA, {
        tokenId: tokenId,
      });
    },
    enabled: !!tokenId,
  });
}
