import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { BLOG_POSTS } from '../constants';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';

const BlogPost: React.FC = () => {
  const { id } = useParams();
  const post = BLOG_POSTS.find(p => p.id === id);

  useEffect(() => {
    // Trigger syntax highlighting if the library is loaded
    if ((window as any).hljs) {
      (window as any).hljs.highlightAll();
    }
  }, [post]);

  if (!post) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Link to="/blog" className="inline-flex items-center text-gray-400 hover:text-brand-primary mb-8 transition-colors group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Journal
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-wrap gap-4 text-sm text-gray-400 font-mono mb-6">
            <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1 rounded-full border border-white/5">
              <Calendar size={14} /> {post.date}
            </div>
            <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1 rounded-full border border-white/5">
              <Clock size={14} /> {post.readTime}
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Link 
                key={tag} 
                to={`/blog?tag=${tag}`}
                className="flex items-center gap-1 text-xs font-mono text-brand-glow bg-brand-glow/10 px-2 py-1 rounded hover:bg-brand-glow/20 transition-colors"
              >
                <Tag size={12} /> {tag}
              </Link>
            ))}
          </div>
        </header>

        {/* Cover Image */}
        <div className="aspect-video w-full rounded-2xl overflow-hidden mb-10 bg-slate-800 border border-white/5 shadow-2xl relative group">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="prose-custom">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm, remarkMath]} 
            rehypePlugins={[rehypeRaw, rehypeKatex]}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Footer of Post */}
        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <h3 className="text-white font-semibold mb-2">Enjoyed this read?</h3>
          <p className="text-gray-400 text-sm mb-6">Check out the portfolio to see these concepts in action.</p>
          <Link to="/portfolio" className="inline-block px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-blue-600 transition-all font-medium shadow-lg shadow-brand-primary/25">
            View Portfolio
          </Link>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;