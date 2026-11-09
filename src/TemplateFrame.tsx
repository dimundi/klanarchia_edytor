import { graphicVariants } from './graphic-variants';
import { TalentTemplate } from './talent-template-model';
import TintedGraphic from './TintedGraphic';
export default function TemplateFrame({template,colour}:{template:TalentTemplate;colour:string}) {
 if(!template.elements.frame.visible)return null;const variant=graphicVariants[template.graphicVariant],b=template.elements.frame;
 return <g data-frame-colour={colour} data-graphic-variant={template.graphicVariant} pointerEvents="none">{variant.frameMode==='joined'?<g transform={`translate(${b.x} ${b.y}) scale(${b.width/185.67} ${b.height/101.76})`}>{variant.framePaths.map((path,i)=><path key={i} d={path.d} transform={path.transform} fill={colour}/>)}</g>:<TintedGraphic source={variant.assets.frame} box={b} colour={colour} stretch/>}</g>;
}
