import {issueMessage,type TalentValidation} from './talent-validation';
type Level='error'|'warning'|'info';
export default function TalentMessages({validation,language,expandable=false}:{validation:TalentValidation;language:'pl'|'en';expandable?:boolean}){
 const groups:Record<Level,string[]>={error:validation.issues.map(i=>issueMessage(i,language)),warning:[],info:[]};
 for(const note of validation.notes??[])if(note.enabled)groups[note.level].push(note.text);
 const labels=language==='pl'?{error:'Błędy',warning:'Ostrzeżenia',info:'Informacje'}:{error:'Errors',warning:'Warnings',info:'Information'};
 return <span className={'ke-messages'+(expandable?' is-expandable':'')}>{(['error','warning','info'] as const).filter(level=>groups[level].length).map(level=>{
  const texts=groups[level],label=labels[level]+': '+texts.length;
  const icon=<MessageIcon level={level}/>;
  return expandable?<details key={level} className={'ke-message-group is-'+level}><summary aria-label={label}>{icon}<span>{texts.length}</span><span>{labels[level]}</span></summary><ul>{texts.map((text,i)=><li key={i}>{text}</li>)}</ul></details>:<span key={level} className={'ke-message-count is-'+level} role="img" aria-label={label} title={label+'\n'+texts.join('\n')}>{icon}{texts.length}</span>;
 })}</span>;
}

export function MessageIcon({level}:{level:Level}){return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">{level==='info'?<><circle cx="12" cy="12" r="9"/><path d="M12 10v7m0-11v1"/></>:<><path d="M12 3 2 21h20L12 3Z"/><path d="M12 9v5m0 3v1"/></>}</svg>;}
