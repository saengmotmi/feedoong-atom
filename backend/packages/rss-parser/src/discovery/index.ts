import { brunchStrategy } from "./strategies/brunch.js";
import { chromeDevStrategy } from "./strategies/chrome-dev.js";
import { defaultStrategy } from "./strategies/default.js";
import { mediumStrategy } from "./strategies/medium.js";
import { naverBlogStrategy } from "./strategies/naver-blog.js";
import { tistoryStrategy } from "./strategies/tistory.js";
import { velogStrategy } from "./strategies/velog.js";
import { xMentionsStrategy } from "./strategies/x-mentions.js";
import { youtubeStrategy } from "./strategies/youtube.js";
import type { DiscoveryResult, FeedDiscoveryStrategy } from "./types.js";
import { uniqueUrls } from "./utils.js";

const DOMAIN_STRATEGIES: FeedDiscoveryStrategy[] = [
  xMentionsStrategy,
  velogStrategy,
  naverBlogStrategy,
  brunchStrategy,
  chromeDevStrategy,
  tistoryStrategy,
  mediumStrategy,
  youtubeStrategy
];

export const discoverFeedCandidates = async (rawUrl: string): Promise<DiscoveryResult> => {
  const inputUrl = new URL(rawUrl);
  const strategy = DOMAIN_STRATEGIES.find((candidate) => candidate.matches(inputUrl));

  if (!strategy) {
    return {
      strategyName: defaultStrategy.name,
      candidates: await defaultStrategy.getCandidates(inputUrl)
    };
  }

  const domainCandidates = await strategy.getCandidates(inputUrl);
  if (strategy.includeDefaultFallback === false) {
    return {
      strategyName: strategy.name,
      candidates: uniqueUrls(domainCandidates)
    };
  }

  const fallbackCandidates = await defaultStrategy.getCandidates(inputUrl);

  return {
    strategyName: strategy.name,
    candidates: uniqueUrls([...domainCandidates, ...fallbackCandidates])
  };
};
