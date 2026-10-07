export default async function handler(req,res){
if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
try{
const body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
const prompt=String(body.prompt||'').trim();
if(!prompt)return res.status(400).json({error:'Image prompt is required.'});
if(prompt.length>2000)return res.status(400).json({error:'Prompt is too long.'});
const key=process.env.POLLINATIONS_API_KEY;
const base='https://gen.pollinations.ai/image/'+encodeURIComponent(prompt);
const params=new URLSearchParams({model:'black-forest-labs/flux.1-schnell',width:String(body.width||1024),height:String(body.height||1024),n:'1'});
if(key)params.set('key',key);
const imageUrl=base+'?'+params.toString();
return res.status(200).json({image:imageUrl,provider:'Pollinations'});
}catch(e){return res.status(500).json({error:e?.message||'Unable to generate image.'});}}