import { Colour } from './styles-colors-model';
import { textColour } from './palette';
import { TalentTemplate, fontFamilies } from './talent-template-model';
export default function TemplateLabel({template,language,colours}:{template:TalentTemplate;colours:Colour[];language:'pl'|'en'}) {
 const b=template.elements.nonRenewable,s=template.styles.nonRenewable;if(!b.visible)return null;
 return <foreignObject x={b.x} y={b.y} width={b.width} height={b.height}><div data-text-box="nonRenewable" className="kt-card-copy" style={{display:'flex',alignItems:'center',height:b.height,fontFamily:fontFamilies[s.font],fontSize:s.fontSize,lineHeight:s.lineHeight,letterSpacing:s.letterSpacing,fontWeight:s.bold?700:400,fontStyle:s.italic?'italic':'normal',color:textColour(s,colours),whiteSpace:'nowrap'}}>{language==='pl'?'nieodnawialny':'non-renewable'}</div></foreignObject>;
}