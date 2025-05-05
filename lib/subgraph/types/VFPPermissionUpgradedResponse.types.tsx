export interface VFPPermissionUpgraded {
  transactionHash: string;
  proposalId: string;
}

export interface VFPPermissionUpgradedResponse {
  vaultFromProposalPermissionUpgradeds: VFPPermissionUpgraded[];
}
