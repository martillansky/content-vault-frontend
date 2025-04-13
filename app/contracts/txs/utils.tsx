export function getVaultAddress(): string {
  return process.env.NEXT_PUBLIC_VAULT_ADDRESS!;
}

export function toBytes(hex: string): string {
  return hex.startsWith("0x") ? hex : `0x${hex}`;
}
