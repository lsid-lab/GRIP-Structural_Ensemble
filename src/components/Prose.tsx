import { useContent } from '../context';

/** Markdown から変換した本文。draft: true なら「仮原稿」ラベルを表示 */
export default function Prose({ html, draft, lead }: { html: string; draft?: boolean; lead?: string }) {
  const { lang } = useContent();
  return (
    <>
      {draft && <p className="draft-badge">{lang === 'ja' ? '仮原稿' : 'Draft'}</p>}
      {lead && <p className="prose-lead">{lead}</p>}
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
