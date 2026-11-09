import { CSSProperties, ReactNode } from 'react';
import { Annotation, Colour } from './styles-colors-model';
import { canonicalColourId } from './palette';
export type TextFragment = string | { tag: string; children: TextFragment[] };
// Markup is text data, never HTML. Unclosed or unknown markers stay visible.
export function parseTalentText(text: string, tags: Set<string>, depth = 0): TextFragment[] {
 if (depth >= 20) return [text];
 const result: TextFragment[] = []; let plain = '', i = 0;
 const flush = () => { if (plain) { result.push(plain); plain = ''; } };
 while (i < text.length) {
  const named = text[i] === '[' ? /^\[([a-z][a-z0-9_-]*):[ \t]?/.exec(text.slice(i)) : null;
  const tag = named?.[1] || (text.startsWith('***', i) ? '***' : text.startsWith('**', i) ? '**' : text[i] === '*' ? '*' : '');
  const allowed = tag === '***' ? tags.has('*') && tags.has('**') : tags.has(tag);
  if (!tag || !allowed) { plain += text[i++]; continue; }
  const start = i + (named ? named[0].length : tag.length); let end = -1;
  if (named) { let brackets = 1; for (let p = start; p < text.length; p++) { if (text[p] === '[') brackets++; if (text[p] === ']' && --brackets === 0) { end = p; break; } } }
  else if (tag === '*') {
   for (let p = start; p < text.length; p++) {
    if (text.startsWith('**', p)) { const close = text.indexOf('**', p + 2); if (close !== -1) { p = close + 1; continue; } }
    if (text[p] === '*') { end = p; break; }
   }
  } else end = text.indexOf(tag, start);
  if (end <= start) { plain += text[i++]; continue; }
  flush(); const children = parseTalentText(text.slice(start, end), tags, depth + 1);
  result.push(tag === '***' ? {tag:'**', children:[{tag:'*', children}]} : {tag, children});
  i = end + (named ? 1 : tag.length);
 }
 flush(); return result;
}
export function annotationStyle(a:Annotation,colours:Colour[]):CSSProperties {return { fontWeight:a.tag==='*'&&a.weight===400?undefined:a.weight, fontStyle:a.tag==='**'&&!a.italic?undefined:a.italic?'italic':'normal', fontVariant:a.smallCaps?'small-caps':'normal', textDecoration:a.underline?'underline':undefined, color:colours.find(c=>c.id===canonicalColourId(a.colourId))?.value, backgroundColor:colours.find(c=>c.id===canonicalColourId(a.backgroundId))?.value };}
export function annotationUiStyle(a:Annotation,colours:Colour[]):CSSProperties {return {...annotationStyle(a,colours),...(a.tag==='aspekt'?{color:'#202420'}:{})};}
export default function FormattedTalentText({ text, annotations, colours }: { text: string; annotations: Annotation[]; colours: Colour[] }) {
 const tags = new Map(annotations.map(a => [a.tag, a]));
 function render(nodes: TextFragment[]): ReactNode { return nodes.map((node, index) => {
  if (typeof node === 'string') return node;
  const a = tags.get(node.tag)!;
  const style = annotationUiStyle(a,colours);
  return <span key={index} data-annotation={node.tag} style={style}>{render(node.children)}</span>;
 }); }
 return <>{render(parseTalentText(text, new Set(tags.keys())))}</>;
}
