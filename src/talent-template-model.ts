import { factionAspectRatios, factions, type FactionCost, type Faction } from './factions';
import { costValueWidth } from './cost-value-layout';
import { GraphicVariantId, resolveGraphicVariant } from './graphic-variants';
import { blackColourId, primaryColourId, defaultTextColourId, whiteColourId } from './palette';
export const textRoles = ['title', 'flavor', 'mechanics'] as const;
export type TextRole = typeof textRoles[number];
export const elementIds = ['frame', 'hex', 'hexMark', 'costAmount', 'cost', 'factionSymbol', 'factionCostAmount', 'factionCost', 'play', 'play2', 'gift', 'specialRules', 'nonRenewable', 'exclusive', 'uses', 'once', 'restriction', 'version', 'textFlow', ...textRoles] as const;
export const colouredGraphics = ['hex','hexMark','cost','play','play2','gift','specialRules','uses','once'] as const;
export type ColouredGraphic = typeof colouredGraphics[number];
export const defaultGraphicColours = (): Record<ColouredGraphic,string> => ({hex:primaryColourId,hexMark:blackColourId,cost:primaryColourId,play:blackColourId,play2:blackColourId,gift:blackColourId,specialRules:blackColourId,uses:primaryColourId,once:primaryColourId});
export type ElementId = typeof elementIds[number];
export const fonts = ['libertine', 'georgia', 'arial'] as const;
export type TextStyle = { font: typeof fonts[number]; fontSize: number; lineHeight: number; letterSpacing: number; color: string; colourId?: string; bold: boolean; italic: boolean };
export type Box = { x: number; y: number; width: number; height: number; visible: boolean; locked: boolean; proportional?: boolean };
export type TalentTemplate = {factionSymbols?:Faction[]; factionCostVisible?:boolean; schemaVersion: 2; kind: 'talent-template'; name: string; page: { width: number; height: number }; background: string; backgroundVisible: boolean; graphicVariant: GraphicVariantId; costValue: number; factionCost:FactionCost; costTextColourId: string; headerRow: {x:number;centerY:number;gap:number}; frameColourId: string; graphicColourIds: Record<ColouredGraphic,string>; textMode: 'flow' | 'separate'; elements: Record<ElementId, Box>; styles: Record<TextRole | 'nonRenewable' | 'exclusive' | 'restriction' | 'version', TextStyle> };
// Dane talentu, nie szablonu: brak nadpisania oznacza dziedziczenie wartości domyślnej.
export type TalentTextOverrides = Partial<Record<TextRole, { lineHeight?: number }>>;
export function resolveTextStyle(template: TalentTemplate, role: TextRole, overrides: TalentTextOverrides = {}): TextStyle {
  const lineHeight = overrides[role]?.lineHeight;
  return { ...template.styles[role], ...(typeof lineHeight === 'number' && Number.isFinite(lineHeight) && lineHeight >= .75 && lineHeight <= 3 ? { lineHeight } : {}) };
}
export const fontFamilies = { libertine: '"KE Libertine", serif', georgia: 'Georgia, serif', arial: 'Arial, sans-serif' };
const box = (x: number, y: number, width: number, height: number, locked = false): Box => ({ x, y, width, height, visible: true, locked, proportional: false });
const style = (color = '#000000', bold = false, italic = false): TextStyle => ({ font: 'libertine', fontSize: 9, lineHeight: 1.12, letterSpacing: 0, color, colourId:defaultTextColourId(color), bold, italic });
export function newTemplate(): TalentTemplate {
  return shiftDefaultDecorations(layoutHeader({ schemaVersion: 2, kind: 'talent-template', name: 'Szablon talentu', page: { width: 185.67, height: 101.76 }, background: '#ffffff', backgroundVisible: true, graphicVariant:'ink',costValue:0,factionCost:{faction:'soldaci',cost:3},costTextColourId:primaryColourId, headerRow:{x:27.25,centerY:14.55,gap:4}, frameColourId: primaryColourId, graphicColourIds: defaultGraphicColours(), textMode: 'flow',
    elements: { factionSymbol:{...box(0,3.5,19,16.55),proportional:true}, factionCostAmount:box(0,5.475,12,18), factionCost:{...box(0,6.2,16,16.55),proportional:true}, exclusive: box(0,7.55,64,14), version: versionBox({width:185.67,height:101.76},true), frame: box(0, 0, 185.67, 101.76, true), hex: box(7, 3.5, 16.25, 22.1), hexMark: markerBox(box(7,3.5,16.25,22.1),{width:185.67,height:101.76}), costAmount: box(27.25,5.475,12,18), cost: {...box(27.25,6.2,16,16.55),proportional:true}, play2:{...box(0,3.5,22.1,22.1),visible:false,proportional:true}, play: {...box(27.25,3.5,22.1,22.1),proportional:true}, gift: box(27.25, 3.5, 22.1, 22.1), specialRules: {...box(53.35,3.5,12.6,22.1),proportional:true}, nonRenewable: box(53.35,7.55,50,14), uses: box(145.22, 10.975, 29.45, 7.15), restriction: box(88.67, 84.76, 90, 10), once: box(156.57, 3.5, 22.1, 22.1), textFlow: box(7, 26.6, 171.67, 71.66), title: box(7, 26.6, 171.67, 13), flavor: box(7, 40.6, 171.67, 25), mechanics: box(7, 66.6, 171.67, 31.66) },
    styles: { exclusive: {...style('#181818',true,true),fontSize:7}, version: {...style('#181818'),fontSize:5,lineHeight:1}, restriction: {...style('#181818',true,true),fontSize:7}, nonRenewable: {...style('#181818',true,true),fontSize:7}, title: style('#181818', true), flavor: style('#3e5074', false, true), mechanics: style() }
  }));
}
function markerBox(hex: Box, page: TalentTemplate['page'], percent = 90): Box { const size=Math.min(hex.width,hex.height)*percent/100;return fitBox({...box(hex.x+(hex.width-size)/2,hex.y+(hex.height-size)/2,size,size),proportional:true},page); }
function defaultRowLabel(gift: Box,page:TalentTemplate['page'],gap=4): Box { const available=page.width-gift.x-gift.width-gap;return fitBox({...box(gift.x+gift.width+gap,gift.y+(gift.height-14)/2,Math.max(1,Math.min(80,available)),14),visible:available>=1},page); }
export const headerRowIds = ['costAmount','cost','factionSymbol','factionCostAmount','factionCost','play','play2','gift','specialRules','nonRenewable','exclusive'] as const;
export function isHeaderRow(id: ElementId) { return (headerRowIds as readonly ElementId[]).includes(id); }
export function setHeaderCenter(template: TalentTemplate, value: number): TalentTemplate {
 const boxes=headerRowIds.map(id=>template.elements[id]);const delta=clamp(value-template.headerRow.centerY,-Math.min(...boxes.map(b=>b.y)),template.page.height-Math.max(...boxes.map(b=>b.y+b.height)));const elements={...template.elements};for(const id of headerRowIds)elements[id]=fitBox({...elements[id],y:elements[id].y+delta},template.page);return {...template,elements,headerRow:{...template.headerRow,centerY:template.headerRow.centerY+delta}};
}
export function layoutHeader(template: TalentTemplate): TalentTemplate {
 const elements={...template.elements};
 const symbols=template.factionSymbols??[template.factionCost.faction],symbol=elements.factionSymbol;
 elements.factionSymbol={...symbol,width:Math.max(1,Math.round((symbols.reduce((sum,f)=>sum+symbol.height*factionAspectRatios[f],0)+Math.max(0,symbols.length-1)*template.headerRow.gap)*1000)/1000),proportional:true};
 const active=headerRowIds.filter(id=>elements[id].visible);
 const settings=template.headerRow || {x:elements.gift.x,centerY:elements.gift.y+elements.gift.height/2,gap:4};
 const width=active.reduce((total,id)=>total+(id==='costAmount'?costValueWidth(elements[id],template.costValue):id==='factionCostAmount'?costValueWidth(elements[id],template.factionCost.cost):elements[id].width),0)+Math.max(0,active.length-1-(elements.cost.visible&&elements.costAmount.visible?1:0))*settings.gap+(elements.cost.visible&&elements.costAmount.visible?1:0);

 const height=Math.max(1,...active.map(id=>elements[id].height));
 const row={...settings,x:Math.round(clamp(settings.x,0,template.page.width)*1000)/1000,centerY:Math.round(clamp(settings.centerY,0,template.page.height)*1000)/1000};
 let x=row.x;
 for(const id of active){elements[id]={...elements[id],x:Math.round(x*1000)/1000};x+=(id==='costAmount'?costValueWidth(elements[id],template.costValue):id==='factionCostAmount'?costValueWidth(elements[id],template.factionCost.cost):elements[id].width)+((id==='costAmount'&&elements.cost.visible)||(id==='factionCostAmount'&&elements.factionCost.visible)?1:(id==='factionSymbol'&&elements.factionCostAmount.visible)?1:row.gap);}
 return {...template,headerRow:row,elements};
}
export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const round = (n: number) => Math.round(n * 1000) / 1000;
export function fitBox(value: Box, page: TalentTemplate['page']): Box {
  const width = round(clamp(value.width, 1, page.width)), height = round(clamp(value.height, 1, page.height));
  return { ...value, width, height, x: round(clamp(value.x, 0, page.width - width)), y: round(clamp(value.y, 0, page.height - height)) };
}
export function resizeBox(original: Box, page: TalentTemplate['page'], size: { width?: number; height?: number }): Box {
  if (!original.proportional) return fitBox({ ...original, ...size }, page);
  const requested = size.width !== undefined ? size.width / original.width : (size.height ?? original.height) / original.height;
  const minScale = Math.max(1 / original.width, 1 / original.height);
  const maxScale = Math.min((page.width - original.x) / original.width, (page.height - original.y) / original.height);
  const scale = clamp(requested, minScale, maxScale);
  return { ...original, width: round(original.width * scale), height: round(original.height * scale) };
}
export function resizePage(template: TalentTemplate, page: TalentTemplate['page']): TalentTemplate {
  return { ...template, page, elements: Object.fromEntries(elementIds.map(id => [id, fitBox(template.elements[id], page)])) as TalentTemplate['elements'] };
}
function record(v: unknown): Record<string, unknown> { if (!v || typeof v !== 'object' || Array.isArray(v)) throw new Error('object'); return v as Record<string, unknown>; }
function number(v: unknown, min: number, max: number): number { if (typeof v !== 'number' || !Number.isFinite(v) || v < min || v > max) throw new Error('number'); return v; }
function boolean(v: unknown): boolean { if (typeof v !== 'boolean') throw new Error('boolean'); return v; }
function color(v: unknown): string { if (typeof v !== 'string' || !/^#[a-f0-9]{6}$/i.test(v)) throw new Error('color'); return v; }
function name(v: unknown): string { if (typeof v !== 'string' || !v.trim() || v.length > 120) throw new Error('name'); return v; }
function splitFactionBox(id:string,source:Record<string,unknown>,page:TalentTemplate['page']):Box {
 const primary=(source[id==='factionCostAmount'?'costAmount':'cost']??box(0,6.2,16,16.55)) as Box;
 const visible=(source.factionCost as Box|undefined)?.visible??true;
 return fitBox({...primary,x:0,visible,locked:false,...(id==='factionSymbol'?{width:primary.height*1.16,proportional:true}:{})},page);
}
export function parseTemplate(input: unknown): TalentTemplate {
  const v = record(input);
  if (v.kind !== 'talent-template') throw new Error('kind');
  const p = record(v.page), page = { width: number(p.width, 50, 600), height: number(p.height, 50, 600) };
  if (v.schemaVersion === 1) {
    const padding = number(v.padding, 0, 30), vertical = number(v.verticalPadding, 0, 30), size = number(v.statusHeight, 4, 30), gap = number(v.iconGap, 0, 20), textGap = number(v.textGap, 0, 20);
    const bodyY = vertical + size * 1.7 + textGap, bodyHeight = page.height - bodyY - vertical, bodyWidth = page.width - padding * 2;
    if (bodyHeight < 1 || bodyWidth < 1) throw new Error('legacy-layout');
    const base = newTemplate(), fontSize = number(v.fontSize, 9, 24), lineHeight = number(v.lineHeight, 1, 2);
    const textColor = color(v.color), flavorColor = color(v.flavorColor), square = size * .55;
    const elements: TalentTemplate['elements'] = { factionSymbol:{...box(0,3.5,19,16.55),proportional:true}, factionCostAmount:box(0,5.475,12,18), factionCost:{...box(0,6.2,16,16.55),proportional:true}, exclusive: box(0,7.55,Math.min(64,page.width),14), version: versionBox(page), costAmount: fitBox(box(padding+size*1.25+gap,vertical,8,16.55),page), restriction: restrictionBox(page),
      frame: { ...box(0, 0, page.width, page.height, true), visible: boolean(v.showFrame) },
      hex: box(padding, vertical, size * 1.25, size * 1.7), hexMark: markerBox(box(padding,vertical,size*1.25,size*1.7),page), cost: {...fitBox(box(padding+size*1.25+gap,vertical,16,16.55),page),proportional:true}, play2:{...box(0,3.5,22.1,22.1),visible:false,proportional:true}, play: {...box(padding+size*1.25+gap,vertical,size*1.7,size*1.7),proportional:true}, gift: box(padding + size * 1.25 + gap, vertical, size * 1.7, size * 1.7), specialRules: {...box(padding+size*1.25+gap,vertical,size*.97,size*1.7),proportional:true}, nonRenewable: defaultRowLabel(box(padding+size*1.25+gap,vertical,size*1.7,size*1.7),page),
      uses: box(page.width - padding - 3 * (square + gap), vertical + (size * 1.7 - square) / 2, 3 * square + 2 * gap, square), once: box(page.width - padding - size * 1.7, vertical, size * 1.7, size * 1.7),
      textFlow: box(padding, bodyY, bodyWidth, bodyHeight), title: box(padding, bodyY, bodyWidth, bodyHeight * .2), flavor: box(padding, bodyY + bodyHeight * .2, bodyWidth, bodyHeight * .35), mechanics: box(padding, bodyY + bodyHeight * .55, bodyWidth, bodyHeight * .45)
    };
    const converted: TalentTemplate = { ...base, name: name(v.name), page, background: color(v.background), elements: Object.fromEntries(elementIds.map(id => [id, fitBox(elements[id], page)])) as TalentTemplate['elements'], styles: { exclusive: base.styles.exclusive, version: base.styles.version, restriction: base.styles.restriction, nonRenewable: base.styles.nonRenewable, title: { ...base.styles.title, fontSize, lineHeight, color: textColor }, flavor: { ...base.styles.flavor, fontSize, lineHeight, color: flavorColor }, mechanics: { ...base.styles.mechanics, fontSize, lineHeight, color: textColor } } };
    converted.headerRow={x:elements.gift.x,centerY:elements.gift.y+elements.gift.height/2,gap:4};

  for(const added of ['cost','specialRules','play'] as const){const active=headerRowIds.filter(id=>converted.elements[id].visible);if(active.reduce((sum,id)=>sum+converted.elements[id].width,0)+Math.max(0,active.length-1)*converted.headerRow.gap>page.width-converted.headerRow.x)converted.elements[added].visible=false;}
    return layoutHeader(converted);
  }
  if (v.schemaVersion !== 2 || !['flow', 'separate'].includes(v.textMode as string)) throw new Error('version/mode');
  const sourceElements = record(v.elements), sourceStyles = record(v.styles);
  const rowSource=v.headerRow===undefined?null:record(v.headerRow);
  const giftSource=record(sourceElements.gift);
  const headerRow=rowSource?{x:number(rowSource.x,0,page.width),centerY:number(rowSource.centerY,0,page.height),gap:number(rowSource.gap,0,30)}:{x:number(giftSource.x,0,page.width),centerY:number(giftSource.y,0,page.height)+number(giftSource.height,1,page.height)/2,gap:4};
  const elements = Object.fromEntries(elementIds.map(id => {
    const b = id==='play2' && sourceElements[id]===undefined ? {...(sourceElements.play as Box || box(0,3.5,22.1,22.1)),visible:false,locked:false} : (['factionSymbol','factionCostAmount','factionCost'].includes(id) && (sourceElements[id] === undefined || sourceElements.factionSymbol === undefined)) ? splitFactionBox(id,sourceElements,page) : id === 'exclusive' && sourceElements[id] === undefined ? box(0,7.55,Math.min(64,page.width),14) : id === 'version' && sourceElements[id] === undefined ? versionBox(page) : id === 'costAmount' && sourceElements[id] === undefined ? splitCostBox(sourceElements.cost as Box || {...box(Number(giftSource.x),Number(giftSource.y),28,16.55)},page) : id === 'restriction' && sourceElements[id] === undefined ? restrictionBox(page) : id === 'cost' && sourceElements[id] === undefined ? {...fitBox(box(Number(giftSource.x),Number(giftSource.y)+(Number(giftSource.height)-16.55)/2,28,16.55),page),proportional:true} : id === 'specialRules' && sourceElements[id] === undefined ? {...fitBox(box(Number(giftSource.x),Number(giftSource.y),12.6,22.1),page),proportional:true} : id === 'play' && sourceElements[id] === undefined ? {...fitBox(box(Number(giftSource.x),Number(giftSource.y),22.1,22.1),page),proportional:true} : id === 'nonRenewable' && sourceElements[id] === undefined ? defaultRowLabel(record(sourceElements.gift) as Box,page,headerRow.gap) : id === 'hexMark' && sourceElements[id] === undefined ? markerBox(record(sourceElements.hex) as Box,page,v.hexMark === undefined ? 90 : number(record(v.hexMark).size,10,150)) : record(sourceElements[id]);
    const result: Box = { x: number(b.x, 0, isHeaderRow(id) ? 6000 : page.width), y: number(b.y, 0, page.height), width: number(b.width, 1, page.width), height: number(b.height, 1, page.height), visible: boolean(b.visible), locked: boolean(b.locked), proportional: b.proportional === undefined ? false : boolean(b.proportional) };
    if ((!isHeaderRow(id) && result.x + result.width > page.width + .001) || result.y + result.height > page.height + .001) throw new Error('bounds');
    return [id, result];
  })) as TalentTemplate['elements'];
  if(sourceElements.costAmount===undefined){const oldCost=elements.cost;const amount=elements.costAmount;elements.cost={...oldCost,width:Math.max(1,oldCost.width-(amount.visible?amount.width+headerRow.gap:0))};}
  if((elements.costAmount.width===8&&elements.costAmount.height===16.55)||(elements.costAmount.width===7&&elements.costAmount.height===10))elements.costAmount=fitBox({...elements.costAmount,width:12,height:18,y:Math.max(0,elements.cost.y+(elements.cost.height-18)/2)},page);
  if(sourceElements.cost===undefined && elements.nonRenewable.width===80){const labelStyle=sourceStyles.nonRenewable===undefined?{font:'libertine',fontSize:7,bold:true,italic:true,letterSpacing:0}:record(sourceStyles.nonRenewable);if(labelStyle.font==='libertine'&&labelStyle.fontSize===7&&labelStyle.bold===true&&labelStyle.italic===true&&labelStyle.letterSpacing===0)elements.nonRenewable.width=50;}
  for(const added of ['cost','specialRules','play'] as const)if(sourceElements[added]===undefined){const active=headerRowIds.filter(id=>elements[id].visible);const width=active.reduce((sum,id)=>sum+elements[id].width,0)+Math.max(0,active.length-1)*headerRow.gap;if(width>page.width-headerRow.x)elements[added].visible=false;}
  const styles = Object.fromEntries(([...textRoles,'nonRenewable', 'exclusive','restriction','version'] as const).map(role => {
    const s = role === 'version' && sourceStyles[role] === undefined ? {...style('#181818'),fontSize:5,lineHeight:1} : (role === 'nonRenewable' || role === 'exclusive' || role === 'restriction') && sourceStyles[role] === undefined ? {...style('#181818',true,true),fontSize:7} : record(sourceStyles[role]);
    if (!fonts.includes(s.font as TextStyle['font'])) throw new Error('font');
    const colourId=s.colourId ?? defaultTextColourId(String(s.color));if(colourId!==undefined && (typeof colourId!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(colourId)))throw new Error('text-colour');
    const result: TextStyle = { colourId, font: s.font as TextStyle['font'], fontSize: number(s.fontSize, role === 'version' || role === 'nonRenewable' || role === 'exclusive' || role === 'restriction' ? 5 : 9, 48), lineHeight: number(s.lineHeight, .75, 3), letterSpacing: number(s.letterSpacing, -2, 10), color: color(s.color), bold: boolean(s.bold), italic: boolean(s.italic) };
    return [role, result];
  })) as TalentTemplate['styles'];
  if(v.costValue!==undefined && !Number.isInteger(v.costValue))throw new Error('cost-integer');
  const graphicColourIds = defaultGraphicColours();
  if (v.graphicColourIds !== undefined) { const source = record(v.graphicColourIds); for (const id of colouredGraphics) { const value = id==='play2' && source[id]===undefined ? (source.play ?? blackColourId) : id === 'cost' && source[id] === undefined ? primaryColourId : (id === 'play' || id === 'specialRules') && source[id] === undefined ? blackColourId : id === 'hexMark' && source[id] === undefined ? (v.hexMark === undefined ? blackColourId : record(v.hexMark).colourId) : source[id]; if (typeof value !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(value)) throw new Error('graphic-colour'); graphicColourIds[id] = value; } }
  return layoutHeader({ schemaVersion: 2, kind: 'talent-template', name: name(v.name), page, graphicVariant:resolveGraphicVariant(v), costValue:v.costValue===undefined?0:number(v.costValue,0,10),factionCost:v.factionCost===undefined?{faction:'soldaci',cost:3}:(()=>{const f=record(v.factionCost);if(!factions.includes(f.faction as Faction)||!Number.isInteger(f.cost))throw Error('faction-cost');return {faction:f.faction as Faction,cost:number(f.cost,0,10)};})(),costTextColourId:sourceElements.costAmount===undefined||v.costTextColourId===undefined?primaryColourId:(() => {if(typeof v.costTextColourId!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(v.costTextColourId))throw new Error('cost-ink');return v.costTextColourId;})(),headerRow, graphicColourIds, background: color(v.background), backgroundVisible: v.backgroundVisible === undefined ? true : boolean(v.backgroundVisible), frameColourId: v.frameColourId === undefined ? primaryColourId : (() => { if (typeof v.frameColourId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(v.frameColourId)) throw new Error('frame-colour'); return v.frameColourId; })(), textMode: v.textMode as TalentTemplate['textMode'], elements, styles });
}
export function visibleElements(template: TalentTemplate): ElementId[] {
  return elementIds.filter(id => template.textMode === 'flow' ? !textRoles.includes(id as TextRole) : id !== 'textFlow');
}

function restrictionBox(page: TalentTemplate['page']): Box { return box(Math.max(0,page.width-97), Math.max(0,page.height-17), Math.min(90,page.width),10); }
// Ograniczenie jest warstwą nad treścią; nie zmienia dostępnej wysokości mechaniki.
export function bodyTextBox(template: TalentTemplate, id: ElementId): Box { return template.elements[id]; }

function splitCostBox(cost:Box,page:TalentTemplate['page']):Box {return fitBox({...cost,width:Math.max(1,cost.width*8/28),visible:cost.visible&&cost.width>=6,locked:false,proportional:true},page);}

function shiftDefaultDecorations(template:TalentTemplate):TalentTemplate {
 const elements={...template.elements};
 for(const id of ['hex','hexMark','costAmount','cost','play','play2','gift','specialRules','nonRenewable', 'exclusive','uses','once'] as const)elements[id]=fitBox({...elements[id],y:elements[id].y-1},template.page);
 elements.restriction=fitBox({...elements.restriction,x:template.page.width-elements.restriction.width-4,y:template.page.height-elements.restriction.height-3.5},template.page);
 return {...template,elements,headerRow:{...template.headerRow,centerY:template.headerRow.centerY-1}};
}
function versionBox(page:TalentTemplate['page'],visible=false):Box {return {...box(7,page.height-9,Math.min(90,page.width-14),6),visible};}
