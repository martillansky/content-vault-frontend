import request from "graphql-request";

export const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL || "";

export const HEADERS = { Authorization: "Bearer {api-key}" };

export function requestClient<T>(query: any, params: any) {
  return request<T>(SUBGRAPH_URL, query, params, HEADERS);
}
