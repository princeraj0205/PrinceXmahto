export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const key=process.env.ANTHROPIC_API_KEY;
  if(!key) return res.status(500).json({error:'Claude API is not configured on the server.'});
  try{
    const body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
    const message=String(body.message||'').trim();
    if(!message) return res.status(400).json({error:'Message is required.'});
    if(message.length>12000) return res.status(400).json({error:'Message is too long.'});
    const history=Array.isArray(body.history)?body.history.slice(-12):[];
    const contents=[];
    for(const item of history){
      if(!item||!['user','assistant'].includes(item.role)||!item.text) continue;
      contents.push({role:item.role==='assistant'?'model':'user',parts:[{text:String(item.text).slice(0,12000)}]});
    }
    if(!contents.length||contents[contents.length-1].parts[0].text!==message) contents.push({role:'user',parts:[{text:message}]});
    const model=process.env.CLAUDE_MODEL||'claude-sonnet-4-5';
    const endpoint='https://api.anthropic.com/v1/messages';
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),25000);
    let response;
    try{
      response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01'},signal:controller.signal,body:JSON.stringify({
        model,
        system:'You are PrinceXmahto AI, a smart, natural and engaging personal AI assistant. Sound like a polished modern AI assistant, not a robotic template. Be genuinely useful and conversational. Match the user language: English, Hindi or Hinglish. For simple questions, answer naturally and briefly. For complex questions, structure the answer with a short direct answer first, then useful details. Use Markdown naturally: headings, bullets, numbered steps, bold emphasis and fenced code blocks when helpful. Never add unnecessary disclaimers. For coding, give practical working code and explain the important parts. For study questions, teach clearly for diploma/polytechnic/CSE students. If the user is casual, be friendly and interesting. Do not repeat the user question unnecessarily. Never claim access to private website data unless provided in the conversation.',
        messages:contents.map(item=>({role:item.role==='model'?'assistant':'user',content:item.parts.map(p=>p.text).join('')})),
        temperature:0.85,
        max_tokens:2048
      })});
    }finally{clearTimeout(timeout)}
    const data=await response.json();
    if(!response.ok) return res.status(response.status).json({error:data?.error?.message||'Claude API request failed.'});
    const reply=(data?.content||[]).filter(p=>p?.type==='text').map(p=>p?.text||'').filter(Boolean).join('\n').trim();
    if(!reply) return res.status(502).json({error:'Claude returned an empty response.'});
    return res.status(200).json({reply});
  }catch(error){
    if(error?.name==='AbortError') return res.status(504).json({error:'Claude took too long to respond. Please try again.'});
    return res.status(500).json({error:error?.message||'Unable to process the AI request.'});
  }
}