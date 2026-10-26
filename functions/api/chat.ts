interface Env {
  GOYU_MODEL_BASE_URL?: string;
  GOYU_MODEL_API_KEY?: string;
  GOYU_MODEL_NAME?: string;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const body = await context.request.json().catch(() => null) as { messages?: unknown[]; model?: string; stream?: boolean; temperature?: number } | null;
  if (!body?.messages || !Array.isArray(body.messages)) return Response.json({ error: "messages 배열이 필요합니다." }, { status: 400 });
  const baseUrl = context.env.GOYU_MODEL_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) return Response.json({ code: "MODEL_NOT_CONNECTED", message: "모델 연결 대기 중입니다." }, { status: 501 });
  try {
    const upstream = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: { "content-type": "application/json", ...(context.env.GOYU_MODEL_API_KEY ? { authorization: `Bearer ${context.env.GOYU_MODEL_API_KEY}` } : {}) },
      body: JSON.stringify({ model: body.model ?? context.env.GOYU_MODEL_NAME ?? "goyu-general", messages: body.messages, stream: Boolean(body.stream), temperature: body.temperature ?? 0.7 })
    });
    const payload = await upstream.json().catch(() => ({}));
    if (!upstream.ok) return Response.json({ code: "MODEL_UPSTREAM_ERROR", message: "모델 서버가 요청을 처리하지 못했습니다." }, { status: 502 });
    return Response.json(payload);
  } catch {
    return Response.json({ code: "MODEL_UNREACHABLE", message: "모델 서버에 연결할 수 없습니다." }, { status: 502 });
  }
}
