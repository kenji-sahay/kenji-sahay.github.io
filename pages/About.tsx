import React from 'react';
import { Mail, Github, Linkedin, Twitter } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Profile Image */}
          <div className="w-full md:w-1/3 sticky top-24">
             <div className="aspect-square rounded-2xl overflow-hidden bg-slate-800 border-2 border-brand-primary/30 shadow-2xl shadow-brand-primary/10 mb-6">
               <img src="" alt="Profile" className="w-full h-full object-cover" />
             </div>
             <div className="flex justify-center space-x-6 text-gray-400">
               <a href="#" className="hover:text-white transition-colors"><Github size={24} /></a>
               <a href="#" className="hover:text-brand-primary transition-colors"><Linkedin size={24} /></a>
               <a href="#" className="hover:text-blue-400 transition-colors"><Twitter size={24} /></a>
             </div>
          </div>

          {/* Content */}
          <div className="w-full md:w-2/3">
            <h1 className="text-4xl font-bold text-white mb-4">Hello, I'm Kenji Sahay.</h1>
            <h2 className="text-xl text-brand-primary font-mono mb-8">Data Scientist & Creative Developer</h2>
            
            <div className="prose-custom text-lg text-gray-300 space-y-6">
              <p>
                I am a student sitting at the intersection of <strong>Machine Learning</strong> and <strong>Digital Art</strong>. 
                Currently, I am researching and working on making LLMs more reliable and safe.
              </p>
              
              <p>
                When I'm not doing LLM research or studying for school, I am an aspiring digital artist. 
                I use tools like <strong>Blender</strong>, <strong>Adobe After Effects</strong>, and <strong>Photoshop</strong> to create 
                immersive visual experiences.
              </p>

              <h3 className="text-2xl font-bold text-white mt-8 mb-4">Technical Arsenal</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-mono text-brand-glow mb-2">Data & AI</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 text-gray-400">
                    <li>Python (PyTorch)</li>
                    <li>Vector DBs (Pinecone, Milvus)</li>
                    <li>LLM Ops (OpenAI API, Gemini API)</li>
                    <li>Data Engineering (SQL, Spark)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-mono text-brand-glow mb-2">Frontend & Creative</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 text-gray-400">
                    <li>React (TypeScript, Next.js)</li>
                    <li>Three.js / R3F / WebGL</li>
                    <li>Tailwind CSS</li>
                    <li>Blender / Adobe Suite</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-12 p-6 bg-slate-900 border border-white/10 rounded-xl">
               <h3 className="text-xl font-bold text-white mb-2">Get in Touch</h3>
               <p className="text-gray-400 mb-4">Open for collaborations on LLM/ML research or digital art (film, graphic design, etc).</p>
               <a href="mailto:kenjisahay26@gmail.com" className="inline-flex items-center text-brand-primary hover:text-white font-bold transition-colors">
                 <Mail size={18} className="mr-2" /> kenjisahay26@gmail.com
               </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
