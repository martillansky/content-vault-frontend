import { Permissions } from "@/app/components/VaultList";
import { VaultCreated } from "./UserData.types";

export interface VaultAccessGranted {
  to: string;
  permission: {
    permission: Permissions;
  };
  blockTimestamp: string;
}

export interface AccessRegistry {
  vaultAccessGranted: VaultAccessGranted;
}

export interface VaultData extends VaultCreated {
  accessRegistries: AccessRegistry[];
}

export interface VaultFromProposalCreated {
  tokenId: string;
  proposalId: string;
  name: string;
  description: string;
  blockTimestamp: string;
}

export interface VaultDataResponse {
  vaultCreateds: VaultData[];
  vaultFromProposalCreateds: VaultFromProposalCreated[];
}
