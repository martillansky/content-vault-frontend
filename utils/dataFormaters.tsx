import { FileNode } from "@/app/components/FileExplorer";
import { Content } from "@/app/subgraph/types/Content.types";

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
    var parentNode = dataPresenter;

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
