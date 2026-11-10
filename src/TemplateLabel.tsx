import exclusiveInk from './assets/talent-template/variants/ink/exclusive.svg?raw';
import exclusiveOriginal from './assets/talent-template/variants/original/exclusive.svg?raw';
import { textColour } from './palette';
﻿import { Colour } from './styles-colors-model';
import { TalentTemplate } from './talent-template-model';
import FixedCardText from './FixedCardText';
export default function TemplateLabel({template,language,colours,kind='nonRenewable'}:{kind?:'nonRenewable'|'exclusive';template:TalentTemplate;colours:Colour[];language:'pl'|'en'}) {
 const b=template.elements[kind];if(!b.visible)return null;
 if(kind==='exclusive'){
  const style=template.styles.exclusive, ink=textColour(style,colours);
  const artwork=(template.graphicVariant==='ink'?exclusiveInk:exclusiveOriginal).replace(/<svg[^>]*>|<\/svg>/g,'');
  const fontSize=Math.min(style.fontSize*.78,b.height*.30,b.width*.68/6.3);
  const badgeWidth=Math.min(b.width,b.width*.28+fontSize*5.8+b.width*.06);
  const textBox={x:b.x+badgeWidth*.28,y:b.y+b.height*.12,width:badgeWidth*.68,height:b.height*.78};
  return <g data-exclusive-badge="true"><g color={ink} transform={`translate(${b.x} ${b.y}) scale(${badgeWidth/100} ${b.height/28})`} dangerouslySetInnerHTML={{__html:artwork}}/><FixedCardText id="exclusive" box={textBox} language={language} colours={colours} vertical="middle" hyphenate={false} segments={[{text:language==='pl'?'talent\nekskluzywny':'exclusive\ntalent',style:{...style,fontSize,letterSpacing:0,lineHeight:1.03,italic:false}}]}/></g>;
 }

 return <FixedCardText id={kind} box={b} language={language} colours={colours} vertical="middle" hyphenate={false} segments={[{text:language==='pl'?'nieodnawialny':'non-renewable',style:template.styles[kind]}]}/>;
}
