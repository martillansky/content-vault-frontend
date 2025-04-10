export interface Field {
  key: string;
  value: string;
}

export interface Content {
  blockTimestamp: string;
  encryptedCID: string;
  fields: Field[];
  id: string;
  isCIDEncrypted: boolean;
  isMetadataSigned: boolean;
  metadata: string;
  sender: string;
}

export interface ContentResponse {
  contentStoredWithMetadata_collection: Content[];
}

enum fieldKeys {
  description = "description",
  extension = "extension",
  name = "name",
  route = "route",
  timestamp = "timestamp",
  type = "type",
}
