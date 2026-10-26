export async function onRequestGet() {
  return Response.json({ code: "AUTH_NOT_CONNECTED", message: "인증 서버 연결 전입니다." }, { status: 501 });
}
