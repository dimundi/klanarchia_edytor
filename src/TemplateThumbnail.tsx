import { textRenderScale } from './talent-text-layout';
import FormattedTalentText from './FormattedTalentText';
import TemplateCostValue from './TemplateCostValue';
import { graphicVariants, useFieldSource } from './graphic-variants';
import { polishSpacing } from './polish-typography';
import { exampleTalent } from './example-talent';
import TemplateRestriction from './TemplateRestriction';
import TemplateCost from './TemplateCost';
import { textColour } from './palette';
import TemplateLabel from './TemplateLabel';
import HexMark from './HexMark';
import TintedGraphic from './TintedGraphic';
import TemplateFrame from './TemplateFrame';
import { Annotation, Colour } from './styles-colors-model';
import TemplateBackground from './TemplateBackground';
import { CSSProperties } from 'react';
import { bodyTextBox, TalentTemplate, TextRole, fontFamilies, layoutHeader } from './talent-template-model';

export type TalentPreviewContent = { title: string; flavor: string; mechanics: string; restriction: string };
export default function TemplateThumbnail({ template, language, colours, content, annotations = [], useCount = 3 }: { annotations?: Annotation[]; useCount?: 1 | 3; content?: TalentPreviewContent; template: TalentTemplate; language: 'pl' | 'en'; colours: Colour[] }) {
  const {hex,specialRules,play,gift,uses:square,once}=graphicVariants[template.graphicVariant].assets;
  template=layoutHeader(template); const e = template.elements, b = bodyTextBox(template,'textFlow');
  const labels = content ? [content.title ? content.title+':' : '', content.flavor, content.mechanics].map(polishSpacing) : language === 'pl' ? [exampleTalent.name+':', exampleTalent.flavor, exampleTalent.description] : ['Title:', 'Flavour text.', 'Talent rules text.'];
  const colour = (id: 'hex'|'hexMark'|'play'|'gift'|'specialRules'|'uses'|'once') => colours.find(c => c.id === template.graphicColourIds[id])?.value || (id === 'gift' || id === 'hexMark' || id === 'play' || id === 'specialRules' ? '#000000' : '#3e5074');
  const graphic = (id: 'hex'|'play'|'gift'|'specialRules'|'once', url: string) => e[id].visible ? <TintedGraphic source={url} box={e[id]} colour={colour(id)} /> : null;
  return <svg viewBox={`0 0 ${template.page.width} ${template.page.height}`} className="kt-thumbnail" overflow="visible" aria-hidden="true">
    <TemplateBackground template={template} /><TemplateFrame template={template} colour={colours.find(c => c.id === template.frameColourId)?.value || '#3e5074'} />{graphic('hex', hex)}<HexMark template={template} colour={colour('hexMark')} /><TemplateCostValue template={template} colours={colours}/><TemplateCost template={template} colours={colours}/>{graphic('play', play)}{graphic('gift', gift)}{graphic('specialRules', specialRules)}<TemplateLabel template={template} language={language} colours={colours} />
    {e.uses.visible ? (useCount===1?[2]:[0,1,2]).map(i => <TintedGraphic key={i} source={useFieldSource(template,i)} box={{x:e.uses.x+e.uses.width*i/3,y:e.uses.y,width:e.uses.width/3,height:e.uses.height}} colour={colour('uses')} />) : null}{graphic('once', once)}
    {b.visible && <foreignObject x={b.x} y={b.y} width={b.width} height={b.height}><div data-talent-body="true" lang={language} className="kt-card-copy" style={{ width:b.width*textRenderScale,height:b.height*textRenderScale,transform:`scale(${1/textRenderScale})`,transformOrigin:'0 0',fontFamily: fontFamilies[template.styles.mechanics.font], fontSize: template.styles.mechanics.fontSize*textRenderScale, lineHeight: template.styles.mechanics.lineHeight, letterSpacing: template.styles.mechanics.letterSpacing*textRenderScale }}>{(['title', 'flavor', 'mechanics'] as TextRole[]).map((role, index) => { const s = template.styles[role]; const css: CSSProperties = { fontFamily: fontFamilies[s.font], fontSize: s.fontSize*textRenderScale, fontWeight: s.bold ? 700 : 400, fontStyle: s.italic ? 'italic' : 'normal', letterSpacing: s.letterSpacing*textRenderScale, lineHeight: s.lineHeight, color: textColour(s,colours) }; return e[role].visible ? <span key={role} style={css}>{content && role === 'mechanics' ? <FormattedTalentText text={labels[index]} annotations={annotations} colours={colours}/> : labels[index]} </span> : null; })}</div></foreignObject>}
    <TemplateRestriction template={template} language={language} colours={colours} text={content?.restriction}/>
  </svg>;
}
