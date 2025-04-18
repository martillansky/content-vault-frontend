declare module "multiformats/cid" {
  export class CID {
    static parse(cidStr: string): CID;
    static decode(bytes: Uint8Array): CID;
    bytes: Uint8Array;
    toString(): string;
  }
}
