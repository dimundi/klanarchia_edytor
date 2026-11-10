import TemplateFactionCost from './TemplateFactionCost';
import { factions, factionNames, factionLogos } from './factions';
import TemplateVersion from './TemplateVersion';
import FixedCardText from './FixedCardText';
import { loadCardFonts } from './card-fonts';
import { exportTalentPdf } from './export-talent-pdf';
import { polishSpacing } from './polish-typography';
import TemplateCostValue from './TemplateCostValue';
import { graphicVariants, graphicVariantIds, useFieldSource } from './graphic-variants';
import { exampleTalent } from './example-talent';
import TemplateRestriction from './TemplateRestriction';
import TemplateCost from './TemplateCost';
import TemplateLabel from './TemplateLabel';
import HexMark from './HexMark';
import AlignmentToolbar from './AlignmentToolbar';
import { alignElements, moveElements, selectionBounds } from './template-alignment';
import PaletteSelect from './PaletteSelect';
import TintedGraphic from './TintedGraphic';
import TemplateFrame from './TemplateFrame';
import { usePalette } from './palette';
import { ApiError, request } from './editor-api';
import ImportPreview from './ImportPreview';
import TemplateBackground from './TemplateBackground';
import { PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from 'react';
import { bodyTextBox, Box, ColouredGraphic, colouredGraphics, ElementId, TalentTemplate, TextRole, TextStyle, clamp, fitBox, isHeaderRow, layoutHeader, setHeaderCenter, fonts, newTemplate, parseTemplate, resizeBox, resizePage, resolveTextStyle, textRoles, visibleElements } from './talent-template-model';
import { templateStrings } from './talent-template-strings';
import './talent-template.css';
import TemplateThumbnail from './TemplateThumbnail';
import { LibraryItem, readLibrary, readLocalLibrary, writeTemplate } from './talent-template-library';
const printable = polishSpacing;
function NumberInput({ value, min, max, step = .1, disabled = false, onValue }: { value: number; min: number; max: number; step?: number; disabled?: boolean; onValue: (value: number) => void }) {
  const [draft, setDraft] = useState(String(value)); const editing = useRef(false);
  useEffect(() => { if (!editing.current) setDraft(String(value)); }, [value]);
  return <input type="number" disabled={disabled} value={draft} min={min} max={max} step={step} onFocus={() => { editing.current = true; }} onChange={event => { setDraft(event.target.value); const n = event.target.valueAsNumber; if (Number.isFinite(n) && n >= min && n <= max) onValue(n); }} onBlur={() => { editing.current = false; const n = Number(draft); const next = draft.trim() && Number.isFinite(n) ? clamp(n, min, max) : value; setDraft(String(value)); onValue(next); }} onKeyDown={event => { if (event.key === 'Enter') event.currentTarget.blur(); }} />;
}
type Selection = ElementId | 'background';
type Drag = { id: ElementId; mode: 'move' | 'resize'; start: DOMPoint; original: Box; snapshot: TalentTemplate; changed: boolean; pointer: number; ids: ElementId[] };
export default function TalentTemplateCreator({ language, active, storageKey }: { language: 'pl' | 'en'; active: boolean; storageKey: string }) {
  const t = templateStrings(language);
  const palette = usePalette(language);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const renameActive = useRef(false), nameInput = useRef<HTMLInputElement>(null), renameButton = useRef<HTMLButtonElement>(null);
  const [screen, setScreen] = useState<'library' | 'editor'>('library');
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [storageError, setStorageError] = useState(false);
  const opening = useRef(false);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const saving = useRef(false), draftId = useRef<string>(crypto.randomUUID());
  const [busy, setBusy] = useState(false), [loading, setLoading] = useState(true);
  const [legacy] = useState(() => { try { return {items:readLocalLibrary(storageKey),error:false}; } catch { return {items:[],error:true}; } });
  const [recordId, setRecordId] = useState<string | null>(null);
  const [recordStamp, setRecordStamp] = useState<string | null>(null);
  const [template, setTemplate] = useState<TalentTemplate>(newTemplate);
  const current = useRef(template); current.current = template;
  const [saved, setSaved] = useState(() => JSON.stringify(newTemplate()));
  const [selected, setSelected] = useState<Selection>('textFlow');
  const [selectedIds, setSelectedIds] = useState<Selection[]>(['textFlow']);
  const selection = useRef<Selection[]>(['textFlow']);
  const [canvasBackground, setCanvasBackground] = useState('#b6aa91');
  const previewConfig = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => { const panel = previewConfig.current; if (panel?.open && event.target instanceof Node && !panel.contains(event.target)) panel.open = false; };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, []);
  const [canvasColor, setCanvasColor] = useState('#666666');
  const [cleanPreview,setCleanPreview]=useState(false);
  const [zoom, setZoom] = useState(2), [outlines, setOutlines] = useState(true);
  const [sample, setSample] = useState({ ...(language === 'pl' ? exampleTalent : {name:'',flavor:'',description:''}), restriction: '', action: false });
  const [useCount, setUseCount] = useState(3);
  const [printing,setPrinting]=useState(false);
  const [message, setMessage] = useState(''), [error, setError] = useState('');
  const [overflow, setOverflow] = useState<string[]>([]), [fontReady, setFontReady] = useState(false);
  const svg = useRef<SVGSVGElement>(null), textRoot = useRef<SVGGElement>(null), drag = useRef<Drag | null>(null);
  const undoStack = useRef<TalentTemplate[]>([]), redoStack = useRef<TalentTemplate[]>([]);
  const dirty = screen === 'editor' && (JSON.stringify(template) !== saved || editingName && nameDraft.trim() !== template.name);
  const ids = visibleElements(template);
  const assets=graphicVariants[template.graphicVariant].assets;
  const role = selectedIds.length === 1 ? selected === 'version' || selected === 'exclusive' || selected === 'nonRenewable' || selected === 'restriction' ? selected : textRoles.includes(selected as TextRole) ? selected as TextRole : null : null;
  const effectiveId: ElementId | null = !selectedIds.length || selected === 'background' ? null : template.textMode === 'flow' && textRoles.includes(selected as TextRole) ? 'textFlow' : selected;
  const selectedBox = effectiveId ? template.elements[effectiveId] : null;
  const geometryId = (id: Selection): ElementId | null => id === 'background' ? null : template.textMode === 'flow' && textRoles.includes(id as TextRole) ? 'textFlow' : id;
  const geometryIds = (values: Selection[]) => [...new Set(values.map(geometryId).filter((id): id is ElementId => id !== null))];
  const selectedGeometry = geometryIds(selectedIds);
  const groupBounds = selectionBounds(template,selectedGeometry);
  const previewIds = [...ids.filter(id=>id!=='restriction'&&id!=='version'),...ids.filter(id=>id==='restriction'),...ids.filter(id=>id==='version')];
  const listIds: Selection[] = ['background', 'version', 'frame', 'hex', 'hexMark', 'costAmount', 'cost', 'factionSymbol', 'factionCostAmount', 'factionCost', 'play', 'play2', 'gift', 'specialRules', 'nonRenewable', 'exclusive', 'uses', 'once', 'restriction', ...(template.textMode === 'flow' ? ['textFlow' as const] : []), ...textRoles];
  const label = (id: Selection) => id === 'background' ? t.background : t[id];
  function replace(next: TalentTemplate) { current.current = next; setTemplate(next); setMessage(''); setError(''); }
  function change(make: (old: TalentTemplate) => TalentTemplate, remember = true) {
    const old = current.current; let next: TalentTemplate; try { next=layoutHeader(make(old)); } catch { setError(language==='pl'?'Elementy rzędu są za szerokie dla karty. Zmniejsz ich szerokość lub odstęp.':'The header row is too wide. Reduce widths or spacing.'); return; }
    if (JSON.stringify(old) === JSON.stringify(next)) return;
    if (remember) { undoStack.current.push(old); if (undoStack.current.length > 100) undoStack.current.shift(); redoStack.current = []; }
    replace(next);
  }
  function setSelection(values: Selection[]) { selection.current=values;setSelectedIds(values);if(values.length)setSelected(values[values.length-1]); }
  function select(id: Selection, additive = false) { const old=selection.current.filter(value=>value!=='background');setSelection(!additive?[id]:id==='background'?(selection.current.includes(id)?[]:[id]):old.includes(id)?old.filter(value=>value!==id):[...old,id]); }
  function isVisible(id: Selection) { return id==='background'?template.backgroundVisible:template.elements[id].visible; }
  function toggleVisible(id: Selection) { const visible=!isVisible(id);if(id==='background')change(old=>({...old,backgroundVisible:visible}));else if(id==='frame'||id==='hex'||id==='gift'||id==='uses'||id==='once')toggleGraphic(id,visible);else updateBox(id,{visible}); }
  function history(direction: 'undo' | 'redo') {
    const from = direction === 'undo' ? undoStack : redoStack, to = direction === 'undo' ? redoStack : undoStack;
    const previous = from.current.pop(); if (!previous) return;
    to.current.push(current.current); replace(previous);
    if (selected === 'textFlow' && previous.textMode === 'separate') select('title');
  }
  function updateBox(id: ElementId, value: Partial<Box>) { change(old => ({ ...old, elements: { ...old.elements, [id]: value.width !== undefined || value.height !== undefined ? resizeBox(old.elements[id], old.page, value) : fitBox({ ...old.elements[id], ...value }, old.page) } })); }
  function updateStyle(value: Partial<TextStyle>) { if (!role) return; change(old => ({ ...old, styles: { ...old.styles, [role]: { ...old.styles[role], ...value } } })); }
  function beginRename() { renameActive.current = true; setNameDraft(current.current.name); setEditingName(true); }
  function finishRename(commit: boolean) {
    if (!renameActive.current) return;
    renameActive.current = false; setEditingName(false);
    const name = nameDraft.trim();
    if (commit && name) change(old => ({ ...old, name }));
  }
  useEffect(() => { if (editingName) { nameInput.current?.focus(); nameInput.current?.select(); } }, [editingName]);
  async function refreshLibrary() { try { const fresh = await readLibrary(); setItems(fresh); setStorageError(false); return fresh; } catch (error) { setStorageError(true); throw error; } }
  useEffect(() => { let alive = true; readLibrary().then(fresh => { if (alive) { setItems(fresh); setStorageError(false); } }).catch(() => { if (alive) setStorageError(true); }).finally(() => { if (alive) setLoading(false); }); return () => { alive = false; }; }, []);
  function openEditor(value: TalentTemplate, item?: LibraryItem) {
    draftId.current = item?.id ?? crypto.randomUUID(); renameActive.current = false; setEditingName(false); replace(structuredClone(value)); setSaved(JSON.stringify(value)); setRecordId(item?.id ?? null); setRecordStamp(item?.revision ? String(item.revision) : null);
    undoStack.current = []; redoStack.current = []; select('textFlow'); setScreen('editor');
  }
  function startNew() { if (opening.current) return; if (!dirty || window.confirm(t.confirm)) openEditor(newTemplate()); }
  function backToLibrary() { if (!dirty || window.confirm(t.confirm)) { setScreen('library'); setMessage(''); setError(''); void refreshLibrary().catch(() => {}); } }
  async function openItem(item: LibraryItem) {
    if (opening.current || busy) return;
    opening.current = true; setOpeningId(item.id); setError('');
    try { const fresh = await readLibrary(); const found = fresh.find(value => value.id === item.id); if (!found) throw new Error(); setItems(fresh); setStorageError(false); openEditor(found.template, found); }
    catch { setError(t.storageError); setStorageError(true); }
    finally { opening.current = false; setOpeningId(null); }
  }
  async function printCard() {
    if(printing||!svg.current)return;setPrinting(true);setError('');
    try{await exportTalentPdf(svg.current,sample.name||template.name,language);}catch{setError(language==='pl'?'Nie udało się wyeksportować PDF. Sprawdź wczytanie fontów i spróbuj ponownie.':'Could not export PDF. Check that fonts have loaded and try again.');}finally{setPrinting(false);}
  }
  async function save() {
    if (saving.current) return;
    finishRename(true);
    let snapshot: TalentTemplate; try { snapshot = parseTemplate(current.current); } catch { setError(t.invalid); return; }
    saving.current = true; setBusy(true);
    try {
      const item = await writeTemplate({id:recordId ?? draftId.current, revision:recordStamp ? Number(recordStamp) : 0, template:snapshot});
      setItems(old => [...old.filter(v => v.id !== item.id),item]); setRecordId(item.id); setRecordStamp(String(item.revision)); setSaved(JSON.stringify(snapshot)); setMessage(t.stored); setError(''); setStorageError(false);
    } catch (error) { setError(error instanceof ApiError && error.status === 409 ? t.conflict : t.storageError); }
    finally { saving.current = false; setBusy(false); }
  }
  async function duplicate(item: LibraryItem) {
    if (saving.current) return; saving.current = true; setBusy(true);
    try {
      const fresh = await readLibrary(), source = fresh.find(value => value.id === item.id); if (!source) throw new Error();
      const suffix = ` — ${t.copySuffix}`, template = {...structuredClone(source.template),name:source.template.name.slice(0,120-suffix.length)+suffix};
      const copy = await writeTemplate({id:crypto.randomUUID(),revision:0,template}); setItems([...fresh,copy]); setError(''); setMessage(t.stored);
    } catch { setError(t.storageError); } finally { saving.current = false; setBusy(false); }
  }  useEffect(() => {
    let alive = true;
    loadCardFonts().then(() => { if (alive) setFontReady(true); }).catch(() => { if (alive) setError(t.loadingFont); });
    return () => { alive = false; };
  }, []);
  useEffect(() => {
    if (!active || screen !== 'editor' || !textRoot.current) return;
    const check = () => { const next = Array.from(svg.current?.querySelectorAll<SVGElement>('[data-fixed-text][data-text-overflow=true]')??[]).map(node=>node.dataset.fixedText!); setOverflow(previous => previous.join() === next.join() ? previous : next); };
    const observer = new MutationObserver(check); observer.observe(textRoot.current,{subtree:true,childList:true,attributes:true});check();
    return () => observer.disconnect();
  }, [template, sample, active, fontReady, screen]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  useEffect(() => {
    if (!active || screen !== 'editor') return;
    const key = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey)) return;
      const target = event.target as HTMLElement;
      if (event.key.toLowerCase() === 's') { event.preventDefault(); save(); }
      if (event.key.toLowerCase() === 'z' && !target.closest('input,textarea,select,[contenteditable=true]')) { event.preventDefault(); history(event.shiftKey ? 'redo' : 'undo'); }
    };
    window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key);
  });
  function point(event: ReactPointerEvent) { const matrix = svg.current?.getScreenCTM(); return matrix ? new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse()) : new DOMPoint(); }
  function begin(event: ReactPointerEvent<SVGGElement | SVGRectElement>, id: ElementId, mode: Drag['mode']) {
    if (event.button !== 0) return;
    event.preventDefault();event.stopPropagation();
    const textRole=(event.target as Element).closest('[data-text-role]')?.getAttribute('data-text-role');
    const target=textRoles.includes(textRole as TextRole)?textRole as TextRole:id;
    if(event.shiftKey&&mode==='move'){select(target,true);svg.current?.focus({preventScroll:true});return;}
    if(mode==='resize'||!geometryIds(selection.current).includes(id)||(selection.current.length===1&&selection.current[0]!==target))select(target);
    svg.current?.focus({preventScroll:true});const original=current.current.elements[id];if(original.locked)return;
    drag.current={id,mode,ids:geometryIds(selection.current),start:point(event),original:{...original},snapshot:current.current,changed:false,pointer:event.pointerId};svg.current?.setPointerCapture(event.pointerId);
  }
  function move(event: ReactPointerEvent<SVGSVGElement>) {
    const d = drag.current; if (!d || event.pointerId !== d.pointer) return;
    const p = point(event), dx = p.x - d.start.x, dy = p.y - d.start.y;
    const ratioDelta = Math.abs(dx / d.original.width) >= Math.abs(dy / d.original.height) ? dx / d.original.width : dy / d.original.height;
    const resized=d.original.proportional?resizeBox(d.original,current.current.page,{width:d.original.width*(1+ratioDelta)}):resizeBox(d.original,current.current.page,{width:d.original.width+dx,height:d.original.height+dy});
    const next=d.mode==='move'?moveElements(d.snapshot,d.ids,dx,dy):{...current.current,elements:{...current.current.elements,[d.id]:resized}};
    if(JSON.stringify(next.elements)===JSON.stringify(current.current.elements))return;
    if(!d.changed){undoStack.current.push(d.snapshot);if(undoStack.current.length>100)undoStack.current.shift();redoStack.current=[];d.changed=true;}change(()=>next,false);
  }  function finish(event: ReactPointerEvent<SVGSVGElement>, cancel = false) {
    const d = drag.current; if (!d || event.pointerId !== d.pointer) return;
    if (cancel && d.changed) { undoStack.current.pop(); replace(d.snapshot); }
    drag.current = null; if (svg.current?.hasPointerCapture(event.pointerId)) svg.current.releasePointerCapture(event.pointerId);
  }
  function content(part: TextRole) { return printable(part === 'title' ? `${sample.name || t.roleTitle}${sample.action ? ` ${t.actionSuffix}` : ''}:` : part === 'flavor' ? sample.flavor || t.placeholderFlavor : sample.description || t.placeholderDescription); }
  function textBox(id: ElementId) {
    const b = bodyTextBox(template,id), flow = id === 'textFlow';
    return <FixedCardText id={id} box={b} language={language} colours={palette.colours} segments={(flow?textRoles.filter(part=>template.elements[part].visible):[id as TextRole]).map(part=>({text:content(part)+' ',style:resolveTextStyle(template,part)}))}/>;}
  function graphic(id: ElementId) {
    if(id==='version')return <TemplateVersion template={template} language={language} colours={palette.colours}/>;
    if(id==='restriction')return <TemplateRestriction template={template} language={language} colours={palette.colours} text={sample.restriction || undefined}/>;
    if(id==='costAmount')return <TemplateCostValue template={template} colours={palette.colours}/>;
    if(id==='cost')return <TemplateCost template={template} colours={palette.colours}/>;
    if(id==='factionSymbol'||id==='factionCostAmount'||id==='factionCost') return <TemplateFactionCost template={template} colours={palette.colours} element={id}/>;
    if(id==='exclusive') return <TemplateLabel template={template} language={language} colours={palette.colours} kind="exclusive" />;
    if(id==='nonRenewable') return <TemplateLabel template={template} language={language} colours={palette.colours} />;
    if (id === 'frame') return <TemplateFrame template={template} colour={palette.colours.find(c => c.id === template.frameColourId)?.value || '#3e5074'} />;
    const b = template.elements[id];
    const colour = palette.colours.find(c => c.id === template.graphicColourIds[id as ColouredGraphic])?.value || (id === 'gift' || id === 'hexMark' || id === 'play' || id === 'play2' || id === 'specialRules' ? '#000000' : '#3e5074');
    if (id === 'textFlow' || textRoles.includes(id as TextRole)) return textBox(id);
    if (id === 'uses') return Array.from({ length: useCount }, (_, index) => <TintedGraphic key={index} source={useFieldSource(template,3-useCount+index)} box={{x:b.x + b.width * (3 - useCount + index) / 3,y:b.y,width:b.width/3,height:b.height}} colour={colour} />);
    if(id==='hexMark') return <HexMark template={template} colour={colour} />;
    return <TintedGraphic source={assets[(id==='play2'?'play':id) as 'hex'|'play'|'gift'|'specialRules'|'once']} box={b} colour={colour} />;
  }
  const style = role ? template.styles[role] : null;
  function toggleGraphic(id: 'frame'|'hex'|'gift'|'uses'|'once', value: boolean) { if(id==='uses'&&value&&useCount===0)setUseCount(3);updateBox(id,{visible:value}); }
  function changeUseCount(value: number) { const count=Math.round(clamp(value,0,3));setUseCount(count);updateBox('uses',{visible:count>0}); }    if (screen === 'library') return <section className="kt-library" aria-label={t.library}>
    <div className="kt-library-header"><div><h3>{t.library}</h3><p className="kt-help">{t.localNotice}</p></div><div className="kt-actions"><button type="button" className="kt-primary" disabled={openingId !== null} onClick={startNew}>{t.newItem}</button></div></div>
    {legacy.error && <p role="alert" className="kt-warning">{language === 'pl' ? 'Nie udało się odczytać starej biblioteki przeglądarki. Zapis pozostał bez zmian.' : 'Could not read the old browser library. Stored data was not changed.'}</p>}
    {!loading && !storageError && <ImportPreview language={language} rows={legacy.items.map(item => ({id:item.id,name:item.template.name,blocked:items.some(v => v.id === item.id)}))} onApply={async ids => { await request('templates/import','POST',{items:legacy.items.filter(item => ids.includes(item.id)).map(item => ({id:item.id,template:item.template}))}); await refreshLibrary(); }} />}
    {loading && <p role="status">{language === 'pl' ? 'Wczytywanie…' : 'Loading…'}</p>}
    {(storageError || error) && <p role="alert" className="kt-warning">{error || t.storageError}</p>}
    {message && <p className="kt-help" role="status">{message}</p>}
    {!loading && !items.length && !storageError && <div className="kt-library-empty"><p>{t.empty}</p><button type="button" className="kt-new-tile" disabled={openingId !== null} onClick={startNew}><span aria-hidden="true">+</span>{t.newItem}</button></div>}
    <div className="kt-library-grid">{[...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map(item => <article className="kt-library-card" key={item.id} data-template-id={item.id}><button type="button" className="kt-library-preview" disabled={busy || openingId !== null} aria-label={`${t.open}: ${item.template.name}`} onClick={() => openItem(item)}><TemplateThumbnail template={item.template} language={language} colours={palette.colours} /></button><div className="kt-library-card-content"><h4>{item.template.name}</h4><p className="kt-help">{t.modified}: <time dateTime={item.updatedAt}>{new Intl.DateTimeFormat(language, { dateStyle: 'short', timeStyle: 'short' }).format(new Date(item.updatedAt))}</time></p><div className="kt-actions"><button type="button" className="kt-open-button" disabled={busy || openingId !== null} aria-busy={openingId === item.id} onClick={() => openItem(item)}>{openingId === item.id && <span className="kt-spinner" aria-hidden="true" />}{openingId === item.id ? (language === 'pl' ? 'Otwieranie…' : 'Opening…') : t.open}</button><button type="button" disabled={busy || openingId !== null} onClick={() => duplicate(item)}>{t.duplicate}</button></div></div></article>)}</div>
  </section>;
  return <div className="kt-creator">
    <div className="kt-toolbar"><div className="kt-title-group"><button type="button" className="kt-back kt-icon-button" aria-label={t.back} title={t.back} disabled={busy} onClick={backToLibrary}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m10 6-6 6 6 6M4 12h16" /></svg></button>{editingName ? <input ref={nameInput} className="kt-name-editor" aria-label={t.name} maxLength={120} value={nameDraft} onChange={event => setNameDraft(event.target.value)} onBlur={() => finishRename(true)} onKeyDown={event => { if (event.key === 'Enter' || event.key === 'Escape') { event.preventDefault(); finishRename(event.key === 'Enter'); requestAnimationFrame(() => renameButton.current?.focus()); } }} /> : <span className="kt-document-name" title={template.name}>{template.name}</span>}<button ref={renameButton} type="button" className="kt-rename kt-icon-button" aria-label={t.rename} title={t.rename} onClick={beginRename}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m16 3 5 5-12 12-6 1 1-6L16 3ZM14 5l5 5" /></svg></button></div>
      <div className="kt-actions"><button type="button" disabled={!undoStack.current.length} onClick={() => history('undo')}>{t.undo}</button><button type="button" disabled={!redoStack.current.length} onClick={() => history('redo')}>{t.redo}</button><button type="button" className="kt-primary kt-save-button" disabled={busy || !template.name.trim() || storageError} aria-busy={busy} onClick={save}>{busy && <span className="kt-spinner" aria-hidden="true" />}{busy ? (language === 'pl' ? 'Zapisywanie…' : 'Saving…') : t.store}</button><button type="button" className="kt-print-button" disabled={printing||!fontReady} aria-busy={printing} onClick={printCard}>{printing&&<span className="kt-spinner" aria-hidden="true"/>}{printing?(language==='pl'?'Przygotowywanie…':'Preparing…'):'PDF'}</button></div>
    </div>
    <div className="kt-feedback" aria-live="polite">{error ? <span role="alert">{error}</span> : message || (dirty ? t.dirty : '')}</div>
    <div className="kt-layout">
      <aside className="kt-settings">
        <details open><summary>{t.elements}</summary><label className="kt-fields">{language==='pl'?'Warianty graficzne':'Graphic variants'}<select aria-label={language==='pl'?'Warianty graficzne':'Graphic variants'} value={template.graphicVariant} onChange={event=>change(old=>({...old,graphicVariant:event.target.value as TalentTemplate['graphicVariant']}))}>{graphicVariantIds.map(id=><option key={id} value={id}>{graphicVariants[id].label[language]}</option>)}</select></label><div className="kt-element-list">{listIds.map(id => {
          const objectId: ElementId | null = id === 'background' ? null : template.textMode === 'flow' && textRoles.includes(id as TextRole) ? 'textFlow' : id;
          const locked = objectId ? template.elements[objectId].locked : false;
          return <div key={id} className="kt-element-entry"><div className="kt-element-row" data-selected={selectedIds.includes(id)} onClick={event => select(id,event.shiftKey)}>
            <input className="kt-object-select" type="checkbox" aria-label={`${language === 'pl' ? 'Zaznacz' : 'Select'}: ${label(id)}`} checked={selectedIds.includes(id)} onClick={event => event.stopPropagation()} onChange={() => select(id,true)} />
            <button type="button" className="kt-element-item" data-element-id={id} aria-pressed={selectedIds.includes(id)} onClick={event => { event.stopPropagation(); select(id,event.shiftKey); }}>{id==='factionSymbol'?<span className="kt-element-images"><img src={factionLogos[template.factionCost.faction]} alt=""/></span>:id==='factionCost'?<span className="kt-element-images"><img src={assets.cost} alt=""/></span>:id === 'background' ? <span className="kt-element-swatch" style={{ background: template.background }} aria-hidden="true" /> : id === 'frame' || id === 'hex' || id === 'hexMark' || id === 'cost' || id === 'play' || id === 'play2' || id === 'specialRules' || id === 'gift' || id === 'uses' || id === 'once' ? <span className="kt-element-images"><img src={assets[id==='play2'?'play':id]} alt="" /></span> : <span className="kt-text-symbol" aria-hidden="true">T</span>}<span>{label(id)}</span></button>
            {(id==='costAmount'||id==='factionCostAmount') && <label className="kt-use-count-inline" onClick={event=>event.stopPropagation()}><span className="kt-visually-hidden">{id==='costAmount'?(language==='pl'?'Wartość kosztu':'Cost value'):(language==='pl'?'Wartość drugiego kosztu':'Second cost value')}</span><NumberInput value={id==='costAmount'?template.costValue:template.factionCost.cost} min={0} max={10} step={1} onValue={value=>change(old=>id==='costAmount'?({...old,costValue:Math.round(value)}):({...old,factionCost:{...old.factionCost,cost:Math.round(value)}}))}/></label>}
            {id === 'uses' && <label className="kt-use-count-inline" onClick={event => event.stopPropagation()}><span className="kt-visually-hidden">{t.useCount}</span><NumberInput value={useCount} min={0} max={3} step={1} onValue={changeUseCount} /></label>}
            {objectId && <button type="button" className="kt-element-lock" aria-label={`${t.locked}: ${label(id)}`} aria-pressed={locked} title={locked ? t.unlock : t.locked} onClick={event => { event.stopPropagation(); updateBox(objectId, { locked: !locked }); }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="6" y="10" width="12" height="11" rx="2" /><path d={locked ? 'M8 10V6a4 4 0 0 1 8 0v4' : 'M8 10V6a4 4 0 0 1 8 0'} /><path d="M12 14v3" /></svg></button>}
            <button type="button" className="kt-element-eye" aria-label={`${language === 'pl' ? (isVisible(id) ? 'Ukryj' : 'Pokaż') : (isVisible(id) ? 'Hide' : 'Show')}: ${label(id)}`} title={language === 'pl' ? (isVisible(id) ? 'Ukryj' : 'Pokaż') : (isVisible(id) ? 'Hide' : 'Show')} aria-pressed={isVisible(id)} onClick={event => { event.stopPropagation(); toggleVisible(id); }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>{!isVisible(id) && <path d="m3 3 18 18"/>}</svg></button>
          </div></div>;
        })}<label className="kt-action-row"><span className="kt-text-symbol" aria-hidden="true">A</span><span>{t.action}</span><input type="checkbox" aria-label={t.action} checked={sample.action} onChange={event => setSample({ ...sample, action: event.target.checked })} /></label></div></details>
      </aside>      <div className="kt-preview-column"><div className="kt-preview-bar"><div className="kt-preview-heading"><h3>{t.preview}</h3><details ref={previewConfig} className="kt-preview-config" onKeyDown={event => { if (event.key === 'Escape') { event.currentTarget.open = false; event.currentTarget.querySelector('summary')?.focus(); } }}><summary aria-label={language === 'pl' ? 'Ustawienia podglądu' : 'Preview settings'} title={language === 'pl' ? 'Ustawienia podglądu' : 'Preview settings'}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.05a2.34 2.34 0 0 0 3.319-1.915Z"/><circle cx="12" cy="12" r="3"/></svg></summary><div className="kt-preview-config-panel"><label className="kt-canvas-choice">{language === 'pl' ? 'Tło podglądu' : 'Preview background'}<select value={canvasBackground} onChange={event => setCanvasBackground(event.target.value)}><option value="checker">{language === 'pl' ? 'Szachownica' : 'Checkerboard'}</option><option value="#ffffff">{language === 'pl' ? 'Białe' : 'White'}</option><option value="#808080">{language === 'pl' ? 'Szare' : 'Grey'}</option><option value="#202420">{language === 'pl' ? 'Ciemne' : 'Dark'}</option><option value="#b6aa91">{language === 'pl' ? 'Przygaszony beż' : 'Muted beige'}</option><option value="custom">{language === 'pl' ? 'Własny kolor' : 'Custom colour'}</option></select>{canvasBackground === 'custom' && <input type="color" aria-label={language === 'pl' ? 'Kolor tła podglądu' : 'Preview background colour'} value={canvasColor} onChange={event => setCanvasColor(event.target.value)} />}</label></div></details></div>{selectedGeometry.length > 0 && <AlignmentToolbar language={language} horizontalDisabled={selectedGeometry.every(isHeaderRow)} count={selectedGeometry.length} disabled={selectedGeometry.every(id=>template.elements[id].locked)} onAlign={alignment=>change(old=>alignElements(old,selectedGeometry,alignment))} />}<div className="kt-preview-toggles"><label className="kt-check"><input type="checkbox" checked={cleanPreview} onChange={event=>setCleanPreview(event.target.checked)}/>{language==='pl'?'Czysty podgląd':'Clean preview'}</label><label className="kt-check"><input type="checkbox" disabled={cleanPreview} checked={outlines} onChange={event => setOutlines(event.target.checked)} />{t.outline}</label></div><div className="kt-zoom-controls"><label>{t.zoom}<select aria-label={t.zoom} value={zoom} onChange={event => setZoom(Number(event.target.value))}>{[1, 1.5, 2, 3, 4].map(n => <option key={n} value={n}>{n * 100}%</option>)}</select></label><button type="button" aria-label={t.zoomOut} title={t.zoomOut} disabled={zoom <= 1} onClick={() => setZoom([1, 1.5, 2, 3, 4].filter(n => n < zoom).at(-1) ?? 1)}>−</button><button type="button" aria-label={t.zoomIn} title={t.zoomIn} disabled={zoom >= 4} onClick={() => setZoom([1, 1.5, 2, 3, 4].find(n => n > zoom) ?? 4)}>+</button></div></div>

        <div className="kt-stage" data-canvas-background={canvasBackground} style={canvasBackground === 'checker' || canvasBackground === '#b6aa91' ? undefined : { background: canvasBackground === 'custom' ? canvasColor : canvasBackground }}><svg ref={svg} tabIndex={0} role="group" aria-label={t.preview} className="kt-card kt-interactive" overflow="visible" viewBox={`0 0 ${template.page.width} ${template.page.height}`} style={{ width: template.page.width * 96 / 72 * zoom, maxWidth: '100%', height: 'auto' }} onPointerMove={move} onPointerUp={event => finish(event)} onPointerCancel={event => finish(event, true)} onLostPointerCapture={() => { drag.current = null; }} onKeyDown={event => { if(cleanPreview)return;if(event.key==='Escape'){event.preventDefault();setSelection([]);return;}const delta: Record<string,[number,number]>={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};const d=delta[event.key];if(!d||!selectedGeometry.length||event.ctrlKey||event.metaKey||event.altKey)return;event.preventDefault();const step=event.shiftKey?10:1;change(old=>moveElements(old,selectedGeometry,d[0]*step,d[1]*step)); }}>
          <TemplateBackground template={template} /><g ref={textRoot}>{previewIds.filter(id => template.elements[id].visible && !(cleanPreview && id === 'version')).map(id => { const b = template.elements[id]; return <g key={id} data-canvas-element={id} onPointerDown={event => {if(!cleanPreview)begin(event, id, 'move');}} className={cleanPreview || b.locked ? 'kt-locked' : 'kt-movable'}>{graphic(id)}<rect x={b.x} y={b.y} width={b.width} height={b.height} fill="transparent" pointerEvents={id === 'textFlow' || textRoles.includes(id as TextRole) ? 'none' : 'all'} stroke={cleanPreview ? 'none' : selectedGeometry.includes(id) ? '#b17d25' : outlines ? '#5b718d70' : 'none'} strokeDasharray="2 2" strokeWidth=".5" vectorEffect="non-scaling-stroke" /></g>; })}</g>
          {!cleanPreview && selectedGeometry.length === 1 && selectedBox && effectiveId && selectedBox.visible && previewIds.includes(effectiveId) && <g className="kt-selection"><rect x={selectedBox.x} y={selectedBox.y} width={selectedBox.width} height={selectedBox.height} fill="none" stroke="#b17d25" strokeWidth="1.5" vectorEffect="non-scaling-stroke" pointerEvents="none" />{!selectedBox.locked && <rect data-resize-handle={effectiveId} x={selectedBox.x + selectedBox.width - 4} y={selectedBox.y + selectedBox.height - 4} width={8} height={8} fill="#b17d25" stroke="#ffffff" strokeWidth="1" vectorEffect="non-scaling-stroke" className="kt-resize-handle" onPointerDown={event => begin(event, effectiveId!, 'resize')} />}</g>}
          {!cleanPreview && selectedGeometry.length > 1 && groupBounds && <rect className="kt-group-selection" x={groupBounds.x} y={groupBounds.y} width={groupBounds.width} height={groupBounds.height} fill="none" stroke="#b17d25" strokeWidth="1.5" strokeDasharray="4 3" vectorEffect="non-scaling-stroke" pointerEvents="none" />}
        </svg></div><div className="kt-preview-options"><span className="kt-help">Linux Libertine</span><span className="kt-help">{(template.page.width * 25.4 / 72).toFixed(1)} × {(template.page.height * 25.4 / 72).toFixed(1)} mm</span></div><p className="kt-help">{t.drag}</p>

        <details className="kt-sample" open><summary>{t.sample}</summary><div className="kt-fields"><p className="kt-help">{t.sampleHelp}</p><label>{t.roleTitle}<input value={sample.name} placeholder={t.roleTitle} maxLength={200} onChange={event => setSample({ ...sample, name: event.target.value })} /></label><label>{t.roleFlavor}<textarea aria-label={t.roleFlavor} rows={2} maxLength={10000} value={sample.flavor} placeholder={t.placeholderFlavor} onChange={event => setSample({ ...sample, flavor: event.target.value })} /></label><label>{t.roleMechanics}<textarea aria-label={t.roleMechanics} rows={3} maxLength={10000} value={sample.description} placeholder={t.placeholderDescription} onChange={event => setSample({ ...sample, description: event.target.value })} /></label></div></details>
        {!fontReady && <p role="status" className="kt-help">{t.loadingFont}</p>}{overflow.length > 0 && fontReady && <p role="status" className="kt-warning">{t.noFit} {overflow.map(id => t[id as ElementId]).join(', ')}</p>}
      </div>
      <aside className="kt-sample-column">
        <details open><summary>{t.properties} · {selectedIds.length > 1 ? `${selectedIds.length} ${language === 'pl' ? 'obiekty' : 'objects'}` : selectedIds.length ? label(selected) : (language === 'pl' ? 'Brak zaznaczenia' : 'No selection')}</summary><div className="kt-fields">
          {selectedIds.length !== 1 ? <p className="kt-help">{selectedIds.length ? (language === 'pl' ? 'Wyrównuj obiekty przyciskami nad podglądem. Zablokowane obiekty pozostają na miejscu. Części tekstu we wspólnym bloku mają wspólną pozycję.' : 'Align objects using the toolbar above the preview. Locked objects stay in place. Shared text parts have one position.') : (language === 'pl' ? 'Wybierz obiekt na liście lub podglądzie.' : 'Select an object in the list or preview.')}</p> : selected === 'background' ? <><div className="kt-pair">{(['width', 'height'] as const).map(key => <label key={key}>{t[key]}<NumberInput value={template.page[key]} min={50} max={600} onValue={value => change(old => resizePage(old, { ...old.page, [key]: value }))} /></label>)}</div><label className="kt-colour">{t.background}<input type="color" value={template.background} onChange={event => change(old => ({ ...old, background: event.target.value }))} /></label><p className="kt-help">{t.changedSize}</p></> : selectedBox && effectiveId && <>
            {(selected === 'frame' || colouredGraphics.includes(selected as ColouredGraphic)) && <><PaletteSelect label={language === 'pl' ? (selected === 'frame' ? 'Kolor ramki' : 'Kolor elementu') : (selected === 'frame' ? 'Frame colour' : 'Element colour')} colours={palette.colours} value={selected === 'frame' ? template.frameColourId : template.graphicColourIds[selected as ColouredGraphic]} disabled={palette.error} unavailable={language === 'pl' ? 'Wybierz kolor palety' : 'Select a palette colour'} onChange={id => change(old => selected === 'frame' ? {...old,frameColourId:id} : {...old,graphicColourIds:{...old.graphicColourIds,[selected]:id}})} />{palette.error && <p role="alert">{language === 'pl' ? 'Nie udało się pobrać palety. Odśwież stronę.' : 'Could not load palette. Reload the page.'}</p>}</>}
            {selected==='costAmount' && <PaletteSelect label={language==='pl'?'Kolor cyfry':'Digit colour'} colours={palette.colours} value={template.costTextColourId} disabled={palette.error} unavailable={language==='pl'?'Wybierz kolor palety':'Select a palette colour'} onChange={id=>change(old=>({...old,costTextColourId:id}))}/>}
            {isHeaderRow(effectiveId) && <><p className="kt-help">{language==='pl'?'X ustala automatyczny rząd. Y ustawiasz osobno dla tego obiektu. Ukryte elementy nie zajmują miejsca.':'X is controlled by the automatic row. Y is independent for each object. Hidden elements take no space.'}</p><div className="kt-row-settings">{(['x','centerY','gap'] as const).map(key=><label key={key}>{key==='x'?'X':key==='centerY'?(language==='pl'?'Środek Y':'Center Y'):(language==='pl'?'Odstęp':'Spacing')}<NumberInput value={template.headerRow[key]} min={0} max={key==='gap'?30:key==='x'?template.page.width:template.page.height} disabled={['costAmount','cost','factionSymbol','factionCostAmount','factionCost','play','play2','gift','specialRules','nonRenewable','exclusive'].some(id=>template.elements[id as ElementId].locked)} onValue={value=>change(old=>key==='centerY'?setHeaderCenter(old,value):({...old,headerRow:{...old.headerRow,[key]:value}}))} /></label>)}</div></>}
            {role && role !== 'version' && role !== 'exclusive' && role !== 'nonRenewable' && role !== 'restriction' && template.textMode === 'flow' && <p className="kt-help">{t.sharedPosition}</p>}
            <div className="kt-geometry-grid">{(['x', 'y', 'width', 'height'] as const).map(key => <label data-geometry={key} key={`${effectiveId}-${key}`}>{t[key]}<NumberInput disabled={selectedBox.locked || (isHeaderRow(effectiveId) && key === 'x')} value={selectedBox[key]} min={key === 'x' || key === 'y' ? 0 : 1} max={key === 'x' ? template.page.width - selectedBox.width : key === 'y' ? template.page.height - selectedBox.height : key === 'width' ? template.page.width - selectedBox.x : template.page.height - selectedBox.y} onValue={value => updateBox(effectiveId, { [key]: value })} /></label>)}<button type="button" className="kt-aspect-toggle" disabled={effectiveId==='factionSymbol'} aria-label={t.proportional} aria-pressed={!!selectedBox.proportional} title={selectedBox.proportional ? t.linked : t.unlinked} onClick={() => updateBox(effectiveId, { proportional: !selectedBox.proportional })}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m10 7 2-2a5 5 0 0 1 7 7l-2 2M14 17l-2 2a5 5 0 0 1-7-7l2-2" />{selectedBox.proportional ? <path d="m8 16 8-8" /> : <path d="m3 3 18 18" />}</svg></button></div>
          </>}
          {selected==='factionSymbol'&&<><label>{language==='pl'?'Frakcja do podglądu':'Preview faction'}<select value={template.factionCost.faction} onChange={e=>change(old=>({...old,factionCost:{...old.factionCost,faction:e.target.value as typeof old.factionCost.faction}}))}>{factions.map(faction=><option key={faction} value={faction}>{factionNames[faction]}</option>)}</select></label></>}{role==='version'&&<p className="kt-help">{language==='pl'?'W podglądzie przykładowe oznaczenie. Na karcie zapisanego talentu pojawi się jego kod wersji. Widoczność ustawiasz oczkiem na liście elementów.':'The preview uses an example. Saved talent cards show their version code. Toggle visibility in the element list.'}</p>}{role==='restriction' && <><label>{language==='pl'?'Tekst do podglądu':'Preview text'}<input value={sample.restriction} placeholder={language==='pl'?'Tylko Mechaniści':'Mechanists only'} maxLength={200} onChange={event=>setSample({...sample,restriction:event.target.value})}/></label><p className="kt-help">{language==='pl'?'Treść przykładowa, bez zapisu w szablonie. Napis jest warstwą nad mechaniką i nie rezerwuje miejsca. Ręcznie dopilnuj, aby treść nie weszła pod napis.':'Preview only, not saved in the template. The label overlays the rules and reserves no space. Keep the rules clear of the label manually.'}</p></>}{style && role && <><label>{t.font}<select aria-label={t.font} value={style.font} onChange={event => updateStyle({ font: event.target.value as TextStyle['font'] })}>{fonts.map(font => <option value={font} key={font} disabled={font!=='libertine'}>{font === 'libertine' ? 'Linux Libertine' : font === 'georgia' ? 'Georgia' : 'Arial'}</option>)}</select></label><div className="kt-pair"><label>{t.fontSize}<NumberInput key={`${role}-fontSize`} value={style.fontSize} min={role === 'version' || role === 'exclusive' || role === 'nonRenewable' || role === 'restriction' ? 5 : 9} max={48} onValue={value => updateStyle({ fontSize: value })} /></label><label>{t.lineHeight}<NumberInput key={`${role}-lineHeight`} value={style.lineHeight} min={.75} max={3} step={.01} onValue={value => updateStyle({ lineHeight: value })} /></label></div><label>{t.letterSpacing}<NumberInput key={`${role}-letterSpacing`} value={style.letterSpacing} min={-2} max={10} step={.05} onValue={value => updateStyle({ letterSpacing: value })} /></label><PaletteSelect label={t.color} colours={palette.colours} value={style.colourId || palette.colours.find(c=>c.value.toLowerCase()===style.color.toLowerCase())?.id || ''} disabled={palette.error} unavailable={language==='pl'?'Wybierz kolor palety':'Select a palette colour'} onChange={id=>{const colour=palette.colours.find(c=>c.id===id);if(colour)updateStyle({colourId:id,color:colour.value});}} /><div className="kt-inline-checks"><label className="kt-check"><input type="checkbox" checked={style.bold} onChange={event => updateStyle({ bold: event.target.checked })} />{t.bold}</label><label className="kt-check"><input type="checkbox" checked={style.italic} onChange={event => updateStyle({ italic: event.target.checked })} />{t.italic}</label></div>{role !== 'version' && role !== 'exclusive' && role !== 'nonRenewable' && role !== 'restriction' && <p className="kt-help">{t.inherited}</p>}</>}
        </div></details>
      </aside>
    </div>
  </div>;
}
