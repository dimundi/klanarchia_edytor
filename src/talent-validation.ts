import type { EditorialNote } from './editorial-notes';
import { stripInlineTalentIcons } from './inline-talent-icons';
import { CARD_TEXT_ENGINE_VERSION } from './card-text-engine';
﻿export type TalentIssue={code:string;details?:{tags?:string[];notes?:string[]}};
export type TalentValidation={notes?:EditorialNote[];automaticErrorCount?:number;noteCount?:number;noteCounts?:Record<'error'|'warning'|'info',number>;templateId?:string;templateRevision?:number;status:'unchecked'|'checked'|'stale';issues:TalentIssue[];errorCount:number;checkedAt?:string;engineVersion?:number;catalogueRevision?:number};
export type LiveTalentValidation={templateId?:string;templateRevision?:number;complete:boolean;engineVersion:number;catalogueRevision:number;issues:TalentIssue[]};
export function issueMessage(issue:TalentIssue,language:'pl'|'en'){
 const messages:Record<string,string>=language==='pl'?{source_review_required:'Fragment źródła wymaga sprawdzenia.',page_reference_missing:'Trzeba uzupełnić numer strony.',version_overflow:'Numer wersji nie mieści się w swoim polu.',missing_title:'Brak tytułu talentu.',body_overflow:'Tekst nie mieści się w ramce.',restriction_overflow:'Ograniczenie dostępności nie mieści się w swoim polu.',nonrenewable_overflow:'Napis nieodnawialny nie mieści się w swoim polu.',text_layout_error:'Nie można złożyć tekstu — problem z fontem lub brakującym znakiem.',unknown_annotation:'Nieznane oznaczenie tekstu.'}:{source_review_required:'A source passage needs review.',page_reference_missing:'Complete the page number.',version_overflow:'The version number does not fit its field.',missing_title:'Talent title is missing.',body_overflow:'The text does not fit inside the frame.',restriction_overflow:'The availability restriction does not fit its field.',nonrenewable_overflow:'The non-renewable label does not fit its field.',text_layout_error:'Cannot lay out text — font or glyph unavailable.',unknown_annotation:'Unknown text annotation.'};
 return (messages[issue.code]||issue.code)+(issue.details?.tags?.length?' '+issue.details.tags.join(', '):'')+(issue.details?.notes?.length?' '+issue.details.notes.join(' '):'');
}
export function collectTalentValidation(root:HTMLElement|null,title:string,mechanics:string,tags:string[],catalogueRevision:number|null,paletteError:boolean):LiveTalentValidation{
 const issues:TalentIssue[]=[];
 if(/(?<![\p{L}\p{N}_])s\.\s*(?:x{2,}|[?…]+)(?![\p{L}\p{N}_])/iu.test(mechanics))issues.push({code:'page_reference_missing'});
 if(!title.trim())issues.push({code:'missing_title'});
 if(catalogueRevision!==null&&!paletteError){const unknown=[...new Set([...stripInlineTalentIcons(mechanics).matchAll(/\[([a-z][a-z0-9_-]*):[^\]]*\]/g)].map(m=>m[1]).filter(tag=>!tags.includes(tag)))];if(unknown.length)issues.push({code:'unknown_annotation',details:{tags:unknown}});}
 if(root){for(const [field,code]of [['body','body_overflow'],['restriction','restriction_overflow'],['nonRenewable','nonrenewable_overflow'],['version','version_overflow']])if(root.querySelector(`[data-fixed-text="${field}"][data-text-overflow=true]`)&&!root.querySelector(`[data-fixed-text="${field}"][data-text-overflow=true]`)?.closest('[data-export-version][display=none]'))issues.push({code});if(root.querySelector('[data-text-status=error]'))issues.push({code:'text_layout_error'});}
 return {complete:!!root?.querySelector('svg')&&!root.querySelector('[data-text-status=loading]')&&catalogueRevision!==null&&!paletteError,engineVersion:CARD_TEXT_ENGINE_VERSION,catalogueRevision:catalogueRevision??0,issues};
}
export function validationPayload(report:LiveTalentValidation){return {...report,issues:report.issues.filter(i=>['body_overflow','restriction_overflow','nonrenewable_overflow','version_overflow','text_layout_error'].includes(i.code))};}
