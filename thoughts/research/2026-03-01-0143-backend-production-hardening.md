---
date: 2026-03-01T01:43:12+09:00
repository: feedoong-atom
branch: main
topic: "backend production hardening baseline"
status: complete
---

# Research: Backend Production Hardening

## 1) 정상동작/현재동작 합의
- 정상동작: 운영 환경에서 인증 없는 쓰기/비용 유발 호출이 차단되고, 동시 요청에도 데이터 정합성이 유지되며, 실패가 타입/코드 기준으로 관측 가능해야 한다.
- 현재동작: 기능은 동작하지만 인증/동시성/네트워크 경계/오류 매핑이 운영 방어 기준으로는 최소 상태다.

## 2) 관측 결과 (증거)

### 2.1 내부 동기화 엔드포인트 보호키 기본값이 빈 문자열
- `apps/api-worker/wrangler.jsonc:11`에서 `SCHEDULER_KEY`가 `""`로 설정돼 있다.
- `apps/api-worker/src/index.ts:90`~`apps/api-worker/src/index.ts:96`에서 `SCHEDULER_KEY`가 비어 있으면 키 검증 분기가 실행되지 않는다.

### 2.2 쓰기/비용 유발 API가 인증 없이 공개
- Worker API:
  - `apps/api-worker/src/index.ts:54` (`POST /v1/sources`)
  - `apps/api-worker/src/index.ts:76` (`POST /v1/sync`)
- Node API:
  - `backend/packages/api/src/server.ts:53` (`POST /v1/sources`)
  - `backend/packages/api/src/server.ts:71` (`POST /v1/sync`)
- 위 경로들은 인증/권한 검사 없이 실행된다.

### 2.3 입력 URL 경계가 느슨하고 서버측 fetch를 직접 수행
- URL 입력 검증은 `z.string().url()` 수준이다: `backend/packages/contracts/src/index.ts:37`.
- HTML feed discovery 단계에서 사용자 입력 기반 URL을 직접 fetch한다: `backend/packages/rss-parser/src/discovery/utils.ts:65`~`backend/packages/rss-parser/src/discovery/utils.ts:71`.
- discovery 후보는 `http/https/x-mentions` 프로토콜만 검사한다: `backend/packages/rss-parser/src/discovery/utils.ts:12`~`backend/packages/rss-parser/src/discovery/utils.ts:19`.

### 2.4 Worker 저장소가 단일 키 read-modify-write 구조
- 단일 키: `apps/api-worker/src/storage.ts:8`.
- 읽기/쓰기: `apps/api-worker/src/storage.ts:17`, `apps/api-worker/src/storage.ts:22`.
- 동기화 흐름에서 read 후 write로 갱신:
  - `apps/api-worker/src/index.ts:56`, `apps/api-worker/src/index.ts:64`
  - `apps/api-worker/src/index.ts:78`, `apps/api-worker/src/index.ts:85`
- 동시 요청 시 별도 CAS/락/버전 검증 로직이 없다.

### 2.5 Node API 저장소도 전체 문서 read/write 기반
- 파일 DB read/write:
  - `backend/packages/api/src/db.ts:61`
  - `backend/packages/api/src/db.ts:67`
- 각 연산에서 전체 문서를 읽고 다시 쓰는 구조다:
  - `backend/packages/api/src/db.ts:80`~`backend/packages/api/src/db.ts:101`
  - `backend/packages/api/src/db.ts:175`~`backend/packages/api/src/db.ts:214`

### 2.6 에러 응답에서 내부 메시지를 그대로 노출
- Worker: `apps/api-worker/src/index.ts:136`~`apps/api-worker/src/index.ts:138`
- Node: `backend/packages/api/src/server.ts:139`~`backend/packages/api/src/server.ts:142`
- `error.message`가 그대로 응답 payload로 전달된다.

### 2.7 scheduler 호출에 타임아웃/중복 실행 가드 부재
- 호출: `backend/packages/scheduler/src/index.ts:17`~`backend/packages/scheduler/src/index.ts:20`
- 주기 실행: `backend/packages/scheduler/src/index.ts:40`~`backend/packages/scheduler/src/index.ts:44`
- in-flight lock이나 요청 타임아웃 제어가 없다.

### 2.8 sourceId 미존재 에러가 일반 예외로 승격
- `backend/packages/sync-core/src/sync-one.ts:50`~`backend/packages/sync-core/src/sync-one.ts:52`에서 `Source not found`를 일반 `Error`로 throw.
- API 계층에서 별도 도메인 매핑 없이 500 기본 분기로 흘러간다:
  - Worker: `apps/api-worker/src/index.ts:136`~`apps/api-worker/src/index.ts:138`
  - Node: `backend/packages/api/src/server.ts:139`~`backend/packages/api/src/server.ts:142`

### 2.9 백엔드 테스트 파일 관측치
- `backend/packages` 경로에서 `test/spec` 파일 검색 결과가 없다.
- 루트 스크립트는 `typecheck/build/smoke-local` 중심이다: `package.json:scripts`.

## 3) 실행 경로 (요약)
1. `POST /v1/sources` -> URL schema parse -> `parseFeed` 호출 -> 저장소 write.
2. `POST /v1/sync` -> sync command parse -> `sync-core` 실행 -> 저장소 write.
3. sync-core는 HEAD preflight 후 변경/미변경을 판정하고 insert/update metadata를 호출한다.

## 4) 상태/환경/시간 축 정리
- State
  - Worker: KV 단일 JSON 문서 (`feedoong.storage.v1`)
  - Node: 로컬 JSON 파일 (`backend/packages/api/data/feedoong.json`)
- Environment
  - Worker vars (`SCHEDULER_KEY`, `WEB_ORIGIN`) 설정 여부에 따라 보안 분기 활성화 여부가 달라진다.
- Time
  - scheduler cron 주기(`*/30 * * * *`)와 sync 소요시간이 겹치면 중복 호출이 발생할 수 있다.

## 5) 오픈 질문
1. 운영에서 `POST /v1/sources`, `POST /v1/sync`를 공개 API로 유지할지, 단일 사용자 토큰 보호로 닫을지.
2. Worker 저장소를 계속 KV 단일키로 유지할지, Durable Object/D1/R2 기반으로 분리할지.
3. URL 입력 정책을 allowlist/denylist/사설망 차단 중 어떤 수준으로 고정할지.
