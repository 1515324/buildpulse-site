// Recebe o formulário da landing page e repassa para um webhook (n8n, Zapier, planilha, CRM...).
// Configure a variável de ambiente LEAD_WEBHOOK_URL no painel da Vercel.
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return res.status(500).json({ error: 'LEAD_WEBHOOK_URL não configurada' });

  const lead = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  if (!lead.nome || !lead.email || !lead.whatsapp) {
    return res.status(400).json({ error: 'campos obrigatórios ausentes' });
  }

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...lead, recebido_em: new Date().toISOString() })
    });
    if (!r.ok) throw new Error('webhook ' + r.status);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(502).json({ error: 'falha ao encaminhar' });
  }
};
