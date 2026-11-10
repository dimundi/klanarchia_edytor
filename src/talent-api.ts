import type { TalentStatus } from './talent-status';
import { parseTemplate } from './talent-template-model';
import type { TalentValidation } from './talent-validation';
﻿import { request } from './editor-api';
import type { TalentPreviewContent } from './TemplateThumbnail';
import type { LibraryItem } from './talent-template-library';
export type TalentSettings = { templateId:string; templateRevision:number; flags:Record<string,boolean>; action:boolean; usage:string; cost:number; letterSpacing:Record<'title'|'flavor'|'mechanics',number|null>; lineHeight:Record<'flavor'|'mechanics',number|null> };
export type TalentRecord = { status:TalentStatus; versionCode:string; id:string; revision:number; categoryId:string; content:TalentPreviewContent; settings:TalentSettings; template:LibraryItem; hasTranslation:boolean; updatedAt:string; validation:TalentValidation };
export type TalentListItem = { status:TalentStatus; template:LibraryItem; versionCode:string; content:TalentPreviewContent; settings:TalentSettings; hasTranslation:boolean; id:string; name:string; revision:number; categoryId:string; updatedAt:string; validation:TalentValidation };
export type TalentHistoryItem = { statusChange?:{from:TalentStatus|null;to:TalentStatus}|null; versionCode:string; revision:number; createdAt:string; author:string; action:string; changes:string[] };
export const readTalent = (id:string,language:string)=>request<TalentRecord>(`talents/${id}?language=${language}`);
export async function readTalents(category:string,language:string) {
 const items:TalentListItem[]=[],templates=new Map<string,LibraryItem>();
 for(let page=1;;page++){const result=await request<{items:Omit<TalentListItem,'template'>[];templates:LibraryItem[];hasMore:boolean}>(`talents?category=${category}&language=${language}&page=${page}`);for(const item of result.templates){const key=item.id+':'+item.revision;if(!templates.has(key))templates.set(key,{...item,template:parseTemplate(item.template)});}for(const item of result.items){const template=templates.get(item.settings.templateId+':'+item.settings.templateRevision);if(!template)throw new Error('Pinned template unavailable');items.push({...item,template});}if(!result.hasMore)return items;}
}
export async function readTalentHistory(id:string) {
 const items:TalentHistoryItem[]=[];
 for(let page=1;;page++){const result=await request<{items:TalentHistoryItem[];hasMore:boolean}>(`talents/${id}/history?page=${page}`);items.push(...result.items);if(!result.hasMore)return items;}
}
