// Granice słów Unicode: końcowe „w” w „przodków” nie jest osobnym przyimkiem.
export function polishSpacing(value:string):string {
 return value.replace(/(?<=[\p{L}\p{N}_][aiouwz])\u00a0/giu,' ').replace(/(?<![\p{L}\p{N}_])([aiouwz])[ \t\u00a0]+(?=\S)/giu,'$1\u00a0');
}
