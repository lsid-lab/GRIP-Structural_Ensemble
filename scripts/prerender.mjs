// vite build の後に実行し、各ページの HTML（dist/<ページ>/index.html）を書き出す
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = path.resolve('dist');
const ssrDir = path.resolve('dist-ssr');
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const { render, allPaths } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);

const pages = [...allPaths(), '/404'];
for (const p of pages) {
  const { html, head, lang } = render(p);
  const out = template
    .replace('<!--app-->', html)
    .replace('<!--head-->', head)
    .replace('<html lang="ja">', `<html lang="${lang}">`);
  const file = p === '/404' ? path.join(dist, '404.html') : path.join(dist, p, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, out);
  console.log('  書き出し:', path.relative(dist, file));
}
fs.writeFileSync(path.join(dist, '.nojekyll'), '');
// フォルダ自体は残す（Dropbox 同期除外の設定を保つため）
for (const f of fs.readdirSync(ssrDir)) fs.rmSync(path.join(ssrDir, f), { recursive: true, force: true });
