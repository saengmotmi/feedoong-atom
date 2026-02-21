# PRD: Feedoong Solo

- 문서 버전: v0.1
- 작성일: 2026-02-21
- 대상: 개인 운영자 1인

## 1. 배경

기존 팀 기반 구조(다수 인원, 분산된 역할, 상대적으로 높은 운영비)로는 제품 유지가 어려웠다.  
핵심 가치인 "RSS 인사이트 통합 피드"는 유효하므로, 1인 운영 가능한 제품 구조로 재정의한다.

## 2. 제품 목표

1. 혼자서 개발/운영/배포 가능한 구조를 만든다.
2. 코어 컨셉을 유지한다.
3. 백엔드를 `api + scheduler + rss-parser` 경계로 명확히 분리한다.
4. 초기에는 개인 사용성(나 혼자 매일 쓰기)에 집중한다.

## 3. 비목표 (MVP 단계)

1. 멀티테넌트 SaaS
2. 팀 협업 기능
3. 복잡한 추천 알고리즘
4. 고가용성 분산 인프라

## 4. 핵심 컨셉 정의

"여기저기 흩어진 RSS 콘텐츠를 내 피드 한 곳에 모아, 새 탭/웹에서 빠르게 소비한다."

## 5. 사용자 시나리오 (MVP)

1. 사용자는 RSS URL을 등록한다.
2. 시스템이 URL을 파싱해 소스와 게시물을 저장한다.
3. 사용자는 웹에서 최신 아이템을 시간순으로 본다.
4. 스케줄러가 주기적으로 동기화해 수동 작업을 줄인다.
5. 필요시 사용자가 즉시 수동 동기화를 실행한다.

## 6. 요구사항

### 6.1 기능 요구사항

1. 소스 등록: RSS URL 입력 및 검증
2. 소스 조회: 등록된 소스 목록 확인
3. 아이템 조회: 최신순 목록, 페이지네이션(limit/offset)
4. 수동 동기화: 전체 또는 단일 소스 대상
5. 자동 동기화: cron 기반 주기 실행
6. 크롬 새 탭 진입: 웹 앱으로 즉시 이동

### 6.2 비기능 요구사항

1. 운영비 최소화: 단일 파일 DB(JSON) + 저비용 인스턴스 기준
2. 유지보수 단순성: 서비스 경계는 유지하되 코드베이스는 단일 모노레포
3. 장애 복구: 프로세스 재시작만으로 복구 가능해야 함
4. 관측성: 최소 health endpoint + 표준 로그
5. 프론트엔드는 RSC를 반드시 사용한다.
6. Cloudflare Edge 캐시를 적극 사용한다.

## 7. 아키텍처

## 7.1 구성요소

1. `apps/web`
   - 개인용 UI
   - 소스 등록, 동기화 버튼, 아이템 피드 조회
   - 기술 스택: Vite + React Router v7 Framework + React Server Components
   - 실행 전략:
     - 개발: RSC 프레임워크 모드(`react-router dev`)
     - 배포/엣지 검증: Cloudflare Workers(`wrangler` + build output)
2. `apps/extension`
   - 크롬 new tab override
   - 웹 앱 URL로 리다이렉트
3. `backend/packages/api`
   - REST API
   - JSON 파일 저장/조회
4. `backend/packages/scheduler`
   - cron 트리거
   - 내부 동기화 API 호출
5. `backend/packages/rss-parser`
   - RSS 파싱
   - 정규화 규칙 캡슐화

### 7.2 개발/배포 모드 분리 원칙

1. `@cloudflare/vite-plugin`를 RSC 프레임워크 모드에 직접 결합하지 않는다.
2. 개발 생산성 우선: 로컬 개발은 `react-router dev`로 고정한다.
3. 런타임 재현 우선: Edge 검증은 `wrangler dev`로 빌드 결과물을 실행한다.
4. 배포는 `wrangler deploy` 단일 경로로 통일한다.

### 7.3 데이터 모델 (MVP)

1. `sources`
   - id, url(unique), title, last_synced_at, created_at
2. `items`
   - id, source_id, guid, title, link, summary, published_at, created_at
   - unique(source_id, guid), unique(link)

### 7.4 캐시 정책 (Cloudflare Edge)

1. 대상
   - `GET /` HTML 응답
   - RSC payload(`text/x-component`)
   - API GET 응답 (`/v1/sources`, `/v1/items`)
2. 기본 정책
   - `s-maxage=60`
   - `stale-while-revalidate=300`
3. 제외 정책
   - `Set-Cookie` 포함 응답은 캐시하지 않음
   - `POST` 요청은 캐시하지 않음
4. 동기화 후
   - 기본 TTL 만료 또는 강제 우회 토큰(`CACHE_BYPASS_TOKEN`) 사용

## 8. API 스펙 (MVP)

1. `GET /health`
2. `GET /v1/sources`
3. `POST /v1/sources`
   - body: `{ "url": "https://example.com/rss.xml" }`
4. `GET /v1/items?limit=50&offset=0`
5. `POST /v1/sync`
   - body(optional): `{ "sourceId": 1 }`
6. `POST /internal/sync`
   - scheduler 전용
   - `x-scheduler-key` 검증

## 9. 비용 전략

1. DB는 JSON 단일 파일로 시작
2. API + Scheduler를 같은 소형 VM/컨테이너 호스트에서 운영
3. RSS fetch 주기 기본 30분 (트래픽 급증 전까지 보수적 운용)
4. 이미지 프록시/캐시 서버는 도입하지 않음 (MVP 범위 제외)

## 10. 성공 지표 (개인 제품 기준)

1. 매일 사용 가능 상태 유지 (헬스체크 실패 없는 날 비율)
2. 등록 소스 기준 동기화 성공률 >= 95%
3. 내 피드 최신 반영 지연 평균 <= 30분
4. 월 인프라 비용 목표: 기존 대비 70% 이상 절감

## 11. 개발 단계

1. Phase 1 (MVP)
   - 현재 스캐폴딩 범위
   - 소스 등록/조회, 아이템 조회, 수동+자동 동기화
2. Phase 2
   - 읽음/즐겨찾기
   - 기본 필터링(소스별, 기간별)
3. Phase 3
   - 경량 추천(로컬 규칙 기반)
   - 백업/내보내기

## 12. 리스크와 대응

1. 피드 형식 다양성으로 파싱 실패 가능
   - 대응: 파서 레이어에서 예외 표준화, 실패 로그 저장
2. 파일 단위 write 경합 이슈
   - 대응: 단일 프로세스 운영 + 스케줄러 호출 주기 제한
3. 스케줄러 과다 호출
   - 대응: 기본 cron 보수 설정 + 재시도 정책 제한
