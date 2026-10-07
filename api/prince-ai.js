export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const key=process.env.GEMINI_API_KEY;
  if(!key) return res.status(500).json({error:'Gemini API is not configured on the server.'});
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
    const model=process.env.GEMINI_MODEL||'gemini-3.5-flash';
    const endpoint='https://generativelanguage.googleapis.com/v1beta/models/'+encodeURIComponent(model)+':generateContent?key='+encodeURIComponent(key);
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),25000);
    let response;
    try{
      response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify({
        systemInstruction:{parts:[{text:'You are PrinceXmahto AI, a smart, natural and engaging personal AI assistant. Sound like a polished modern AI assistant, not a robotic template. Be genuinely useful and conversational. Match the user language: English, Hindi or Hinglish. For simple questions, answer naturally and briefly. For complex questions, structure the answer with a short direct answer first, then useful details. Use Markdown naturally: headings, bullets, numbered steps, bold emphasis and fenced code blocks when helpful. Never add unnecessary disclaimers. For coding, give practical working code and explain the important parts. For study questions, teach clearly for diploma/polytechnic/CSE students. If the user is casual, be friendly and interesting. Do not repeat the user question unnecessarily. Never claim access to private website data unless provided in the conversation.'}]},
        contents,
        generationConfig:{temperature:0.85,maxOutputTokens:2048}
      })});
    }finally{clearTimeout(timeout)}
    const data=await response.json();
    if(!response.ok) return res.status(response.status).json({error:data?.error?.message||'Gemini API request failed.'});
    const reply=(data?.candidates||[]).flatMap(c=>c?.content?.parts||[]).map(p=>p?.text||'').filter(Boolean).join('\n').trim();
    if(!reply) return res.status(502).json({error:'Gemini returned an empty response.'});
    return res.status(200).json({reply});
  }catch(error){
    if(error?.name==='AbortError') return res.status(504).json({error:'Gemini took too long to respond. Please try again.'});
    return res.status(500).json({error:error?.message||'Unable to process the AI request.'});
  }
}