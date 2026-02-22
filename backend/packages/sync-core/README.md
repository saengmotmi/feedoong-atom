# @feedoong/sync-core

증분 동기화 핵심 유스케이스 패키지입니다.  
런타임에 독립적인 순수 도메인 로직(HEAD preflight + item dedupe)을 제공합니다.

## 역할

- `syncOneSource(deps)`
- `syncAllSources(deps)`
- HEAD 요청 기반 변경 여부 판단
- 변경 없으면 `status: "skipped"` 반환

## 내부 모듈 구조 (v0.2)

- `/Users/ohjongtaek/Desktop/dev/feedoong-atom/backend/packages/sync-core/src/head-check.ts`
  - HEAD 판정 룰(`ts-pattern`) + validator 갱신
- `/Users/ohjongtaek/Desktop/dev/feedoong-atom/backend/packages/sync-core/src/sync-one.ts`
  - 단일 소스 동기화 오케스트레이션(`neverthrow`)
- `/Users/ohjongtaek/Desktop/dev/feedoong-atom/backend/packages/sync-core/src/sync-all.ts`
  - 배치 동기화 집계(`remeda`)
- `/Users/ohjongtaek/Desktop/dev/feedoong-atom/backend/packages/sync-core/src/detail.ts`
  - SyncDetail 생성/아이템 정규화
- `/Users/ohjongtaek/Desktop/dev/feedoong-atom/backend/packages/sync-core/src/runtime.ts`
  - 런타임 포트(fetch/clock) 공통 유틸
- `/Users/ohjongtaek/Desktop/dev/feedoong-atom/backend/packages/sync-core/src/index.ts`
  - public API re-export

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
