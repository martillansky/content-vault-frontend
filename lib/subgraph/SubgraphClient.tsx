import { request, Variables } from "graphql-request";

export const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL || "";
export const SUBGRAPH_URL_CHIADO =
  process.env.NEXT_PUBLIC_SUBGRAPH_URL_CHIADO || "";

export const HEADERS = { Authorization: "Bearer {api-key}" };

export function requestClientSepolia<TResponse>(
  query: string,
  variables?: Variables
): Promise<TResponse> {
  return request<TResponse>(SUBGRAPH_URL, query, variables, HEADERS);
}

export function requestClientChiado<TResponse>(
  query: string,
  variables?: Variables
): Promise<TResponse> {
  return request<TResponse>(SUBGRAPH_URL_CHIADO, query, variables, HEADERS);
}
