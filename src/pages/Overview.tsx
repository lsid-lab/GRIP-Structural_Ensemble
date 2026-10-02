import { useContent } from '../context';
import PageHeader from '../components/PageHeader';
import Prose from '../components/Prose';

export default function Overview() {
  const { overview } = useContent();
  return (
    <>
      <PageHeader pageKey="overview" />
      <div className="container page-body narrow">
        <Prose html={overview.html} draft={overview.draft} />
      </div>
    </>
  );
}
