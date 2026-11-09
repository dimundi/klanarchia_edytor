import FormattedTalentText from './FormattedTalentText';
import { graphicVariants } from './graphic-variants';
import { polishSpacing } from './polish-typography';
import type { TalentListItem } from './talent-api';
import type { Annotation, Colour } from './styles-colors-model';
export function TalentListSymbols({item,language}:{item:TalentListItem;language:'pl'|'en'}){
 const pl=language==='pl',s=item.settings,assets=graphicVariants.ink.assets;
 const names:Record<string,string>=pl?{hexMark:'Zaznaczenie heksa',cost:'Koszt',play:'Zagrywka',gift:'Dar Ciemności',specialRules:'Zasady specjalne',nonRenewable:'nieodnawialny'}:{hexMark:'Hex mark',cost:'Cost',play:'Play',gift:'Dark gift',specialRules:'Special rules',nonRenewable:'Non-renewable'};
 const usage:Record<string,string>=pl?{'mission-one':'Raz na misję','mission-three':'Trzy razy na misję',once:'Raz na scenę'}:{'mission-one':'Once per mission','mission-three':'Three times per mission',once:'Once per scene'};
 return <div className="ke-talent-list-symbols">
   {s.action&&<span className="ke-talent-list-tag">{pl?'akcja':'action'}</span>}
   {Object.entries(names).filter(([id])=>s.flags[id]).map(([id,label])=><span key={id} className="ke-talent-list-tag" title={label}>{id!=='nonRenewable'&&<span aria-hidden="true" className="ke-talent-list-icon" style={{maskImage:'url("'+assets[id as 'hexMark'|'cost'|'play'|'gift'|'specialRules']+'")'}}/>}{label}{id==='cost'?' '+s.cost:''}</span>)}
   {usage[s.usage]&&<span className="ke-talent-list-tag" role="img" aria-label={usage[s.usage]} title={usage[s.usage]}>{(s.usage==='mission-three'?[0,1,2]:[s.usage==='mission-one'?2:0]).map(i=><span key={i} aria-hidden="true" className={'ke-talent-list-icon'+(s.usage!=='once'?' is-use':'')} style={{maskImage:'url("'+(s.usage==='once'?assets.once:graphicVariants.ink.useFields[i])+'")'}}/>)}</span>}
   {!item.hasTranslation&&<span className="ke-talent-list-tag">{pl?'Brak tłumaczenia — treść PL':'Not translated — PL content'}</span>}
 </div>;
}
export default function TalentListContent({item,language,annotations,colours}:{item:TalentListItem;language:'pl'|'en';annotations:Annotation[];colours:Colour[]}){
 const pl=language==='pl',c=item.content;
 return <div className="ke-talent-list-content">
  {c.flavor&&<p className="ke-talent-list-flavor">{polishSpacing(c.flavor)}</p>}
  {c.mechanics&&<p className="ke-talent-list-mechanics"><FormattedTalentText text={polishSpacing(c.mechanics)} annotations={annotations} colours={colours}/></p>}
  {c.restriction&&<p className="ke-talent-list-restriction"><strong>{pl?'Dostępność:':'Availability:'}</strong> {polishSpacing(c.restriction)}</p>}
 </div>;
}
