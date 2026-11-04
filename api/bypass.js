export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const apiKey = process.env.ZAPI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API belum dikonfigurasi. Tambahkan ZAPI_API_KEY di Vercel Environment Variables.' });
  }

  const rawUrl = typeof req.body?.url === 'string' ? req.body.url.trim() : '';
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return res.status(400).json({ error: 'URL tidak valid.' });
  }

  const allowedHosts = new Set([
    'sfl.gl', 'www.sfl.gl',
    'safelinku.com', 'www.safelinku.com',
    'linku.to', 'www.linku.to',
    'lokerwfh.net', 'www.lokerwfh.net'
  ]);
  if (!['http:', 'https:'].includes(parsed.protocol) || !allowedHosts.has(parsed.hostname.toLowerCase())) {
    return res.status(400).json({ error: 'Domain link tidak didukung.' });
  }

  try {
    const endpoint = new URL('https://api.zapi.ink/v1/bypass-tools:safelinku/resolve');
    endpoint.searchParams.set('url', parsed.href);

    const upstream = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'accept': 'application/json'
      },
      signal: AbortSignal.timeout(25000)
    });

    const body = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const message = upstream.status === 401 ? 'API key ditolak. Periksa ZAPI_API_KEY di Vercel.' :
        upstream.status === 429 ? 'Kuota API habis atau terlalu banyak permintaan.' :
        upstream.status === 404 ? 'Link tidak ditemukan atau tidak didukung.' :
        `Layanan bypass gagal (HTTP ${upstream.status}).`;
      return res.status(upstream.status >= 500 ? 502 : upstream.status).json({ error: message });
    }

    const finalUrl = body?.data?.finalUrl;
    let finalParsed;
    try { finalParsed = new URL(finalUrl); } catch {}
    if (!finalParsed || !['http:', 'https:'].includes(finalParsed.protocol)) {
      return res.status(502).json({ error: 'API tidak mengembalikan URL hasil yang valid.' });
    }

    return res.status(200).json({ ok: true, url: finalParsed.href });
  } catch (error) {
    console.error('YASLAM bypass error:', error?.name || 'Error');
    return res.status(502).json({ error: 'Tidak dapat menghubungi layanan bypass. Coba lagi nanti.' });
  }
}
  
