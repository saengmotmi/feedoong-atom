# @feedoong/api-worker

Cloudflare Workers 기반 API 런타임입니다.  
`@feedoong/contracts`, `@feedoong/sync-core`, `@feedoong/rss-parser`를 조합해 피드 등록/조회/동기화를 제공합니다.

## 역할

- Hono 라우팅 (`/health`, `/v1/sources`, `/v1/items`, `/v1/sync`, `/internal/sync`)
- 저장소 어댑터 (Cloudflare KV)
- RSS 파서 옵션(X Mentions 토큰 등) 런타임 주입

## 개발

레포 루트에서:

```bash
yarn workspace @feedoong/api-worker dev
```

## 배포

```bash
yarn workspace @feedoong/api-worker deploy
```

## 타입 생성 / 타입체크

```bash
yarn workspace @feedoong/api-worker cf-typegen
yarn workspace @feedoong/api-worker typecheck
```

## 환경설정

`/Users/ohjongtaek/Desktop/dev/feedoong-atom/apps/api-worker/wrangler.jsonc` 기준:

- KV binding: `FEEDOONG_DB`
- vars:
  - `WEB_ORIGIN`
  - `SCHEDULER_KEY`
  - `X_BEARER_TOKEN` (선택, x-mentions 전략용)
  - `X_API_BASE_URL` (선택, 기본 `https://api.x.com/2`)
  - `X_MENTIONS_MAX_RESULTS` (선택, 기본 100)

## 의존 경계

- 런타임(Worker) 전용 로직만 포함
- 동기화 정책은 `@feedoong/sync-core`에 위임
- 요청 계약은 `@feedoong/contracts`를 사용
