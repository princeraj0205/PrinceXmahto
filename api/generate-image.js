export default async function handler(req,res){
if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
const key=process.env.GEMINI_API_KEY;if(!key)return res.status(500).json({error:'Gemini API is not configured.'});
try{const body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});const prompt=String(body.prompt||'').trim();
if(!prompt)return res.status(400).json({error:'Image prompt is required.'});
const r=await fetch('https://generativelanguage.googleapis.com/v1beta/interactions',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify({model:'gemini-nano-banana-2.1',input:[{type:'text',text:prompt}],response_format:{type:'image',mime_type:'image/jpeg',aspect_ratio:body.aspectRatio||'1:1',image_size:body.imageSize||'1K'}})});
const data=await r.json();if(!r.ok)return res.status(r.status).json({error:data?.error?.message||'Image generation failed.'});
const image=data?.output_image;if(!image?.data)return res.status(502).json({error:'No image was returned.'});
return res.status(200).json({image:'data:'+(image.mime_type||'image/png')+';base64,'+image.data});}catch(e){return res.status(500).json({error:e?.message||'Unable to generate image.'});}}