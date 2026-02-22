# @feedoong/web

React Router v7 Framework + RSC + Vite 기반 웹 앱입니다.  
피드 조회, 소스 추가, 동기화 액션을 제공합니다.

## 역할

- RSC 페이지 렌더링
- API 서비스 호출(`API_BASE_URL` 또는 `API_SERVICE` binding)
- Cloudflare 캐시 헤더(`Cache-Control`, `Cache-Tag`) 적용

## 개발

레포 루트에서:

```bash
yarn workspace @feedoong/web dev
```

## Edge 로컬 검증

```bash
yarn workspace @feedoong/web dev:edge
```

## 빌드 / 프리뷰 / 배포

```bash
yarn workspace @feedoong/web build
yarn workspace @feedoong/web preview
yarn workspace @feedoong/web deploy
```

## 타입 생성 / 타입체크

```bash
yarn workspace @feedoong/web cf-typegen
yarn workspace @feedoong/web typecheck
```

## 환경설정

`/Users/ohjongtaek/Desktop/dev/feedoong-atom/apps/web/wrangler.jsonc` 기준:

- service binding: `API_SERVICE` (`feedoong-atom-api`)
- vars:
  - `API_BASE_URL`
  - `CACHE_TTL_SECONDS`

## 주요 파일

- 라우트: `/Users/ohjongtaek/Desktop/dev/feedoong-atom/apps/web/app/routes/home.tsx`
- 워커 엔트리: `/Users/ohjongtaek/Desktop/dev/feedoong-atom/apps/web/worker-entry.ts`
- Vite 설정: `/Users/ohjongtaek/Desktop/dev/feedoong-atom/apps/web/vite.config.ts`
