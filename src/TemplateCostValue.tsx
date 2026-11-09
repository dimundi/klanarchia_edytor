import { TalentTemplate } from './talent-template-model';
import { Colour } from './styles-colors-model';
import { handDrawnDigits, handDrawnDigitBounds } from './hand-drawn-digits';
export default function TemplateCostValue({template,colours}:{template:TalentTemplate;colours:Colour[]}) {
 const b=template.elements.costAmount;if(!b.visible)return null;
 return <svg x={b.x} y={b.y} width={b.width} height={b.height} viewBox={handDrawnDigitBounds[template.costValue]} preserveAspectRatio="xMaxYMid meet" pointerEvents="none" aria-label={String(template.costValue)}><path data-cost-value={template.costValue} d={handDrawnDigits[template.costValue]} fillRule="evenodd" fill={colours.find(c=>c.id===template.costTextColourId)?.value||'#3e5074'}/></svg>;
}