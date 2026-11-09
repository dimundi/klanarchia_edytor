import { useId } from 'react';
import { Box } from './talent-template-model';
export default function TintedGraphic({ source, box, colour, stretch = false }: { source: string; box: Pick<Box,'x'|'y'|'width'|'height'>; colour: string; stretch?: boolean }) {
 const id='ke-graphic-'+useId().replace(/[^a-zA-Z0-9_-]/g,'');
 return <g data-graphic-colour={colour} pointerEvents="none"><defs><mask id={id} maskUnits="userSpaceOnUse" x={box.x} y={box.y} width={box.width} height={box.height} style={{maskType:'alpha'}}><image href={source} x={box.x} y={box.y} width={box.width} height={box.height} preserveAspectRatio={stretch ? 'none' : 'xMidYMid meet'} /></mask></defs><rect x={box.x} y={box.y} width={box.width} height={box.height} fill={colour} mask={`url(#${id})`} /></g>;
}