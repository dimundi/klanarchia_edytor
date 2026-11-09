import type { Font, Glyph } from 'opentype.js';
import type { CardFonts } from './card-fonts';
import { hyphenPoints } from './hyphenation';
export type RunStyle={font:string;fontSize:number;lineHeight:number;letterSpacing:number;color:string;bold:boolean;italic:boolean;smallCaps?:boolean;background?:string;underline?:boolean};
export type TextRun={text:string;style:RunStyle};
export type Atom={char:string;glyph:Glyph;font:Font;size:number;style:RunStyle};
export type FixedLine={atoms:Atom[];width:number;height:number;baseline:number;top:number;text:string};
export type FixedLayout={lines:FixedLine[];width:number;height:number;overflow:boolean};
function advance(atom:Atom){return (atom.glyph.advanceWidth??0)*atom.size/atom.font.unitsPerEm+atom.style.letterSpacing;}
export function atomPositions(atoms:Atom[]){let x=0;let previous:Atom|undefined;return atoms.map(atom=>{if(previous&&previous.font===atom.font&&previous.size===atom.size)x+=atom.font.getKerningValue(previous.glyph,atom.glyph)*atom.size/atom.font.unitsPerEm;const left=x;x+=advance(atom);previous=atom;return {atom,x:left,advance:advance(atom),right:x};});}
function width(atoms:Atom[]){return atomPositions(atoms).at(-1)?.right??0;}
export function layoutCardText(runs:TextRun[],fonts:CardFonts,box:{width:number;height:number},language:'pl'|'en',hyphenate=true):FixedLayout{
 const atoms:Atom[]=[];
 for(const run of runs){if(run.style.font!=='libertine')throw new Error('Unsupported font: '+run.style.font);const font=fonts[run.style.bold?(run.style.italic?'boldItalic':'bold'):(run.style.italic?'italic':'regular')];for(const c of Array.from(run.text.normalize('NFC').replaceAll('\r\n','\n').replaceAll('\r','\n'))){if(c==='\u00ad')continue;const small=run.style.smallCaps&&c.toUpperCase()!==c;const char=small?c.toUpperCase():c;const glyph=font.charToGlyph(char==='\n'||char==='\t'?' ':char);if(!['\n','\t',' '].includes(char)&&glyph.index===0)throw new Error('Missing glyph: '+c);atoms.push({char:c,glyph,font,size:run.style.fontSize*(small?.8:1),style:run.style});}}
 const tokens:Atom[][]=[];let token:Atom[]=[];let type='';for(const atom of atoms){const next=atom.char==='\n'?'newline':/[ \t]/.test(atom.char)?'space':'word';if(next!==type||next==='newline'){if(token.length)tokens.push(token);token=[];type=next;}token.push(atom);}if(token.length)tokens.push(token);
 const lines:FixedLine[]=[];let line:Atom[]=[],spaces:Atom[]=[],y=0;
 const base=runs[0]?.style;
 function flush(force=false){if(!line.length&&!force)return;const height=line.length?Math.max(...line.map(a=>a.style.fontSize*a.style.lineHeight)):(base?.fontSize??9)*(base?.lineHeight??1.12);const ascent=line.length?Math.max(...line.map(a=>a.font.ascender*a.size/a.font.unitsPerEm)):height*.8;const descent=line.length?Math.max(...line.map(a=>-a.font.descender*a.size/a.font.unitsPerEm)):height*.2;lines.push({atoms:line,width:width(line),height,baseline:y+(height-ascent-descent)/2+ascent,top:y,text:line.map(a=>a.char).join('')});y+=height;line=[];spaces=[];}
 function candidates(word:Atom[]){const points:{index:number;hyphen:boolean}[]=[];if(hyphenate){const text=word.map(a=>a.char).join('');for(const match of text.matchAll(/\p{L}+/gu)){const offset=Array.from(text.slice(0,match.index)).length;for(const point of hyphenPoints(match[0],language))points.push({index:offset+point,hyphen:true});}}word.forEach((a,i)=>{if(a.char==='-'&&i<word.length-1)points.push({index:i+1,hyphen:false});});return points.sort((a,b)=>a.index-b.index);}
 for(const part of tokens){if(part[0].char==='\n'){flush(true);continue;}if(/[ \t]/.test(part[0].char)){if(line.length)spaces=part;continue;}let word=part;
  while(word.length){const prefix=line.length?spaces:[];if(width([...line,...prefix,...word])<=box.width+.0001){line.push(...prefix,...word);spaces=[];break;}
   let split:{index:number;hyphen:Atom[]}|undefined;for(const point of candidates(word)){const prior=word[point.index-1];const mark=point.hyphen?[{...prior,char:'-',glyph:prior.font.charToGlyph('-')}]:[];if(width([...line,...prefix,...word.slice(0,point.index),...mark])<=box.width+.0001)split={index:point.index,hyphen:mark};}
   if(split){line.push(...prefix,...word.slice(0,split.index),...split.hyphen);word=word.slice(split.index);flush();}
   else if(line.length){flush();}else{line=word;word=[];flush();}
  }
 }
 flush();const maxWidth=Math.max(0,...lines.map(l=>l.width));return {lines,width:maxWidth,height:y,overflow:y>box.height+.001||maxWidth>box.width+.001};
}
