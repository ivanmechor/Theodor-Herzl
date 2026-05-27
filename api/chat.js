const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

function extractReply(data) {
  if (data == null) return '';
  if (typeof data === 'string') return data;
  if (Array.isArray(data)) {
    for (const item of data) {
      const reply = extractReply(item);
      if (reply) return reply;
    }
    return '';
  }
  if (typeof data === 'object') {
    for (const key of ['output', 'reply', 'message', 'text', 'response', 'answer', 'content']) {
      if (typeof data[key] === 'string' && data[key].trim()) return data[key];
      if (data[key] && typeof data[key] === 'object') {
        const reply = extractReply(data[key]);
        if (reply) return reply;
      }
    }
  }
  return '';
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  if (!N8N_WEBHOOK_URL) {
    sendJson(res, 500, {
      error: 'N8N_WEBHOOK_URL is not configured in Vercel Environment Variables',
    });
    return;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {}),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = n8nResponse.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await n8nResponse.json()
      : await n8nResponse.text();

    if (!n8nResponse.ok) {
      sendJson(res, n8nResponse.status, {
        error: 'n8n webhook failed',
        details: typeof data === 'string' ? data : data.message || data.error || data,
      });
      return;
    }

    sendJson(res, 200, { output: extractReply(data) || 'Não consegui formular uma resposta agora.' });
  } catch (error) {
    const message = error && error.name === 'AbortError'
      ? 'n8n webhook timed out'
      : 'Unable to contact n8n webhook';
    sendJson(res, 502, { error: message });
  }
};
