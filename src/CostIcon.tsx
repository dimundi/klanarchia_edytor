import TintedGraphic from './TintedGraphic';
import { Box } from './talent-template-model';
import { GraphicVariantId, graphicVariants } from './graphic-variants';
export default function CostIcon({box,colour,variant='ink'}:{box:Pick<Box,'x'|'y'|'width'|'height'>;colour:string;variant?:GraphicVariantId}) {return <g data-cost-icon="true" data-graphic-variant={variant}><TintedGraphic source={graphicVariants[variant].assets.cost} box={box} colour={colour}/></g>;}
export function InlineCostIcon({label='Koszt',variant='ink'}:{label?:string;variant?:GraphicVariantId}) {const source=graphicVariants[variant].assets.cost;return <span role="img" aria-label={label} style={{display:'inline-block',width:'1.05em',height:'1em',verticalAlign:'-.14em',backgroundColor:'currentColor',maskImage:`url(${source})`,WebkitMaskImage:`url(${source})`,maskSize:'contain',WebkitMaskSize:'contain',maskRepeat:'no-repeat',WebkitMaskRepeat:'no-repeat',maskPosition:'center',WebkitMaskPosition:'center'}}/>;}
