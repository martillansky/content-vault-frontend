export interface VFPPermissionUpgradeRequested {
  transactionHash: string;
  proposalId: string;
}

export interface VFPPermissionUpgradeRequestedResponse {
  vaultFromProposalPermissionUpgradeRequesteds: VFPPermissionUpgradeRequested[];
}
