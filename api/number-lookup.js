module.exports = function handler(req, res) {
  const target = process.env.NUMBER_LOOKUP_URL;

  if (!target) {
    return res.status(503).send('Number Lookup is temporarily unavailable.');
  }

  try {
    const url = new URL(target);
    if (url.protocol !== 'https:') {
      return res.status(500).send('Invalid redirect configuration.');
    }

    res.setHeader('Cache-Control', 'no-store');
    res.writeHead(302, { Location: url.toString() });
    res.end();
  } catch {
    res.status(500).send('Invalid redirect configuration.');
  }
};
