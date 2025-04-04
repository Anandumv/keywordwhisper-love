
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Copy } from 'lucide-react';

interface ResultProductDescriptionProps {
  description: string;
  copied: boolean;
  handleCopy: () => void;
}

const ResultProductDescription = ({ description, copied, handleCopy }: ResultProductDescriptionProps) => {
  return (
    <Card className="border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-yellow-950/90 to-yellow-900/80 backdrop-blur-sm overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <CardHeader className="pb-2 bg-gradient-to-r from-yellow-500/50 to-transparent">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-yellow-500/50 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-yellow-300">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <CardTitle className="text-lg text-white font-bold">Product Description</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start">
          <p className="text-base whitespace-pre-line text-white font-medium">{description}</p>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 hover:bg-yellow-900/80 transition-colors text-white rounded-full"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultProductDescription;
