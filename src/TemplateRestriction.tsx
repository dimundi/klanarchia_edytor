import { graphicVariants } from './graphic-variants';
import { useId, useLayoutEffect, useRef, useState } from 'react';
import { Colour } from './styles-colors-model';
import TemplateBackground from './TemplateBackground';
import TemplateFrame from './TemplateFrame';
import { textColour } from './palette';
import { TalentTemplate, fontFamilies } from './talent-template-model';
export default function TemplateRestriction({template,language,colours,text}:{template:TalentTemplate;language:'pl'|'en';colours:Colour[];text?:string}) {
 const b=template.elements.restriction,s=template.styles.restriction;
 const ref=useRef<HTMLSpanElement>(null),[size,setSize]=useState({width:b.width,height:b.height});
 const mask='restriction-edge-'+useId().replace(/[^a-z0-9_-]/gi,'');
 const label=text===undefined?(language==='pl'?'Tylko Mechaniści':'Mechanists only'):text;
 useLayoutEffect(()=>{const node=ref.current;if(!node)return;const measure=()=>{const rect=node.getBoundingClientRect(),matrix=(node.closest('foreignObject') as SVGGraphicsElement|null)?.getScreenCTM();if(!matrix)return;const width=rect.width/Math.hypot(matrix.a,matrix.b),height=rect.height/Math.hypot(matrix.c,matrix.d);setSize(old=>Math.abs(old.width-width)<.01&&Math.abs(old.height-height)<.01?old:{width,height});};measure();const observer=new ResizeObserver(measure);observer.observe(node);return()=>observer.disconnect();},[label,s,b.visible]);
 if(!b.visible)return null;
 const left=Math.max(0,b.x+b.width-size.width-2),top=Math.max(0,b.y+b.height-size.height-1.4);
 const frame=template.elements.frame;
 const right=frame.visible?frame.x+frame.width:template.page.width,bottom=frame.visible?frame.y+frame.height:template.page.height,w=right-left,h=bottom-top;
 const colour=colours.find(c=>c.id===template.frameColourId)?.value||'#3e5074';
 const channel=(hex:string,i:number)=>parseInt(hex.slice(i,i+2),16);
 const tint='#'+[1,3,5].map(i=>Math.round(channel(template.background,i)*.89+channel(colour,i)*.11).toString(16).padStart(2,'0')).join('');
 const shape=graphicVariants[template.graphicVariant].patch;
 return <g data-restriction-panel="true"><defs><mask id={mask} maskUnits="userSpaceOnUse" x={0} y={0} width={template.page.width} height={template.page.height} style={{maskType:"alpha"}}><TemplateBackground template={{...template,background:"#ffffff",backgroundVisible:true}}/></mask></defs><path data-restriction-patch="true" d={shape} transform={`translate(${left} ${top}) scale(${w/100} ${h/20})`} fill={tint} mask={`url(#${mask})`} pointerEvents="none"/><TemplateFrame template={template} colour={colour}/><foreignObject x={b.x} y={b.y} width={b.width} height={b.height}><div data-text-box="restriction" className="kt-card-copy" style={{height:b.height,display:'flex',alignItems:'flex-end',justifyContent:'flex-end',textAlign:'right',fontFamily:fontFamilies[s.font],fontSize:s.fontSize,lineHeight:s.lineHeight,letterSpacing:s.letterSpacing,fontWeight:s.bold?700:400,fontStyle:s.italic?'italic':'normal',color:textColour(s,colours)}}><span ref={ref} data-restriction-backdrop="true" style={{display:'inline-block',padding:'0 .5px 0 2px'}}>{label}</span></div></foreignObject></g>;
}
