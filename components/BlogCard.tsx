import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <Link to={`/blog/${post.id}`} className="group">
      <article className="h-full bg-slate-800/50 border border-white/5 rounded-xl overflow-hidden hover:border-brand-primary/50 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-brand-primary/20 flex flex-col">
        
        {/* Render Image Only If It Exists (It won't for research posts) */}
        {post.coverImage && (
          <div className="relative h-48 overflow-hidden">
             <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
          </div>
        )}
        
        <div className="p-6 flex-1 flex flex-col">
          {/* Tags moved here for text-only layout visibility */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs font-mono bg-slate-700/50 text-brand-primary px-2 py-1 rounded border border-brand-primary/20">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-400 mb-3 font-mono">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{post.readTime}</span>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-glow transition-colors">
            {post.title}
          </h3>
          
          <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
            {post.excerpt}
          </p>
          
          <div className="text-brand-primary text-sm font-semibold flex items-center gap-1">
            Read Article <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;