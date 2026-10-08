export default async function handler(req,res){
if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
const key=process.env.POLLINATIONS_API_KEY;
if(!key)return res.status(503).json({error:'Image generation is not configured yet. Add POLLINATIONS_API_KEY in Vercel Environment Variables.'});
try{const body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});const prompt=String(body.prompt||'').trim();if(!prompt)return res.status(400).json({error:'Image prompt is required.'});
const url='https://gen.pollinations.ai/image/'+encodeURIComponent(prompt)+'?model=black-forest-labs/flux.1-schnell&width=1024&height=1024';
const r=await fetch(url,{headers:{Authorization:'Bearer '+key}});if(!r.ok)return res.status(r.status).json({error:'Image provider returned '+r.status+'. Check the Pollinations API key/balance.'});
const type=r.headers.get('content-type')||'image/jpeg';const buf=Buffer.from(await r.arrayBuffer());
return res.status(200).json({image:'data:'+type+';base64,'+buf.toString('base64')});}catch(e){return res.status(500).json({error:e?.message||'Unable to generate image.'});}}