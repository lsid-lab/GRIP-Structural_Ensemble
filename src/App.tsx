import { Route, Routes } from 'react-router-dom';
import { languages, pathFor } from './content';
import Layout from './components/Layout';
import Home from './pages/Home';
import Greeting from './pages/Greeting';
import Overview from './pages/Overview';
import Members from './pages/Members';
import Outreach from './pages/Outreach';
import News from './pages/News';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      {languages.map((lang) => (
        <Route key={lang} path={pathFor(lang, 'home')} element={<Layout lang={lang} />}>
          <Route index element={<Home />} />
          <Route path="greeting" element={<Greeting />} />
          <Route path="overview" element={<Overview />} />
          <Route path="members" element={<Members />} />
          <Route path="outreach" element={<Outreach />} />
          <Route path="news" element={<News />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      ))}
    </Routes>
  );
}
