export const talentStatuses=['dev','toCheck','approved','delete'] as const;
export type TalentStatus=typeof talentStatuses[number];
export function talentStatusLabel(status:TalentStatus,language:'pl'|'en'){return (language==='pl'?{dev:'W\u00a0opracowaniu',toCheck:'Do weryfikacji',approved:'Zatwierdzony',delete:'Wycofany'}:{dev:'In development',toCheck:'To check',approved:'Approved',delete:'Withdrawn'})[status];}
export default function TalentStatusDot({status='dev',language}:{status?:TalentStatus;language:'pl'|'en'}){const label=talentStatusLabel(status,language);return <span className={'ke-talent-status-dot is-'+status} role="img" aria-label={label} title={label}/>;}
