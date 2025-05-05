import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { snapshotRequestClient } from "../SubgraphClient";
import {
  SnapshotProposalData,
  SnapshotProposalDataResponse,
} from "../types/SnapshotProposalData.types";

const GET_SNAPSHOT_PROPOSAL_DATA = gql`
  query GetSnapshotProposalData($ID: String!) {
    proposal(id: $ID) {
      id
      title
      body
      choices
      start
      end
      snapshot
      state
      author
      space {
        id
        name
        strategies {
          params
          network
        }
      }
    }
  }
`;

export function useSnapshotProposalData(proposalId: string) {
  return useQuery<SnapshotProposalDataResponse>({
    queryKey: ["snapshotProposalData", proposalId],
    queryFn: async () => {
      if (!proposalId) return { proposal: {} as SnapshotProposalData };
      return snapshotRequestClient<SnapshotProposalDataResponse>(
        GET_SNAPSHOT_PROPOSAL_DATA,
        {
          ID: proposalId,
        }
      );
    },
    enabled: !!proposalId,
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch when component mounts if data is fresh
  });
}
