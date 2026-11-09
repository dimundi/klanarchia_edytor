import { graphicVariants } from './graphic-variants';
import { TalentTemplate } from './talent-template-model';
export default function TemplateBackground({template}:{template:TalentTemplate}) {
 if(!template.backgroundVisible)return null;const b=template.elements.frame;
 return b.visible?<path data-template-background="true" pointerEvents="none" d={graphicVariants[template.graphicVariant].contour} transform={`translate(${b.x} ${b.y}) scale(${b.width/185.67} ${b.height/101.76})`} fill={template.background}/>:<rect data-template-background="true" pointerEvents="none" width={template.page.width} height={template.page.height} fill={template.background}/>;
}
