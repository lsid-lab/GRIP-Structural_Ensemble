import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { brandName, getContent, languages, oneLine, pageTitle, parsePath, pathFor, type Lang } from '../content';
import { ContentContext } from '../context';

export default function Layout({ lang }: { lang: Lang }) {
  const content = getContent(lang);
  const { site } = content;
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.title = pageTitle(pathname);
    document.documentElement.lang = lang;
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [pathname, lang]);

  const { key } = parsePath(pathname);
  const siteAbbr = brandName(lang).split('｜')[0];
  const otherLang: Lang = lang === 'ja' ? 'en' : 'ja';

  return (
    <ContentContext.Provider value={content}>
      <header className="site-header">
        <div className="container header-inner">
          <Link to={pathFor(lang, 'home')} className="brand">
            <span className="brand-mark" aria-hidden="true" />
            <span className="brand-abbr">{siteAbbr}</span>
            {site.shortTitle && (
              <>
                <span className="brand-sep" aria-hidden="true">｜</span>
                <span className="brand-text">{site.shortTitle}</span>
              </>
            )}
          </Link>
          <button
            className="menu-button"
            aria-expanded={menuOpen}
            aria-controls="global-nav"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="menu-icon" aria-hidden="true" />
            <span className="sr-only">メニュー</span>
          </button>
          <nav id="global-nav" className={`global-nav${menuOpen ? ' is-open' : ''}`}>
            <ul>
              {site.nav.map((n) => (
                <li key={n.key}>
                  <NavLink to={pathFor(lang, n.key)}>{n.label}</NavLink>
                </li>
              ))}
            </ul>
            {languages.length > 1 && (
              <Link className="lang-switch" to={pathFor(otherLang, key ?? 'home')}>
                {otherLang === 'en' ? 'English' : '日本語'}
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <p className="footer-title">{oneLine(site.title)}</p>
            <p className="footer-meta">{site.program}</p>
            <p className="footer-meta">{site.organization}</p>
          </div>
          <ul className="footer-nav">
            {site.nav.map((n) => (
              <li key={n.key}>
                <Link to={pathFor(lang, n.key)}>{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="container footer-copy">© {new Date().getFullYear()} {brandName(lang)}</div>
      </footer>
    </ContentContext.Provider>
  );
}
