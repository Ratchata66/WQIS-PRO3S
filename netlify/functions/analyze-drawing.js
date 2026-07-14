/**
 * Netlify Function — analyze engineering drawing via Claude Vision API
 * Env var required: ANTHROPIC_API_KEY
 */
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const PROMPT = `You are analyzing a 2D engineering/technical drawing (blueprint).
Extract structure type and dimensions, then respond ONLY with a JSON object — no markdown, no code block, no explanation.

Required JSON format:
{"shape":"frame","w":1000,"h":800,"d":600,"ts":60,"thick":30,"notes":"คำอธิบายสั้น ๆ เป็นภาษาไทย"}

Rules for "shape" (pick exactly one):
- "frame"    = rectangular hollow-section tube frame / support structure (square/rect tubes at corners + rails)
- "box"      = solid block, plate, or filled rectangular structure
- "cylinder" = round tank, vessel, or solid round column
- "pipe"     = hollow round tube or pipe
- "lbracket" = L-shaped angle bracket or channel section

Rules for dimensions (in mm):
- w = overall width (horizontal, left-right in front view)
- h = overall height (vertical, up-down)
- d = overall depth (front-to-back / third dimension; estimate from side view or proportions)
- ts = tube section size in mm (for frame/lbracket; default 60 if not labeled)
- thick = pipe wall thickness in mm (for pipe; default 30 if not labeled)
- Use labeled dimensions from the drawing if visible; otherwise estimate from proportions

Respond with ONLY the JSON object. No other text.`;

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 503,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'ANTHROPIC_API_KEY ยังไม่ได้ตั้งค่าใน Netlify environment variables' }),
    };
  }

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch { body = {}; }
  const { imageBase64, mediaType = 'image/jpeg' } = body;

  if (!imageBase64) {
    return {
      statusCode: 400,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'imageBase64 required' }),
    };
  }

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 512,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: imageBase64 } },
            { type: 'text', text: PROMPT },
          ],
        }],
      }),
      signal: AbortSignal.timeout(25000),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return {
        statusCode: 502,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: `Anthropic API error (${resp.status}): ${errText.slice(0, 300)}` }),
      };
    }

    const data = await resp.json();
    const text = (data.content?.[0]?.text || '').trim();

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return {
        statusCode: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'parse_failed', raw: text.slice(0, 500) }),
      };
    }

    const parsed = JSON.parse(match[0]);
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed),
    };
  } catch (err) {
    const isTimeout = err.name === 'TimeoutError' || err.name === 'AbortError';
    return {
      statusCode: isTimeout ? 504 : 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: isTimeout ? 'Request timeout (25s)' : err.message }),
    };
  }
};
