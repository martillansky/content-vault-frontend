import { request, Variables } from "graphql-request";

export const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL || "";

export const HEADERS = { Authorization: "Bearer {api-key}" };

export function requestClient<TResponse>(
  query: string,
  variables?: Variables
): Promise<TResponse> {
  return request<TResponse>(SUBGRAPH_URL, query, variables, HEADERS);
}
