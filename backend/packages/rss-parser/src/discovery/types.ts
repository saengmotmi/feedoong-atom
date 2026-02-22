export type FeedDiscoveryStrategy = {
  name: string;
  matches: (inputUrl: URL) => boolean;
  getCandidates: (inputUrl: URL) => Promise<string[]>;
  includeDefaultFallback?: boolean;
};

export type DiscoveryResult = {
  strategyName: string;
  candidates: string[];
};
