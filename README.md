# GOYU AI Web

GOYU AI의 웹 앱 프로토타입입니다. 밝고 세련된 블루/퍼플 SaaS UI와 확장 가능한 작업 공간을 제공합니다.

## 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다. 배포 전에는 `npm run build`로 프로덕션 빌드를 확인합니다.

## 현재 포함된 화면

- 홈 랜딩 및 제품 소개
- GOYU Chat: 대화 목록을 확장할 수 있는 채팅 UI, 모델 미연결 상태 표시
- Agent / Web / Work / Proof / Memory / Studio / Desktop / 설정 상태 화면
- 로그인/회원가입 UI를 연결할 수 있는 공통 shell 구조
- 로그인/회원가입 요청 화면과 인증 API 계약 골격
- 이용약관, 개인정보처리방침, 쿠키 안내, 이용 제한·AI 안전 안내
- 모바일 하단 내비게이션 및 반응형 레이아웃

일부 기능은 아직 백엔드 연결 전이므로 화면에 `연결 대기 중`, `출시 예정`으로 명확히 표시됩니다. 임의의 AI 답변은 생성하지 않습니다.

## 인증과 법률 문서

`/auth`에는 로그인·회원가입 UI가 있으며 다음 Pages Functions 경로를 호출하도록 준비되어 있습니다.

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`

현재 인증 함수는 `501 AUTH_NOT_CONNECTED`를 반환합니다. 실제 운영에서는 비밀번호 해시(Argon2id 또는 동등 수준), 이메일 인증, 세션 쿠키, CSRF 방어, rate limit, 로그아웃·비밀번호 재설정, 사용자·워크스페이스별 권한 검사를 구현해야 합니다. 비밀번호를 평문으로 저장하거나 브라우저 localStorage에 저장하지 마세요.

법률 문서는 다음 경로에 있습니다.

- `/legal/terms` 이용약관
- `/legal/privacy` 개인정보처리방침
- `/legal/cookies` 쿠키 및 저장 기술 안내
- `/legal/acceptable-use` 이용 제한 및 AI 안전 안내

문서는 초기 검토용 템플릿입니다. 실제 사업자 정보, 개인정보 처리 목적·보유기간, 위탁사·국외 이전, 결제·환불 정책을 반영한 뒤 법률 전문가 검토를 거쳐 시행해야 합니다.

## 모델 담당자용 API 계약

프론트엔드는 `POST /api/chat`을 호출하도록 확장할 수 있습니다.

요청 예시:

```json
{
  "conversationId": "conv_123",
  "messages": [
    { "role": "user", "content": "안녕하세요" }
  ],
  "stream": false,
  "metadata": { "workspaceId": "workspace_123" }
}
```

권장 응답:

```json
{
  "id": "msg_123",
  "role": "assistant",
  "content": "모델의 응답",
  "model": "goyu-mini",
  "usage": { "inputTokens": 0, "outputTokens": 0 },
  "proof": { "status": "unverified", "checks": [] }
}
```

스트리밍을 쓸 경우 SSE 이벤트 형식을 권장합니다: `message.delta`, `message.completed`, `error`.

## 환경변수

`.env.example`을 `.env.local`로 복사합니다.

- `GOYU_MODEL_BASE_URL`: 지인이 제공하는 모델 서버 주소
- `GOYU_MODEL_API_KEY`: 서버 전용 비밀키. 브라우저에 노출하지 않습니다.
- `GOYU_MODEL_NAME`: 모델 식별자

## 보안 및 데이터 분리 권장사항

인증은 서버에서 세션을 검증하고, 모든 대화·파일·메모리 쿼리에 `userId`와 `workspaceId`를 서버가 주입해야 합니다. 클라이언트가 전달한 소유자 ID를 신뢰하지 마세요. 모델 API 키는 서버 환경변수에만 두고, 업로드 파일은 MIME/용량 검증·악성 파일 검사·짧은 만료 URL을 사용하세요. 실제 운영 전에는 rate limit, CSRF, 감사 로그, 삭제/내보내기 정책도 추가해야 합니다.

## 백엔드 연결 위치

`app/api/chat/route.ts`는 모델 주소가 없을 때만 `501 MODEL_NOT_CONNECTED`를 반환합니다. `GOYU_MODEL_BASE_URL`을 설정하면 서버에서 모델 서버의 `/v1/chat/completions`로 안전하게 프록시합니다. API 키는 브라우저로 노출되지 않습니다.

## Cloudflare Pages 배포

`goyu-ai.pages.dev` 주소를 받을 수 있도록 정적 Next.js export와 Pages Functions를 사용합니다. 화면은 Pages에 배포되고, `/api/chat`과 `/api/health`는 `functions/`에서 처리됩니다.

```bash
npx wrangler login
npx wrangler pages project create goyu-ai
npm run pages:deploy
```

모델 연결 후에는 Cloudflare Pages의 Variables and Secrets에 `GOYU_MODEL_BASE_URL`, `GOYU_MODEL_API_KEY`, `GOYU_MODEL_NAME`을 서버 전용 변수로 등록합니다.
