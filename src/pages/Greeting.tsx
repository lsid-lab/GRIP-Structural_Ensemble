import { withBase } from '../content';
import { useContent } from '../context';
import PageHeader from '../components/PageHeader';
import Prose from '../components/Prose';

export default function Greeting() {
  const { greeting, members } = useContent();
  const leader = members.leader;
  const photo = greeting.photo ?? leader.photo;
  // 署名：greeting.md の signature があればそれを、無ければ members.yaml の代表者情報を使う
  const signature = greeting.signature ?? [`${leader.affiliation} ${leader.position ?? ''}`.trim(), leader.name];
  return (
    <>
      <PageHeader pageKey="greeting" />
      <div className="container page-body greeting">
        <div className="greeting-text">
          <Prose html={greeting.html} draft={greeting.draft} />
          <p className="signature">
            {signature.map((line, i) => (
              <span key={i}>{line}</span>
            ))}
          </p>
        </div>
        <figure className="greeting-photo">
          {photo ? (
            <img src={withBase(photo)} alt={leader.name} />
          ) : (
            <div className="photo-placeholder" aria-hidden="true">
              {leader.name.slice(0, 1)}
            </div>
          )}
          <figcaption>
            {signature.map((line, i) => (
              <span key={i}>{line}</span>
            ))}
          </figcaption>
        </figure>
      </div>
    </>
  );
}
