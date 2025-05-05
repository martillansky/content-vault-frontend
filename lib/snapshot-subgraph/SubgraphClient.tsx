import { request, Variables } from "graphql-request";

export const SNAPSHOT_SUBGRAPH_URL =
  process.env.NEXT_PUBLIC_SNAPSHOT_SUBGRAPH_URL || "";

export function snapshotRequestClient<TResponse>(
  query: string,
  variables?: Variables
): Promise<TResponse> {
  return request<TResponse>(SNAPSHOT_SUBGRAPH_URL, query, variables);
}
