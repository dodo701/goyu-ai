export default {
  async fetch(request, env) {
    const handleRequest = async () => {
      const url = new URL(request.url);
      if (url.pathname === "/api/health" && request.method === "GET") {
        return Response.json({ service: "goyu-web", model: env.GOYU_MODEL_NAME || "not_connected", status: env.GOYU_MODEL_BASE_URL ? "connected" : "ready_for_integration" });
      }
      if (url.pathname === "/api/chat" && request.method === "POST") {
        const body = await request.json().catch(() => null);
        if (!body?.messages || !Array.isArray(body.messages)) return Response.json({ error: "messages 배열이 필요합니다." }, { status: 400 });
        const baseUrl = env.GOYU_MODEL_BASE_URL?.replace(/\/$/, "");
        if (!baseUrl) return Response.json({ code: "MODEL_NOT_CONNECTED", message: "모델 연결 대기 중입니다." }, { status: 501 });
        try {
          const upstream = await fetch(`${baseUrl}/v1/chat/completions`, {
            method: "POST",
            headers: { "content-type": "application/json", ...(env.GOYU_MODEL_API_KEY ? { authorization: `Bearer ${env.GOYU_MODEL_API_KEY}` } : {}) },
            body: JSON.stringify({ model: body.model || env.GOYU_MODEL_NAME || "goyu-general", messages: body.messages, stream: Boolean(body.stream), temperature: body.temperature ?? 0.7 })
          });
          const payload = await upstream.json().catch(() => ({}));
          if (!upstream.ok) return Response.json({ code: "MODEL_UPSTREAM_ERROR", message: "모델 서버가 요청을 처리하지 못했습니다." }, { status: 502 });
          return Response.json(payload);
        } catch {
          return Response.json({ code: "MODEL_UNREACHABLE", message: "모델 서버에 연결할 수 없습니다." }, { status: 502 });
        }
      }
      return env.ASSETS.fetch(request);
    };

    const response = await handleRequest();
    const newResponse = new Response(response.body, response);
    newResponse.headers.set("X-Frame-Options", "DENY");
    newResponse.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    newResponse.headers.set("X-Content-Type-Options", "nosniff");
    return newResponse;
  }
};
