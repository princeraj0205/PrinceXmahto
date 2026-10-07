export default async function handler(req,res){
if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
const key=process.env.GEMINI_API_KEY;if(!key)return res.status(500).json({error:'Gemini API is not configured.'});
try{const body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});const prompt=String(body.prompt||'').trim();
if(!prompt)return res.status(400).json({error:'Video prompt is required.'});
const r=await fetch('https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-generate-preview:predictLongRunning',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify({instances:[{prompt}],parameters:{aspectRatio:body.aspectRatio||'16:9',resolution:body.resolution||'720p',numberOfVideos:1}})});
const data=await r.json();if(!r.ok)return res.status(r.status).json({error:data?.error?.message||'Video generation failed to start.'});
if(!data?.name)return res.status(502).json({error:'No video operation was returned.'});return res.status(200).json({operation:data.name});}catch(e){return res.status(500).json({error:e?.message||'Unable to start video generation.'});}}