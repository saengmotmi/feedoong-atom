# PRD: X 멘션 전용 피드 (Replies/Retweets/Likes 제외)

- 문서 버전: v0.1
- 작성일: 2026-02-22
- 제품 단계: v0.3 후보 기능
- 대상: 1인 운영(개인 사용자 본인)

## 1. 합의된 동작 기준

- 현재동작: Feedoong Atom은 RSS/Atom 소스만 등록 가능하며 X(Twitter) 계정/트윗 입력을 피드 소스로 처리하지 못한다.
- 정상동작: 사용자가 X 계정 URL 또는 트윗 URL을 입력하면, 해당 계정을 대상으로 멘션만 수집한 전용 피드 소스가 생성되고 답글/리트윗/좋아요 성격의 항목은 피드에 노출되지 않는다.

## 2. 문제 정의

RSS 기반 블로그/유튜브 외에도 X 계정 기반으로 신호를 받고 싶지만, 일반 타임라인은 노이즈(답글/리트윗/좋아요/인용)가 크다.
사용자 입장에서는 "특정 계정 관련 멘션"만 빠르게 모아보고 싶다.

## 3. 목표 / 비목표

### 3.1 목표

1. 입력이 계정 URL이든 트윗 URL이든, 대상 계정을 자동 추출해 멘션 피드를 만든다.
2. 멘션 피드에는 답글/리트윗/좋아요 성격의 항목을 제외한다.
3. 기존 피드 UX(등록/동기화/목록 소비) 안에서 일관되게 동작한다.
4. 1인 운영 기준으로 실패 원인(인증/쿼터/레이트리밋/비공개 계정)을 관측 가능하게 만든다.

### 3.2 비목표 (v0.3)

1. X 전체 검색 기반 키워드 모니터링
2. 멀티유저 OAuth 연결
3. 좋아요/리트윗/답글 자체를 별도 피드 타입으로 제공
4. 비공개(Protected) 계정 멘션 보장

## 4. 용어 정의

1. `대상 계정(Target User)`: 사용자가 입력한 계정 URL 또는 트윗 URL에서 추출된 계정
2. `멘션(Mention)`: 대상 계정을 언급한 게시물
3. `노이즈(제외 대상)`: 답글, 리트윗, 좋아요 성격의 항목
4. `X 멘션 소스`: Feedoong 내부 source 타입 중 `provider=x_mentions`인 소스

## 5. 입력/출력 정의

## 5.1 입력

1. 계정 URL
   - 예: `https://x.com/username`
2. 트윗 URL
   - 예: `https://x.com/username/status/1234567890`
3. (선택) `@username` 텍스트

## 5.2 출력

1. 소스 등록 성공 시 `provider=x_mentions`, `targetUserId`, `targetUsername`가 저장된다.
2. 동기화 후 아이템은 멘션 조건을 만족하는 게시물만 저장된다.
3. 피드 목록에서 일반 RSS 아이템과 동일한 카드로 소비한다(원문 링크는 X 게시물 URL).

## 6. 핵심 유저 스토리

### US-X-01. 멘션 소스 등록

"나는 계정 URL/트윗 URL 하나만 넣고 멘션 전용 피드를 만들고 싶다."

### US-X-02. 노이즈 없는 멘션 소비

"나는 답글/리트윗/좋아요 성격의 노이즈를 빼고 멘션만 보고 싶다."

### US-X-03. 증분 동기화

"나는 이미 읽은 과거 항목을 중복 없이, 신규 멘션만 빠르게 추가 반영하고 싶다."

## 7. 정상동작 정의 (수용조건)

### 7.1 US-X-01 소스 등록 정상동작

전제:
1. X API 인증 토큰이 유효하다.
2. 입력이 유효한 계정/트윗 URL 또는 `@username`이다.

입력:
1. 웹 등록 폼에 X 계정 URL 또는 트윗 URL 입력 후 제출

