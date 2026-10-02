import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

/** 外部リンク（http〜）は新しいタブ、サイト内リンク（/〜）はページ遷移 */
export default function SmartLink({ to, className, children }: { to: string; className?: string; children: ReactNode }) {
  if (/^https?:\/\//.test(to)) {
    return (
      <a href={to} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}
