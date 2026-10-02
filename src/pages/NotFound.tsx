import { Link } from 'react-router-dom';
import { pathFor } from '../content';
import { useContent } from '../context';

export default function NotFound() {
  const { lang } = useContent();
  const ja = lang === 'ja';
  return (
    <div className="container page-body narrow not-found">
      <p className="section-sub">404</p>
      <h1>{ja ? 'ページが見つかりません' : 'Page not found'}</h1>
      <Link to={pathFor(lang, 'home')} className="more-link">
        {ja ? 'トップページへ' : 'Back to top'}
      </Link>
    </div>
  );
}
