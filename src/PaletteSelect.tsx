import { useEffect, useId, useRef, useState } from 'react';
import { Colour } from './styles-colors-model';
import './PaletteSelect.css';
export default function PaletteSelect({ label, colours, value, onChange, disabled = false, unavailable }: { label: string; colours: Colour[]; value: string; onChange: (id: string) => void; disabled?: boolean; unavailable: string }) {
 const [open, setOpen] = useState(false); const root = useRef<HTMLDivElement>(null), trigger = useRef<HTMLButtonElement>(null), options = useRef<(HTMLButtonElement | null)[]>([]); const id = useId(); const selected = colours.find(c => c.id === value);
 useEffect(() => { const outside = (e: PointerEvent) => { if (e.target instanceof Node && !root.current?.contains(e.target)) setOpen(false); }; document.addEventListener('pointerdown',outside); return () => document.removeEventListener('pointerdown',outside); }, []);
 function show(index = Math.max(0,colours.findIndex(c => c.id === value))) { setOpen(true); requestAnimationFrame(() => options.current[index]?.focus()); }
 function choose(id: string) { onChange(id); setOpen(false); trigger.current?.focus(); }
 return <div ref={root} className="kp-select" onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }} onKeyDown={e => {
  if (e.key === 'Escape') { e.stopPropagation(); setOpen(false); trigger.current?.focus(); }
  if (!['ArrowDown','ArrowUp','Home','End'].includes(e.key) || disabled || !colours.length) return;
  e.preventDefault(); const current = options.current.findIndex(el => el === document.activeElement); const index = e.key === 'Home' ? 0 : e.key === 'End' ? colours.length-1 : !open ? Math.max(0,colours.findIndex(c => c.id === value)) : (Math.max(0,current)+(e.key === 'ArrowDown' ? 1 : -1)+colours.length)%colours.length;
  show(index);
 }}><span id={id+'-label'} className="kp-label">{label}</span><button ref={trigger} type="button" className="kp-trigger" role="combobox" aria-labelledby={id+'-label'} aria-haspopup="listbox" aria-expanded={open} aria-controls={id+'-list'} disabled={disabled || !colours.length} onClick={() => open ? setOpen(false) : show()}><span className="kp-swatch" style={{background:selected?.value || 'transparent'}} aria-hidden="true" /><span className="kp-name">{selected?.name || unavailable}</span>{selected && <span className="kp-hex">{selected.value.toUpperCase()}</span>}<span aria-hidden="true">⌄</span></button>
 {open && <div id={id+'-list'} className="kp-options" role="listbox" aria-labelledby={id+'-label'}>{colours.map((colour,index) => <button ref={el => { options.current[index]=el; }} key={colour.id} type="button" role="option" aria-selected={colour.id === value} tabIndex={-1} onClick={() => choose(colour.id)}><span className="kp-swatch" style={{background:colour.value}} aria-hidden="true" /><span className="kp-name">{colour.name}</span><span className="kp-hex">{colour.value.toUpperCase()}</span>{colour.id === value && <span aria-hidden="true">✓</span>}</button>)}</div>}
 </div>;
}