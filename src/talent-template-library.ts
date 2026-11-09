import { request } from './editor-api';
import { TalentTemplate, parseTemplate } from './talent-template-model';
export type LibraryItem = { id: string; createdAt: string; updatedAt: string; revision?: number; template: TalentTemplate };
export function readLocalLibrary(key: string): LibraryItem[] {
  const raw = localStorage.getItem(key); if (raw === null) return [];
  const parsed = JSON.parse(raw);
  if (!parsed || parsed.schemaVersion !== 1 || !Array.isArray(parsed.items)) throw new Error('Invalid library');
  const ids = new Set<string>();
  return parsed.items.map((item: unknown) => {
    if (!item || typeof item !== 'object') throw new Error('Invalid item');
    const v = item as Record<string, unknown>;
    if (typeof v.id !== 'string' || !/^[0-9a-f-]{36}$/i.test(v.id) || ids.has(v.id) || typeof v.createdAt !== 'string' || typeof v.updatedAt !== 'string' || !Number.isFinite(Date.parse(v.createdAt)) || !Number.isFinite(Date.parse(v.updatedAt))) throw new Error('Invalid metadata');
    ids.add(v.id);
    const template = parseTemplate(v.template); template.textMode = 'flow';
    return { id: v.id, createdAt: v.createdAt, updatedAt: v.updatedAt, template };
  });
}
export async function readLibrary(): Promise<LibraryItem[]> {
 const items: LibraryItem[] = [];
 for (let page = 1; ; page++) { const result = await request<{items: LibraryItem[]; hasMore: boolean}>('templates?page='+page); items.push(...result.items.map(item => ({...item, template:parseTemplate(item.template)}))); if (!result.hasMore) return items; }
}
export function writeTemplate(item: {id: string; revision: number; template: TalentTemplate}) { return request<LibraryItem>('templates/'+item.id,'PUT',{revision:item.revision,template:item.template}); }