import { FileNode } from "@/app/components/FileExplorer";
//import { metadataJSONToHex } from "@/lib/crypto/secureEncryption_Multiformats";
import { Content } from "@/lib/subgraph/types/Content.types";

export interface Metadata {
  name: string;
  extension: string;
  route: string;
  type: string;
  description: string;
  timestamp: string;
}

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export function contentFormatter(contentArray: Content[]): FileNode {
  const dataPresenter: FileNode = {
    id: "root",
    name: "Content Vault",
    extension: "",
    description: "",
    type: "",
    metatype: "folder" as const,
    children: [],
  };

  contentArray.forEach((content) => {
    const route: string =
      content.fields.find((field) => field.key === "route")?.value ?? "";

    const routeArray: string[] = route.split("/").slice(1);
    let parentNode: FileNode = dataPresenter;

    routeArray.forEach((folder: string) => {
      let nextNode = parentNode.children.find((node) => node.name === folder);

      if (!nextNode) {
        const nodeFolder: FileNode = {
          id: folder.toLowerCase(),
          name: folder,
          extension: "",
          description: "",
          type: "",
          metatype: "folder" as const,
          children: [],
        };
        parentNode.children.push(nodeFolder);
        nextNode = nodeFolder;
      }
      parentNode = nextNode;
    });

    const nodeFile: FileNode = {
      id: content.id,
      name:
        content.fields.find((field) => field.key === "name")?.value ??
        "unnamed",
      extension:
        content.fields.find((field) => field.key === "extension")?.value ?? "",
      description:
        content.fields.find((field) => field.key === "description")?.value ??
        "",
      metatype: "file",
      type:
        content.fields.find((field) => field.key === "type")?.value ?? "file",
      created:
        content.fields.find((field) => field.key === "timestamp")?.value ??
        content.blockTimestamp,
      children: [],
    };
    parentNode.children.push(nodeFile);
  });
  return dataPresenter;
}

export function buildContentForTX(
  ipfsCIDHex: string,
  mimeType: string,
  name: string,
  description: string,
  route: string,
  timestamp: string,
  isCIDEncrypted: boolean
) {
  const metadata: Metadata = {
    name: name,
    extension: mimeType.split("/")[1] ?? "unknown",
    route: route,
    type: mimeType,
    description: description,
    timestamp: timestamp,
  };

  //const metadataHex = metadataJSONToHex(metadata);
  //const metadataString = JSON.stringify(metadata);

  return {
    tokenId: 1,
    encryptedCIDHex: ipfsCIDHex,
    isCIDEncrypted,
    metadata,
    //metadata: metadataString,
    //metadata: metadataHex,
  };
}

export function formatTimestampShort(timestamp: string) {
  return new Date(Number(timestamp) * 1000).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatTimestampLong(timestamp: string) {
  return new Date(Number(timestamp) * 1000).toString();
}

export function isoTsToUnixTs(isoString: string): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid ISO timestamp format");
  }
  return String(Math.floor(date.getTime() / 1000));
}
