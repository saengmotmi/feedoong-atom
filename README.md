# Feedoong Solo

혼자 운영 가능한 RSS 인사이트 피드 서비스 모노레포입니다.

## Why

- 핵심 컨셉 유지: RSS 기반으로 "내가 구독한 인사이트를 한 곳에서 보기"
- 운영 단순화: API + Scheduler + RSS Parser를 최소 경계로 분리
- 비용 절감: 복잡한 분산 시스템 대신 단일 파일 저장소(JSON) + 단순 잡 구조
- 프론트 전략 고정: `Vite + React Router v7 Framework + RSC + Cloudflare Workers`

## Repo Structure

```text
apps/
  web/                 # 개인용 웹 UI (피드 보기, 소스 추가/동기화)
  extension/           # 크롬 새 탭 -> web 리다이렉트
backend/packages/
  api/                 # REST API + JSON 파일 저장소
  scheduler/           # 주기 동기화 트리거
  rss-parser/          # RSS 파싱/정규화 공통 패키지
docs/
  PRD.md
infra/
  docker-compose.yml
```

## Quick Start

```bash
cd /Users/ohjongtaek/Desktop/dev/feedoong-solo
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

터미널 3개에서 실행:

```bash
yarn dev:api
yarn dev:scheduler
yarn dev:web
```

- Web: <http://localhost:5173>
- API: <http://localhost:4000/health>

Cloudflare 런타임으로 로컬 검증할 때:

```bash
yarn dev:web:edge
```

- Edge Web: <http://localhost:8788>

## Frontend Notes (`apps/web`)

- 라우팅/렌더링: React Router v7 Framework Mode + RSC
- 번들러: Vite
- 실행 모드 분리:
  - 개발: `react-router dev` (RSC 프레임워크 모드)
  - 엣지 검증/배포: `wrangler`가 `build/server/index.js` + `build/client`를 서빙
- 워커 설정: `/Users/ohjongtaek/Desktop/dev/feedoong-solo/apps/web/wrangler.jsonc`
- API 원점: `vars.API_BASE_URL`
- 캐시 TTL: `vars.CACHE_TTL_SECONDS` (기본 60초)

참고: `@cloudflare/vite-plugin`를 RSC 프레임워크 모드에 직접 결합하면
로컬에서 `virtual:react-router/server-build` 또는 `WeakRef` 런타임 오류가 재현될 수 있어,
현재는 위 분리 방식을 기본 전략으로 사용합니다.

Cloudflare 타입 생성(선택):

```bash
yarn workspace @feedoong/web cf-typegen
```

## MVP API

- `GET /health`
- `GET /v1/sources`
- `POST /v1/sources`
- `GET /v1/items?limit=50&offset=0`
- `POST /v1/sync`
- `POST /internal/sync` (scheduler 전용, `SCHEDULER_KEY` 검증)

## Notes

- `apps/extension/newtab.js`의 URL을 운영 주소로 바꾸면 크롬 새 탭에서 바로 연결됩니다.
- PRD는 `docs/PRD.md`에 있습니다.
