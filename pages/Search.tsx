import React, { useState, useMemo } from 'react';
import { Search as SearchIcon, FileText, Image } from 'lucide-react';
import { BLOG_POSTS, PORTFOLIO_ITEMS } from '../constants';
import { Link } from 'react-router-dom';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return { posts: [], portfolio: [] };
    
    const lowerQuery = query.toLowerCase();
    
    const posts = BLOG_POSTS.filter(p => 
      p.title.toLowerCase().includes(lowerQuery) || 
      p.excerpt.toLowerCase().includes(lowerQuery) ||
      p.tags.some(t => t.toLowerCase().includes(lowerQuery))
    );
    
    const portfolio = PORTFOLIO_ITEMS.filter(p => 
      p.title.toLowerCase().includes(lowerQuery) || 
      p.description.toLowerCase().includes(lowerQuery) ||
      p.type.toLowerCase().includes(lowerQuery)
    );

    return { posts, portfolio };
  }, [query]);

  return (
    <div className="min-h-screen bg-slate-950 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Search Archive</h1>
        
        <div className="relative mb-12">
          <input
            type="text"
            placeholder="Type to search articles, tags, or projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 pl-14 text-lg text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
            autoFocus
          />
          <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={24} />
        </div>

        {query && (
          <div className="space-y-8">
            {/* Blog Results */}
            {results.posts.length > 0 && (
              <section>
                <h2 className="text-sm font-mono text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <FileText size={16} /> Journal Entries ({results.posts.length})
                </h2>
                <div className="space-y-4">
                  {results.posts.map(post => (
                    <Link key={post.id} to={`/blog/${post.id}`} className="block bg-slate-900/50 p-4 rounded-lg border border-white/5 hover:border-brand-primary/50 transition-colors">
                      <h3 className="text-lg font-bold text-white mb-1">{post.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">{post.excerpt}</p>
                      <div className="flex gap-2">
                        {post.tags.map(t => (
                          <span key={t} className="text-xs bg-slate-800 text-gray-300 px-2 py-0.5 rounded">{t}</span>
                        ))}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Portfolio Results */}
            {results.portfolio.length > 0 && (
              <section>
                <h2 className="text-sm font-mono text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Image size={16} /> Creative Works ({results.portfolio.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {results.portfolio.map(item => (
                    <Link key={item.id} to="/portfolio" className="flex items-center gap-4 bg-slate-900/50 p-3 rounded-lg border border-white/5 hover:border-brand-primary/50 transition-colors">
                      <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-md" />
                      <div>
                        <h3 className="text-white font-bold">{item.title}</h3>
                        <span className="text-xs text-brand-glow">{item.type}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {results.posts.length === 0 && results.portfolio.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No matches found. Try searching for "RAG", "Art", or "React".
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;