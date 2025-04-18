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

export function metadataJSONToHex(metadata: object): string {
  return bytesToHex(new TextEncoder().encode(JSON.stringify(metadata)));
}

// ------------------------------------------------------------------------------------------------
// 📦 Helper Functions
// ------------------------------------------------------------------------------------------------

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

export async function deriveHashKey(
  password: string,
  salt: string
): Promise<string> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new TextEncoder().encode(salt),
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    256 // 256 bits = 32 bytes
  );

  return Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function generateSecurePassword(): string {
  // 32 random bytes (256 bits) for high-entropy password
  const array = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // 64-character hex string
}

export function generateSalt(): string {
  const saltBytes = crypto.getRandomValues(new Uint8Array(16)); // 128-bit salt
  return Array.from(saltBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // 32-character hex string
}
