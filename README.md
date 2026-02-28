# Feedoong Atom

혼자 운영 가능한 RSS 인사이트 피드 서비스 모노레포입니다.

## Why

- 핵심 컨셉 유지: RSS 기반으로 "내가 구독한 인사이트를 한 곳에서 보기"
- 운영 단순화: API + Scheduler + RSS Parser를 최소 경계로 분리
- 비용 절감: 운영 write path는 D1 단일 경로, 로컬 개발은 JSON 저장소로 단순화
- 프론트 전략 고정: `Vite + React Router v7 Framework + RSC + Cloudflare Workers`

## Repo Structure

```text
apps/
  api-worker/          # Cloudflare Worker API 런타임(Hono + D1)
  web/                 # 개인용 웹 UI (피드 보기, 소스 추가/동기화)
  extension/           # 크롬 새 탭 -> web 리다이렉트
backend/packages/
  api/                 # REST API + JSON 파일 저장소
  contracts/           # API 계약/스키마
  scheduler/           # 주기 동기화 트리거
  rss-parser/          # RSS 파싱/정규화 공통 패키지
  sync-core/           # 런타임 비종속 동기화 도메인
docs/
  PRD.md
  PRD_DECLARATIVE_COMPOSITION.md
infra/
  docker-compose.yml
```

## Quick Start

```bash
cd /Users/ohjongtaek/Desktop/dev/feedoong-atom
fnm use
yarn install

cp backend/packages/api/.env.example backend/packages/api/.env
cp backend/packages/scheduler/.env.example backend/packages/scheduler/.env
```

Node는 `>=20.19.0`(권장 `22.22.0`)이 필요합니다.
패키지 매니저는 `yarn@4.12.0` + `PnP(nodeLinker: pnp)`로 고정되어 있습니다.

`fnm use`가 실패하면:

```bash
fnm install 22.22.0
fnm use 22.22.0
```

최소 로컬 동작(웹+API)은 한 번에 실행:

```bash
yarn dev:local
```

- Web: <http://localhost:5173>
- API: <http://localhost:4000/health>

전체 개발(웹+API+스케줄러)은 터미널 3개:

```bash
yarn dev:api
yarn dev:scheduler
yarn dev:web
```

Cloudflare 런타임으로 로컬 검증할 때:

```bash
yarn dev:web:edge
```

- Edge Web: <http://localhost:8788>

로컬 최소 정상동작 스모크 테스트:

```bash
yarn smoke:local
```

Worker 런타임(D1 포함) 스모크 테스트:

```bash
yarn smoke:worker-runtime
```

기존 구독 CSV(기본: `~/Downloads/feedoong_subscriptions_ohjtack@gmail.com.csv`) 가져오기:

```bash
yarn dev:api
yarn import:subscriptions
```

다른 경로 CSV를 쓸 때:

```bash
yarn import:subscriptions /path/to/subscriptions.csv
```

## Frontend Notes (`apps/web`)

- 라우팅/렌더링: React Router v7 Framework Mode + RSC
- 번들러: Vite
- 실행 모드 분리:
  - 개발: `react-router dev` (RSC 프레임워크 모드)
  - 엣지 검증/배포: `wrangler`가 `build/server/index.js` + `build/client`를 서빙
- 워커 설정: `/Users/ohjongtaek/Desktop/dev/feedoong-atom/apps/web/wrangler.jsonc`
- API 원점: `vars.API_BASE_URL`
- 캐시 TTL: `vars.CACHE_TTL_SECONDS` (기본 60초)

참고: `@cloudflare/vite-plugin`를 RSC 프레임워크 모드에 직접 결합하면
로컬에서 `virtual:react-router/server-build` 또는 `WeakRef` 런타임 오류가 재현될 수 있어,
현재는 위 분리 방식을 기본 전략으로 사용합니다.

Cloudflare 타입 생성(선택):

```bash
yarn workspace @feedoong/web cf-typegen
```

## Declarative Refactor (v0.2)

2026-02-22 기준으로 선언적 함수 조합 리팩토링을 적용했습니다.

- 핵심 문서: `docs/PRD_DECLARATIVE_COMPOSITION.md`
- 적용 대상:
  - `backend/packages/sync-core/src/*` (HEAD 판정/단일 동기화/배치 집계 분리)
  - `apps/api-worker/src/*` (storage/sync-usecase/http 조합 분리)
  - `apps/web/app/routes/home*.ts*` (runtime/api/intents/presenter 분리)
- 강제 가드:
  - `yarn check:architecture`
  - 엔트리 파일 라인 수 220 이하 체크 포함
  - `sync-core`의 `remeda`/`ts-pattern`/`neverthrow` 사용 체크 포함

## MVP API

- `GET /health`
- `GET /v1/sources`
- `POST /v1/sources`
- `GET /v1/items?limit=50&offset=0`
- `POST /v1/sync`
- `POST /internal/sync` (scheduler 전용, `SCHEDULER_KEY` 검증)

## Production Guardrails

- CI: `/Users/ohjongtaek/Desktop/dev/feedoong-atom/.github/workflows/backend-quality.yml`
  - `typecheck` + `test:backend` + `build`
  - Worker runtime smoke(`yarn smoke:worker-runtime`)
- 원격 스모크(수동 실행): `/Users/ohjongtaek/Desktop/dev/feedoong-atom/.github/workflows/remote-smoke.yml`
  - 필요 설정: `PROD_API_BASE_URL`, `PROD_API_WRITE_KEY`, `PROD_SCHEDULER_KEY`
- SLO 체크(30분 주기): `/Users/ohjongtaek/Desktop/dev/feedoong-atom/.github/workflows/slo-check.yml`
  - 가용성/지연 임계치(`SLO_*`) 기반 실패 시 워크플로우 실패로 알림
- D1 백업(일 1회): `/Users/ohjongtaek/Desktop/dev/feedoong-atom/.github/workflows/d1-backup.yml`
  - 필요 설정: `D1_DATABASE_NAME`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`
  - 산출물: SQL export 아티팩트(보존 14일)
- 설정값 주입 TODO: `/Users/ohjongtaek/Desktop/dev/feedoong-atom/docs/TODO.md`

## Notes

- `apps/extension/newtab.js`의 URL을 운영 주소로 바꾸면 크롬 새 탭에서 바로 연결됩니다.
- PRD는 `docs/PRD.md`에 있습니다.
