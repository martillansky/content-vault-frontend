import {
  ForeignCrosschainGranter__factory,
  ForeignGateway__factory,
  MasterCrosschainGranter__factory,
  MasterGateway__factory,
  ProposalVaultManager__factory,
  SchemaManager__factory,
  Vault__factory,
} from "@/lib/contracts/types";
import { TransactionResponse, Web3Provider } from "@ethersproject/providers";
import { Signer } from "ethers";

export function getVaultAddress(): string {
  return process.env.NEXT_PUBLIC_VAULT_ADDRESS!;
}

export function getMasterCrosschainGranterAddress(): string {
  return process.env.NEXT_PUBLIC_MASTER_CROSSCHAIN_GRANTER_ADDRESS_SEPOLIA!;
}

export function getMasterGatewayAddress(): string {
  return process.env.NEXT_PUBLIC_MASTER_GATEWAY_ADDRESS_SEPOLIA!;
}

export function getForeignGatewayAddress(): string {
  return process.env.NEXT_PUBLIC_FOREIGN_GATEWAY_ADDRESS_CHIADO!;
}

export function getForeignCrosschainGranterAddress(): string {
  return process.env.NEXT_PUBLIC_FOREIGN_CROSSCHAIN_GRANTER_ADDRESS_CHIADO!;
}

export function getProposalVaultManagerAddress(): string {
  return process.env.NEXT_PUBLIC_PROPOSAL_VAULT_MANAGER_ADDRESS_SEPOLIA!;
}

export function getSchemaManagerAddress(): string {
  return process.env.NEXT_PUBLIC_SCHEMA_MANAGER_ADDRESS_SEPOLIA!;
}

export function toBytes(hex: string): string {
  return hex.startsWith("0x") ? hex : `0x${hex}`;
}

export async function getSignerAndContract(address: string) {
  if (!address) throw new Error("Wallet not connected");

  const signer: Signer | null = getSigner(address);

  if (!signer) throw new Error("Signer not found");

  const contract = Vault__factory.connect(getVaultAddress(), signer);
  const schemaManager = SchemaManager__factory.connect(
    getSchemaManagerAddress(),
    signer
  );

  const proposalVaultManager = ProposalVaultManager__factory.connect(
    getProposalVaultManagerAddress(),
    signer
  );

  const masterGateway = MasterGateway__factory.connect(
    getMasterGatewayAddress(),
    signer
  );

  const masterCrosschainGranter = MasterCrosschainGranter__factory.connect(
    getMasterCrosschainGranterAddress(),
    signer
  );

  const foreignGateway = ForeignGateway__factory.connect(
    getForeignGatewayAddress(),
    signer
  );

  const foreignCrosschainGranter = ForeignCrosschainGranter__factory.connect(
    getForeignCrosschainGranterAddress(),
    signer
  );

  return {
    signer,
    contract,
    schemaManager,
    proposalVaultManager,
    masterGateway,
    masterCrosschainGranter,
    foreignGateway,
    foreignCrosschainGranter,
  };
}

export const getSigner = (address: string) => {
  const provider = getEthersProvider();
  return provider.getSigner(address);
};

export async function getTransactionReceipt(
  signer: Signer,
  tx: TransactionResponse
) {
  // Wait for transaction confirmation using the provider
  if (!signer.provider) {
    throw new Error("Signer has no provider");
  }

  // Use type assertion to access the hash property
  const txResponse = tx as unknown as TransactionResponse;
  const receipt = await signer.provider.waitForTransaction(txResponse.hash);
  return receipt;
}

export function getEthersProvider(): Web3Provider {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    return new Web3Provider(window.ethereum);
  } else {
    throw new Error("No injected provider found (e.g., MetaMask).");
  }
}
