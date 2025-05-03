import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { requestClient } from "../SubgraphClient";
import { UserDataResponse } from "../types/UserData.types";

const GET_USER_DATA = gql`
  query GetUserData($user: String!) {
    userDatas(where: { user: $user }) {
      vaultsCreated {
        tokenId
        name
        description
        schemaCID
        blockTimestamp
      }
      vaultAccessesGranted {
        tokenId
        permission {
          permission
        }
        accessRegistry {
          vaultCreated {
            tokenId
            name
            description
            schemaCID
            blockTimestamp
          }
        }
      }
      vaultsFromProposalPinned {
        tokenId
        permission {
          permission
        }
        vaultFromProposal {
          proposalId
          tokenId
          name
          description
          chainId
          tokenContract
          schemaCID
          blockTimestamp
        }
      }
    }
  }
`;

export function useUserData(address: string) {
  return useQuery<UserDataResponse>({
    queryKey: ["userData", address],
    queryFn: async () => {
      if (!address) return { userDatas: [] };
      return requestClient<UserDataResponse>(GET_USER_DATA, {
        user: address,
      });
    },
    enabled: !!address,
  });
}
