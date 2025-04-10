export interface VaultCreated {
  name: string;
  description: string;
  owner: string;
  lastAccessed: string;
  itemCount: number;
  tokenId: string;
  schemaCID: string;
  blockTimestamp: string;
}

export interface VaultsResponse {
  vaultCreateds: VaultCreated[];
}
