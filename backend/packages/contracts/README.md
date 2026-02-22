# @feedoong/contracts

API 요청/검증 계약 공용 패키지입니다.  
런타임(node/worker) 간 중복을 제거하기 위해 zod schema와 JSON body 파서를 제공합니다.

## 제공 항목

- `sourceBodySchema`
- `itemsQuerySchema`
- `syncBodySchema`
- `readJsonBody(request)`
- `INVALID_JSON_BODY_ERROR`

## 사용 예시

```ts
import { sourceBodySchema, readJsonBody } from "@feedoong/contracts";

const body = sourceBodySchema.parse(await readJsonBody(request));
```

## 명령어

레포 루트에서:

```bash
yarn workspace @feedoong/contracts build
yarn workspace @feedoong/contracts typecheck
```

## 원칙

- 런타임 의존성 없음 (`hono`, `node:*` 미의존)
- API 계약 변경 시 이 패키지에서 먼저 수정
