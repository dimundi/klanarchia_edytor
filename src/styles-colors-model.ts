export type Colour = { id: string; name: string; value: string; cmyk: [number, number, number, number] | null };
export type Annotation = { id: string; name: string; tag: string; colourId: string; backgroundId: string; weight: 400 | 600 | 700; smallCaps: boolean; bold: boolean; italic: boolean; underline: boolean };
export type Catalogue = { version: 2; colours: Colour[]; annotations: Annotation[] };
export const validTag = (tag: string) => /^(?:[a-z][a-z0-9_-]{0,39}|\*{1,2})$/.test(tag);
export const notation = (tag: string, text: string) => tag === '*' || tag === '**' ? `${tag}${text}${tag}` : `[${tag}: ${text}]`;
export function approximateCmyk(hex: string): [number, number, number, number] {
 const rgb = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255), k = 1 - Math.max(...rgb);
 return [...rgb.map(v => Math.round(k === 1 ? 0 : (1 - v - k) / (1 - k) * 100)), Math.round(k * 100)] as [number, number, number, number];
}
const annotation = (tag: string, name: string, extra: Partial<Annotation> = {}): Annotation => ({ id: crypto.randomUUID(), tag, name, colourId: '', backgroundId: '', weight: 400, smallCaps: false, bold: false, italic: false, underline: false, ...extra });
export function withPresets(data: Catalogue, language: 'pl' | 'en'): Catalogue {
 const colours = [...data.colours], annotations = [...data.annotations];
 const missingAspect = !annotations.some(a => a.tag === 'aspekt');
 let aspectColour = colours.find(c => c.value.toLowerCase() === '#b1b7c6');
 if (missingAspect && !aspectColour) { aspectColour = { id: crypto.randomUUID(), name: language === 'pl' ? 'Tło aspektu' : 'Aspect background', value: '#b1b7c6', cmyk: null }; const base = aspectColour.name; let n = 2; while (colours.some(c => c.name === aspectColour!.name)) aspectColour.name = `${base} ${n++}`; colours.push(aspectColour); }
 const presets = [annotation('cecha', language === 'pl' ? 'Cecha' : 'Trait', { weight: 700, bold: true, italic: true }), annotation('aspekt', language === 'pl' ? 'Aspekt' : 'Aspect', { backgroundId: aspectColour?.id || '' }), annotation('stan', language === 'pl' ? 'Stan' : 'State', { weight: 600, smallCaps: true }), annotation('**', language === 'pl' ? 'Pogrubienie' : 'Bold', { weight: 700, bold: true }), annotation('*', language === 'pl' ? 'Kursywa' : 'Italic', { italic: true })];
 for (const preset of presets) if (!annotations.some(a => a.tag === preset.tag)) { const base = preset.name; let n = 2; while (annotations.some(a => a.name === preset.name)) preset.name = `${base} ${n++}`; annotations.push(preset); }
 return { version: 2, colours, annotations };
}
export function parseCatalogue(raw: string, language: 'pl' | 'en'): Catalogue {
 const v = JSON.parse(raw);
 const validName = (n: unknown) => typeof n === 'string' && !!n.trim() && n.length <= 80;
 if (![1, 2].includes(v?.version) || !Array.isArray(v.colours) || !Array.isArray(v.annotations)) throw Error('format');
 const ids = new Set<string>();
 for (const item of [...v.colours, ...v.annotations]) { if (typeof item.id !== 'string' || !item.id || ids.has(item.id) || !validName(item.name)) throw Error('item'); ids.add(item.id); }
 const colours: Colour[] = v.colours.map((c: Colour) => { if (typeof c.value !== 'string' || !/^#[0-9a-f]{6}$/i.test(c.value)) throw Error('colour'); const cmyk = v.version === 1 ? null : c.cmyk; if (cmyk !== null && (!Array.isArray(cmyk) || cmyk.length !== 4 || cmyk.some(n => typeof n !== 'number' || !Number.isFinite(n) || n < 0 || n > 100))) throw Error('cmyk'); return { id: c.id, name: c.name, value: c.value, cmyk }; });
 const tags = new Set<string>();
 const annotations: Annotation[] = v.annotations.map((a: Annotation) => {
  if (![a.bold, a.italic, a.underline].every(b => typeof b === 'boolean') || typeof a.colourId !== 'string') throw Error('style');
  let tag = a.tag;
  if (v.version === 1) { const slug = a.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 32); tag = /^[a-z]/.test(slug) ? slug : 'oznaczenie'; const base = tag; let n = 2; while (tags.has(tag)) tag = `${base}-${n++}`; }
  const result: Annotation = { id: a.id, name: a.name, tag, colourId: a.colourId, backgroundId: v.version === 1 ? '' : a.backgroundId, weight: v.version === 1 ? (a.bold ? 700 : 400) : a.weight, smallCaps: v.version === 1 ? false : a.smallCaps, bold: a.bold, italic: a.italic, underline: a.underline };
  if (!validTag(tag) || tags.has(tag) || ![400, 600, 700].includes(result.weight) || typeof result.smallCaps !== 'boolean' || [result.colourId, result.backgroundId].some(id => typeof id !== 'string' || id && !colours.some(c => c.id === id))) throw Error('annotation');
  tags.add(tag); return result;
 });
 const result: Catalogue = { version: 2, colours, annotations };
 return v.version === 1 ? withPresets(result, language) : result;
}