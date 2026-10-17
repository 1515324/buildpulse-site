// BuildPulse - Google Sheets - URL: https://script.google.com/macros/s/AKfycbx_B6GZLHij5haU9EJF5qC_yNJwQWM-Nahw3GEbvWpMD2k0inuM8HqtmXdAUlUZtnVq/exec
// Cole este código no https://script.google.com - Projeto BuildPulse Leads
const CONFIG = {
  NOME_ABA: 'Leads',
  CABECALHOS: ['Data do cadastro','Nome','E-mail','WhatsApp','Empresa','Site/Instagram','CNPJ','Segmento','Faturamento Mensal','Ticket Medio','Time Comercial','Dificuldade','Investimento Mensal','Origem','Status']
};

function prepararPlanilha() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let aba = ss.getSheetByName(CONFIG.NOME_ABA);
  if (!aba) aba = ss.insertSheet(CONFIG.NOME_ABA);
  if (aba.getLastRow() === 0) aba.appendRow(CONFIG.CABECALHOS);
  aba.setFrozenRows(1);
  aba.getRange(1,1,1,CONFIG.CABECALHOS.length).setFontWeight('bold').setBackground('#14212d').setFontColor('#d4a843');
  aba.autoResizeColumns(1, CONFIG.CABECALHOS.length);
  Logger.log('Planilha preparada');
}

function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) throw new Error('Sem postData');
    const dados = JSON.parse(e.postData.contents);
    
    const nome = String(dados.nome||'').trim();
    const email = String(dados.email||'').trim();
    const empresa = String(dados.empresa||'').trim();
    
    if(!nome||!email||!empresa) {
      return resposta({sucesso:false, mensagem:'Preencha Nome, E-mail e Empresa'});
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let aba = ss.getSheetByName(CONFIG.NOME_ABA);
    if(!aba){ prepararPlanilha(); aba = ss.getSheetByName(CONFIG.NOME_ABA); }

    aba.appendRow([
      new Date(),
      protegerTexto(nome),
      protegerTexto(email),
      protegerTexto(dados.whatsapp||''),
      protegerTexto(empresa),
      protegerTexto(dados.site||''),
      protegerTexto(dados.cnpj||''),
      protegerTexto(dados.segmento||''),
      protegerTexto(dados.faturamento||''),
      protegerTexto(dados.ticket||''),
      protegerTexto(dados.time||''),
      protegerTexto(Array.isArray(dados.dificuldade)?dados.dificuldade.join(', '):(dados.dificuldade||'')),
      protegerTexto(dados.mensalidade||''),
      protegerTexto(dados.origem||'Landing'),
      'Novo lead - Verificar em 10s'
    ]);

    return resposta({sucesso:true, mensagem:'Cadastro recebido - verifique aba Leads'});
  } catch(err) {
    Logger.log('Erro doPost: '+err);
    return resposta({sucesso:false, mensagem:'Erro: '+err.message});
  }
}

function protegerTexto(v){const t=String(v||'').trim(); return /^[=+\-@\t\r]/.test(t)?"'"+t:t;}
function resposta(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);}
function doGet(){return ContentService.createTextOutput(JSON.stringify({status:'BuildPulse Leads OK - URL: https://script.google.com/macros/s/AKfycbx_B6GZLHij5haU9EJF5qC_yNJwQWM-Nahw3GEbvWpMD2k0inuM8HqtmXdAUlUZtnVq/exec - Use POST para gravar na aba Leads - Execute prepararPlanilha primeiro'})).setMimeType(ContentService.MimeType.JSON);}
