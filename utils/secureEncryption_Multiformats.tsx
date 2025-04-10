import { CID } from "multiformats/cid";

// ------------------------------------------------------------------------------------------------
// 📦 Secure Encryption Multiformats
// ------------------------------------------------------------------------------------------------

export async function encryptCIDToHex(
  cidStr: string,
  password: string
): Promise<string> {
  // Convert the CID string to a Uint8Array
  const cid = CID.parse(cidStr);
  const cidBytes = cid.bytes;

  // Generate a random salt
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // Derive a key from the password and salt
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );

  // Generate a random IV
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Encrypt the CID bytes
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    cidBytes
  );

  // Concatenate salt, IV, and ciphertext
  const encryptedBytes = new Uint8Array([
    ...salt,
    ...iv,
    ...new Uint8Array(encrypted),
  ]);

  return bytesToHex(encryptedBytes);
}

export async function decryptCIDFromHex(
  encryptedHex: string,
  password: string
): Promise<string> {
  const encryptedBytes = hexToBytes(encryptedHex);

  // Extract salt, IV, and ciphertext
  const salt = encryptedBytes.slice(0, 16);
  const iv = encryptedBytes.slice(16, 28);
  const ciphertext = encryptedBytes.slice(28);

  // Derive the key using the same method as during encryption
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );

  // Decrypt the ciphertext
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    ciphertext
  );

  // Convert decrypted bytes back to CID
  const cid = CID.decode(new Uint8Array(decrypted));
  return cid.toString();
}

export function simpleCIDToHex(cidStr: string): string {
  const cid = CID.parse(cidStr);
  return Array.from(cid.bytes as Uint8Array)
    .map((byte: number) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function simpleCIDFromHex(hexStr: string): string {
  const bytes = new Uint8Array(
    hexStr.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );
  const cid = CID.decode(bytes);
  return cid.toString();
}

export function bytesToHex(bytes: Uint8Array): string {
  return (
    "0x" +
    Array.from(bytes)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("")
  );
}

export function hexToBytes(hex: string): Uint8Array {
  if (hex.startsWith("0x")) hex = hex.slice(2);
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

export function metadataJSONToHex(metadata: any): string {
  return bytesToHex(new TextEncoder().encode(JSON.stringify(metadata)));
}
