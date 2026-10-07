export default async function handler(req,res){
if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
const key=process.env.POLLINATIONS_API_KEY;
if(!key)return res.status(503).json({error:'Video generation is not configured yet. Add POLLINATIONS_API_KEY in Vercel Environment Variables.'});
try{const body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});const prompt=String(body.prompt||'').trim();if(!prompt)return res.status(400).json({error:'Video prompt is required.'});
const model='google/veo-3.1-fast';const duration=Math.min(Math.max(Number(body.duration||4),1),8);
const url='https://gen.pollinations.ai/video/'+encodeURIComponent(prompt)+'?model='+encodeURIComponent(model)+'&duration='+duration;
const r=await fetch(url,{headers:{Authorization:'Bearer '+key}});if(!r.ok){let msg='Video provider returned '+r.status+'. Check the Pollinations API key/balance.';try{const d=await r.json();msg=d?.error?.message||d?.error||msg;}catch{}return res.status(r.status).json({error:String(msg)});}
const type=r.headers.get('content-type')||'video/mp4';const buf=Buffer.from(await r.arrayBuffer());
return res.status(200).json({video:'data:'+type+';base64,'+buf.toString('base64')});}catch(e){return res.status(500).json({error:e?.message||'Unable to generate video.'});}}