import CostIcon from './CostIcon';
import { Colour } from './styles-colors-model';
import { TalentTemplate } from './talent-template-model';
export default function TemplateCost({template,colours}:{template:TalentTemplate;colours:Colour[]}) {if(!template.elements.cost.visible)return null;return <CostIcon variant={template.graphicVariant} box={template.elements.cost} colour={colours.find(c=>c.id===template.graphicColourIds.cost)?.value||'#3e5074'}/>;}
