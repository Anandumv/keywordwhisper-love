
import { motion } from 'framer-motion';

const KeywordGeneratorHeader = () => {
  return (
    <div className="text-center mb-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-500/50 via-purple-500/50 to-pink-500/50 px-6 py-3 rounded-full backdrop-blur-md border border-white/30 shadow-2xl"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-yellow-300 animate-pulse">
          <path d="M6 9v8a3 3 0 0 0 3 3v0a3 3 0 0 0 3-3v-4"></path>
          <line x1="9" x2="9" y1="17" y2="6"></line>
          <line x1="9" x2="12" y1="6" y2="6"></line>
          <line x1="15" x2="18" y1="12" y2="12"></line>
          <ellipse cx="15" cy="9" rx="3" ry="3"></ellipse>
          <ellipse cx="18" cy="15" rx="3" ry="3"></ellipse>
        </svg>
        <span className="text-white font-bold text-2xl tracking-wide drop-shadow-lg">Trend Whisper SEO Generator</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-yellow-300 animate-pulse">
          <path d="M6 9v8a3 3 0 0 0 3 3v0a3 3 0 0 0 3-3v-4"></path>
          <line x1="9" x2="9" y1="17" y2="6"></line>
          <line x1="9" x2="12" y1="6" y2="6"></line>
          <line x1="15" x2="18" y1="12" y2="12"></line>
          <ellipse cx="15" cy="9" rx="3" ry="3"></ellipse>
          <ellipse cx="18" cy="15" rx="3" ry="3"></ellipse>
        </svg>
      </motion.div>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-4 text-white text-xl max-w-2xl mx-auto font-medium drop-shadow-md"
      >
        Create professional SEO content with AI-powered insights
      </motion.p>
    </div>
  );
};

export default KeywordGeneratorHeader;
