# TODO

## 운영 설정값 주입

아래 값이 설정돼야 원격 스모크/SLO/백업 자동화가 실제로 동작합니다.

1. `PROD_API_BASE_URL`
2. `PROD_API_WRITE_KEY`
3. `PROD_SCHEDULER_KEY`
4. `D1_DATABASE_NAME`
5. `CLOUDFLARE_ACCOUNT_ID`
6. `CLOUDFLARE_API_TOKEN`

## 권장 후속 작업

1. `wrangler@4.69.0+` 업그레이드 (로컬 런타임 compatibility 경고 제거)
2. `SLO_*` 임계치 운영값 확정 (현재 기본값 사용 중)
3. D1 백업 산출물 외부 장기 보관(예: R2) 연결
