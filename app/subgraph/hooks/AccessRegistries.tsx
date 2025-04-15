import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { requestClient } from "../SubgraphClient";
import { AccessRegistriesResponse } from "../types/AccessRegistries.types";

const GET_ACCESS_REGISTRIES = gql`
  query GetAccessRegistries($tokenId: String!) {
    accessRegistries(where: { vaultAccessGranted_: { tokenId: 1 } }) {
      vaultAccessGranted {
        to
        permission
        blockTimestamp
      }
    }
  }
`;

export function useAccessRegistries(tokenId: string) {
  return useQuery<AccessRegistriesResponse>({
    queryKey: ["accessRegistries", tokenId],
    queryFn: async () => {
      if (!tokenId) return { accessRegistries: [] };
      return requestClient<AccessRegistriesResponse>(GET_ACCESS_REGISTRIES, {
        tokenId: tokenId,
      });
    },
    enabled: !!tokenId,
  });
}
