# DEBUG: RRv7 RSC + Cloudflare 결합 이슈

- 작성일: 2026-02-21
- 대상: `/Users/ohjongtaek/Desktop/dev/feedoong-solo/apps/web`

## 1) 정상동작/현재동작 고정

- 정상동작: `react-router dev`(RSC 프레임워크 모드)와 `wrangler dev`(빌드 산출물 실행) 모두 `/` 요청이 `200`이어야 한다.
- 현재동작(관측): `@cloudflare/vite-plugin`를 직접 결합한 경로에서 `virtual:react-router/server-build` 또는 `WeakRef is not defined` 런타임 에러가 재현된다.

추가 환경 요인:
- 현재 머신 Node `20.10.0`에서는 `react-router dev` 실행 시 `TypeError: crypto.hash is not a function`으로 조기 실패한다.
- Vite `7.x` 엔진 요구사항: `^20.19.0 || >=22.12.0`.

## 2) 빠른 반증 실험

### 실험 A: 현재 레포(분리 전략) 검증

1. `yarn workspace @feedoong/web build`
2. `npx wrangler dev --config wrangler.jsonc --port 8788`
3. `curl -i http://localhost:8788/`

결과:
- `HTTP/1.1 200 OK` 확인
- 즉, “RSC 개발 경로와 Cloudflare 런타임 경로 분리” 전략은 동작함.

### 실험 B: Node 환경 요인 분리

1. Node `20.10.0` + `yarn workspace @feedoong/web dev` 실행
2. `TypeError: crypto.hash is not a function` 즉시 발생

결론:
- 이 에러는 Cloudflare/RSC 이전 단계의 환경 요인.
- Node 최소 버전 상향 명시가 필요.

## 3) 결정

1. 개발은 `react-router dev`로 고정한다.
2. 엣지 검증/배포는 `wrangler`가 빌드 산출물을 실행하도록 분리한다.
3. Node 요구사항을 `>=20.19.0`으로 상향한다(권장 `22.22.0`).

## 4) 운영 명령

- 로컬 개발: `yarn dev:web`
- 엣지 검증: `yarn dev:web:edge`
- 배포: `yarn workspace @feedoong/web deploy`
