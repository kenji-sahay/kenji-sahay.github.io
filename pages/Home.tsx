import React from 'react';
import ThreeHero from '../components/ThreeHero';
import BlogCard from '../components/BlogCard';
import PortfolioCard from '../components/PortfolioCard';
import { BLOG_POSTS, PORTFOLIO_ITEMS } from '../constants';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const recentPosts = BLOG_POSTS.slice(0, 6);
  const featuredPortfolio = PORTFOLIO_ITEMS.slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-950">
      <ThreeHero />
      
      {/* Recent Journal Entries */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 border-l-4 border-brand-primary pl-4">Latest Research</h2>
            <p className="text-gray-400 pl-5">Notes from the field on LLMs, ML, and Data Engineering.</p>
          </div>
          <Link to="/blog" className="hidden sm:flex items-center text-brand-primary hover:text-brand-glow transition-colors font-mono">
            View Archive <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
        
        <div className="mt-12 sm:hidden text-center">
          <Link to="/blog" className="inline-flex items-center justify-center text-brand-primary font-bold">
             View All Posts <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </section>

      {/* Creative Works */}
      <section className="py-20 bg-slate-900 border-y border-white/5 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-glow to-transparent opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 border-l-4 border-brand-accent pl-4">Creative Output</h2>
              <p className="text-gray-400 pl-5">Creative Works</p>
            </div>
             <Link to="/portfolio" className="hidden sm:flex items-center text-brand-primary hover:text-brand-glow transition-colors font-mono">
              View Gallery <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPortfolio.map(item => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* About Teaser */}
      <section className="py-24 px-4 text-center bg-gradient-to-b from-slate-950 to-brand-dark">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6">Bridging <span className="text-brand-accent">Art</span> & <span className="text-brand-primary">Algorithms</span></h2>
          <p className="text-xl text-gray-400 mb-10 leading-relaxed">
            I'm a highschool student who is interested in Data Science/ML obsessed with visual storytelling. I love to make digital art and also research LLMs!
          </p>
          <Link to="/about" className="inline-block bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-brand-glow hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            More About Me
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
