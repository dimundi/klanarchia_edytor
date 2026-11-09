import TalentLibrary from './TalentLibrary';
import { configureApi } from './editor-api';
import StylesColours from './StylesColours';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import TalentTemplateCreator from './TalentTemplateCreator';
const logoUrl = new URL('./assets/klanarchia-logo.webp', import.meta.url).href;

type Config = { userId: number; language: 'pl' | 'en'; apiUrl: string; nonce: string };
type View = 'welcome' | 'characters' | 'my-talents' | 'talents' | 'talent-templates' | 'styles-colors' | 'character-templates';
const userViews: View[] = ['characters', 'my-talents'];
const designViews: View[] = ['talents', 'talent-templates', 'styles-colors', 'character-templates'];
const allViews: View[] = ['welcome', ...userViews, ...designViews];
const messages = {
  pl: {
    editor: 'EDYTOR', expand: 'Rozwiń na całe okno', expandHint: 'Powiększ', restore: 'Wróć do strony', menu: 'Menu edytora', personal: 'Twoja przestrzeń', design: 'Projektowanie',
    loading: 'Sprawdzanie dostępu…', home: 'Przejdź do strony Witaj', shortcuts: 'Na skróty', welcomeHeading: 'Witaj w\u00a0edytorze materiałów do RPG Klanarchia', welcomeTitle: 'Edytor talentów i\u00a0postaci został odblokowany podczas zbiórki Klanarchii.', welcomeLead: 'Możesz już z\u00a0niego korzystać, ale nadal jest w\u00a0trakcie tworzenia i\u00a0nie ma jeszcze pełnej funkcjonalności. Wszystkie zawarte tutaj materiały należy traktować jako prototypowe.',
    descriptions: { characters: 'Postacie, karty i\u00a0dane twoich bohaterów.', 'my-talents': 'Twoja własna kolekcja talentów.', talents: 'Treści, parametry i\u00a0porządkowanie biblioteki talentów.', 'talent-templates': 'Wygląd kart talentów: układ, teksty i\u00a0symbole.', 'styles-colors': 'Wspólne style oznaczeń tekstu i\u00a0paleta kolorów.', 'character-templates': 'Projektowanie kart postaci, ich pól i\u00a0wariantów.' },
    error: 'Nie udało się potwierdzić dostępu. Odśwież stronę i\u00a0sprawdź logowanie.',
    views: { welcome: 'Witaj', characters: 'Moje postacie', 'my-talents': 'Moje talenty', talents: 'Talenty', 'talent-templates': 'Szablony talentów', 'styles-colors': 'Style i\u00a0kolory', 'character-templates': 'Szablony kart postaci' }
  },
  en: {
    editor: 'EDITOR', expand: 'Expand to window', expandHint: 'Expand', restore: 'Return to page', menu: 'Editor menu', personal: 'Your workspace', design: 'Design',
    loading: 'Checking access…', home: 'Go to Welcome', shortcuts: 'Shortcuts', welcomeHeading: 'Welcome to the Klanarchia RPG materials editor', welcomeTitle: 'The talent and character editor was unlocked during the Klanarchia crowdfunding campaign.', welcomeLead: 'You can already use it, but it is still in development and does not yet offer its full functionality. All materials available here should be treated as prototypes.',
    descriptions: { characters: 'Your characters, sheets and character details.', 'my-talents': 'Your own collection of talents.', talents: 'Content, parameters and organisation of the talent library.', 'talent-templates': 'Talent card design: layout, text and symbols.', 'styles-colors': 'Shared text annotation styles and colour palette.', 'character-templates': 'Character sheet design, fields and variants.' },
    error: 'Unable to confirm access. Reload the page and check your login.',
    views: { welcome: 'Welcome', characters: 'My characters', 'my-talents': 'My talents', talents: 'Talents', 'talent-templates': 'Talent templates', 'styles-colors': 'Styles and colours', 'character-templates': 'Character sheet templates' }
  }
};
function selectedView(): View {
  const value = window.location.hash.slice(1) as View;
  return allViews.includes(value) ? value : 'welcome';
}
function Icon({ view }: { view: View }) {
  const paths: Record<View, string> = {
    welcome: 'M3 11 12 3l9 8M5 10v11h14V10M9 21v-7h6v7',
    characters: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3a4 4 0 0 1 0 8M22 21v-2a4 4 0 0 0-3-3.87M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
    'my-talents': 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z',
    talents: 'M5 3h14v18H5V3ZM8 7h8M8 11h8M8 15h5',
    'talent-templates': 'M3 5h18v14H3V5ZM3 10h18M8 10v9',
    'styles-colors': 'M4 4h7v7H4V4ZM14 4h6v6h-6V4ZM4 14h6v6H4v-6ZM17 13a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z',
    'character-templates': 'M5 2h14v20H5V2ZM8 6h8M8 10h3v4H8v-4ZM14 10h2M14 14h2M8 18h8'
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[view]} /></svg>;
}
function App({ config }: { config: Config }) {
  const t = messages[config.language];
  const [view, setView] = useState<View>(selectedView);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showExpandHint, setShowExpandHint] = useState(() => {
    try { return !document.cookie.split(';').some(cookie => cookie.trim() === 'ke_expand_hint_seen=1'); }
    catch { return true; }
  });
  function toggleExpanded() {
    if (!expanded) {
      setShowExpandHint(false);
      try {
        document.cookie = `ke_expand_hint_seen=1; Max-Age=31536000; Path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
      } catch { /* Brak zgody przeglądarki na zapis nie blokuje powiększenia. */ }
    }
    setExpanded(value => !value);
  }
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [canDesign, setCanDesign] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [hintLeaving, setHintLeaving] = useState(false);
  useEffect(() => {
    if (!showExpandHint || expanded || status !== 'ready') return;
    const enter = window.setTimeout(() => { setHintLeaving(false); setHintVisible(true); }, 1000);
    const leave = window.setTimeout(() => setHintLeaving(true), 7000);
    const finish = window.setTimeout(() => { setHintVisible(false); setShowExpandHint(false); }, 7400);
    return () => { window.clearTimeout(enter); window.clearTimeout(leave); window.clearTimeout(finish); };
  }, [showExpandHint, expanded, status]);
  useEffect(() => {
    const changed = () => { setView(selectedView()); setMenuOpen(false); };
    window.addEventListener('hashchange', changed);
    return () => window.removeEventListener('hashchange', changed);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    fetch(config.apiUrl, { credentials: 'same-origin', headers: { 'X-WP-Nonce': config.nonce }, signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error('Access denied');
        const data = await response.json();
        if (data.status !== 'ok') throw new Error('Invalid response');
        setCanDesign(data.permissions?.accessEditor === true);
        setStatus('ready');
      })
      .catch(error => { if (error.name !== 'AbortError') setStatus('error'); });
    return () => controller.abort();
  }, [config]);
  useEffect(() => {
    if (!expanded) return;
    const root = document.getElementById('klanarchia-editor');
    if (!root) return;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const hidden: { element: HTMLElement; inert: boolean }[] = [];
    // Wyłączamy fokus i interakcję z zasłoniętą stroną, zachowując wcześniejszy stan.
    let branch: HTMLElement = root;
    while (branch.parentElement) {
      for (const sibling of branch.parentElement.children) {
        if (sibling !== branch && sibling instanceof HTMLElement && !['SCRIPT', 'STYLE', 'LINK', 'HEAD'].includes(sibling.tagName)) {
          hidden.push({ element: sibling, inert: sibling.inert });
          sibling.inert = true;
        }
      }
      if (branch.parentElement === document.body) break;
      branch = branch.parentElement;
    }
    root.classList.add('ke-expanded');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setExpanded(false); }
    };
    window.addEventListener('keydown', escape);
    return () => {
      window.removeEventListener('keydown', escape);
      root.classList.remove('ke-expanded');
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      hidden.forEach(({ element, inert }) => { element.inert = inert; });
      root.querySelector<HTMLButtonElement>('.ke-expand-toggle')?.focus({ preventScroll: true });
    };
  }, [expanded]);
  const isDesign = designViews.includes(view);
  const allowed = !isDesign || canDesign;
  function choose(next: View) {
    window.location.hash = next;
    setView(next);
    setMenuOpen(false);
  }
  function items(views: View[]) {
    return views.map(item => <button key={item} type="button" className="ke-menu-item" aria-current={view === item ? 'page' : undefined} onClick={() => choose(item)}><Icon view={item} /><span>{t.views[item]}</span></button>);
  }
  function shortcuts(views: View[]) {
    return views.filter((item): item is Exclude<View, 'welcome'> => item !== 'welcome').map(item =>
      <button key={item} type="button" className="ke-shortcut" onClick={() => choose(item)}>
        <span className="ke-shortcut-icon"><Icon view={item} /></span>
        <span className="ke-shortcut-title">{t.views[item]}</span>
        <span className="ke-shortcut-description">{t.descriptions[item]}</span>
      </button>
    );
  }
  return <div className="ke-shell" lang={config.language}>
    <header className="ke-topbar">
      <h1 className="ke-brand"><button type="button" className="ke-brand-home" aria-label={t.home} onClick={() => choose('welcome')}><img src={logoUrl} alt="Klanarchia" width="320" height="200" /><span>{t.editor}</span></button></h1>
      <button type="button" className="ke-menu-toggle" aria-expanded={menuOpen} aria-controls="ke-navigation" onClick={() => setMenuOpen(open => !open)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>{t.menu}</button>
      <nav id="ke-navigation" className={`ke-navigation${menuOpen ? ' is-open' : ''}`} aria-label={t.menu}>
        <div className="ke-menu-group"><p className="ke-group-label">{t.personal}</p>{items(userViews)}</div>
        {canDesign && <div className="ke-menu-group"><p className="ke-group-label">{t.design}</p>{items(designViews)}</div>}
      </nav>
      <div className="ke-expand-control"><button type="button" className="ke-expand-toggle" aria-pressed={expanded} aria-label={expanded ? t.restore : t.expand} title={expanded ? `${t.restore} (Esc)` : t.expand} aria-describedby={hintVisible && showExpandHint && !expanded && status === 'ready' ? 'ke-expand-hint' : undefined} onClick={toggleExpanded}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={expanded ? 'M9 3v6H3M15 3v6h6M9 21v-6H3M15 21v-6h6' : 'M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5'} /></svg>
      </button>
      {hintVisible && showExpandHint && !expanded && status === 'ready' && <div id="ke-expand-hint" className={`ke-expand-hint${hintLeaving ? ' is-leaving' : ''}`} role="note">
        <svg className="ke-hint-arrow" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 26C17 26 22 17 22 3M16 9l6-6 4 7" /></svg>
        {t.expandHint}
      </div>}
      </div>
    </header>
    <section className="ke-workspace" aria-labelledby={view === 'welcome' || view === 'talent-templates' || view === 'talents' ? undefined : 'ke-view-title'} aria-label={view === 'welcome' || view === 'talent-templates' || view === 'talents' ? t.views[view] : undefined}>
      {view !== 'welcome' && view !== 'talent-templates' && view !== 'talents' && <header className="ke-workspace-header"><p className="ke-breadcrumb">{isDesign ? t.design : t.personal}</p><h2 id="ke-view-title">{t.views[view]}</h2></header>}
      <div className="ke-workspace-body">
        {view === 'welcome' && status === 'ready' && <div className="ke-welcome">
          <h2 className="ke-welcome-heading">{t.welcomeHeading}</h2><div className="ke-welcome-intro"><p><strong>{t.welcomeTitle}</strong></p><p>{t.welcomeLead}</p></div>
          <section className="ke-welcome-section" aria-labelledby="ke-personal-title"><h3 id="ke-personal-title">{t.shortcuts}</h3><div className="ke-shortcuts">{shortcuts(userViews)}</div></section>
        </div>}
        {status === 'ready' && canDesign && <div hidden={view !== 'talent-templates'}><TalentTemplateCreator storageKey={`ke:talent-templates:${config.userId}`} language={config.language} active={view === 'talent-templates'} /></div>}
        {status === 'ready' && canDesign && <div hidden={view !== 'talents'}><TalentLibrary language={config.language} active={view === 'talents'} /></div>}
        {status === 'ready' && canDesign && <div hidden={view !== 'styles-colors'}><StylesColours language={config.language} storageKey={'ke:styles-colors:' + config.userId} /></div>}
        {status === 'loading' && <p className="ke-status" role="status">{t.loading}</p>}
        {(status === 'error' || (status === 'ready' && !allowed)) && <p className="ke-status ke-error" role="alert">{t.error}</p>}
      </div>
    </section>
  </div>;
}
const mount = document.getElementById('klanarchia-editor');
if (mount?.dataset.config) {
  const config: Config = JSON.parse(mount.dataset.config);
  configureApi(config);
  createRoot(mount).render(<App config={config} />);
}
