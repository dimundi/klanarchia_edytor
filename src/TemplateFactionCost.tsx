import TintedGraphic from './TintedGraphic';
import CostIcon from './CostIcon';
import TemplateCostValue from './TemplateCostValue';
import { factionAspectRatios, factionLogos } from './factions';
import type { TalentTemplate } from './talent-template-model';
import type { Colour } from './styles-colors-model';
export type FactionElement='factionSymbol'|'factionCostAmount'|'factionCost';
export default function TemplateFactionCost({template,colours,element}:{template:TalentTemplate;colours:Colour[];element?:FactionElement}){
 const colour=colours.find(c=>c.id===template.graphicColourIds.cost)?.value||'#3e5074',value=template.factionCost;
 const symbols=template.factionSymbols??[value.faction],symbol=template.elements.factionSymbol;
 const amount=template.elements.factionCostAmount,cost=template.elements.factionCost;
 const preview={...template,costValue:value.cost,costTextColourId:template.graphicColourIds.cost,elements:{...template.elements,costAmount:amount}};
 const gap=template.headerRow.gap;
 let cursor=symbol.x;
 return <>{(!element||element==='factionSymbol')&&symbol.visible&&symbols.map(faction=>{const width=symbol.height*factionAspectRatios[faction],x=cursor;cursor+=width+gap;return <g key={faction} data-faction-symbol={faction}><TintedGraphic source={factionLogos[faction]} box={{...symbol,x,width}} colour={colour}/></g>;})}{(!element||element==='factionCostAmount')&&amount.visible&&<g data-second-cost-value><TemplateCostValue template={preview} colours={colours}/></g>}{(!element||element==='factionCost')&&cost.visible&&<g data-faction-cost={value.faction}><CostIcon variant={template.graphicVariant} box={cost} colour={colour}/></g>}</>;
}
