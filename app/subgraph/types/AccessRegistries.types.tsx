import { Permissions } from "@/app/components/VaultList";

export interface VaultAccessGranted {
  to: string;
  permission: Permissions;
  blockTimestamp: string;
}

export interface AccessRegistry {
  vaultAccessGranted: VaultAccessGranted;
}

export interface AccessRegistriesResponse {
  accessRegistries: AccessRegistry[];
}
