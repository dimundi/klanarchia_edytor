import { graphicSource } from './graphic-variants';
import { TalentTemplate } from './talent-template-model';
import TintedGraphic from './TintedGraphic';
export default function HexMark({template,colour}:{template:TalentTemplate;colour:string}) {
 const box=template.elements.hexMark;if(!box.visible)return null;
 return <g data-hex-mark="true"><TintedGraphic source={graphicSource(template,'hexMark')} colour={colour} box={box} /></g>;
}