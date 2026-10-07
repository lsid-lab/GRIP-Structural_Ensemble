import { withBase, type Content } from '../content';
import { useContent } from '../context';
import PageHeader from '../components/PageHeader';
import SmartLink from '../components/SmartLink';

type GroupLead = Content['members']['leader'];

/** 写真。未登録のときは人型のシルエットを表示 */
function Avatar({ photo, name, className }: { photo?: string; name: string; className: string }) {
  if (photo) return <img className={className} src={withBase(photo)} alt={name} loading="lazy" />;
  return (
    <div className={`${className} avatar-empty`} aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="8.5" r="4" />
        <path d="M4 21c0-4.4 3.6-7.5 8-7.5s8 3.1 8 7.5z" />
      </svg>
    </div>
  );
}

function GroupCard({ group, ja }: { group: GroupLead; ja: boolean }) {
  return (
    <article className="group-card">
      <div className="group-lead">
        <Avatar photo={group.photo} name={group.name} className="group-lead-photo" />
        <div>
          <p className="group-lead-name">{group.name}</p>
          <p className="group-lead-aff">
            {group.affiliation}
            {group.position && ` ${group.position}`}
          </p>
          {group.role && <p className="group-lead-role">{group.role}</p>}
        </div>
      </div>
      {group.members.length > 0 && (
        <>
          <h3 className="group-members-title">{ja ? '研究参加者' : 'Members'}</h3>
          <ul className="group-members">
            {group.members.map((m, i) => (
              <li key={i} className="group-member">
                <Avatar photo={m.photo} name={m.name} className="group-member-photo" />
                <span className="group-member-name">{m.name}</span>
                {(m.affiliation || m.position) && (
                  <span className="group-member-pos">{[m.affiliation, m.position].filter(Boolean).join(' ')}</span>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </article>
  );
}

export default function Members() {
  const { lang, members } = useContent();
  const ja = lang === 'ja';
  const { leader, groups, partners } = members;
  return (
    <>
      <PageHeader pageKey="members" />
      <div className="container page-body">
        <section className="section">
          <h2 className="section-title">{ja ? '課題代表機関' : 'Lead Institution'}</h2>
          <GroupCard group={leader} ja={ja} />
        </section>

        {groups.length > 0 && (
          <section className="section">
            <h2 className="section-title">{ja ? '分担研究機関' : 'Collaborating Institutions'}</h2>
            <div className="group-grid">
              {groups.map((g, i) => (
                <GroupCard key={i} group={g} ja={ja} />
              ))}
            </div>
          </section>
        )}

        <section className="section">
          <h2 className="section-title">{ja ? '連携機関' : 'Partner Institutions'}</h2>
          <ul className="partner-grid">
            {partners.map((p, i) => (
              <li key={i} className="partner-card">
                <p className="partner-name">
                  {p.url ? <SmartLink to={p.url}>{p.name}</SmartLink> : p.name}
                </p>
                {p.role && <p className="partner-role">{p.role}</p>}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
