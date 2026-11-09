import { Colour } from './styles-colors-model';
import { TalentTemplate } from './talent-template-model';
import FixedCardText from './FixedCardText';
export default function TemplateLabel({template,language,colours}:{template:TalentTemplate;colours:Colour[];language:'pl'|'en'}) {
 const b=template.elements.nonRenewable;if(!b.visible)return null;
 return <FixedCardText id="nonRenewable" box={b} language={language} colours={colours} vertical="middle" hyphenate={false} segments={[{text:language==='pl'?'nieodnawialny':'non-renewable',style:template.styles.nonRenewable}]}/>;
}
