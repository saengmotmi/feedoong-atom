# @feedoong/sync-core

증분 동기화 핵심 유스케이스 패키지입니다.  
런타임에 독립적인 순수 도메인 로직(HEAD preflight + item dedupe)을 제공합니다.

## 역할

- `syncOneSource(deps)`
- `syncAllSources(deps)`
- HEAD 요청 기반 변경 여부 판단
- 변경 없으면 `status: "skipped"` 반환

## 의존성 주입 포트

- `SyncRepository`
  - `getSourceById`, `listSources`
  - `insertItems`
  - `updateSourceMetadata`, `updateSourceCheckMetadata`
- `ParseFeedPort`
- 선택: `fetchImpl`, `now`, `headTimeoutMs`, `headUserAgent`

## 사용 예시

```ts
import { syncAllSources } from "@feedoong/sync-core";

const result = await syncAllSources({
  repository,
  parseFeed
});
```

## 명령어

레포 루트에서:

```bash
yarn workspace @feedoong/sync-core build
yarn workspace @feedoong/sync-core typecheck
```

## 경계 원칙

- `hono`, `node:*`, `process.env`, `globalThis` 직접 참조 금지
- 런타임(node/worker)은 이 패키지를 어댑터로 감싸서 사용
