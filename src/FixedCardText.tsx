import { useEffect, useId, useMemo, useState } from 'react';
import type { Box, TextStyle } from './talent-template-model';
import type { Annotation, Colour } from './styles-colors-model';
import { annotationStyle, parseTalentText, TextFragment } from './FormattedTalentText';
import { textColour } from './palette';
import { CardFonts, loadCardFonts } from './card-fonts';
import { atomPositions, FixedLayout, layoutCardText, RunStyle, TextRun } from './card-text-engine';
export type FixedTextSegment={text:string;style:TextStyle;formatted?:boolean};
export function cardRuns(segments:FixedTextSegment[],annotations:Annotation[],colours:Colour[]):TextRun[]{
 const result:TextRun[]=[];const tags=new Map(annotations.map(a=>[a.tag,a]));
 function flatten(nodes:TextFragment[],style:RunStyle){for(const node of nodes){if(typeof node==='string'){if(node)result.push({text:node,style});continue;}const a=tags.get(node.tag)!;const patch=annotationStyle(a,colours);flatten(node.children,{...style,bold:patch.fontWeight===undefined?style.bold:Number(patch.fontWeight)>=600,italic:patch.fontStyle===undefined?style.italic:patch.fontStyle==='italic',color:patch.color as string||style.color,background:patch.backgroundColor as string||style.background,smallCaps:a.smallCaps,underline:a.underline||style.underline});}}
 for(const segment of segments){const s=segment.style;const style:RunStyle={font:s.font,fontSize:s.fontSize,lineHeight:s.lineHeight,letterSpacing:s.letterSpacing,color:textColour(s,colours),bold:s.bold,italic:s.italic};flatten(segment.formatted?parseTalentText(segment.text,new Set(tags.keys())):[segment.text],style);}
 return result;
}
export default function FixedCardText({box,segments,language,annotations=[],colours,align='left',vertical='top',hyphenate=true,onLayout,id}:{box:Pick<Box,'x'|'y'|'width'|'height'>;segments:FixedTextSegment[];language:'pl'|'en';annotations?:Annotation[];colours:Colour[];align?:'left'|'right';vertical?:'top'|'middle'|'bottom';hyphenate?:boolean;onLayout?:(layout:FixedLayout)=>void;id?:string}){
 const [fonts,setFonts]=useState<CardFonts>(),[fontError,setFontError]=useState(false);const clip='ke-text-'+useId().replace(/[^a-z0-9_-]/gi,'');
 useEffect(()=>{let alive=true;loadCardFonts().then(f=>{if(alive)setFonts(f);}).catch(()=>{if(alive)setFontError(true);});return()=>{alive=false;};},[]);
 const result=useMemo(()=>{if(!fonts)return {};try{return {layout:layoutCardText(cardRuns(segments,annotations,colours),fonts,box,language,hyphenate)};}catch(e){return {error:e instanceof Error?e.message:'Text layout failed'};}},[fonts,segments,annotations,colours,box,language,hyphenate]);
 useEffect(()=>{if(result.layout)onLayout?.(result.layout);},[result.layout,onLayout]);
 const layout=result.layout;
 if(!layout)return <g data-text-status={fontError||result.error?'error':'loading'}><foreignObject x={box.x} y={box.y} width={box.width} height={Math.max(12,box.height)}><div style={{font:'8px sans-serif',color:'#bd553d'}} role={fontError||result.error?'alert':'status'}>{fontError||result.error?(language==='pl'?'Nie można złożyć tekstu. Sprawdź font i dostępność znaków.':'Cannot lay out text. Check the font and supported characters.'):(language==='pl'?'Wczytywanie fontów…':'Loading fonts…')}</div></foreignObject></g>;
 const dy=vertical==='bottom'?Math.max(0,box.height-layout.height):vertical==='middle'?Math.max(0,(box.height-layout.height)/2):0;
 return <g data-fixed-text={id||'body'} data-text-status="ready" data-text-overflow={layout.overflow?'true':'false'} data-layout-width={layout.width} data-layout-height={layout.height} aria-label={segments.map(s=>s.text).join('')} pointerEvents="none">
  <defs><clipPath id={clip}><rect x={box.x} y={box.y} width={box.width} height={box.height}/></clipPath></defs>
  <g clipPath={`url(#${clip})`}>{layout.lines.map((line,index)=>{const dx=align==='right'?box.width-line.width:0;return <g key={index} data-line-text={line.text} data-line-index={index} transform={`translate(${box.x+dx} ${box.y+dy})`}>{atomPositions(line.atoms).map(({atom,x,advance},i)=><g key={i}>{atom.style.background&&<rect x={x} y={line.top} width={Math.max(0,advance)} height={line.height} fill={atom.style.background}/>}<path d={atom.glyph.getPath(x,line.baseline,atom.size).toPathData(4)} fill={atom.style.color}/>{atom.style.underline&&<path d={`M${x} ${line.baseline+atom.size*.1}h${advance}`} stroke={atom.style.color} strokeWidth={Math.max(.25,atom.size*.045)}/>}</g>)}</g>;})}</g>
 </g>;
}
