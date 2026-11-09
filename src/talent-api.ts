import type { TalentValidation } from './talent-validation';
﻿import { request } from './editor-api';
import type { TalentPreviewContent } from './TemplateThumbnail';
import type { LibraryItem } from './talent-template-library';
export type TalentSettings = { templateId:string; templateRevision:number; flags:Record<string,boolean>; action:boolean; usage:string; cost:number; letterSpacing:Record<'title'|'flavor'|'mechanics',number|null>; lineHeight:Record<'flavor'|'mechanics',number|null> };
export type TalentRecord = { versionCode:string; id:string; revision:number; categoryId:string; content:TalentPreviewContent; settings:TalentSettings; template:LibraryItem; hasTranslation:boolean; updatedAt:string; validation:TalentValidation };
export type TalentListItem = { versionCode:string; content:TalentPreviewContent; settings:TalentSettings; hasTranslation:boolean; id:string; name:string; revision:number; categoryId:string; updatedAt:string; validation:TalentValidation };
export type TalentHistoryItem = { versionCode:string; revision:number; createdAt:string; author:string; action:string; changes:string[] };
export const readTalent = (id:string,language:string)=>request<TalentRecord>(`talents/${id}?language=${language}`);
export async function readTalents(category:string,language:string) {
 const items:TalentListItem[]=[];
 for(let page=1;;page++){const result=await request<{items:TalentListItem[];hasMore:boolean}>(`talents?category=${category}&language=${language}&page=${page}`);items.push(...result.items);if(!result.hasMore)return items;}
}
export async function readTalentHistory(id:string) {
 const items:TalentHistoryItem[]=[];
 for(let page=1;;page++){const result=await request<{items:TalentHistoryItem[];hasMore:boolean}>(`talents/${id}/history?page=${page}`);items.push(...result.items);if(!result.hasMore)return items;}
}
