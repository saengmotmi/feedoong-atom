# @feedoong/api-worker

Cloudflare Workers 기반 API 런타임입니다.  
`@feedoong/contracts`, `@feedoong/sync-core`, `@feedoong/rss-parser`를 조합해 피드 등록/조회/동기화를 제공합니다.

## 역할

- Hono 라우팅 (`/health`, `/v1/sources`, `/v1/items`, `/v1/sync`, `/internal/sync`)
- 저장소 어댑터 (Cloudflare D1)
- RSS 파서 옵션(X Mentions 토큰 등) 런타임 주입

## 내부 모듈 구조 (v0.2)

- `/Users/ohjongtaek/Desktop/dev/feedoong-atom/apps/api-worker/src/index.ts`
  - HTTP 라우팅 조합, 요청/응답 경계만 담당
- `/Users/ohjongtaek/Desktop/dev/feedoong-atom/apps/api-worker/src/storage.ts`
  - D1 repository 어댑터 (`next_check_at`, `error_count`, `retry_after_seconds`, `last_error_type` 포함)
- `/Users/ohjongtaek/Desktop/dev/feedoong-atom/apps/api-worker/src/sync-usecase.ts`
  - sync command 파싱/실행 + `@feedoong/sync-core` 어댑터
- `/Users/ohjongtaek/Desktop/dev/feedoong-atom/apps/api-worker/src/types.ts`
  - 런타임/스토리지 타입 정의

## 개발

레포 루트에서:

```bash
yarn workspace @feedoong/api-worker dev
```

## 배포

```bash
yarn workspace @feedoong/api-worker deploy
```

## D1 마이그레이션

```bash
yarn workspace @feedoong/api-worker wrangler d1 migrations apply feedoong-atom-db --local --config wrangler.jsonc
yarn workspace @feedoong/api-worker wrangler d1 migrations apply feedoong-atom-db --remote --config wrangler.jsonc
```

운영 스모크(Worker 런타임 + D1)는 레포 루트에서:

```bash
yarn smoke:worker-runtime
```

## 테스트 / 타입 생성 / 타입체크

```bash
yarn workspace @feedoong/api-worker test
yarn workspace @feedoong/api-worker cf-typegen
yarn workspace @feedoong/api-worker typecheck
```

## 환경설정

`/Users/ohjongtaek/Desktop/dev/feedoong-atom/apps/api-worker/wrangler.jsonc` 기준:

- D1 binding: `FEEDOONG_DB`
- vars:
  - `WEB_ORIGIN`
  - `API_WRITE_KEY` (필수)
  - `SCHEDULER_KEY` (필수)
  - `PARSE_FEED_TIMEOUT_MS` (선택, 기본 `15000`)
  - `X_BEARER_TOKEN` (선택, x-mentions 전략용)
  - `X_API_BASE_URL` (선택, 기본 `https://api.x.com/2`)
  - `X_MENTIONS_MAX_RESULTS` (선택, 기본 100)

## 인증 헤더

- 쓰기 요청(`POST /v1/sources`, `POST /v1/sync`): `x-api-key`
- 내부 동기화(`POST /internal/sync`): `x-scheduler-key`

## 의존 경계

- 런타임(Worker) 전용 로직만 포함
- 동기화 정책은 `@feedoong/sync-core`에 위임
- 요청 계약은 `@feedoong/contracts`를 사용
