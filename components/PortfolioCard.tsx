import React from 'react';
import { PortfolioItem } from '../types';
import { ExternalLink } from 'lucide-react';

interface PortfolioCardProps {
  item: PortfolioItem;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ item }) => {
  return (
    <div className="group relative rounded-xl overflow-hidden aspect-square bg-slate-800">
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <span className="text-brand-glow font-mono text-xs uppercase tracking-wider mb-1 block">
            {item.type}
          </span>
          <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
          <p className="text-gray-300 text-sm mb-4">{item.description}</p>
          
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white border border-white/20 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm backdrop-blur-sm transition-colors w-fit"
            >
              View Project <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;