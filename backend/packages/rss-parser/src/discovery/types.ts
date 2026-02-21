export type FeedDiscoveryStrategy = {
  name: string;
  matches: (inputUrl: URL) => boolean;
  getCandidates: (inputUrl: URL) => Promise<string[]>;
};

export type DiscoveryResult = {
  strategyName: string;
  candidates: string[];
};
