import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { requestClientSepolia } from "../SubgraphClient";
import { VFPPermissionUpgradedResponse } from "../types/VFPPermissionUpgradedResponse.types";

const GET_PERMISSION_UPGRADE_UPGRADED = gql`
  query GetPermissionUpgraded($user: String!, $proposalIds: [String!]!) {
    vaultFromProposalPermissionUpgradeds(
      where: { user: $user, proposalId_in: $proposalIds }
    ) {
      transactionHash
      proposalId
    }
  }
`;

export function useVFPPermissionUpgraded(user: string, proposalIds: string[]) {
  return useQuery<VFPPermissionUpgradedResponse>({
    queryKey: ["permissionUpgraded", user, proposalIds],
    queryFn: async () => {
      if (!user || !proposalIds || proposalIds.length === 0)
        return { vaultFromProposalPermissionUpgradeds: [] };
      return requestClientSepolia<VFPPermissionUpgradedResponse>(
        GET_PERMISSION_UPGRADE_UPGRADED,
        {
          user: user,
          proposalIds: proposalIds,
        }
      );
    },
    enabled: !!user && !!proposalIds,
  });
}
