# @feedoong/rss-parser

피드 탐색/파싱/정규화 패키지입니다.  
도메인별 전략으로 후보 feed URL을 찾고, 성공한 피드를 공통 타입으로 반환합니다.

## 역할

- URL 기반 discovery 전략 선택
- 후보 feed URL 순차 파싱
- RSS/Atom 결과 normalize
- X Mentions 같은 provider 전략 지원

## 파싱 파이프라인 원칙 (v0.2)

- provider 선택은 프로토콜 매칭(`ts-pattern`)으로 처리
- 후보 URL 시도는 Result 체인(`neverthrow`)으로 누적
- normalize 단계는 컬렉션 조합(`remeda`)으로 표현

## 주요 API

- `parseFeed(url, options?)`
- 반환 타입: `ParsedFeedResult`

`options.xMentions`:

- `token` (필수, x-mentions 사용 시)
- `apiBaseUrl` (선택)
- `maxResults` (선택)
- `fetchImpl` (선택)
- `timeoutMs` (선택)

## 명령어

레포 루트에서:

```bash
yarn workspace @feedoong/rss-parser dev
yarn workspace @feedoong/rss-parser build
yarn workspace @feedoong/rss-parser typecheck
```

## 전략 추가 위치

- 전략 등록: `/Users/ohjongtaek/Desktop/dev/feedoong-atom/backend/packages/rss-parser/src/discovery/index.ts`
- 전략 구현: `/Users/ohjongtaek/Desktop/dev/feedoong-atom/backend/packages/rss-parser/src/discovery/strategies/`
- provider 구현: `/Users/ohjongtaek/Desktop/dev/feedoong-atom/backend/packages/rss-parser/src/providers/`

## 의존 경계

- 런타임 전역 상태(`globalThis`, `process.env`) 직접 참조 금지
- 필요한 설정은 `parseFeed` 옵션으로 주입
