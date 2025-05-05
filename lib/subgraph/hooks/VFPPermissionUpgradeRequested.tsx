import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { requestClientChiado } from "../SubgraphClient";
import { VFPPermissionUpgradeRequestedResponse } from "../types/VFPPermissionUpgradeRequested.types";
import { useVFPPermissionUpgraded } from "./VFPPermissionUpgraded";

const GET_PERMISSION_UPGRADE_REQUESTED = gql`
  query GetPermissionUpgradeRequested(
    $user: String!
    $proposalIds: [String!]!
  ) {
    vaultFromProposalPermissionUpgradeRequesteds(
      where: { user: $user, proposalId_in: $proposalIds }
    ) {
      transactionHash
      proposalId
    }
  }
`;

function useVFPPermissionUpgradeRequested(user: string, proposalIds: string[]) {
  return useQuery<VFPPermissionUpgradeRequestedResponse>({
    queryKey: ["permissionUpgradeRequested", user, proposalIds],
    queryFn: async () => {
      if (!user || !proposalIds || proposalIds.length === 0)
        return { vaultFromProposalPermissionUpgradeRequesteds: [] };
      return requestClientChiado<VFPPermissionUpgradeRequestedResponse>(
        GET_PERMISSION_UPGRADE_REQUESTED,
        {
          user: user,
          proposalIds: proposalIds,
        }
      );
    },
    enabled: !!user && !!proposalIds,
  });
}

export function useVFPPendingUpgrade(user: string, proposalIds: string[]) {
  const { data: permissionUpgradeRequested } = useVFPPermissionUpgradeRequested(
    user,
    proposalIds
  );

  const { data: permissionUpgraded } = useVFPPermissionUpgraded(
    user,
    proposalIds
  );

  if (
    !permissionUpgradeRequested ||
    permissionUpgradeRequested.vaultFromProposalPermissionUpgradeRequesteds
      .length === 0
  )
    return null;

  const out =
    permissionUpgradeRequested.vaultFromProposalPermissionUpgradeRequesteds.filter(
      (upgradeReq) =>
        !permissionUpgraded?.vaultFromProposalPermissionUpgradeds.some(
          (upgraded) => upgraded.proposalId === upgradeReq.proposalId
        )
    );
  return out;
}
