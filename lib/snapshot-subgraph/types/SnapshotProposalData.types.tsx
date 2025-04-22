export interface SnapshotStrategyParams {
  address: string;
  symbol: string;
  decimals: number;
}

export interface SnapshotStrategy {
  network: string;
  params: SnapshotStrategyParams | SnapshotStrategy[];
}

export interface SnapshotProposalData {
  author: string;
  body: string;
  choices: string[];
  end: number;
  id: string;
  snapshot: number;
  space: {
    id: string;
    name: string;
    strategies: SnapshotStrategy[];
  };
  start: number;
  state: string;
  title: string;
}

export interface SnapshotProposalDataResponse {
  proposal: SnapshotProposalData;
}
