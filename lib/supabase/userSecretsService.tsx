import {
  deriveHashKey,
  generateSalt,
  generateSecurePassword,
} from "@/lib/crypto/secureEncryption_Multiformats";
import { supabase } from "./supabaseClient";

interface UserSecrets {
  password: string;
  salt: string;
  response_salt: string;
}

async function storeUserSecrets(
  wallet: string,
  secrets: UserSecrets
): Promise<void> {
  const { error } = await supabase.from("user_secrets").upsert(
    {
      wallet_address: wallet,
      password: secrets.password,
      salt: secrets.salt,
      response_salt: secrets.response_salt,
    },
    { onConflict: "wallet_address" }
  );

  if (error) throw new Error(`Failed to store secrets: ${error.message}`);
}

async function getUserSecrets(wallet: string): Promise<UserSecrets> {
  const { data, error } = await supabase
    .from("user_secrets")
    .select("password, salt, response_salt")
    .eq("wallet_address", wallet)
    .single();

  if (error) throw new Error(`Failed to fetch secrets: ${error.message}`);

  if (!data) throw new Error(`No secrets found for wallet: ${wallet}`);

  return {
    password: data.password,
    salt: data.salt,
    response_salt: data.response_salt,
  };
}

export async function getHashDerivedKey(wallet: string): Promise<string> {
  let userSecrets: UserSecrets | null = null;
  try {
    userSecrets = await getUserSecrets(wallet.toLowerCase());
  } catch (error) {
    if (error instanceof Error && error.message.includes("No secrets found")) {
      const salt = generateSalt();
      const password = generateSecurePassword();
      const response_salt = "";
      userSecrets = { password, salt, response_salt };
      await storeUserSecrets(wallet.toLowerCase(), userSecrets);
    } else {
      throw error;
    }
  }
  const hashedDerivedKey = await deriveHashKey(
    userSecrets.password,
    userSecrets.salt
  );

  return hashedDerivedKey;
}

export async function validateReceivedHashDerivedKey(
  wallet: string,
  hashedDerivedKey: string
): Promise<boolean> {
  let userSecrets: UserSecrets | null = null;
  try {
    userSecrets = await getUserSecrets(wallet.toLowerCase());
    const generatedHashedDerivedKey = await deriveHashKey(
      userSecrets.password,
      userSecrets.response_salt
    );
    return hashedDerivedKey === generatedHashedDerivedKey;
  } catch (error) {
    throw error;
  }
}

export async function retrieveEncryptionPassword(
  address: string
): Promise<string> {
  let userSecrets: UserSecrets | null = null;
  try {
    userSecrets = await getUserSecrets(address.toLowerCase());
  } catch (error) {
    throw error;
  }
  return userSecrets.password;
}
