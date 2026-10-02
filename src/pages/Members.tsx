import { useContent } from '../context';
import PageHeader from '../components/PageHeader';
import SmartLink from '../components/SmartLink';

export default function Members() {
  const { lang, members } = useContent();
  const ja = lang === 'ja';
  const { leader, participants, partners } = members;
  return (
    <>
      <PageHeader pageKey="members" />
      <div className="container page-body">
        <section className="section">
          <h2 className="section-title">{ja ? '課題代表者' : 'Project Leader'}</h2>
          <div className="leader-card">
            <p className="leader-name">{leader.name}</p>
            <p className="leader-aff">
              {leader.affiliation}
              {leader.position && ` ${leader.position}`}
            </p>
            {leader.role && <p className="leader-role">{leader.role}</p>}
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">{ja ? '研究参加者' : 'Participants'}</h2>
          <div className="member-table" role="table">
            <div className="member-row member-head" role="row">
              <span role="columnheader">{ja ? '氏名' : 'Name'}</span>
              <span role="columnheader">{ja ? '所属・役職' : 'Affiliation'}</span>
              <span role="columnheader">{ja ? '実施内容' : 'Role'}</span>
            </div>
            {participants.map((p, i) => (
              <div className="member-row" role="row" key={i}>
                <span role="cell" className="member-name">{p.name}</span>
                <span role="cell" className="member-aff">
                  {p.affiliation}
                  {p.position && <small>{p.position}</small>}
                </span>
                <span role="cell" className="member-role">{p.role}</span>
              </div>
            ))}
          </div>
        </section>

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
