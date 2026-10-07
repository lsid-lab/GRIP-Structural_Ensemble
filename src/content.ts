// content/ フォルダの YAML・Markdown を読み込み、入力内容をチェックするモジュール。
// 学生が編集するのは content/ 側だけで、このファイルは通常触りません。
import YAML from 'yaml';
import { marked } from 'marked';
import { z } from 'zod';

export type Lang = 'ja' | 'en';
export const PAGE_KEYS = ['greeting', 'overview', 'members', 'outreach', 'news'] as const;
export type PageKey = (typeof PAGE_KEYS)[number];

const files = import.meta.glob('/content/**/*.{yaml,md}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const BASE = import.meta.env.BASE_URL;

/** "/images/a.jpg" のようなサイト内パスに公開先のベースパスを付ける */
export function withBase(path: string): string {
  return path.startsWith('/') ? BASE + path.slice(1) : path;
}

// ---------- スキーマ（入力ルール） ----------
const date = z
  .string({ error: '日付が必要です' })
  .regex(/^\d{4}-\d{2}-\d{2}$/, '日付は 2026-10-15 のように「年-月-日」で書いてください');
const text = z.string({ error: '文字が必要です' }).min(1, '空欄にできません');
const optionalText = z.string().nullish().transform((v) => v || undefined);

const navItem = z.object({
  key: z.enum(PAGE_KEYS, { error: `key は ${PAGE_KEYS.join(' / ')} のいずれかです` }),
  label: text,
  heading: optionalText,
  sub: text,
  description: optionalText,
});
const siteLang = z.object({
  title: text,
  shortTitle: optionalText,
  subtitle: optionalText,
  program: text,
  lead: text,
  period: text,
  organization: text,
  nav: z.array(navItem),
});
const siteSchema = z.object({
  noindex: z.boolean().default(true),
  englishEnabled: z.boolean().default(false),
  heroImage: text,
  abbr: text,
  ja: siteLang,
  en: siteLang,
});

const newsSchema = z
  .array(z.object({ date, category: text, title: text, link: optionalText }))
  .nullish()
  .transform((v) => v ?? []);

const person = z.object({
  name: text,
  affiliation: text,
  position: optionalText,
  role: optionalText,
  photo: optionalText,
});
// 研究参加者（グループ内のメンバー）。所属は省略するとグループ代表者と同じ扱い
const groupMember = z.object({
  name: text,
  affiliation: optionalText,
  position: optionalText,
  photo: optionalText,
});
const memberList = z.array(groupMember).nullish().transform((v) => v ?? []);
// グループ代表者（課題代表者・分担研究者）と、その下の研究参加者
const groupLead = person.extend({ members: memberList });
const membersSchema = z.object({
  leader: groupLead,
  groups: z.array(groupLead).nullish().transform((v) => v ?? []),
  partners: z
    .array(z.object({ name: text, role: optionalText, url: optionalText }))
    .nullish()
    .transform((v) => v ?? []),
});

const outreachSchema = z.object({
  items: z
    .array(
      z.object({
        date,
        type: text,
        title: text,
        body: optionalText,
        link: optionalText,
        image: optionalText,
      }),
    )
    .nullish()
    .transform((v) => v ?? []),
});

const frontSchema = z.object({
  draft: z.boolean().default(false),
  photo: optionalText,
  lead: optionalText,
  signature: z.array(text).nullish().transform((v) => v ?? undefined),
});

// ---------- 読み込み処理 ----------
function readRaw(path: string): string {
  const raw = files[`/content/${path}`];
  if (raw === undefined) throw new Error(`[content] ファイルが見つかりません: content/${path}`);
  return raw;
}

function check<T extends z.ZodType>(path: string, schema: T, data: unknown): z.output<T> {
  const r = schema.safeParse(data);
  if (r.success) return r.data;
  const lines = r.error.issues.map((i) => `  - ${i.path.map((k) => (typeof k === 'number' ? `${k + 1}件目` : String(k))).join(' > ') || '(全体)'}: ${i.message}`);
  throw new Error(`[content] 入力内容に誤りがあります: content/${path}\n${lines.join('\n')}`);
}

function parseYaml(path: string, raw: string): unknown {
  try {
    return YAML.parse(raw);
  } catch (e) {
    throw new Error(`[content] YAML の書き方に誤りがあります: content/${path}\n${(e as Error).message}`);
  }
}

function loadYaml<T extends z.ZodType>(path: string, schema: T): z.output<T> {
  return check(path, schema, parseYaml(path, readRaw(path)));
}

function renderMarkdown(md: string): string {
  const html = marked.parse(md, { async: false }) as string;
  // サイト内リンク・画像（/ で始まるもの）に公開先のベースパスを付ける
  return html.replace(/(src|href)="\/(?!\/)/g, `$1="${BASE}`);
}

function loadMarkdown(path: string) {
  const raw = readRaw(path).replace(/\r\n/g, '\n');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const front = check(path, frontSchema, m ? parseYaml(path, m[1]) ?? {} : {});
  return { ...front, html: renderMarkdown(m ? m[2] : raw) };
}

export const site = loadYaml('site.yaml', siteSchema);

/** ヘッダー等に出す名称（例：ACE-SEP｜創薬構造アンサンブル基盤） */
export function brandName(lang: Lang): string {
  const short = site[lang].shortTitle;
  return short ? `${site.abbr}｜${short}` : site.abbr;
}

/** 課題名の改行（\n）を取り除いた1行版（タブ名・フッター用） */
export function oneLine(s: string): string {
  return s.replace(/\s*\n\s*/g, '');
}
export const languages: Lang[] = site.englishEnabled ? ['ja', 'en'] : ['ja'];

function loadLang(lang: Lang) {
  const news = loadYaml(`${lang}/news.yaml`, newsSchema).sort((a, b) => b.date.localeCompare(a.date));
  const outreach = loadYaml(`${lang}/outreach.yaml`, outreachSchema).items.sort((a, b) =>
    b.date.localeCompare(a.date),
  );
  return {
    lang,
    site: site[lang],
    news,
    outreach,
    members: loadYaml(`${lang}/members.yaml`, membersSchema),
    greeting: loadMarkdown(`${lang}/greeting.md`),
    overview: loadMarkdown(`${lang}/overview.md`),
  };
}

export type Content = ReturnType<typeof loadLang>;

// 公開する言語のファイルだけ読み込む（英語版が無効の間は en/ の誤りでビルドが止まらない）
const cache: Partial<Record<Lang, Content>> = {};
export function getContent(lang: Lang): Content {
  return (cache[lang] ??= loadLang(lang));
}
for (const lang of languages) getContent(lang);

// ---------- URL ----------
export function pathFor(lang: Lang, key: PageKey | 'home'): string {
  const prefix = lang === 'ja' ? '' : `/${lang}`;
  return key === 'home' ? `${prefix}/` : `${prefix}/${key}/`;
}

/** URL から言語とページを判定（タイトル生成・言語切替用） */
export function parsePath(pathname: string): { lang: Lang; key: PageKey | 'home' | null } {
  const parts = pathname.split('/').filter(Boolean);
  let lang: Lang = 'ja';
  if (parts[0] === 'en' && languages.includes('en')) {
    lang = 'en';
    parts.shift();
  }
  if (parts.length === 0) return { lang, key: 'home' };
  const key = PAGE_KEYS.find((k) => k === parts[0]);
  return { lang, key: parts.length === 1 && key ? key : null };
}

export function allPaths(): string[] {
  return languages.flatMap((lang) => [pathFor(lang, 'home'), ...PAGE_KEYS.map((k) => pathFor(lang, k))]);
}

export function pageTitle(pathname: string): string {
  const { lang, key } = parsePath(pathname);
  const s = site[lang];
  if (key === 'home') return oneLine(s.title);
  const nav = key ? s.nav.find((n) => n.key === key) : undefined;
  const label = nav ? (nav.heading ?? nav.label) : lang === 'ja' ? 'ページが見つかりません' : 'Not Found';
  return `${label} | ${brandName(lang)}`;
}

export function formatDate(d: string): string {
  return d.replaceAll('-', '.');
}
