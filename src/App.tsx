import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import HomePage from './pages/Home';
import ProgramsPage from './pages/Programs';
import ProgramDetailPage from './pages/ProgramDetail';
import EligibilityPage from './pages/Eligibility';
import AssistantPage from './pages/Assistant';
import MyServicesPage from './pages/MyServices';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/programs/:id" element={<ProgramDetailPage />} />
            <Route path="/eligibility" element={<EligibilityPage />} />
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/my-services" element={<MyServicesPage />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AppProvider>
  );
}
