import { InlineCostIcon } from './CostIcon';
import { INLINE_COST_MARKER } from './inline-talent-icons';
import type { GraphicVariantId } from './graphic-variants';
import { annotationUiStyle } from './FormattedTalentText';
import { useRef } from 'react';
import { Annotation, Colour, notation } from './styles-colors-model';
export default function TalentTextField({ label, value, onChange, annotations, colours, rows, maxLength, spacing, inlineCostLabel, graphicVariant }: { inlineCostLabel?:string;graphicVariant?:GraphicVariantId;spacing?:{value:string;inherited?:number;label:string;onChange:(value:string)=>void}; label: string; value: string; onChange: (text:string)=>void; annotations:Annotation[]; colours:Colour[]; rows?:number; maxLength:number }) {
 const field=useRef<HTMLInputElement|HTMLTextAreaElement|null>(null);
 function format(tag:string) {
  const input=field.current;if(!input)return;
  let start=input.selectionStart??0,end=input.selectionEnd??start;
  if(end>start){const selection=value.slice(start,end);if(!selection.trim())return;start+=selection.length-selection.trimStart().length;end-=selection.length-selection.trimEnd().length;}
  const selected=value.slice(start,end);
  const open=tag==='*'||tag==='**'?tag:`[${tag}: `,close=tag==='*'||tag==='**'?tag:']';
  const unwrap=value.slice(Math.max(0,start-open.length),start)===open&&value.slice(end,end+close.length)===close;
  const next=unwrap?value.slice(0,start-open.length)+selected+value.slice(end+close.length):value.slice(0,start)+notation(tag,selected)+value.slice(end);
  if(next.length>maxLength)return;
  onChange(next);requestAnimationFrame(()=>{input.focus();input.setSelectionRange(unwrap?start-open.length:start+open.length,unwrap?end-open.length:end+open.length);});
 }
 function insertCost(){const input=field.current;if(!input)return;const start=input.selectionStart??value.length,end=input.selectionEnd??start;const next=value.slice(0,start)+INLINE_COST_MARKER+value.slice(end);if(next.length>maxLength)return;onChange(next);requestAnimationFrame(()=>{input.focus();input.setSelectionRange(start+INLINE_COST_MARKER.length,start+INLINE_COST_MARKER.length);});}
 const labelId=useRef('ke-text-'+crypto.randomUUID()).current;
 return <div className="ke-talent-text-field"><label htmlFor={labelId}>{label}</label>{(annotations.length > 0 || spacing || inlineCostLabel) && <div className="ke-text-formatting" role="toolbar" aria-label={label}>{[...annotations].sort((a,b)=>{const order=['**','*','cecha','aspekt','stan'];const rank=(tag:string)=>order.includes(tag)?order.indexOf(tag):order.length;return rank(a.tag)-rank(b.tag);}).map(a=><button key={a.id} type="button" title={a.name} aria-label={a.name} onMouseDown={e=>e.preventDefault()} onClick={()=>format(a.tag)}>{a.tag==='**'?<strong>B</strong>:a.tag==='*'?<em>I</em>:<span style={annotationUiStyle(a,colours)}>{a.name}</span>}</button>)}{inlineCostLabel&&<button type="button" title={inlineCostLabel} aria-label={inlineCostLabel} onMouseDown={e=>e.preventDefault()} onClick={insertCost}><InlineCostIcon variant={graphicVariant}/></button>}{spacing&&<label className="ke-inline-spacing" title={spacing.label+' (pt)'}><span aria-hidden="true">A↔A</span><input className="ke-inline-spacing-input" aria-label={spacing.label} type="number" min={-2} max={10} step={.05} placeholder={spacing.inherited?.toString()??''} value={spacing.value} onChange={e=>{const value=e.target.value;if(value===''||(Number.isFinite(Number(value))&&Number(value)>=-2&&Number(value)<=10))spacing.onChange(value);}}/><span className="ke-inline-spacing-unit">pt</span></label>}</div>}{rows?<textarea id={labelId} ref={node=>{field.current=node;}} aria-label={label} rows={rows} maxLength={maxLength} value={value} onChange={e=>onChange(e.target.value)} onKeyDown={e=>{if((e.ctrlKey||e.metaKey)&&!e.altKey&&['b','i'].includes(e.key.toLowerCase())){const tag=e.key.toLowerCase()==='b'?'**':'*';if(annotations.some(a=>a.tag===tag)){e.preventDefault();format(tag);}}}}/>:<input id={labelId} ref={node=>{field.current=node;}} aria-label={label} maxLength={maxLength} value={value} onChange={e=>onChange(e.target.value)}/>}</div>;
}
