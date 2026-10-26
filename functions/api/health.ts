export async function onRequestGet() {
  return Response.json({ service: "goyu-web", model: "not_connected", status: "ready_for_integration" });
}
