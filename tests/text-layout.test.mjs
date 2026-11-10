import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createServer } from 'vite';
import opentype from 'opentype.js';
const {parse}=opentype;
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
after(()=>server.close());
const {layoutCardText,atomPositions}=await server.ssrLoadModule('/src/card-text-engine.ts');
const {hyphenPoints}=await server.ssrLoadModule('/src/hyphenation.ts');
const fonts=Object.fromEntries(await Promise.all(Object.entries({regular:'R',bold:'RB',italic:'RI',boldItalic:'RBI'}).map(async([key,suffix])=>{const b=await fs.readFile(new URL('../src/assets/talent-template/LinLibertine_'+suffix+'.ttf',import.meta.url));return [key,parse(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength))];})));
const style={font:'libertine',fontSize:9,lineHeight:1.12,letterSpacing:0,color:'#000000',bold:false,italic:false};
const run=(text,extra={})=>({text,style:{...style,...extra}});
const {parseTalentText}=await server.ssrLoadModule('/src/FormattedTalentText.tsx');
const {glyphPathData}=await server.ssrLoadModule('/src/glyph-path.ts');
const {cardRuns}=await server.ssrLoadModule('/src/FixedCardText.tsx');
const {stripInlineTalentIcons}=await server.ssrLoadModule('/src/inline-talent-icons.ts');

test('TeX exceptions and minimum fragments for PL/EN',()=>{assert.deepEqual(hyphenPoints('bynajmniej','pl'),[2,5]);assert.deepEqual(hyphenPoints('obligatory','en'),[5,6]);for(const p of hyphenPoints('interpunkcja','pl'))assert.ok(p>=2&&p<='interpunkcja'.length-2);});
test('same inputs produce identical lines and outlines',()=>{const runs=[run('Prymat potępieńca: ',{bold:true,letterSpacing:-.25}),run('Emanujesz aurą plugawej potęgi i czasem mówisz w echomenie. ',{italic:true,letterSpacing:-.4}),run('Masz Przewagę w atakach i egzorcyzmach przeciw upiorom.')];const box={width:170,height:90};const result=layoutCardText(runs,fonts,box,'pl');assert.ok(result.lines[0].text.startsWith('Prymat potępieńca:'));assert.deepEqual(result,layoutCardText(runs,fonts,box,'pl'));assert.ok(atomPositions(result.lines[0].atoms).some(({atom,x})=>atom.glyph.getPath(x,result.lines[0].baseline,atom.size).commands.length>0));});
test('nonbreaking spaces keep one-letter words with the next word',()=>{const layout=layoutCardText([run('tekst w domu i lesie z nim')],fonts,{width:27,height:100},'pl',false);for(const line of layout.lines)assert.ok(!/(?:^|\s)[wiouz]\s*$/i.test(line.text));});
test('long content reports overflow; short content fits',()=>{assert.equal(layoutCardText([run('tekst '.repeat(100))],fonts,{width:80,height:20},'pl').overflow,true);assert.equal(layoutCardText([run('tekst')],fonts,{width:80,height:20},'pl').overflow,false);});
test('manual newlines, all font faces, small caps and letter spacing',()=>{const result=layoutCardText([run('Pierwszy\n'),run('Drugi ',{bold:true}),run('Trzeci ',{italic:true}),run('Czwarty ',{bold:true,italic:true}),run('Stan',{smallCaps:true})],fonts,{width:500,height:100},'pl');assert.equal(result.lines.length,2);assert.equal(result.lines[0].text,'Pierwszy');const normal=layoutCardText([run('odstępy')],fonts,{width:200,height:100},'pl').width,tight=layoutCardText([run('odstępy',{letterSpacing:-.3})],fonts,{width:200,height:100},'pl').width;assert.ok(tight<normal);});
test('unsupported fonts and unavailable glyphs fail explicitly',()=>{assert.throws(()=>layoutCardText([run('tekst',{font:'arial'})],fonts,{width:100,height:100},'pl'),/Unsupported font/);assert.throws(()=>layoutCardText([run('🦄')],fonts,{width:100,height:100},'pl'),/Missing glyph/);});

