
import { Button } from '@/components/ui/button';
import { Download, Printer, RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ResultsHeaderProps {
  handleReset: () => void;
  handleDownload: () => void;
  handlePrint: () => void;
}

const ResultsHeader = ({ handleReset, handleDownload, handlePrint }: ResultsHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-indigo-500/50 to-purple-500/50 rounded-lg shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-yellow-300">
            <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-7h-2c0-1-1-1.5-1-1.5"></path>
            <path d="M2 9v1c0 1.1.9 2 2 2h1"></path>
            <path d="M16 11h0"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white drop-shadow-md">
          Generated SEO Content
        </h2>
      </div>
      <div className="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleReset}
                className="text-sm border-white/50 hover:border-white/70 hover:bg-indigo-900/80 transition-colors text-white rounded-lg"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Generate New
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Start over with a new product description</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownload}
                className="text-sm border-white/50 hover:border-white/70 hover:bg-indigo-900/80 transition-colors text-white rounded-lg"
              >
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download as text file</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrint}
                className="text-sm border-white/50 hover:border-white/70 hover:bg-indigo-900/80 transition-colors text-white rounded-lg"
              >
                <Printer className="h-3 w-3 mr-1" />
                Print
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Print the content</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ResultsHeader;
