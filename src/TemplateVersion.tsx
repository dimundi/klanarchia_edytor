import FixedCardText from './FixedCardText';
import type { Colour } from './styles-colors-model';
import type { TalentTemplate } from './talent-template-model';
export const exampleVersionCode='A7K2-M9B4-091126-01';
export default function TemplateVersion({template,language,colours,text=exampleVersionCode}:{template:TalentTemplate;language:'pl'|'en';colours:Colour[];text?:string}){
 const box=template.elements.version;if(!box.visible||!text)return null;
 return <FixedCardText id="version" box={box} language={language} colours={colours} segments={[{text,style:template.styles.version}]} vertical="bottom" hyphenate={false}/>;
}
