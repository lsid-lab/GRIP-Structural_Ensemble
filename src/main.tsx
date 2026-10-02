import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css';

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;
const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// 本番（書き出し済みHTML）はハイドレート、開発時は通常描画
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
