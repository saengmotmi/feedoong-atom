# @feedoong/scheduler

주기 동기화 트리거 패키지입니다.  
`node-cron`으로 API의 `/internal/sync`를 호출합니다.

## 역할

- 시작 시 즉시 1회 동기화 시도
- cron 주기에 맞춰 반복 동기화
- `SCHEDULER_KEY` 헤더 인증 지원

## 개발/실행

레포 루트에서:

```bash
yarn workspace @feedoong/scheduler dev
yarn workspace @feedoong/scheduler start
```

## 빌드 / 타입체크

```bash
yarn workspace @feedoong/scheduler build
yarn workspace @feedoong/scheduler typecheck
```

## 환경변수

`.env` 예시는 `/Users/ohjongtaek/Desktop/dev/feedoong-atom/backend/packages/scheduler/.env.example`

- `API_BASE_URL` (기본 `http://localhost:4000`)
- `SYNC_CRON` (기본 `*/30 * * * *`)
- `SCHEDULER_KEY` (선택)

## 운영 팁

- API와 동일한 `SCHEDULER_KEY`를 맞춰야 `/internal/sync` 인증이 통과됩니다.
