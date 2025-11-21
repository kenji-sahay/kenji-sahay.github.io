import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { label: 'Home', path: '/' },
    { label: 'Blog', path: '/blog' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 bg-brand-dark/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-white font-bold text-xl tracking-wider hover:text-brand-glow transition-colors">
              EN GARDE<span className="text-brand-primary">.DATA</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'text-brand-glow bg-white/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/search" className="text-gray-300 hover:text-brand-glow">
                <Search size={20} />
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-dark border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'text-brand-glow bg-white/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
             <Link
                to="/search"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
              >
                Search
              </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;