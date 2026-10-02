import { site as siteConfig, withBase, type PageKey } from '../content';
import { useContent } from '../context';

export default function PageHeader({ pageKey }: { pageKey: PageKey }) {
  const { site } = useContent();
  const nav = site.nav.find((n) => n.key === pageKey);
  return (
    <section className="page-header" style={{ backgroundImage: `url(${withBase(siteConfig.heroImage)})` }}>
      <div className="container">
        <p className="page-header-sub">{nav?.sub}</p>
        <h1>{nav?.label ?? pageKey}</h1>
      </div>
    </section>
  );
}
