import React, { useState, useEffect } from 'react';
import { BLOG_POSTS } from '../constants';
import BlogCard from '../components/BlogCard';
import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const Blog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tagParam = searchParams.get('tag');
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  
  const [activeTag, setActiveTag] = useState<string | null>(tagParam);
  const [currentPage, setCurrentPage] = useState(pageParam);

  // Extract unique tags
  const allTags = Array.from(new Set(BLOG_POSTS.flatMap(post => post.tags)));

  useEffect(() => {
    setActiveTag(tagParam);
    setCurrentPage(1); // Reset to page 1 when tag changes
  }, [tagParam]);

  const handleTagClick = (tag: string | null) => {
    if (tag) {
      setSearchParams({ tag, page: '1' });
    } else {
      setSearchParams({ page: '1' });
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.set('page', newPage.toString());
        return newParams;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredPosts = activeTag
    ? BLOG_POSTS.filter(post => post.tags.includes(activeTag))
    : BLOG_POSTS;

  // Pagination Logic
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Technical Journal</h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Documenting my journey through machine learning, internships, and software engineering.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-10 flex flex-wrap items-center gap-3 bg-slate-900/50 p-4 rounded-xl border border-white/5">
          <div className="flex items-center text-gray-400 mr-2">
            <Filter size={18} className="mr-2" /> Filter by:
          </div>
          <button
            onClick={() => handleTagClick(null)}
            className={`px-4 py-1.5 rounded-full text-sm transition-all ${
              activeTag === null
                ? 'bg-white text-slate-900 font-bold'
                : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
            }`}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                activeTag === tag
                  ? 'bg-brand-primary text-white font-bold shadow-lg shadow-brand-primary/25'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[500px]">
          {paginatedPosts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No posts found for this tag.
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
            <div className="mt-16 flex justify-center items-center gap-4">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-slate-800 text-white hover:bg-brand-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>
                
                <span className="text-gray-400 font-mono">
                    Page {currentPage} of {totalPages}
                </span>

                <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-slate-800 text-white hover:bg-brand-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Blog;