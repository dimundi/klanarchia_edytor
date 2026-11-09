import { RefObject,useLayoutEffect,useState } from 'react';
import { collectTalentValidation, LiveTalentValidation } from './talent-validation';
import { Annotation } from './styles-colors-model';
export function useTalentValidation(root:RefObject<HTMLDivElement|null>,ready:boolean,title:string,mechanics:string,annotations:Annotation[],revision:number|null,paletteError:boolean){
 const [report,setReport]=useState<LiveTalentValidation>({complete:false,engineVersion:1,catalogueRevision:0,issues:[]});
 useLayoutEffect(()=>{let frame=0,alive=true;const measure=()=>{frame=0;if(!alive)return;const next=collectTalentValidation(ready?root.current:null,title,mechanics,annotations.map(a=>a.tag),revision,paletteError);setReport(old=>JSON.stringify(old)===JSON.stringify(next)?old:next);};const schedule=()=>{if(!frame)frame=requestAnimationFrame(measure);};const observer=new MutationObserver(schedule);if(root.current)observer.observe(root.current,{subtree:true,childList:true,attributes:true,characterData:true});schedule();return()=>{alive=false;cancelAnimationFrame(frame);observer.disconnect();};},[root,ready,title,mechanics,annotations,revision,paletteError]);
 return report;
}
