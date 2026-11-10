import { GLYPH_PATH_VERSION } from './glyph-path';
import { CARD_TEXT_ENGINE_VERSION } from './card-text-engine';
import { useEffect, useMemo, useRef, useState } from 'react';
import TemplateThumbnail from './TemplateThumbnail';
import { talentPreviewTemplate } from './talent-preview';
import { cacheTalentPreview, dropTalentPreview, getTalentPreview, hasTalentPreview, snapshotTalentPreview } from './talent-preview-cache';
import type { TalentListItem } from './talent-api';
import type { Annotation, Colour } from './styles-colors-model';
type Palette={revision:number|null;error:boolean;colours:Colour[];annotations:Annotation[]};
export default function LazyTalentCard({item,language,palette,onOpen,disabled}:{item:TalentListItem;language:'pl'|'en';palette:Palette;onOpen:()=>void;disabled:boolean}){
 const host=useRef<HTMLButtonElement>(null),[near,setNear]=useState(false),[image,setImage]=useState<{key:string;url:string}|null>(null),[failed,setFailed]=useState(false);
 const ready=palette.revision!==null&&!palette.error;
 const key=[GLYPH_PATH_VERSION,'play2-1','cost-ten-size-2','no-card-id-1','inline-cost-1',CARD_TEXT_ENGINE_VERSION,item.id,item.revision,item.template.id,item.template.revision,palette.revision,language].join(':');
 const template=useMemo(()=>talentPreviewTemplate(item.template.template,item.settings,item.content),[item]);
 useEffect(()=>{const element=host.current;if(!element)return;const observer=new IntersectionObserver(entries=>{for(const entry of entries)setNear(entry.isIntersecting);},{rootMargin:'300px'});observer.observe(element);return()=>observer.disconnect();},[]);
 useEffect(()=>{
  if(!near||!ready)return;let disposed=false,url='',frame=0,started=false;setFailed(false);
  const display=(blob:Blob)=>{if(disposed)return;url=URL.createObjectURL(blob);setImage({key,url});};
  const cached=getTalentPreview(key);if(cached)display(cached);
  const capture=()=>{frame=0;if(disposed||started||cached)return;const svg=host.current?.querySelector('svg.kt-thumbnail');if(!svg)return;if(svg.querySelector('[data-text-status=error]')){setFailed(true);return;}if(svg.querySelector('[data-text-status=loading]'))return;started=true;void snapshotTalentPreview(svg as SVGSVGElement).then(blob=>{cacheTalentPreview(key,blob);display(blob);}).catch(()=>{if(!disposed)setFailed(true);});};
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(capture);};
  const observer=new MutationObserver(schedule);if(host.current)observer.observe(host.current,{subtree:true,childList:true,attributes:true});schedule();
  return()=>{disposed=true;observer.disconnect();cancelAnimationFrame(frame);if(url)URL.revokeObjectURL(url);setImage(old=>old?.url===url?null:old);};
 },[near,ready,key]);
 const src=image?.key===key?image.url:null;
 const title=item.name||(language==='pl'?'Bez tytułu':'Untitled');
 return <button ref={host} type="button" className="ke-talent-card-preview" style={{aspectRatio:template.page.width+' / '+template.page.height}} disabled={disabled} onClick={onOpen} aria-label={(language==='pl'?'Otwórz talent: ':'Open talent: ')+title} aria-busy={near&&ready&&!src&&!failed}>
  {near&&src?<img src={src} alt="" onError={()=>{dropTalentPreview(key);setFailed(true);setImage(null);}}/>:near&&ready&&!failed&&!hasTalentPreview(key)?<TemplateThumbnail template={template} language={language} colours={palette.colours} annotations={palette.annotations} content={{...item.content,title:item.content.title+(item.settings.action?(language==='pl'?' (akcja)':' (action)'):'')}} useCount={item.settings.usage==='mission-one'?1:3} versionCode={item.versionCode}/>:<span className="ke-tile-placeholder" aria-hidden="true">{failed||palette.error?(language==='pl'?'Podgląd niedostępny':'Preview unavailable'):(language==='pl'?'Podgląd karty':'Card preview')}</span>}
 </button>;
}
