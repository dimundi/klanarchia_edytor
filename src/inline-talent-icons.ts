export const INLINE_COST_TAG='ikona-kosztu';
export const INLINE_COST_MARKER='[ikona-kosztu: koszt]';
export const INLINE_COST_WIDTH_EM=1.05;
export const INLINE_COST_BASELINE_EM=.82;
export function stripInlineTalentIcons(text:string){return text.replace(/\[ikona-kosztu:[ \t]*koszt[ \t]*\]/g,'');}
