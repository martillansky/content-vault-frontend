import { FileNode } from "../components/FileExplorer";

// Sample data for demonstration
export const sampleVaults = [
  {
    name: "Personal Documents",
    description: "Important personal documents and certificates",
    owner: "0x1234...5678",
    lastAccessed: "2024-04-08",
    itemCount: 12,
    tokenId: "12",
    schemaCID: "QmHash",
    blockTimestamp: "1712345678",
  },
  {
    name: "Project Files",
    description: "Work-related documents and project files",
    owner: "0x1234...5678",
    lastAccessed: "2024-04-07",
    itemCount: 8,
    tokenId: "2",
    schemaCID: "QmHash",
    blockTimestamp: "1712345678",
  },
  {
    name: "Media Library",
    description: "Photos, videos, and other media files",
    owner: "0x1234...5678",
    lastAccessed: "2024-04-06",
    itemCount: 24,
    tokenId: "3",
    schemaCID: "QmHash",
    blockTimestamp: "1712345678",
  },
  {
    name: "Shared Documents",
    description: "Documents shared with team members",
    owner: "0xabcd...efgh",
    lastAccessed: "2024-04-05",
    itemCount: 15,
    tokenId: "4",
    schemaCID: "QmHash",
    blockTimestamp: "1712345678",
  },
];

// Sample data structure
export const sampleData: FileNode = {
  id: "root",
  name: "Content Vault",
  extension: "",
  description: "",
  type: "",
  metatype: "folder" as const,
  children: [
    {
      id: "folder1",
      name: "Documents",
      extension: "",
      description: "",
      type: "",
      metatype: "folder" as const,
      children: [
        {
          id: "file1",
          name: "report.pdf",
          type: "image/png",
          extension: "pdf",
          description: "A report about the company",
          created: "2024-04-08",
          metatype: "file" as const,
          children: [],
        },
        {
          id: "file2",
          name: "presentation.pptx",
          type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          extension: "pptx",
          description: "A presentation about the company",
          created: "2024-04-07",
          metatype: "file" as const,
          children: [],
        },
      ],
    },
    {
      id: "folder2",
      name: "Images",
      extension: "",
      description: "",
      type: "",
      metatype: "folder" as const,
      children: [
        {
          id: "file3",
          name: "photo.jpg",
          type: "image/jpeg",
          extension: "jpg",
          description: "A photo of the company",
          created: "2024-04-06",
          metatype: "file" as const,
          children: [],
        },
      ],
    },
  ],
};

// Sample vault data mapping
/* export const vaultDataMap: Record<string, any> = {
  vault1: {
    id: "root",
    name: "Personal Documents",
    type: "folder" as const,
    children: [
      {
        id: "folder1",
        name: "Certificates",
        type: "folder" as const,
        children: [
          {
            id: "file1",
            name: "birth_certificate.pdf",
            type: "file" as const,
            size: 1024,
            lastModified: "2024-04-08",
          },
          {
            id: "file2",
            name: "diploma.pdf",
            type: "file" as const,
            size: 2048,
            lastModified: "2024-04-07",
          },
        ],
      },
      {
        id: "folder2",
        name: "ID Documents",
        type: "folder" as const,
        children: [
          {
            id: "file3",
            name: "passport.jpg",
            type: "file" as const,
            size: 3072,
            lastModified: "2024-04-06",
          },
          {
            id: "file4",
            name: "drivers_license.pdf",
            type: "file" as const,
            size: 1536,
            lastModified: "2024-04-05",
          },
        ],
      },
    ],
  },
  vault2: {
    id: "root",
    name: "Project Files",
    type: "folder" as const,
    children: [
      {
        id: "folder1",
        name: "Designs",
        type: "folder" as const,
        children: [
          {
            id: "file1",
            name: "mockup.fig",
            type: "file" as const,
            size: 4096,
            lastModified: "2024-04-08",
          },
        ],
      },
      {
        id: "folder2",
        name: "Documents",
        type: "folder" as const,
        children: [
          {
            id: "file2",
            name: "specifications.docx",
            type: "file" as const,
            size: 2048,
            lastModified: "2024-04-07",
          },
        ],
      },
    ],
  },
  vault3: sampleData,
  vault4: {
    id: "root",
    name: "Shared Documents",
    type: "folder" as const,
    children: [
      {
        id: "folder1",
        name: "Team Reports",
        type: "folder" as const,
        children: [
          {
            id: "file1",
            name: "q1_report.pdf",
            type: "file" as const,
            size: 3072,
            lastModified: "2024-04-08",
          },
          {
            id: "file2",
            name: "q2_forecast.xlsx",
            type: "file" as const,
            size: 2048,
            lastModified: "2024-04-07",
          },
        ],
      },
    ],
  },
};
 */
