export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  try {
    const data = req.body;
    // data._score = QUENTE | QUENTE_DOMINIO_VALIDADO | MORNO | FRIO
    // data._status = DESQUALIFICADO_ELEGANTE se faturamento <50k
    // data._cnpj_valido, data._dominio_match, data.cnpj, data.email
    
    // Exemplo: enviar para webhook (Make, Zapier, Sheet)
    if (process.env.LEAD_WEBHOOK_URL) {
      await fetch(process.env.LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({...data, timestamp: new Date().toISOString()})
      });
    }
    
    console.log('LEAD BUILDPULSE', data);
    return res.status(200).json({ok:true, score: data._score});
  } catch (e) {
    console.error(e);
    return res.status(500).json({error:'fail'});
  }
}
