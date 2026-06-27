import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import SocialShieldLauncher from './components/ui/SocialShieldLauncher';
import DevNoteLauncher from './components/ui/DevNoteLauncher';

function App() {
  useEffect(() => {
    const stored = localStorage.getItem('privaguard-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored ?? (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 60px - 85px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      <Footer />
      <SocialShieldLauncher />
      <DevNoteLauncher />
    </BrowserRouter>
  );
}

export default App;
