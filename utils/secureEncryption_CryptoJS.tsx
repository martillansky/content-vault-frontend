import CryptoJS from "crypto-js";

// ------------------------------------------------------------------------------------------------
// 📦 Secure Encryption
// ------------------------------------------------------------------------------------------------

export function encryptCIDToHex(cid: string, password: string): string {
  const salt = CryptoJS.lib.WordArray.random(128 / 8);
  const key = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 1000,
  });
  const iv = CryptoJS.lib.WordArray.random(128 / 8);
  const encrypted = CryptoJS.AES.encrypt(cid, key, { iv });

  const full =
    "0x" + salt.toString() + iv.toString() + encrypted.ciphertext.toString();
  return full;
}

export function decryptCIDFromHex(
  encryptedHex: string,
  password: string
): string {
  if (encryptedHex.startsWith("0x")) {
    encryptedHex = encryptedHex.slice(2);
  }

  const salt = CryptoJS.enc.Hex.parse(encryptedHex.slice(0, 32));
  const iv = CryptoJS.enc.Hex.parse(encryptedHex.slice(32, 64));
  const ciphertext = CryptoJS.enc.Hex.parse(encryptedHex.slice(64));

  const key = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 1000,
  });

  const decrypted = CryptoJS.AES.decrypt(
    CryptoJS.lib.CipherParams.create({ ciphertext }),
    key,
    { iv }
  );

  return decrypted.toString(CryptoJS.enc.Utf8);
}
