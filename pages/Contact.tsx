import React from 'react';
import { Mail, MapPin, Coffee } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-slate-900 p-8 rounded-2xl border border-white/10 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-2">Get In Touch</h1>
        <p className="text-gray-400 mb-8">Have a question or want to work together?</p>

        <div className="space-y-6 mb-8">
          <div className="flex items-center text-gray-300">
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-brand-primary mr-4">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Email</p>
              <a href="mailto:kenjisahay26@gmail.com" className="hover:text-white transition-colors">kenjisahay26@gmail.com</a>
            </div>
          </div>
          
          <div className="flex items-center text-gray-300">
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-brand-accent mr-4">
              <MapPin size={20} />
            </div>
             <div>
              <p className="text-xs text-gray-500 uppercase">Location</p>
              <span>Wilton, CT</span>
            </div>
          </div>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
            <input type="text" className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
            <textarea rows={4} className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-primary focus:outline-none"></textarea>
          </div>
          <button type="button" className="w-full bg-brand-primary hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            <Coffee size={18} /> Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