기대 결과:
1. URL 파서가 `targetUsername`을 추출한다.
2. 사용자 조회 API로 `targetUserId`를 얻는다.
3. `POST /v1/sources`가 `201` 반환한다.
4. 소스 목록에 `X 멘션: @username` 형태로 1건 추가된다.

실패 동작:
1. 잘못된 URL/핸들이면 `422` + `source-error`
2. 중복 대상 계정이면 `409`
3. 토큰/쿼터 이슈면 `503` 또는 `429` + 원인 코드 노출

### 7.2 US-X-02 멘션 필터링 정상동작

전제:
1. 대상 계정용 X 멘션 소스가 등록되어 있다.

입력:
1. `POST /v1/sync` 또는 scheduler sync

기대 결과:
1. 멘션 수집 결과 중 아래 제외 규칙이 적용된다.
2. 제외되지 않은 항목만 item 저장된다.
3. 동일 트윗 ID 중복 저장이 없다.

제외 규칙(v0.3):
1. `referenced_tweets.type`에 `retweeted`가 포함되면 제외
2. `referenced_tweets.type`에 `replied_to`가 포함되면 제외
3. 좋아요는 멘션 타임라인 데이터에 직접 포함되지 않으므로 별도 수집 대상에서 제외
4. `author_id == targetUserId`인 자기 글은 기본 제외

포함 규칙(v0.3):
1. 대상 계정을 멘션한 게시물
2. 위 제외 규칙에 걸리지 않는 게시물

### 7.3 US-X-03 증분 동기화 정상동작

전제:
1. 소스별 마지막 `since_id`(또는 최신 트윗 ID)가 저장되어 있다.

입력:
1. 동일 소스에 대해 연속 2회 이상 sync 수행

기대 결과:
1. 2회차 sync는 신규 멘션만 조회한다.
2. 저장된 아이템 수는 신규분만 증가한다.
3. 기존 아이템 중복 insert는 0건이다.

## 8. 기능 요구사항

### 8.1 소스 등록

1. 입력이 X URL인지 판별하는 `source-input resolver`를 둔다.
2. 계정 URL/트윗 URL에서 `targetUsername` 추출 규칙을 구현한다.
3. 트윗 URL 입력 시 `status/{id}`는 등록 편의 입력으로만 사용하고 최종 대상은 `username` 기준으로 고정한다.

### 8.2 수집/정규화

1. provider별 전략 패턴에 `x-mentions` 전략 추가
2. 수집 결과를 공통 Item 스키마로 normalize
3. source metadata에 `targetUserId`, `targetUsername`, `sinceId`, `lastSyncAt` 저장

### 8.3 동기화

1. 수동 sync, 자동 sync 모두 동일 파이프라인 사용
2. 429/5xx는 재시도(backoff + jitter) 적용
3. 실패 분류를 `AUTH`, `RATE_LIMIT`, `QUOTA`, `NOT_FOUND`, `FILTERED_ZERO`, `UNKNOWN`로 기록

### 8.4 UI

1. 등록 성공 시 소스 라벨에 `X 멘션` 뱃지 표시
2. 아이템 카드에 `@mention` 배지(또는 provider 아이콘) 표시
3. "필터 제외 n건"을 sync 결과 요약에 노출

## 9. 비기능 요구사항

1. 성능: 소스 1개 sync p95 3초 이내(정상 API 응답 시)
2. 신뢰성: 동일 입력 재시도 시 중복 소스 생성 0건
3. 관측성: sourceId 단위 수집/필터/저장 카운트 로그 필수
4. 운영성: 토큰 누락/만료 시 사용자 메시지와 운영 로그가 즉시 구분되어야 함

## 10. 아키텍처 반영안

1. `backend/packages/rss-parser` 인근에 provider 확장 레이어 추가
2. `backend/packages/rss-parser/src/discovery/strategies`와 같은 방식으로
   `social/strategies/x-mentions.ts` 추가
3. API `POST /v1/sources` 입력 해석 단계에 URL 타입 분기 추가
4. sync 오케스트레이터에서 source.provider별 collector 호출

