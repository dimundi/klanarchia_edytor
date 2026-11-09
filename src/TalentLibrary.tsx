import TalentListContent, { TalentListSymbols } from './TalentListContent';
import { usePalette } from './palette';
import { issueMessage } from './talent-validation';
import { readTalent, readTalents, TalentListItem, TalentRecord } from './talent-api';
import TalentEditor from './TalentEditor';
import { useEffect, useState } from 'react';
import { request, ApiError } from './editor-api';
import './talent-library.css';
type Category = { id: string; parentId: string | null; name: string; talentCount?:number };
export default function TalentLibrary({ language, active }: { language: 'pl' | 'en'; active: boolean }) {
 const pl = language === 'pl', palette=usePalette(language);
 const [editing, setEditing] = useState<{name:string;categoryId:string;record?:TalentRecord} | null>(null);
 const [items, setItems] = useState<Category[]>([]), [loaded, setLoaded] = useState(false), [busy, setBusy] = useState(false);
 const [error, setError] = useState(''), [current, setCurrent] = useState<string | null>(null), [selected, setSelected] = useState<string[]>([]), [collapsed, setCollapsed] = useState<string[]>([]);
 const [form, setForm] = useState<{ parentId: string | null } | null>(null), [name, setName] = useState('');
 const [talents,setTalents]=useState<TalentListItem[]>([]),[talentsLoading,setTalentsLoading]=useState(false),[talentsError,setTalentsError]=useState(false),[reload,setReload]=useState(0),[openingId,setOpeningId]=useState<string|null>(null);
 const category = items.find(i => i.id === current), parent = items.find(i => i.id === category?.parentId);
 async function load() {
  setBusy(true); setError('');
  try { const result = await request<{items: Category[]}>(`talent-categories?language=${language}`); setItems(result.items); setCurrent(old => old ?? result.items.find(i => !i.parentId)?.id ?? null); setLoaded(true); }
  catch { setError(pl ? 'Nie udało się pobrać biblioteki.' : 'Could not load the library.'); }
  finally { setBusy(false); }
 }
 useEffect(() => { if (active && !loaded) void load(); }, [active, loaded]);
 useEffect(()=>{if(!active||editing||!current)return;let alive=true;setTalentsLoading(true);setTalentsError(false);setTalents([]);readTalents(current,language).then(result=>{if(alive)setTalents(result);}).catch(()=>{if(alive)setTalentsError(true);}).finally(()=>{if(alive)setTalentsLoading(false);});return()=>{alive=false;};},[active,editing,current,language,reload]);
 async function openTalent(item:TalentListItem){if(openingId)return;setOpeningId(item.id);setError('');try{const record=await readTalent(item.id,language);setEditing({name:items.find(i=>i.id===record.categoryId)?.name||'',categoryId:record.categoryId,record});}catch{setError(pl?'Nie udało się otworzyć talentu.':'Could not open the talent.');}finally{setOpeningId(null);}}
 function toggle(id: string) {
  const ids = [id, ...items.filter(i => i.parentId === id).map(i => i.id)];
  setSelected(old => ids.every(key => old.includes(key)) ? old.filter(key => !ids.includes(key)) : [...new Set([...old, ...ids])]);
 }
 async function create(event: React.FormEvent) {
  event.preventDefault(); if (!form || busy) return; setBusy(true); setError('');
  try {
   const item = await request<Category>(`talent-categories?language=${language}`, 'POST', { name: name.trim(), parentId: form.parentId });
   setItems(old => [...old, item]); setCurrent(item.id); setCollapsed(old => old.filter(id => id !== item.parentId)); setForm(null); setName('');
  } catch (e) { setError(e instanceof ApiError && e.status === 409 ? (pl ? 'Taka nazwa już istnieje w tej grupie.' : 'This name already exists in this group.') : (pl ? 'Nie udało się zapisać grupy.' : 'Could not save the group.')); }
  finally { setBusy(false); }
 }
 function row(item: Category, child = false) {
  return <div key={item.id} className={`ke-library-row${child ? ' is-child' : ''}${current === item.id ? ' is-current' : ''}`}>
   <input type="checkbox" aria-label={`${pl ? 'Zaznacz' : 'Select'} ${item.name}`} checked={selected.includes(item.id)} onChange={() => toggle(item.id)} />
   {!child && <button type="button" className="ke-library-disclosure" aria-label={`${collapsed.includes(item.id) ? (pl ? 'Rozwiń' : 'Expand') : (pl ? 'Zwiń' : 'Collapse')} ${item.name}`} aria-expanded={!collapsed.includes(item.id)} onClick={() => setCollapsed(old => old.includes(item.id) ? old.filter(id => id !== item.id) : [...old, item.id])}>{collapsed.includes(item.id) ? '▸' : '▾'}</button>}
   <button type="button" className="ke-library-name" aria-current={current === item.id ? 'true' : undefined} onClick={() => { setCurrent(item.id); setForm(null); }}>{item.name}</button>
   <span className="ke-library-count">{item.talentCount??0}</span>
  </div>;
 }
 if (editing) return <TalentEditor language={language} subgroup={editing.name} categoryId={editing.categoryId} initial={editing.record} onSaved={()=>{setReload(v=>v+1);void load();}} onClose={() => setEditing(null)} />;
 return <div className="ke-library">
  <aside className="ke-library-sidebar" aria-label={pl ? 'Grupy talentów' : 'Talent groups'}>
   <div className="ke-library-tools"><strong>{pl ? 'Grupy talentów' : 'Talent groups'}</strong><button type="button" onClick={() => { setForm({parentId: null}); setName(''); }}>{pl ? '+ Grupa' : '+ Group'}</button></div>
   {items.filter(i => !i.parentId).map(group => <div key={group.id}>{row(group)}{!collapsed.includes(group.id) && items.filter(i => i.parentId === group.id).map(i => row(i, true))}</div>)}
   {busy && !loaded && <p role="status">{pl ? 'Wczytywanie…' : 'Loading…'}</p>}
   <div className="ke-library-selection"><span>{pl ? 'Zaznaczono' : 'Selected'}: {selected.length}</span><button type="button" disabled={!selected.length} onClick={() => setSelected([])}>{pl ? 'Odznacz' : 'Clear'}</button></div>
  </aside>
  <section className="ke-library-content" aria-label={pl ? 'Zawartość biblioteki' : 'Library contents'}>
   <div className="ke-library-tools"><div>{parent && <small>{parent.name} / </small>}<h3>{category?.name || (pl ? 'Biblioteka talentów' : 'Talent library')}</h3></div>
    {category?.parentId && <button type="button" onClick={() => setEditing({name:category.name,categoryId:category.id})}>{pl ? '+ Utwórz talent' : '+ Create talent'}</button>}
    {category && !category.parentId && <button type="button" onClick={() => {setForm({parentId: category.id}); setName('');}}>{pl ? '+ Podgrupa' : '+ Subgroup'}</button>}
   </div>
   {error && <div role="alert"><p>{error}</p>{!loaded && <button type="button" disabled={busy} onClick={() => void load()}>{pl ? 'Spróbuj ponownie' : 'Retry'}</button>}</div>}
   {form && <form className="ke-library-form" onSubmit={create}>
    <label>{form.parentId ? (pl ? 'Nazwa podgrupy' : 'Subgroup name') : (pl ? 'Nazwa grupy' : 'Group name')}<input autoFocus maxLength={120} required value={name} onChange={e => setName(e.target.value)} /></label>
    <button type="submit" disabled={busy || !name.trim()}>{busy ? (pl ? 'Zapisywanie…' : 'Saving…') : (pl ? 'Utwórz' : 'Create')}</button>
    <button type="button" disabled={busy} onClick={() => setForm(null)}>{pl ? 'Anuluj' : 'Cancel'}</button>
   </form>}
   {loaded && !form && <>
    {talentsLoading?<p role="status">{pl?'Wczytywanie talentów…':'Loading talents…'}</p>:talentsError?<div role="alert"><p>{pl?'Nie udało się pobrać talentów.':'Could not load talents.'}</p><button type="button" onClick={()=>setReload(v=>v+1)}>{pl?'Spróbuj ponownie':'Retry'}</button></div>:talents.length?<div className="ke-talent-list">{talents.map(item=><article key={item.id} data-talent-id={item.id}><div className="ke-talent-list-body"><div className="ke-talent-list-meta"><h4><button type="button" className="ke-talent-title" disabled={openingId!==null} onClick={()=>void openTalent(item)}>{item.name||(pl?'Bez tytułu':'Untitled')}</button></h4><code className="ke-talent-code">{item.versionCode}</code><small>{items.find(i=>i.id===item.categoryId)?.name}</small><TalentListSymbols item={item} language={language}/><div className="ke-talent-list-validation">{item.validation.errorCount>0&&<details><summary className="ke-talent-error-badge">{pl?'Błędy':'Errors'}: {item.validation.errorCount}</summary><ul>{item.validation.issues.map(issue=><li key={issue.code}>{issueMessage(issue,language)}</li>)}</ul></details>}{item.validation.status!=='checked'&&<small className="ke-talent-check-pending">{item.validation.status==='stale'?(pl?'Wymaga ponownego sprawdzenia':'Needs rechecking'):(pl?'Jeszcze niesprawdzony':'Not checked yet')}</small>}</div></div><TalentListContent item={item} language={language} annotations={palette.annotations} colours={palette.colours}/></div><button type="button" className="ke-talent-open" disabled={openingId!==null} onClick={()=>void openTalent(item)}>{openingId===item.id?<><span className="ke-saving-spinner" aria-hidden="true"/>{pl?'Otwieranie…':'Opening…'}</>:(pl?'Otwórz':'Open')}</button></article>)}</div>:<div className="ke-library-empty"><h4>{pl?'Nie ma jeszcze talentów':'No talents yet'}</h4><p>{category?.parentId?(pl?'Utwórz pierwszy talent w tej podgrupie.':'Create the first talent in this subgroup.'):(pl?'Wybierz podgrupę, aby utworzyć talent.':'Choose a subgroup to create a talent.')}</p></div>}
   </>}
  </section>
 </div>;
}
