import { ElementId, TalentTemplate, clamp, fitBox, isHeaderRow, layoutHeader } from './talent-template-model';
export type Alignment = 'left'|'centerX'|'right'|'top'|'centerY'|'bottom';
export function selectionBounds(template: TalentTemplate, ids: ElementId[]) {
 const boxes=ids.map(id=>template.elements[id]);if(!boxes.length)return null;const x=Math.min(...boxes.map(b=>b.x)),y=Math.min(...boxes.map(b=>b.y));return {x,y,width:Math.max(...boxes.map(b=>b.x+b.width))-x,height:Math.max(...boxes.map(b=>b.y+b.height))-y};
}
export function alignElements(template: TalentTemplate, ids: ElementId[], alignment: Alignment): TalentTemplate {
 template=layoutHeader(template);const horizontal=['left','right','centerX'].includes(alignment);const r=ids.length===1?{x:0,y:0,...template.page}:selectionBounds(template,ids);if(!r)return template;const elements={...template.elements};
 for(const id of ids){const b=elements[id];if(b.locked||(horizontal&&isHeaderRow(id)))continue;const patch=alignment==='left'?{x:r.x}:alignment==='right'?{x:r.x+r.width-b.width}:alignment==='centerX'?{x:r.x+(r.width-b.width)/2}:alignment==='top'?{y:r.y}:alignment==='bottom'?{y:r.y+r.height-b.height}:{y:r.y+(r.height-b.height)/2};elements[id]=fitBox({...b,...patch},template.page);}return layoutHeader({...template,elements});
}
export function moveElements(template: TalentTemplate, ids: ElementId[], dx: number, dy: number): TalentTemplate {
 template=layoutHeader(template);const movable=ids.filter(id=>!template.elements[id].locked),bounds=selectionBounds(template,movable);if(!bounds)return template;const freeBounds=selectionBounds(template,movable.filter(id=>!isHeaderRow(id)));dx=freeBounds?clamp(dx,-freeBounds.x,template.page.width-freeBounds.x-freeBounds.width):0;dy=clamp(dy,-bounds.y,template.page.height-bounds.y-bounds.height);const elements={...template.elements};for(const id of movable){const b=elements[id];elements[id]=fitBox({...b,x:b.x+(isHeaderRow(id)?0:dx),y:b.y+dy},template.page);}return layoutHeader({...template,elements});
}