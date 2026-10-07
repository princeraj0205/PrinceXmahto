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
        systemInstruction:{parts:[{text:'You are PrinceXmahto AI, the official AI assistant of the PrinceXmahto website. Be helpful, accurate, concise and friendly. Answer in English, Hindi or Hinglish based on the user. For coding, provide practical working examples. For study questions, explain clearly for diploma/polytechnic/CSE students. Never claim to have access to private website data unless it is explicitly provided in the conversation.'}]},
        contents,
        generationConfig:{temperature:0.7,maxOutputTokens:2048}
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