권장 모듈:
1. `backend/packages/social-collector`
2. `backend/packages/social-collector/src/providers/x-mentions.ts`
3. `backend/packages/social-collector/src/normalize.ts`

## 11. 데이터 모델 변경

### 11.1 Source 확장

1. `provider`: `rss | x_mentions`
2. `providerMeta` (JSON)
   - `targetUserId`
   - `targetUsername`
   - `sinceId`
   - `lastCursor`

### 11.2 Item 확장(옵션)

1. `provider`: `rss | x_mentions`
2. `rawType`: `mention`
3. `rawRef`: 원본 트윗 ID

## 12. API 계약 변경안

### 12.1 소스 등록

`POST /v1/sources`

body 예시:

```json
{
  "input": "https://x.com/someone/status/1234567890"
}
```

서버 동작:
1. 입력이 X URL이면 `provider=x_mentions`로 등록
2. RSS URL이면 기존 로직 유지

### 12.2 sync 응답 확장

`POST /v1/sync` 응답 detail에 아래 필드 추가:
1. `fetchedCount`
2. `filteredOutCount`
3. `insertedCount`
4. `providerErrorType`

## 13. 성공 지표

1. 멘션 정밀도(Precision): 수동 샘플링 기준 95% 이상
2. 노이즈 제외율: 답글/리트윗 판정 항목의 95% 이상 제외
3. 증분 동기화 중복률: 0%
4. 등록 성공률: 유효 입력 기준 98% 이상

## 14. 로컬/스테이징 검증 시나리오

### 시나리오 A: 계정 URL 등록

1. `POST /v1/sources`에 `https://x.com/{username}` 입력
2. `201` + `provider=x_mentions` 확인

### 시나리오 B: 트윗 URL 등록

1. `POST /v1/sources`에 `https://x.com/{username}/status/{id}` 입력
2. `targetUsername={username}`로 등록되는지 확인

### 시나리오 C: 필터 검증

1. 테스트 fixture에 리트윗/답글/일반 멘션 섞인 응답 주입
2. 결과에서 리트윗/답글 0건 저장, 일반 멘션만 저장 확인

### 시나리오 D: 증분 sync

1. 1회 sync 후 `sinceId` 저장 확인
2. 2회 sync에서 신규 항목만 추가되는지 확인

## 15. 리스크 / 대응

1. API 요금/쿼터 변동
   - 대응: provider별 월간 사용량/호출량 대시보드 + soft limit
2. 429 빈발
   - 대응: backoff, source별 최소 동기화 간격 설정
3. 정책 변경으로 필드 의미 변경
   - 대응: 응답 스키마 버전 로그와 fallback 파서 유지
4. 멘션 정의 불일치(제품/사용자 기대치)
   - 대응: v0.3에서는 "대상 계정을 언급한 게시물 중 답글/리트윗 제외"를 명시 정의

## 16. 오픈 이슈

1. 멘션에서 "인용(quote)"도 제외할지 여부
2. 자기 멘션(`author_id == targetUserId`)을 예외 허용할지 여부
3. 수집 보관 기간(예: 90일 rolling) 적용 여부
4. 사용자 입력이 `@username`일 때 검증 실패 UX 문구

## 17. 근거(공식 문서)

1. X API Timelines 소개 (멘션 타임라인 특성: 최대 800, replies/quote 포함)  
   - https://docs.x.com/x-api/posts/timelines/introduction
2. Get mentions endpoint (`GET /2/users/{id}/mentions`)  
   - https://docs.x.com/x-api/users/get-mentions
3. Rate limits (`/2/users/:id/mentions`, `/2/users/:id/tweets`, `/2/users/:id/liked_tweets`)  
   - https://docs.x.com/x-api/fundamentals/rate-limits
4. OAuth 2.0 app-only 인증 개요  
   - https://docs.x.com/fundamentals/authentication/oauth-2-0/application-only
5. X Developer Platform overview (현재 pricing 모델 안내)  
   - https://docs.x.com/overview
