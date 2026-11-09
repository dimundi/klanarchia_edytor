async function assetData(url:string):Promise<string> {
 const response=await fetch(url,{credentials:'same-origin'});if(!response.ok)throw new Error('Print asset unavailable');
 const blob=await response.blob();return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=reject;reader.readAsDataURL(blob);});
}
async function embeddedFonts():Promise<string> {
 let fonts='';for(const sheet of Array.from(document.styleSheets)){let rules:CSSRuleList;try{rules=sheet.cssRules;}catch{continue;}
 for(const rule of Array.from(rules)){if(rule.type!==CSSRule.FONT_FACE_RULE)continue;const font=rule as CSSFontFaceRule;if(!font.style.getPropertyValue('font-family').includes('KE Libertine'))continue;
 let css=font.cssText;for(const match of Array.from(css.matchAll(/url\(["']?([^"')]+)["']?\)/g)))css=css.replace(match[0],'url("'+await assetData(new URL(match[1],sheet.href||location.href).href)+'")');fonts+=css;
 }}if(!fonts)throw new Error('Print fonts unavailable');return fonts;
}
export async function printTalent(source:SVGSVGElement,title:string,language:'pl'|'en'):Promise<void> {
 // Otwieramy od razu w obsłudze kliknięcia, zanim rozpoczną się operacje asynchroniczne.
 const popup=window.open('','klanarchia-talent-print','width=900,height=700');if(!popup)throw new Error('Print window blocked');
 const pl=language==='pl';popup.document.open();popup.document.write('<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>');popup.document.close();popup.document.documentElement.lang=language;popup.document.title=title;
 const status=popup.document.createElement('p');status.textContent=pl?'Przygotowywanie wydruku…':'Preparing print…';popup.document.body.append(status);
 try {
 const clone=source.cloneNode(true) as SVGSVGElement,view=source.viewBox.baseVal;
 clone.querySelectorAll('.kt-selection,.kt-group-selection,[data-resize-handle],[data-canvas-element] > rect').forEach(node=>node.remove());
 clone.removeAttribute('tabindex');clone.removeAttribute('class');clone.removeAttribute('style');clone.setAttribute('xmlns','http://www.w3.org/2000/svg');clone.setAttribute('width',(Math.round(view.width*1000)/1000)+'pt');clone.setAttribute('height',(Math.round(view.height*1000)/1000)+'pt');
 const fonts=await embeddedFonts();for(const image of Array.from(clone.querySelectorAll('image'))){const url=image.getAttribute('href');if(url&&!url.startsWith('data:'))image.setAttribute('href',await assetData(new URL(url,location.href).href));}
 if(popup.closed)return;
 const style=popup.document.createElement('style');style.textContent=fonts+'@page{size:A4;margin:10mm}html,body{padding:0;background:white}body{margin:20px}body>svg{display:block}.kt-card-copy{font-synthesis:none;overflow:hidden;overflow-wrap:anywhere;word-break:normal;hyphens:auto;white-space:pre-wrap;text-align:left;user-select:none}[data-print-controls]{font:14px/1.5 Arial,sans-serif;margin-bottom:20px}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}@media print{body{margin:0}[data-print-controls]{display:none}}';popup.document.head.append(style);
 popup.document.body.replaceChildren();const controls=popup.document.createElement('div');controls.dataset.printControls='true';const button=popup.document.createElement('button');button.textContent=pl?'Drukuj / Zapisz jako PDF':'Print / Save as PDF';button.onclick=()=>popup.print();const hint=popup.document.createElement('p');hint.textContent=pl?'Skala 100%, bez dopasowania do strony. Wybierz „Zapisz jako PDF”, aby pobrać plik.':'Use 100% scale, without fit to page. Choose “Save as PDF” to download a file.';controls.append(button,hint);popup.document.body.append(controls,popup.document.importNode(clone,true));
 await popup.document.fonts.ready;for(const image of Array.from(popup.document.querySelectorAll('image'))){const decoded=new Image();decoded.src=image.getAttribute('href')||'';await decoded.decode();}
 if(popup.closed)return;await new Promise<void>(resolve=>popup.requestAnimationFrame(()=>popup.requestAnimationFrame(()=>resolve())));popup.focus();popup.print();
 }catch(error){if(!popup.closed)popup.close();throw error;}
}
