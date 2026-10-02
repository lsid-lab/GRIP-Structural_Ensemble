import { createContext, useContext } from 'react';
import type { Content } from './content';

export const ContentContext = createContext<Content | null>(null);

export function useContent(): Content {
  const c = useContext(ContentContext);
  if (!c) throw new Error('ContentContext がありません');
  return c;
}
