import { Permissions } from "@/app/components/VaultList";

// Base Vault shared by both owned and granted vaults
export interface BaseVault {
  name: string;
  description: string;
  owner: string;
  lastAccessed: string;
  itemCount: number;
  tokenId: string;
  schemaCID: string;
  blockTimestamp: string;
}

// Vault created by the user (owns it)
export interface VaultCreated extends BaseVault {
  tokenId: string;
}

export interface Permission {
  permission: Permissions;
}

// Vault the user has access to (granted by someone else)
export interface VaultGranted extends BaseVault {
  permission: Permission;
}

// Vault from proposal pinned by the user
export interface VaultFromProposal extends BaseVault {
  permission: Permission;
  chainId: string;
  tokenContract: string;
  proposalId: string;
}

// Structure for vault access granted to the user
export interface VaultAccessGranted {
  tokenId: string;
  //permission: number;
  permission: Permission;
  accessRegistry: AccessRegistry;
}

export interface VaultFromProposalPinned {
  tokenId: string;
  //permission: number;
  permission: Permission;

  /* accessRegistries: AccessRegistry; */
  vaultFromProposal: VaultFromProposal;
}

export interface AccessRegistry {
  vaultCreated: VaultCreated;
  vaultFromProposal: VaultFromProposal;
}

// Top-level query result from The Graph
export interface UserDataResponse {
  userDatas: UserData[];
}

// Grouped vault info for a user (both owned and granted)
export interface UserData {
  vaultsCreated: VaultCreated[];
  vaultAccessesGranted: VaultAccessGranted[];
  vaultsFromProposalPinned: VaultFromProposalPinned[];
}
