import { useId, useState } from 'react';
import { Colour } from './styles-colors-model';
import TemplateBackground from './TemplateBackground';
import TemplateFrame from './TemplateFrame';
import FixedCardText from './FixedCardText';
import { TalentTemplate } from './talent-template-model';
export default function TemplateRestriction({template,language,colours,text}:{template:TalentTemplate;language:'pl'|'en';colours:Colour[];text?:string}) {
 const b=template.elements.restriction,s={...template.styles.restriction,bold:false,italic:false};
 const [size,setSize]=useState({width:b.width,height:b.height});const mask='restriction-edge-'+useId().replace(/[^a-z0-9_-]/gi,'');
 const label=text===undefined?(language==='pl'?'Tylko Mechaniści':'Mechanists only'):text;
 if(!b.visible)return null;
 const textBox={...b,width:Math.max(1,b.width-2)};
 const left=Math.max(0,textBox.x+textBox.width-size.width-3),top=Math.max(0,b.y+b.height-size.height-1.4),frame=template.elements.frame;
 const right=frame.visible?frame.x+frame.width:template.page.width,bottom=frame.visible?frame.y+frame.height:template.page.height,w=right-left,h=bottom-top;
 const colour=colours.find(c=>c.id===template.frameColourId)?.value||'#3e5074';
 const channel=(hex:string,i:number)=>parseInt(hex.slice(i,i+2),16);
 const tint='#'+[1,3,5].map(i=>Math.round(channel(template.background,i)*.89+channel(colour,i)*.11).toString(16).padStart(2,'0')).join('');
 return <g data-restriction-panel="true"><defs><mask id={mask} maskUnits="userSpaceOnUse" x={0} y={0} width={template.page.width} height={template.page.height} style={{maskType:'alpha'}}><TemplateBackground template={{...template,background:'#ffffff',backgroundVisible:true}}/></mask></defs><path data-restriction-patch="true" d="M 0,20 L 0.8,15.8 0.2,12.6 1.7,9.7 0.9,6.8 2.5,3.1 5,3.7 8,2.2 14,2.8 19,1.2 25,2.1 31,0.8 39,1.6 47,0.4 54,1.5 62,0.7 70,1.2 79,0.2 87,1.1 94,0.5 100,0 L 100,20 Z" transform={`translate(${left} ${top}) scale(${w/100} ${h/20})`} fill={tint} mask={`url(#${mask})`} pointerEvents="none"/><TemplateFrame template={template} colour={colour}/><FixedCardText id="restriction" box={textBox} language={language} colours={colours} segments={[{text:label,style:s}]} align="right" vertical="bottom" hyphenate={false} onLayout={layout=>setSize(old=>Math.abs(old.width-layout.width)<.001&&Math.abs(old.height-layout.height)<.001?old:{width:layout.width,height:layout.height})}/></g>;
}
