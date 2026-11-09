import type { TextStyle } from './talent-template-model';
import { useEffect, useState } from 'react';
import { request } from './editor-api';
import { Catalogue } from './styles-colors-model';
export const primaryColourId = '3e507400-0000-4000-8000-000000000001';
export const blackColourId = '00000000-0000-4000-8000-000000000002';
export function paletteChanged() { window.dispatchEvent(new Event('ke:palette-changed')); }
export function usePalette(language: 'pl' | 'en') {
 const [revision,setRevision]=useState<number|null>(null);
 const [annotations,setAnnotations]=useState<Catalogue['annotations']>([]);
 const [colours, setColours] = useState<Catalogue['colours']>([]), [error, setError] = useState(false);
 useEffect(() => { let alive = true, sequence = 0;
  const refresh = () => { const current = ++sequence; request<{data:Catalogue;revision:number}>('catalogue?language='+language).then(result => { if (alive && sequence === current) { setRevision(result.revision);setColours(result.data.colours); setAnnotations(result.data.annotations); setError(false); } }).catch(() => { if (alive && sequence === current) setError(true); }); };
  refresh(); window.addEventListener('ke:palette-changed', refresh); window.addEventListener('focus', refresh);
  return () => { alive = false; window.removeEventListener('ke:palette-changed',refresh); window.removeEventListener('focus',refresh); };
 }, [language]);
 return {colours,annotations,revision,error};
}
export const inkColourId=blackColourId;
export const storyColourId=primaryColourId;
export function canonicalColourId(id:string):string {return id==='18181800-0000-4000-8000-000000000004'?blackColourId:id==='40346600-0000-4000-8000-000000000005'?primaryColourId:id;}
export function defaultTextColourId(hex:string) {return ['#181818','#000000'].includes(hex.toLowerCase())?blackColourId:['#403466','#3e5074'].includes(hex.toLowerCase())?primaryColourId:undefined;}
export function textColour(style: TextStyle, colours: Catalogue['colours']) { return (style.colourId ? colours.find(c=>c.id===canonicalColourId(style.colourId!))?.value : undefined) || style.color; }
export const whiteColourId='ffffff00-0000-4000-8000-000000000003';
