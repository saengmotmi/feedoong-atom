# @feedoong/api

Node.js(Hono) 기반 API 런타임입니다.  
로컬/단일 서버 운용 기준의 기준 API 구현입니다.

## 역할

- REST 엔드포인트 제공
- 파일 저장소(`FeedoongDb`) 어댑터 사용
- `@feedoong/sync-core` 유스케이스 호출
- `@feedoong/contracts` 요청/검증 계약 사용

## 엔드포인트

- `GET /health`
- `GET /v1/sources`
- `POST /v1/sources`
- `GET /v1/items`
- `POST /v1/sync`
- `POST /internal/sync`

## 개발

레포 루트에서:

```bash
yarn workspace @feedoong/api dev
```

## 빌드 / 실행 / 타입체크

```bash
yarn workspace @feedoong/api build
yarn workspace @feedoong/api start
yarn workspace @feedoong/api typecheck
yarn workspace @feedoong/api test
```

## 환경변수

`.env` 예시는 `/Users/ohjongtaek/Desktop/dev/feedoong-atom/backend/packages/api/.env.example`

- `PORT` (기본 `4000`)
- `WEB_ORIGIN`
- `DB_PATH`
- `API_WRITE_KEY` (필수)
- `SCHEDULER_KEY` (필수)
- `PARSE_FEED_TIMEOUT_MS` (선택, 기본 `15000`)
- `X_BEARER_TOKEN` (선택)
- `X_API_BASE_URL` (선택)
- `X_MENTIONS_MAX_RESULTS` (선택)

## 인증 헤더

- 쓰기 요청(`POST /v1/sources`, `POST /v1/sync`): `x-api-key`
- 내부 동기화(`POST /internal/sync`): `x-scheduler-key`

`API_WRITE_KEY`, `SCHEDULER_KEY`가 비어 있으면 앱이 시작되지 않습니다.

## 의존 경계

- 동기화 알고리즘 직접 구현 금지 (`@feedoong/sync-core` 사용)
- 요청 schema 중복 정의 금지 (`@feedoong/contracts` 사용)
