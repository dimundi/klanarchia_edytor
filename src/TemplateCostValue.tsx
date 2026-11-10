import { costValueWidth } from './cost-value-layout';
import { TalentTemplate } from './talent-template-model';
import { Colour } from './styles-colors-model';
import { handDrawnDigits, handDrawnDigitBounds } from './hand-drawn-digits';
export default function TemplateCostValue({template,colours}:{template:TalentTemplate;colours:Colour[]}) {
 const b=template.elements.costAmount;if(!b.visible)return null;
 if(template.costValue===10){
  const one=handDrawnDigitBounds[1].split(' ').map(Number),zero=handDrawnDigitBounds[0].split(' ').map(Number),height=Math.max(one[3],zero[3]),width=one[2]+2+zero[2];
  return <svg x={b.x} y={b.y} width={costValueWidth(b,10)} height={b.height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMaxYMid meet" pointerEvents="none" aria-label="10" data-cost-value="10" fill={colours.find(c=>c.id===template.costTextColourId)?.value||'#3e5074'}><path d={handDrawnDigits[1]} transform={`translate(${-one[0]} ${height-one[1]-one[3]})`} fillRule="evenodd"/><path d={handDrawnDigits[0]} transform={`translate(${one[2]+2-zero[0]} ${height-zero[1]-zero[3]})`} fillRule="evenodd"/></svg>;
 }
 return <svg x={b.x} y={b.y} width={b.width} height={b.height} viewBox={handDrawnDigitBounds[template.costValue]} preserveAspectRatio="xMaxYMid meet" pointerEvents="none" aria-label={String(template.costValue)}><path data-cost-value={template.costValue} d={handDrawnDigits[template.costValue]} fillRule="evenodd" fill={colours.find(c=>c.id===template.costTextColourId)?.value||'#3e5074'}/></svg>;
}