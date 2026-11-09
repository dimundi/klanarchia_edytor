import type { Font } from 'opentype.js';
const sources={regular:new URL('./assets/talent-template/LinLibertine_R.ttf',import.meta.url).href,bold:new URL('./assets/talent-template/LinLibertine_RB.ttf',import.meta.url).href,italic:new URL('./assets/talent-template/LinLibertine_RI.ttf',import.meta.url).href,boldItalic:new URL('./assets/talent-template/LinLibertine_RBI.ttf',import.meta.url).href};
export type CardFonts=Record<keyof typeof sources,Font>;
let loaded:Promise<CardFonts>|undefined;
export function loadCardFonts(){if(!loaded)loaded=(async()=>{const {parse}=await import('opentype.js');const entries=await Promise.all(Object.entries(sources).map(async([id,url])=>{const r=await fetch(url);if(!r.ok)throw new Error('Font unavailable');return [id,parse(await r.arrayBuffer())] as const;}));return Object.fromEntries(entries) as CardFonts;})().catch(e=>{loaded=undefined;throw e;});return loaded;}
