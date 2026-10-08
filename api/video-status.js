export default async function handler(req,res){
if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
const key=process.env.GEMINI_API_KEY;const operation=String(req.query?.operation||'');if(!key||!operation)return res.status(400).json({error:'Missing operation.'});
try{const r=await fetch('https://generativelanguage.googleapis.com/v1beta/'+operation.replace(/^\/+/,''),{headers:{'x-goog-api-key':key}});const data=await r.json();
if(!r.ok)return res.status(r.status).json({error:data?.error?.message||'Status check failed.'});if(!data.done)return res.status(200).json({done:false});if(data.error)return res.status(400).json({error:data.error.message||'Video generation failed.'});
const uri=data?.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;if(!uri)return res.status(502).json({error:'Video finished but no video URL was returned.'});
return res.status(200).json({done:true,videoUrl:uri});}catch(e){return res.status(500).json({error:e?.message||'Unable to check video status.'});}}