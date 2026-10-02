import { Link } from 'react-router-dom';
import { pathFor, site as siteConfig, withBase } from '../content';
import { useContent } from '../context';
import NewsList from '../components/NewsList';

const TOP_NEWS_COUNT = 5;

export default function Home() {
  const { lang, site, news } = useContent();
  const ja = lang === 'ja';
  const cards = site.nav.filter((n) => n.key !== 'news');

  return (
    <>
      <section className="hero" style={{ backgroundImage: `url(${withBase(siteConfig.heroImage)})` }}>
        <div className="container hero-inner">
          <p className="hero-program">{site.program}</p>
          <h1 className="hero-title">{site.title}</h1>
          <p className="hero-short">{site.shortTitle}</p>
          <p className="hero-period">
            {ja ? '実施期間' : 'Period'}：{site.period}
          </p>
        </div>
      </section>

      <section className="container home-news" aria-labelledby="home-news-title">
        <div className="home-news-card">
          <div className="home-news-head">
            <p className="section-sub">NEWS</p>
            <h2 id="home-news-title">{ja ? 'お知らせ' : 'News'}</h2>
            <Link to={pathFor(lang, 'news')} className="more-link">
              {ja ? '一覧を見る' : 'View all'}
            </Link>
          </div>
          <NewsList items={news.slice(0, TOP_NEWS_COUNT)} />
        </div>
      </section>

      <section className="container home-lead">
        <p>{site.lead}</p>
      </section>

      <section className="container home-cards">
        {cards.map((n) => (
          <Link key={n.key} to={pathFor(lang, n.key)} className="link-card">
            <span className="link-card-sub">{n.sub}</span>
            <span className="link-card-label">{n.label}</span>
            {n.description && <span className="link-card-desc">{n.description}</span>}
            <span className="link-card-arrow" aria-hidden="true">→</span>
          </Link>
        ))}
      </section>
    </>
  );
}
