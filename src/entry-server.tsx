// ビルド時に各ページの HTML を書き出すための入口（scripts/prerender.mjs から使用）
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import { allPaths, pageTitle, parsePath, site, withBase } from './content';

const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

function escape(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

export function render(path: string) {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={basename + path} basename={basename || undefined}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
  const { lang } = parsePath(path);
  const head = [
    `<title>${escape(pageTitle(path))}</title>`,
    `<meta name="description" content="${escape(site[lang].lead)}" />`,
    `<meta property="og:title" content="${escape(pageTitle(path))}" />`,
    `<meta property="og:image" content="${withBase(site.heroImage)}" />`,
    site.noindex ? '<meta name="robots" content="noindex, nofollow" />' : '',
  ].join('\n    ');
  return { html, head, lang };
}

export { allPaths };
