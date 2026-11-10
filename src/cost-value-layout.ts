import { handDrawnDigitBounds } from './hand-drawn-digits';
export function costValueWidth(box:{width:number;height:number},value:number){
 if(value!==10)return box.width;
 const one=handDrawnDigitBounds[1].split(' ').map(Number),zero=handDrawnDigitBounds[0].split(' ').map(Number);
 return Math.max(box.width,(one[2]+2+zero[2])*Math.min(box.width/zero[2],box.height/zero[3]));
}
