import { withBase } from '../content';
import { useContent } from '../context';
import PageHeader from '../components/PageHeader';
import Prose from '../components/Prose';

export default function Greeting() {
  const { greeting, members } = useContent();
  const leader = members.leader;
  const photo = greeting.photo ?? leader.photo;
  return (
    <>
      <PageHeader pageKey="greeting" />
      <div className="container page-body greeting">
        <div className="greeting-text">
          <Prose html={greeting.html} draft={greeting.draft} />
          <p className="signature">
            <span>{leader.affiliation} {leader.position}</span>
            <strong>{leader.name}</strong>
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
            {leader.role}
            <br />
            <strong>{leader.name}</strong>
          </figcaption>
        </figure>
      </div>
    </>
  );
}
