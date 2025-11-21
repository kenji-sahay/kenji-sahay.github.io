import React from 'react';
import { PORTFOLIO_ITEMS } from '../constants';
import PortfolioCard from '../components/PortfolioCard';

const Portfolio: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Creative Portfolio</h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            A curated collection of my best work in digital art, film, and software development.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PORTFOLIO_ITEMS.map(item => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;