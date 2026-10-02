import { useContent } from '../context';
import NewsList from '../components/NewsList';
import PageHeader from '../components/PageHeader';

export default function News() {
  const { news } = useContent();
  const years = [...new Set(news.map((n) => n.date.slice(0, 4)))];
  return (
    <>
      <PageHeader pageKey="news" />
      <div className="container page-body narrow">
        {years.length === 0 && <NewsList items={[]} />}
        {years.map((y) => (
          <section key={y} className="section">
            <h2 className="section-title">{y}</h2>
            <NewsList items={news.filter((n) => n.date.startsWith(y))} />
          </section>
        ))}
      </div>
    </>
  );
}
