
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const LoadingState = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center p-10 bg-gradient-to-br from-indigo-900/80 to-purple-900/80 rounded-lg backdrop-blur-sm border border-white/30 shadow-xl"
    >
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/50 to-purple-500/50 rounded-full blur-md"></div>
        <Loader2 className="h-20 w-20 animate-spin text-indigo-300 relative z-10" />
      </div>
      <p className="text-xl text-white font-medium">Generating comprehensive SEO content...</p>
      <p className="text-base text-white mt-2">This may take a moment</p>
    </motion.div>
  );
};

export default LoadingState;
