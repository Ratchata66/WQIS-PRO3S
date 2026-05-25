/**
 * Netlify Function — proxy to Render AI server
 * Env var required:  WQIS_AI_URL = https://wqis-ai-server.onrender.com
 */
exports.handler = async (event) => {
  const CORS = {
    "Access-Control-Allow-Origin":  "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const AI_URL = process.env.WQIS_AI_URL;
  if (!AI_URL) {
    return {
      statusCode: 503,
      headers: { ...CORS, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "AI server not configured (WQIS_AI_URL missing)" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");

    const res = await fetch(`${AI_URL}/api/analyze-weld`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ imageData: body.imageData }),
      // Render free tier may take ~30s on cold start — allow up to 28s
      signal: AbortSignal.timeout(28000),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        statusCode: res.status,
        headers: { ...CORS, "Content-Type": "application/json" },
        body: JSON.stringify({ error: data.detail || "AI server error" }),
      };
    }

    return {
      statusCode: 200,
      headers: { ...CORS, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    const isTimeout = err.name === "TimeoutError" || err.name === "AbortError";
    return {
      statusCode: isTimeout ? 504 : 502,
      headers: { ...CORS, "Content-Type": "application/json" },
      body: JSON.stringify({
        error: isTimeout
          ? "AI server is waking up — please retry in 30 seconds"
          : `Proxy error: ${err.message}`,
      }),
    };
  }
};
