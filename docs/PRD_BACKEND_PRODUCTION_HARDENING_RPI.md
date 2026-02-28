# PRD: Backend Production Hardening (RPI)

- 문서 버전: v0.1
- 작성일: 2026-03-01
- 기반 리서치: `/Users/ohjongtaek/Desktop/dev/feedoong-atom/thoughts/research/2026-03-01-0143-backend-production-hardening.md`
- 기반 플랜: `/Users/ohjongtaek/Desktop/dev/feedoong-atom/thoughts/plans/2026-03-01-0144-backend-production-hardening-rpi.md`

## 1) 문제 정의

- 현재 백엔드는 개인 사용 MVP로는 동작하지만, 운영 기준의 최소 보안/정합성/안정성 가드가 약하다.
- 특히 인증 없는 쓰기 엔드포인트, 단일 KV 문서 write 구조, URL fetch 경계 부재가 비용/장애/악용 리스크를 만든다.

## 2) 목표

1. 인증/권한 경계 강화
2. URL/FETCH 보안 경계 강화
3. 에러 계약 표준화 및 내부 정보 노출 제거
4. Worker 저장소를 정합성 보장 가능한 구조로 전환
5. scheduler 실행 안정성 확보

## 3) 비목표

1. UI/UX 개편
2. 추천/소셜 기능 추가
3. RSS 전략 신규 확장

## 4) 핵심 유저 스토리

1. 사용자는 인증된 클라이언트에서만 소스를 등록할 수 있다.
2. 사용자는 안전한 public URL만 등록할 수 있다.
3. 동기화는 중복 실행/동시 실행에서도 데이터 정합성을 유지한다.
4. 실패 시 사용자에게는 안정된 에러 코드/메시지가, 운영자에게는 원인 로그가 제공된다.

## 5) RPI 체크

## Research

- 완료 기준:
1. 현재 구조와 리스크가 파일/라인 증거로 문서화되어 있다.
2. 정상동작/현재동작이 1문장으로 고정되어 있다.
- 상태: 완료

## Plan

- 완료 기준:
1. Phase별 작업/검증/완료 기준이 정의되어 있다.
2. 저장소 전환 옵션과 트레이드오프가 명시되어 있다.
- 상태: 완료

## Implement

- 완료 기준:
1. 각 Phase별 검증 명령 통과
2. 배포 후 운영 검증 항목 확인
- 상태: 미착수

## 6) 구현 범위 (Phase)

### Phase 1 (P0): 인증/권한
1. 쓰기 API 인증 강제
2. scheduler 키 빈값 배포 차단

### Phase 2 (P1): URL/FETCH 경계
1. private/local/meta 네트워크 차단
2. parser fetch 이전 정책 검증

### Phase 3 (P1): 에러 계약
1. 도메인 에러 코드 표준화
2. 500 응답 내부 메시지 비노출

### Phase 4 (P1): 저장소 정합성
1. Worker 저장소 D1 전환
2. KV 단일 문서 write 제거

### Phase 5 (P2): scheduler 안정화
1. timeout + in-flight guard
2. 재시도/백오프

### Phase 6 (P2): 테스트/관측성
1. 백엔드 통합 테스트 추가
2. sync 지표 표준화

## 7) 수용 기준 (DoD)

1. 인증 없는 쓰기/동기화 호출 차단율 100%
2. 동시 sync 재현에서 데이터 유실 0건
3. 에러 응답 스키마 표준화 완료
4. 배포 후 sync 실패율/지연 메트릭 관측 가능

## 8) 리스크 및 대응

1. 인증 전환 중 기존 호출 실패
- 대응: 배포 순서 고정 + 환경변수 체크리스트

2. D1 마이그레이션 데이터 누락
- 대응: dry-run + row count/hash 검증 + 롤백 스냅샷

3. URL 정책 오탐
- 대응: denylist 기본 정책 + 감사 로그 + allow override 절차
