const svgNS='http://www.w3.org/2000/svg';
async function assetData(url:string):Promise<string>{const response=await fetch(url,{credentials:'same-origin'});if(!response.ok)throw new Error('PDF asset unavailable');const blob=await response.blob();return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=reject;reader.readAsDataURL(blob);});}
function imageFrom(url:string){return new Promise<HTMLImageElement>((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=url;});}
// svg2pdf does not implement alpha masks. Flatten only masked graphics at
// 600 dpi; all letter outlines, frame paths and unmasked graphics stay vectors.
async function flattenMasks(svg:SVGSVGElement,width:number,height:number){
 for(const masked of Array.from(svg.querySelectorAll<SVGElement>('[mask]'))){
  if(masked.closest('defs'))continue;
  const isolated=document.createElementNS(svgNS,'svg');isolated.setAttribute('xmlns',svgNS);isolated.setAttribute('viewBox',svg.getAttribute('viewBox')!);isolated.setAttribute('width',String(width));isolated.setAttribute('height',String(height));
  for(const defs of Array.from(svg.querySelectorAll('defs')))isolated.append(defs.cloneNode(true));isolated.append(masked.cloneNode(true));
  const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(isolated)],{type:'image/svg+xml'}));
  try{const image=await imageFrom(url),scale=600/72,canvas=document.createElement('canvas');canvas.width=Math.ceil(width*scale);canvas.height=Math.ceil(height*scale);const context=canvas.getContext('2d');if(!context)throw new Error('PDF graphic conversion unavailable');context.drawImage(image,0,0,canvas.width,canvas.height);const replacement=document.createElementNS(svgNS,'image');replacement.setAttribute('x','0');replacement.setAttribute('y','0');replacement.setAttribute('width',String(width));replacement.setAttribute('height',String(height));replacement.setAttribute('href',canvas.toDataURL('image/png'));replacement.setAttribute('preserveAspectRatio','none');masked.replaceWith(replacement);}finally{URL.revokeObjectURL(url);}
 }
 svg.querySelectorAll('mask').forEach(node=>node.remove());
}
export async function exportTalentPdf(source:SVGSVGElement,title:string,language:'pl'|'en'):Promise<void>{
 if(source.querySelector('[data-text-status=loading],[data-text-status=error]'))throw new Error('Text fonts are not ready');
 const clone=source.cloneNode(true) as SVGSVGElement,view=source.viewBox.baseVal,width=view.width,height=view.height;
 if(!(width>0&&height>0))throw new Error('Invalid PDF dimensions');
 clone.querySelectorAll('.kt-selection,.kt-group-selection,[data-resize-handle],[data-canvas-element] > rect').forEach(node=>node.remove());
 clone.removeAttribute('tabindex');clone.removeAttribute('class');clone.removeAttribute('style');clone.setAttribute('xmlns',svgNS);clone.setAttribute('width',String(width));clone.setAttribute('height',String(height));
 if(clone.querySelector('foreignObject'))throw new Error('PDF requires ready vector text');
 const assets=new Map<string,Promise<string>>();for(const image of Array.from(clone.querySelectorAll('image'))){const href=image.getAttribute('href');if(!href||href.startsWith('data:'))continue;const url=new URL(href,location.href).href;if(!assets.has(url))assets.set(url,assetData(url));image.setAttribute('href',await assets.get(url)!);}
 await flattenMasks(clone,width,height);
 const [{jsPDF},{svg2pdf}]=await Promise.all([import('jspdf'),import('svg2pdf.js')]);
 const pdf=new jsPDF({unit:'pt',format:'a4',orientation:'portrait',compress:true,floatPrecision:8});
 const margin=10*72/25.4;if(width+2*margin>pdf.internal.pageSize.getWidth()||height+2*margin>pdf.internal.pageSize.getHeight())throw new Error('Card exceeds A4 page');
 pdf.setProperties({title:title||'Klanarchia',creator:'Klanarchia — Edytor'});
 const holder=document.createElement('div');holder.style.cssText='position:fixed;left:-100000px;top:0;pointer-events:none';holder.append(clone);document.body.append(holder);
 try{await svg2pdf(clone,pdf,{x:margin,y:margin,width,height,loadExternalStyleSheets:false,loadImages:true});const blob=pdf.output('blob'),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=(title.trim().replace(/[<>:"/\\|?*\x00-\x1f]/g,'-').replace(/[. ]+$/,'').slice(0,120)||(language==='pl'?'Talent':'Talent'))+'.pdf';document.body.append(link);link.click();link.remove();window.setTimeout(()=>URL.revokeObjectURL(url),30000);}finally{holder.remove();}
}
