import {
  getHashDerivedKey,
  validateReceivedHashDerivedKey,
} from "@/lib/supabase/userSecretsService";

export async function uploadToIPFSBackend(
  walletAddress: string,
  name: string,
  file: File,
  useEncryption: boolean
): Promise<{
  IpfsHash: string;
  MimeType: string;
  Name: string;
  timestamp: string;
}> {
  const normalizedAddress = walletAddress.toLowerCase();
  const hashedDerivedKey = await getHashDerivedKey(normalizedAddress);

  const formData = new FormData();
  formData.append("walletAddress", normalizedAddress);
  formData.append("hashedDerivedKey", hashedDerivedKey);
  formData.append("file", file, name);
  formData.append("useEncryption", useEncryption.toString());

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const { IpfsHash, ReturnedHashedDerivedKey, MimeType, Name, timestamp } =
    await response.json();

  if (
    !(await validateReceivedHashDerivedKey(
      normalizedAddress,
      ReturnedHashedDerivedKey
    ))
  ) {
    throw new Error("Invalid hash derived key");
  }

  return {
    IpfsHash,
    MimeType,
    Name,
    timestamp,
  };
}
