import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { requestClientSepolia } from "../SubgraphClient";
import { ContentResponse } from "../types/Content.types";

const GET_CONTENT = gql`
  query GetContent($tokenId: String!) {
    contentStoredWithMetadata_collection(where: { tokenId: $tokenId }) {
      id
      sender
      encryptedCID
      isCIDEncrypted
      metadata
      fields {
        key
        value
      }
      isMetadataSigned
      blockTimestamp
    }
  }
`;

export function useVaultsContents(tokenId: string) {
  return useQuery<ContentResponse>({
    queryKey: ["content", tokenId],
    queryFn: async () => {
      if (!tokenId) return { contentStoredWithMetadata_collection: [] };
      return requestClientSepolia<ContentResponse>(GET_CONTENT, {
        tokenId: tokenId,
      });
    },
    enabled: !!tokenId,
  });
}
