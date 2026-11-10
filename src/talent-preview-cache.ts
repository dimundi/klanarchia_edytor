const previews=new Map<string,Blob>();
const assets=new Map<string,Promise<string>>();
const limit=96;
export function hasTalentPreview(key:string){return previews.has(key);}
export function getTalentPreview(key:string){const blob=previews.get(key);if(blob){previews.delete(key);previews.set(key,blob);}return blob;}
export function dropTalentPreview(key:string){previews.delete(key);}
export function cacheTalentPreview(key:string,blob:Blob){previews.delete(key);previews.set(key,blob);while(previews.size>limit)previews.delete(previews.keys().next().value!);}
function inlineAsset(url:string):Promise<string>{let request=assets.get(url);if(!request){request=(async()=>{const response=await fetch(url,{credentials:'same-origin'});if(!response.ok)throw new Error('Preview asset unavailable');const blob=await response.blob();return new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(new Error('Preview asset unavailable'));reader.readAsDataURL(blob);});})().catch(error=>{assets.delete(url);throw error;});assets.set(url,request);}return request;}
export async function snapshotTalentPreview(source:SVGSVGElement):Promise<Blob>{
 const svg=source.cloneNode(true) as SVGSVGElement,box=source.viewBox.baseVal;
 svg.removeAttribute('class');svg.removeAttribute('style');svg.setAttribute('xmlns','http://www.w3.org/2000/svg');svg.setAttribute('width',String(box.width));svg.setAttribute('height',String(box.height));
 await Promise.all(Array.from(svg.querySelectorAll('image')).map(async image=>{const href=image.getAttribute('href');if(href&&!href.startsWith('data:'))image.setAttribute('href',await inlineAsset(new URL(href,location.href).href));}));
 return new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml;charset=utf-8'});
}
