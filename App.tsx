import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import Contact from './pages/Contact';
import Search from './pages/Search';
import GeminiChat from './components/GeminiChat';

// Scroll to top wrapper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen font-sans bg-slate-950 text-white selection:bg-brand-primary selection:text-white">
        <ScrollToTop />
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/search" element={<Search />} />
            <Route path="*" element={<div className="h-screen flex items-center justify-center text-2xl text-gray-500">404 | Page Not Found</div>} />
          </Routes>
        </main>
        <Footer />
        <GeminiChat />
      </div>
    </Router>
  );
};

export default App;