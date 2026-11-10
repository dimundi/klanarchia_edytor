import EditorialNoteBadge from './EditorialNoteBadge';
import TalentListRow from './TalentListRow';
import { emptyTalentSearch } from './TalentSearch';
import TalentLibraryTools, { type NameAuditReport } from './TalentLibraryTools';
import CategoryRenameButton from './CategoryRenameButton';
import { issueMessage } from './talent-validation';
import TalentStatusDot, { talentStatusLabel } from './talent-status';
import type { LibraryItem } from './talent-template-library';
import TalentNavigator from './TalentNavigator';
import LazyTalentCard from './LazyTalentCard';
import { usePalette } from './palette';
import { readTalent, readTalents, TalentListItem, TalentRecord } from './talent-api';
import TalentEditor from './TalentEditor';
import { useEffect, useMemo, useRef, useState } from 'react';
import { request, ApiError } from './editor-api';
import './talent-library.css';
type EditingTalent = {name:string;categoryId:string;record?:TalentRecord;draftId?:string;template?:LibraryItem};
type Category = { id: string; parentId: string | null; name: string; talentCount?:number };
export default function TalentLibrary({ language, active }: { language: 'pl' | 'en'; active: boolean }) {
 const pl = language === 'pl', palette=usePalette(language);
 const [view,setView]=useState<'list'|'tiles'>('list'),[showTileStatuses,setShowTileStatuses]=useState(false);
 const groupsInitialized=useRef(false);
 const [searchState,setSearchState]=useState(emptyTalentSearch);
 const [nameReport,setNameReport]=useState<NameAuditReport|null>(null);
 const [editing, setEditing] = useState<EditingTalent | null>(()=>window.location.hash==='#talents'?(window.history.state?.keTalentEditor??null):null);
 const [categoryItems, setItems] = useState<Category[]>([]), [loaded, setLoaded] = useState(false), [busy, setBusy] = useState(false);
 const items=useMemo(()=>[...categoryItems].sort((a,b)=>a.name.localeCompare(b.name,language,{sensitivity:'base',numeric:true})),[categoryItems,language]);
 const [error, setError] = useState(''), [current, setCurrent] = useState<string | null>(()=>window.history.state?.keTalentCategory??null), [selected, setSelected] = useState<string[]>([]), [collapsed, setCollapsed] = useState<string[]>([]);
 const [form, setForm] = useState<{ parentId: string | null } | null>(null), [name, setName] = useState('');
 const [talents,setTalents]=useState<TalentListItem[]>([]),[talentsLoading,setTalentsLoading]=useState(false),[talentsError,setTalentsError]=useState(false),[reload,setReload]=useState(0),[openingId,setOpeningId]=useState<string|null>(null);
 const [navCategory,setNavCategory]=useState<string|null>(()=>window.history.state?.keTalentEditor?.categoryId??null),[editorBusy,setEditorBusy]=useState(false);
 const lastTemplate=useRef<LibraryItem|undefined>(editing?.record?.template??editing?.template);
 const historyDepth=useRef(window.history.state?.keTalentDepth??0);
 const dirty=useRef(false), skipNavigationGuard=useRef(false), restoreScroll=useRef<number|null>(null);
 function beginEditing(next:EditingTalent){
  if(!editing)window.history.replaceState({...window.history.state,keTalentEditor:null,keTalentDepth:0,keTalentCategory:current,keTalentScroll:window.scrollY},'');
  window.history.pushState({...window.history.state,keTalentEditor:next,keTalentDepth:(window.history.state?.keTalentDepth??0)+1},'',window.location.href);
  historyDepth.current=window.history.state.keTalentDepth;dirty.current=false;setNavCategory(next.categoryId);setEditing(next);
 }
 function createTalent(categoryId:string){
  if(editorBusy||openingId)return;
  if(editing&&dirty.current&&!window.confirm(pl?'Odrzucić roboczą treść talentu?':'Discard this talent draft?'))return;
  const group=items.find(item=>item.id===categoryId);if(!group?.parentId||items.some(item=>item.parentId===categoryId))return;
  beginEditing({name:group.name,categoryId:group.id,draftId:crypto.randomUUID(),template:lastTemplate.current});
 }
 useEffect(()=>{
  const openLibrary=(event:Event)=>{
   if(!editing&&!current){setForm(null);return;}
   if(editorBusy||(dirty.current&&!window.confirm(pl?'Odrzucić roboczą treść talentu?':'Discard this talent draft?'))){event.preventDefault();return;}
   window.history.pushState({...window.history.state,keTalentEditor:null,keTalentDepth:0,keTalentCategory:null},'', '#talents');
   historyDepth.current=0;dirty.current=false;setEditing(null);setCurrent(null);setTalents([]);setForm(null);
  };
  window.addEventListener('ke:open-talent-library',openLibrary);return()=>window.removeEventListener('ke:open-talent-library',openLibrary);
 },[editing,editorBusy,current,pl]);
 useEffect(()=>{
  const navigate=()=>{
   if(!active)return;
   if(editing&&dirty.current&&!skipNavigationGuard.current&&!window.confirm(pl?'Odrzucić roboczą treść talentu?':'Discard this talent draft?')){skipNavigationGuard.current=true;window.history.go(Math.sign(historyDepth.current-(window.history.state?.keTalentDepth??0))||1);return;}
   skipNavigationGuard.current=false;dirty.current=false;
   const state=window.history.state;historyDepth.current=state?.keTalentDepth??0;
   setCurrent(state?.keTalentCategory??null);
   setEditing(window.location.hash==='#talents'?(state?.keTalentEditor??null):null);
   if(state?.keTalentEditor)setNavCategory(state.keTalentEditor.categoryId);
   if(!state?.keTalentEditor)restoreScroll.current=state?.keTalentScroll??null;
  };
  window.addEventListener('popstate',navigate);return()=>window.removeEventListener('popstate',navigate);
 },[active,editing,pl]);
 useEffect(()=>{if(!editing&&!talentsLoading&&talents.length&&restoreScroll.current!==null){const y=restoreScroll.current;restoreScroll.current=null;requestAnimationFrame(()=>window.scrollTo(0,y));}},[editing,talentsLoading,talents]);
 const category = items.find(i => i.id === current), parent = items.find(i => i.id === category?.parentId);
 const sections = items.map(group => ({group, talents:talents.filter(talent => talent.categoryId===group.id)})).filter(section => section.talents.length>0);
 async function load() {
  setBusy(true); setError('');
  try { const result = await request<{items: Category[]}>(`talent-categories?language=${language}`); setItems(result.items); if(!groupsInitialized.current){setCollapsed(result.items.filter(item=>!item.parentId).map(item=>item.id));groupsInitialized.current=true;}  setLoaded(true); }
  catch { setError(pl ? 'Nie udało się pobrać biblioteki.' : 'Could not load the library.'); }
  finally { setBusy(false); }
 }
 useEffect(()=>{const refresh=()=>setReload(v=>v+1);window.addEventListener('ke:templates-changed',refresh);window.addEventListener('focus',refresh);return()=>{window.removeEventListener('ke:templates-changed',refresh);window.removeEventListener('focus',refresh);};},[]);
 useEffect(() => { if (active && !loaded) void load(); }, [active, loaded]);
 useEffect(()=>{if(!active||editing||!current)return;let alive=true;setTalentsLoading(true);setTalentsError(false);setTalents([]);readTalents(current,language).then(result=>{if(alive)setTalents(result);}).catch(()=>{if(alive)setTalentsError(true);}).finally(()=>{if(alive)setTalentsLoading(false);});return()=>{alive=false;};},[active,editing,current,language,reload]);
 async function openTalent(item:Pick<TalentListItem,'id'>){if(openingId||editorBusy||item.id===editing?.record?.id)return;if(editing&&dirty.current&&!window.confirm(pl?'Odrzucić roboczą treść talentu?':'Discard this talent draft?'))return;setOpeningId(item.id);setError('');try{const record=await readTalent(item.id,language);beginEditing({name:items.find(i=>i.id===record.categoryId)?.name||'',categoryId:record.categoryId,record});}catch{setError(pl?'Nie udało się otworzyć talentu.':'Could not open the talent.');}finally{setOpeningId(null);}}
 function toggle(id: string) {
  const ids = [id, ...items.filter(i => i.parentId === id).map(i => i.id)];
  setSelected(old => ids.every(key => old.includes(key)) ? old.filter(key => !ids.includes(key)) : [...new Set([...old, ...ids])]);
 }
 async function create(event: React.FormEvent) {
  event.preventDefault(); if (!form || busy) return; setBusy(true); setError('');
  try {
   const item = await request<Category>(`talent-categories?language=${language}`, 'POST', { name: name.trim(), parentId: form.parentId });
   setItems(old => [...old, item]); setCurrent(item.id); setCollapsed(old => item.parentId?old.filter(id => id !== item.parentId):[...old,item.id]); setForm(null); setName('');
  } catch (e) { setError(e instanceof ApiError && e.status === 409 ? (pl ? 'Taka nazwa już istnieje w tej grupie.' : 'This name already exists in this group.') : (pl ? 'Nie udało się zapisać grupy.' : 'Could not save the group.')); }
  finally { setBusy(false); }
 }
 function categoryRenamed(updated:Category){setItems(old=>old.map(item=>item.id===updated.id?{...item,name:updated.name}:item));if(editing?.categoryId===updated.id){const next={...editing,name:updated.name};setEditing(next);if(window.history.state?.keTalentEditor)window.history.replaceState({...window.history.state,keTalentEditor:next},'');}}
 function row(item: Category, child = false) {
  return <div key={item.id} className={`ke-library-row${child ? ' is-child' : ''}${current === item.id ? ' is-current' : ''}`}>
   <input type="checkbox" aria-label={`${pl ? 'Zaznacz' : 'Select'} ${item.name}`} checked={selected.includes(item.id)} onChange={() => toggle(item.id)} />
   {!child && <button type="button" className="ke-library-disclosure" aria-label={`${collapsed.includes(item.id) ? (pl ? 'Rozwiń' : 'Expand') : (pl ? 'Zwiń' : 'Collapse')} ${item.name}`} aria-expanded={!collapsed.includes(item.id)} onClick={() => setCollapsed(old => old.includes(item.id) ? old.filter(id => id !== item.id) : [...old, item.id])}>{collapsed.includes(item.id) ? '▸' : '▾'}</button>}
   <button type="button" className="ke-library-name" aria-current={current === item.id ? 'true' : undefined} onClick={() => { setCurrent(item.id); setForm(null); }}>{item.name}</button>
   <CategoryRenameButton item={item} language={language} onRenamed={categoryRenamed} disabled={busy}/><span className="ke-library-count">{item.talentCount??0}</span>
  </div>;
 }
 if (editing) return <div className="ke-talent-workspace"><TalentNavigator onCategoryRenamed={categoryRenamed} protectedCategoryId={editing.categoryId} onCategoryCreated={item=>setItems(old=>[...old,item])} onCategoryDeleted={id=>{setItems(old=>old.filter(item=>item.id!==id));setSelected(old=>old.filter(value=>value!==id));setCurrent(old=>old===id?(items.find(item=>item.id===id)?.parentId??null):old);}} categories={items} categoryId={navCategory} onCategoryChange={setNavCategory} currentId={editing.record?.id} language={language} onOpen={item=>void openTalent(item)} openingId={openingId} revision={reload} disabled={editorBusy} onCreate={()=>{if(navCategory)createTalent(navCategory);}}/><div className="ke-talent-workspace-editor">{error&&<p role="alert">{error}</p>}<TalentEditor categories={items} key={editing.record?.id??editing.draftId??'new'} initialTemplate={editing.template} onTemplateChange={template=>{lastTemplate.current=template;}} onBusyChange={setEditorBusy} language={language} subgroup={editing.name} categoryId={editing.categoryId} initial={editing.record} onDirtyChange={value=>{dirty.current=value;}} onSaved={record=>{const state=window.history.state;if(state?.keTalentEditor&&(!state.keTalentEditor.record||state.keTalentEditor.record.id===record.id)){const next={...editing,record,categoryId:record.categoryId,name:items.find(item=>item.id===record.categoryId)?.name??editing.name};window.history.replaceState({...state,keTalentEditor:next},'');if(editing.categoryId!==record.categoryId)setNavCategory(record.categoryId);setEditing(old=>old&&(!old.record||old.record.id===record.id)?next:old);}setReload(v=>v+1);void load();}} /></div></div>;
 return <div className="ke-library">
  <aside className="ke-library-sidebar" aria-label={pl ? 'Grupy talentów' : 'Talent groups'}>
   <div className="ke-library-tools"><strong>{pl ? 'Grupy talentów' : 'Talent groups'}</strong><button type="button" onClick={() => { setForm({parentId: null}); setName(''); }}>{pl ? '+ Grupa' : '+ Group'}</button></div>
   {items.filter(i => !i.parentId).map(group => <div key={group.id}>{row(group)}{!collapsed.includes(group.id) && items.filter(i => i.parentId === group.id).map(i => row(i, true))}</div>)}
   {busy && !loaded && <p role="status">{pl ? 'Wczytywanie…' : 'Loading…'}</p>}
   <div className="ke-library-selection"><span>{pl ? 'Zaznaczono' : 'Selected'}: {selected.length}</span><button type="button" disabled={!selected.length} onClick={() => setSelected([])}>{pl ? 'Odznacz' : 'Clear'}</button></div>
  </aside>
  <section className="ke-library-content" aria-label={pl ? 'Zawartość biblioteki' : 'Library contents'}>
   {current&&<div className="ke-library-tools"><div>{parent && <small>{parent.name} / </small>}<h3>{category?.name || (pl ? 'Biblioteka talentów' : 'Talent library')}</h3></div>
    <div className="ke-library-view-tools"><div className="ke-library-view-toggle" role="group" aria-label={pl?'Widok talentów':'Talent view'}><button type="button" aria-pressed={view==='list'} onClick={()=>setView('list')}>{pl?'Lista':'List'}</button><button type="button" aria-pressed={view==='tiles'} onClick={()=>setView('tiles')}>{pl?'Kafelki':'Tiles'}</button></div>{view==='tiles'&&<button type="button" className="ke-tile-status-toggle" aria-pressed={showTileStatuses} onClick={()=>setShowTileStatuses(value=>!value)}>{showTileStatuses?(pl?'Ukryj statusy':'Hide statuses'):(pl?'Pokaż statusy':'Show statuses')}</button>}
    {category?.parentId && <button type="button" onClick={() => createTalent(category.id)}>{pl ? '+ Utwórz talent' : '+ Create talent'}</button>}
    {category && !category.parentId && <button type="button" onClick={() => {setForm({parentId: category.id}); setName('');}}>{pl ? '+ Podgrupa' : '+ Subgroup'}</button>}</div>
   </div>}
   {error && <div role="alert"><p>{error}</p>{!loaded && <button type="button" disabled={busy} onClick={() => void load()}>{pl ? 'Spróbuj ponownie' : 'Retry'}</button>}</div>}
   {form && <form className="ke-library-form" onSubmit={create}>
    <label>{form.parentId ? (pl ? 'Nazwa podgrupy' : 'Subgroup name') : (pl ? 'Nazwa grupy' : 'Group name')}<input autoFocus maxLength={120} required value={name} onChange={e => setName(e.target.value)} /></label>
    <button type="submit" disabled={busy || !name.trim()}>{busy ? (pl ? 'Zapisywanie…' : 'Saving…') : (pl ? 'Utwórz' : 'Create')}</button>
    <button type="button" disabled={busy} onClick={() => setForm(null)}>{pl ? 'Anuluj' : 'Cancel'}</button>
   </form>}
   {loaded&&!form&&!current&&<TalentLibraryTools palette={palette} categories={items} searchState={searchState} onSearchState={setSearchState} language={language} report={nameReport} onReport={setNameReport} onOpen={item=>void openTalent(item)} openingId={openingId}/>}
   {loaded && !form && current && <>
    {talentsLoading?<p role="status">{pl?'Wczytywanie talentów…':'Loading talents…'}</p>:talentsError?<div role="alert"><p>{pl?'Nie udało się pobrać talentów.':'Could not load talents.'}</p><button type="button" onClick={()=>setReload(v=>v+1)}>{pl?'Spróbuj ponownie':'Retry'}</button></div>:talents.length?<div className="ke-talent-sections">{sections.map(({group,talents:groupTalents})=><section className="ke-talent-section" key={group.id} aria-labelledby={`talent-section-${group.id}`}><h4 id={`talent-section-${group.id}`} className="ke-talent-section-title">{group.name} <span>{groupTalents.length}</span></h4><div className={'ke-talent-list '+(view==='tiles'?'is-tiles':'is-rows')}>{groupTalents.map(item=><article key={item.id} data-talent-id={item.id} onClick={event=>{if(view==='tiles'&&!(event.target as Element).closest('button,input,details,a,select,textarea'))void openTalent(item);}}>{view==='tiles'?<><LazyTalentCard item={item} language={language} palette={palette} disabled={openingId!==null} onOpen={()=>void openTalent(item)}/>{showTileStatuses&&<div className="ke-tile-info"><code title={item.versionCode}>{item.id}</code><span className="ke-tile-info-status"><TalentStatusDot status={item.status} language={language}/>{talentStatusLabel(item.status,language)}</span><span className={'ke-tile-info-errors'+((item.validation.automaticErrorCount??item.validation.issues.length)?' has-errors':'')} role="img" aria-label={(pl?'Błędy: ':'Errors: ')+item.validation.errorCount} title={item.validation.errorCount?item.validation.issues.map(issue=>issueMessage(issue,language)).join('\n'):(pl?'Brak zapisanych błędów':'No recorded errors')}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M12 3 2 21h20L12 3Z"/><path d="M12 9v5m0 3v1"/></svg>{item.validation.errorCount}</span><EditorialNoteBadge validation={item.validation} language={language}/></div>}</>:<TalentListRow item={item} language={language} annotations={palette.annotations} colours={palette.colours} disabled={openingId!==null} onOpen={()=>void openTalent(item)}/>}{openingId===item.id&&<span className={view==='tiles'?'ke-tile-opening':'ke-row-opening'} role="status"><span className="ke-saving-spinner" aria-hidden="true"/>{pl?'Otwieranie…':'Opening…'}</span>}</article>)}</div></section>)}</div>:<div className="ke-library-empty"><h4>{pl?'Nie ma jeszcze talentów':'No talents yet'}</h4><p>{category?.parentId?(pl?'Utwórz pierwszy talent w tej podgrupie.':'Create the first talent in this subgroup.'):(pl?'Wybierz podgrupę, aby utworzyć talent.':'Choose a subgroup to create a talent.')}</p></div>}
   </>}
  </section>
 </div>;
}
