import pl from './assets/hyphenation/hyph-pl.tex?raw';
import en from './assets/hyphenation/hyph-en-us.tex?raw';
type Node = { next:Map<string,Node>; weights?:number[] };
function dictionary(source:string,right:number){
 const clean=source.replace(/%[^\n]*/g,'');const root:Node={next:new Map()};
 for(const block of clean.matchAll(/\\patterns\s*\{([^}]*)\}/g))for(const pattern of block[1].trim().split(/\s+/)){
  let node=root;const weights=[0];let index=0;
  for(const c of pattern){if(/[0-9]/.test(c))weights[index]=Number(c);else{if(!node.next.has(c))node.next.set(c,{next:new Map()});node=node.next.get(c)!;weights[++index]=0;}}
  node.weights=weights;
 }
 const exceptions=new Map<string,number[]>();for(const block of clean.matchAll(/\\hyphenation\s*\{([^}]*)\}/g))for(const word of block[1].trim().split(/\s+/)){let count=0;const points:number[]=[];for(const c of word){if(c==='-')points.push(count);else count++;}exceptions.set(word.replaceAll('-',''),points);}
 const cache=new Map<string,number[]>();
 return (word:string)=>{const lower=word.toLowerCase();if(exceptions.has(lower))return exceptions.get(lower)!;if(cache.has(lower))return cache.get(lower)!;const text='.'+lower+'.',weights=new Array(text.length+1).fill(0);for(let i=0;i<text.length;i++){let node=root;for(let j=i;j<text.length;j++){const next=node.next.get(text[j]);if(!next)break;node=next;if(node.weights)node.weights.forEach((v,k)=>{weights[i+k]=Math.max(weights[i+k],v);});}}const points:number[]=[];for(let i=2;i<=word.length-right;i++)if(weights[i+1]%2===1)points.push(i);if(cache.size>5000)cache.clear();cache.set(lower,points);return points;};
}
const dictionaries={pl:dictionary(pl,2),en:dictionary(en,3)};
export function hyphenPoints(word:string,language:'pl'|'en'){return dictionaries[language](word);}
