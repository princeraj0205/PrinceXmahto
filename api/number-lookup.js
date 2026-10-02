module.exports = async function handler(req, res) {
  const q = typeof req.query?.q === 'string' ? req.query.q.trim() : '';

  if (!q) {
    return res.status(400).json({
      status: false,
      error: 'Missing q parameter.'
    });
  }

  if (!/^\+?[0-9]{7,15}$/.test(q)) {
    return res.status(400).json({
      status: false,
      error: 'Invalid number format.'
    });
  }

  try {
    const upstream = new URL('https://osint-apis-hub.onrender.com/api/num-info');
    upstream.searchParams.set('key', 'Demo');
    upstream.searchParams.set('q', q);

    const response = await fetch(upstream.toString(), {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store'
    });

    const text = await response.text();

    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');

    return res.status(response.status).send(text);
  } catch (error) {
    return res.status(502).json({
      status: false,
      error: 'Lookup service is temporarily unavailable.'
    });
  }
};
