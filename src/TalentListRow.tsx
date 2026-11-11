import TalentMessages from './TalentMessages';
﻿import TalentListContent, { TalentListSymbols } from './TalentListContent';
import TalentStatusDot from './talent-status';

import type { TalentListItem } from './talent-api';
import type { Annotation, Colour } from './styles-colors-model';
export default function TalentListRow({item,language,annotations,colours,onOpen,disabled,path}:{item:TalentListItem;language:'pl'|'en';annotations:Annotation[];colours:Colour[];onOpen:()=>void;disabled:boolean;path?:string}){
 const pl=language==='pl';
 return <div className="ke-talent-list-body"><div className="ke-talent-list-meta"><h4 className="ke-talent-row-title"><TalentStatusDot status={item.status} language={language}/><button type="button" className="ke-talent-title" disabled={disabled} onClick={onOpen}>{item.name||(pl?'Bez tytułu':'Untitled')}</button></h4>{path&&<small className="ke-search-group-path">{path}</small>}<code className="ke-talent-code">{item.versionCode}</code><TalentListSymbols item={item} language={language}/><div className="ke-talent-list-validation"><TalentMessages expandable validation={item.validation} language={language}/>{item.validation.status!=='checked'&&<small className="ke-talent-check-pending">{item.validation.status==='stale'?(pl?'Wymaga ponownego sprawdzenia':'Needs rechecking'):(pl?'Jeszcze niesprawdzony':'Not checked yet')}</small>}</div></div><TalentListContent item={item} language={language} annotations={annotations} colours={colours}/></div>;
}
