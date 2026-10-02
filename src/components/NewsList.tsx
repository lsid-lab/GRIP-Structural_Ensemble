import { formatDate } from '../content';
import { useContent } from '../context';
import SmartLink from './SmartLink';

type Item = { date: string; category: string; title: string; link?: string };

export default function NewsList({ items }: { items: Item[] }) {
  const { lang } = useContent();
  if (items.length === 0) return <p className="empty">{lang === 'ja' ? 'お知らせはまだありません。' : 'No news yet.'}</p>;
  return (
    <ul className="news-list">
      {items.map((n, i) => (
        <li key={i} className="news-item">
          <time dateTime={n.date}>{formatDate(n.date)}</time>
          <span className="tag">{n.category}</span>
          {n.link ? (
            <SmartLink to={n.link} className="news-title is-link">
              {n.title}
            </SmartLink>
          ) : (
            <span className="news-title">{n.title}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
