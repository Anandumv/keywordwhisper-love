
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface InputSectionProps {
  productDescription: string;
  setProductDescription: (desc: string) => void;
  isLoading: boolean;
  retryAfter: number | null;
  handleGenerate: () => void;
}

const InputSection = ({
  productDescription,
  setProductDescription,
  isLoading,
  retryAfter,
  handleGenerate,
}: InputSectionProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 rounded-lg blur-md"></div>
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white h-5 w-5">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <Input
            placeholder="Enter your product description..."
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            className="pl-12 pr-4 py-6 text-lg border-white/50 bg-indigo-950/80 text-white placeholder:text-white/70 focus:border-indigo-400/70 focus:ring-indigo-400/50 transition-colors rounded-lg shadow-inner"
            disabled={isLoading || retryAfter !== null}
          />
        </div>
      </div>
      <Button
        onClick={handleGenerate}
        disabled={isLoading || !productDescription.trim() || retryAfter !== null}
        className="px-8 py-6 text-lg font-medium bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-indigo-500/50 text-white rounded-lg relative overflow-hidden group"
        size="lg"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
        {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
            <path d="M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1"></path>
            <path d="M14 13V7a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v6"></path>
            <path d="M12 10v6"></path>
            <path d="M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
            <path d="M12 20v-3"></path>
            <path d="M18 10c.6 0 1 .4 1 1v1"></path>
            <path d="M5 10c-.6 0-1 .4-1 1v1"></path>
          </svg>
        )}
        {isLoading ? 'Generating...' : 'Generate'}
      </Button>
    </div>
  );
};

export default InputSection;
