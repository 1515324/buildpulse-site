export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  try{
    const data = req.body;
    console.log('NEW LEAD BUILDPULSE:', JSON.stringify(data));
    // TODO: integrar com Google Sheets / n8n / RD Station aqui
    return res.status(200).json({ok:true, score:data._score || 'QUENTE', cnpj:data.cnpj});
  }catch(e){
    return res.status(500).json({error:e.message});
  }
}
