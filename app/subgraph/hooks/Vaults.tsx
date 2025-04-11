import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { requestClient } from "../SubgraphClient";
import { VaultsResponse } from "../types/Vaults.types";

const GET_VAULTS_CREATED = gql`
  query GetVaultsCreated($owner: String!) {
    vaultCreateds(where: { owner: $owner }) {
      tokenId
      schemaCID
      blockTimestamp
    }
  }
`;

export function useVaults(address: string) {
  return useQuery<VaultsResponse>({
    queryKey: ["vaults", address],
    queryFn: async () => {
      if (!address) return { vaultCreateds: [] };
      return requestClient<VaultsResponse>(GET_VAULTS_CREATED, {
        owner: address,
      });
    },
    enabled: !!address,
  });
}
