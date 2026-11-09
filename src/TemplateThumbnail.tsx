import TemplateVersion from './TemplateVersion';
import FixedCardText from './FixedCardText';
import TemplateCostValue from './TemplateCostValue';
import { graphicVariants, useFieldSource } from './graphic-variants';
import { polishSpacing } from './polish-typography';
import { exampleTalent } from './example-talent';
import TemplateRestriction from './TemplateRestriction';
import TemplateCost from './TemplateCost';
import TemplateLabel from './TemplateLabel';
import HexMark from './HexMark';
import TintedGraphic from './TintedGraphic';
import TemplateFrame from './TemplateFrame';
import { Annotation, Colour } from './styles-colors-model';
import TemplateBackground from './TemplateBackground';
import { bodyTextBox, TalentTemplate, TextRole, layoutHeader } from './talent-template-model';

export type TalentPreviewContent = { title: string; flavor: string; mechanics: string; restriction: string };
export default function TemplateThumbnail({ template, language, colours, content, annotations = [], useCount = 3, versionCode }: { versionCode?:string; annotations?: Annotation[]; useCount?: 1 | 3; content?: TalentPreviewContent; template: TalentTemplate; language: 'pl' | 'en'; colours: Colour[] }) {
  const {hex,specialRules,play,gift,once}=graphicVariants[template.graphicVariant].assets;
  template=layoutHeader(template); const e = template.elements, b = bodyTextBox(template,'textFlow');
  const labels = content ? [content.title ? content.title+':' : '', content.flavor, content.mechanics].map(polishSpacing) : language === 'pl' ? [exampleTalent.name+':', exampleTalent.flavor, exampleTalent.description] : ['Title:', 'Flavour text.', 'Talent rules text.'];
  const colour = (id: 'hex'|'hexMark'|'play'|'gift'|'specialRules'|'uses'|'once') => colours.find(c => c.id === template.graphicColourIds[id])?.value || (id === 'gift' || id === 'hexMark' || id === 'play' || id === 'specialRules' ? '#000000' : '#3e5074');
  const graphic = (id: 'hex'|'play'|'gift'|'specialRules'|'once', url: string) => e[id].visible ? <TintedGraphic source={url} box={e[id]} colour={colour(id)} /> : null;
  return <svg viewBox={`0 0 ${template.page.width} ${template.page.height}`} className="kt-thumbnail" overflow="visible" aria-hidden="true">
    <TemplateBackground template={template} /><TemplateFrame template={template} colour={colours.find(c => c.id === template.frameColourId)?.value || '#3e5074'} />{graphic('hex', hex)}<HexMark template={template} colour={colour('hexMark')} /><TemplateCostValue template={template} colours={colours}/><TemplateCost template={template} colours={colours}/>{graphic('play', play)}{graphic('gift', gift)}{graphic('specialRules', specialRules)}<TemplateLabel template={template} language={language} colours={colours} />
    {e.uses.visible ? (useCount===1?[2]:[0,1,2]).map(i => <TintedGraphic key={i} source={useFieldSource(template,i)} box={{x:e.uses.x+e.uses.width*i/3,y:e.uses.y,width:e.uses.width/3,height:e.uses.height}} colour={colour('uses')} />) : null}{graphic('once', once)}
    {b.visible&&<FixedCardText box={b} language={language} annotations={annotations} colours={colours} segments={(['title','flavor','mechanics'] as TextRole[]).filter(role=>e[role].visible).map(role=>({text:labels[['title','flavor','mechanics'].indexOf(role)]+' ',style:template.styles[role],formatted:!!content&&role==='mechanics'}))}/>}
    <TemplateRestriction template={template} language={language} colours={colours} text={content?.restriction}/><TemplateVersion template={template} language={language} colours={colours} text={versionCode??(content?'':undefined)}/>
  </svg>;
}
