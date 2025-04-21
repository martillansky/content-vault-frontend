import { Signer } from "ethers";

export interface TypedDataSigner extends Signer {
  _signTypedData: (
    domain: EIP712Domain,
    types: EIP712Types,
    message: Record<string, string | number>
  ) => Promise<string>;
}

export type EIP712Domain = {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
};

export type EIP712Types = Record<string, Array<{ name: string; type: string }>>;

/**
 * Signs a typed message using EIP-712
 */
export async function signTypedData(
  signer: Signer,
  domain: EIP712Domain,
  types: EIP712Types,
  message: Record<string, string | number>
): Promise<string> {
  const typedSigner = signer as TypedDataSigner;
  return typedSigner._signTypedData(domain, types, message);
}
