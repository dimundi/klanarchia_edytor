import { RefObject, useLayoutEffect, useState } from 'react';
export function useTalentOverflow(stage: RefObject<HTMLDivElement | null>, ready: boolean) {
 const [overflow,setOverflow]=useState(false);
 useLayoutEffect(()=>{
  const root=stage.current;if(!root||!ready){setOverflow(false);return;}
  let frame=0,alive=true;
  const measure=()=>{frame=0;if(!alive)return;const text=root.querySelector<HTMLElement>('[data-talent-body]');setOverflow(!!text&&text.clientWidth>0&&text.clientHeight>0&&(text.scrollHeight>text.clientHeight+1||text.scrollWidth>text.clientWidth+1));};
  const schedule=()=>{if(!frame&&alive)frame=requestAnimationFrame(measure);};
  const resize=new ResizeObserver(schedule);resize.observe(root);const text=root.querySelector<HTMLElement>('[data-talent-body]');if(text)resize.observe(text);
  const mutation=new MutationObserver(schedule);mutation.observe(root,{subtree:true,childList:true,characterData:true,attributes:true});
  document.fonts.ready.then(schedule);document.fonts.addEventListener('loadingdone',schedule);schedule();
  return()=>{alive=false;cancelAnimationFrame(frame);resize.disconnect();mutation.disconnect();document.fonts.removeEventListener('loadingdone',schedule);};
 },[stage,ready]);
 return overflow;
}
