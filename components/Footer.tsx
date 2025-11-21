import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
        <p className="mb-2">&copy; {new Date().getFullYear()} En Garde Data. All rights reserved.</p>
        <p className="font-mono text-xs text-gray-600">
          Built with React, Tailwind, Three.js & Gemini API.
        </p>
      </div>
    </footer>
  );
};

export default Footer;