test('cost marker is built-in, nests in formatting, malformed markers remain visible',()=>{
 assert.deepEqual(parseTalentText('2 [ikona-kosztu: koszt]',new Set()),['2\u00a0',{icon:'cost'}]);
 assert.deepEqual(parseTalentText('**[ikona-kosztu: koszt]**',new Set(['**'])),[{tag:'**',children:[{icon:'cost'}]}]);
 assert.deepEqual(parseTalentText('[ikona-kosztu: złoto]',new Set()),['[ikona-kosztu: złoto]']);
 assert.equal(stripInlineTalentIcons('[ikona-kosztu: koszt] [ikona-kosztu: złoto]'),' [ikona-kosztu: złoto]');
});
test('inline cost is one fixed-size atom, wraps without splitting and respects font size',()=>{
 const icon={text:'',icon:'cost',style};
 const result=layoutCardText([icon],fonts,{width:20,height:20},'pl');
 assert.equal(result.lines[0].atoms.length,1);assert.equal(result.lines[0].atoms[0].icon,'cost');assert.ok(Math.abs(result.width-9*1.05)<1e-8);
 const large=layoutCardText([{...icon,style:{...style,fontSize:18}}],fonts,{width:30,height:30},'pl');assert.ok(Math.abs(large.width-result.width*2)<1e-8);
 assert.equal(layoutCardText([icon],fonts,{width:3,height:20},'pl').overflow,true);
 const wrapped=layoutCardText([run('tekst '),icon,run(' tekst')],fonts,{width:25,height:100},'pl');assert.equal(wrapped.lines.flatMap(l=>l.atoms).filter(a=>a.icon).length,1);assert.ok(!wrapped.lines.map(l=>l.text).join('').includes('ikona-kosztu'));
});
test('formatted cost run inherits surrounding size and colour',()=>{
 const textStyle={font:'libertine',fontSize:12,lineHeight:1.1,letterSpacing:-.2,color:'#3e5074',bold:true,italic:true};
 const runs=cardRuns([{text:'4 [ikona-kosztu: koszt]',formatted:true,style:textStyle}],[],[]),icon=runs.find(r=>r.icon);
 assert.ok(icon);assert.equal(icon.style.fontSize,12);assert.equal(icon.style.color,'#3e5074');assert.equal(icon.style.bold,true);
});

test('a cost value stays on the same line as its symbol',()=>{const runs=cardRuns([{text:'wartość 5 [ikona-kosztu: koszt] na misję',formatted:true,style}],[],[]);const result=layoutCardText(runs,fonts,{width:30,height:100},'pl');const line=result.lines.find(l=>l.atoms.some(a=>a.icon));assert.ok(line.text.includes('5\u00a0\uFFFC'));});


test('glyph paths stay finite near integer boundaries with negative tracking',()=>{
 const glyph=fonts.regular.charToGlyph('y');
 for(const x of [99.56933593750001,100+Number.EPSILON*64,-1e-14,0,100]){const path=glyphPathData(glyph,x,18.0533,9);assert.ok(path.includes('Q'));assert.ok(path.length>100);assert.doesNotMatch(path,/NaN|Infinity/);}
 for(const tracking of [-.05,-.2,-.4,-1,0,.1]){const layout=layoutCardText([run('Klanyta, który uderzy w dzwon, ma ryzyko (7) wyzwolenia Mrocznego Instynktu.',{letterSpacing:tracking})],fonts,{width:171.67,height:100},'pl');for(const line of layout.lines)for(const {atom,x}of atomPositions(line.atoms)){const raw=atom.glyph.getPath(x,line.baseline,atom.size);assert.ok(raw.commands.every(c=>Object.entries(c).filter(([k])=>k!=='type').every(([,v])=>Number.isFinite(v))));assert.doesNotMatch(glyphPathData(atom.glyph,x,line.baseline,atom.size),/NaN|Infinity/);}}
});
