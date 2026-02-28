---
date: 2026-03-01T01:44:05+09:00
repository: feedoong-atom
branch: main
source_research: thoughts/research/2026-03-01-0143-backend-production-hardening.md
status: draft
---

# Plan: Backend Production Hardening (RPI)

## 1) 목표 / 비목표

### 목표
1. 인증 없는 쓰기/동기화 호출을 차단한다.
2. URL 입력 경계와 서버측 fetch 경계를 강화한다.
3. 에러를 도메인 코드 중심으로 매핑하고 내부 메시지 노출을 제거한다.
4. Worker 저장소 정합성 리스크를 줄이는 저장 구조로 전환한다.
5. scheduler 호출 폭주/중복 실행을 방지한다.

### 비목표
1. UI 리디자인
2. 추천/소셜 등 신규 기능
3. RSS 파서 전략 확대

## 2) 옵션 및 트레이드오프

### 저장소 정합성 옵션
1. 옵션 A: KV 유지 + 단기 완화
- 장점: 변경량 작음
- 단점: 강한 정합성 보장 불가, 구조적 한계 유지

2. 옵션 B: D1 마이그레이션 (권장)
- 장점: 동시성/증분 조회/페이지네이션/업서트를 DB 레벨로 제어 가능
- 단점: 마이그레이션 비용 발생

선택: **옵션 B(D1)**. 단, Phase 1~3 보안/경계 고정을 먼저 적용한 뒤 수행.

## 3) 단계별 실행 계획

### Phase 1: 인증/권한 경계 고정 (P0)
- 작업
1. `SCHEDULER_KEY` 빈값 배포 금지 가드 추가
2. `POST /v1/sources`, `POST /v1/sync`에 write token 검사 추가 (`X-Api-Key`)
3. Node API/Worker API 모두 동일 정책 적용
- 검증
1. 인증 누락 시 401
2. 정상 키로 기존 동작 유지
3. `/internal/sync`는 스케줄러 키로만 허용
- 완료 기준
1. 공개 엔드포인트 중 쓰기 계열 인증 없는 경로 0개
- [ ] done

### Phase 2: URL/FETCH 경계 강화 (P1)
- 작업
1. URL 정책 모듈 도입: private/local/meta IP 및 loopback host 차단
2. parser discovery fetch 전 정책 검사 강제
3. 허용 스킴/포트 정책 명시
- 검증
1. `localhost`, `127.0.0.1`, `169.254.169.254`, RFC1918 대역 URL 입력 거부
2. 정상 public RSS URL 등록 가능
- 완료 기준
1. SSRF 기본 차단 정책 문서화 + 코드 반영
- [ ] done

### Phase 3: 에러 계약/응답 하드닝 (P1)
- 작업
1. `SourceNotFoundError`, `UnauthorizedError`, `ValidationError` 등 도메인 에러 코드 표준화
2. API 에러 응답을 `{ code, message, requestId }` 형태로 통일
3. 500 계열에서 내부 상세 메시지 비노출
- 검증
1. 미존재 sourceId sync 요청이 404 코드로 응답
2. 예외 발생 시 로그에는 원인, 응답에는 안전 메시지
- 완료 기준
1. 문자열 메시지 기반 분기 제거
- [ ] done

### Phase 4: Worker 저장소 D1 전환 (P1)
- 작업
1. 스키마 설계: `sources`, `items`, `sync_runs`, `sync_details`
2. 기존 KV JSON -> D1 마이그레이션 스크립트
3. Repository adapter를 D1 기반으로 교체
4. read path 인덱스 최적화 (publishedAt/sourceId)
- 검증
1. 동시 `POST /v1/sync` 호출에서 유실/중복률 관측
2. 기존 데이터 마이그레이션 후 조회/동기화 회귀 없음
- 완료 기준
1. Worker 운영 저장소에서 단일 KV 문서 write 제거
- [ ] done

### Phase 5: Scheduler 실행 안정화 (P2)
- 작업
1. fetch timeout 적용
2. in-flight guard(동일 주기 중복 실행 방지) 추가
3. 실패 재시도 정책/백오프 추가
- 검증
1. API 응답 지연 시 중첩 실행 없음
2. 실패 시 로그에 시도 횟수/원인 기록
- 완료 기준
1. scheduler 폭주 재현 시 단일 실행 유지
- [ ] done

### Phase 6: 테스트/관측성 보강 (P2)
- 작업
1. 백엔드 핵심 시나리오 통합 테스트 추가
2. 보안 경계 테스트(URL 차단, 인증 실패) 추가
3. sync 성공/실패/skip 메트릭 구조 통일
- 검증
1. CI에서 최소 `typecheck + backend integration tests` 통과
2. 배포 후 메트릭 대시보드에서 실패율/지연 관측 가능
- 완료 기준
1. 운영 배포 전 자동 검증 게이트 확보
- [ ] done

## 4) 리스크 / 대응

1. 리스크: 인증 도입 시 웹/스크립트 호출이 일시 실패 가능
- 대응: Phase 1에서 호환 기간(읽기 엔드포인트 무영향) + 배포 순서 문서화

2. 리스크: D1 전환 시 데이터 누락/중복
- 대응: 마이그레이션 dry-run, row count/hash 비교, 롤백 스냅샷 유지

3. 리스크: URL 차단 정책 과도 적용으로 정상 도메인 오탐
- 대응: denylist 기본 + allow override 정책 및 감사 로그

## 5) 수용 기준 (DoD)

1. 보안
- 쓰기/동기화 엔드포인트 인증 없는 접근 100% 차단
- 내부 sync 엔드포인트 공개 호출 차단

2. 정합성
- 동시 sync 요청에서 데이터 유실 재현 0건

3. 안정성
- scheduler 중복 실행 재현 시 동시 실행 수 1 유지

4. 계약
- 에러 코드 스키마 고정
- 500 응답에서 내부 상세 메시지 노출 0건

## 6) 구현 순서 제안 (RPI)

1. Research: `thoughts/research/2026-03-01-0143-backend-production-hardening.md` (완료)
2. Plan: 본 문서 (완료)
3. Implement:
- PR-1: Phase 1~2
- PR-2: Phase 3
- PR-3: Phase 4
- PR-4: Phase 5~6
