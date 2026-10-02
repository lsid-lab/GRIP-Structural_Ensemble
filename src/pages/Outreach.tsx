import { formatDate, withBase } from '../content';
import { useContent } from '../context';
import PageHeader from '../components/PageHeader';
import SmartLink from '../components/SmartLink';

export default function Outreach() {
  const { lang, outreach } = useContent();
  return (
    <>
      <PageHeader pageKey="outreach" />
      <div className="container page-body">
        {outreach.length === 0 ? (
          <p className="empty">{lang === 'ja' ? '現在準備中です。' : 'Coming soon.'}</p>
        ) : (
          <ul className="outreach-list">
            {outreach.map((o, i) => (
              <li key={i} className="outreach-card">
                {o.image && <img src={withBase(o.image)} alt="" loading="lazy" />}
                <div>
                  <p className="outreach-meta">
                    <time dateTime={o.date}>{formatDate(o.date)}</time>
                    <span className="tag">{o.type}</span>
                  </p>
                  <h3>{o.link ? <SmartLink to={o.link}>{o.title}</SmartLink> : o.title}</h3>
                  {o.body && <p>{o.body}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
