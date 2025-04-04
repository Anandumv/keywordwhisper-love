
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ResultCompetitorAnalysisProps {
  analysis: string;
}

const ResultCompetitorAnalysis = ({ analysis }: ResultCompetitorAnalysisProps) => {
  return (
    <Card className="border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-indigo-950/90 to-blue-900/80 backdrop-blur-sm overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <CardHeader className="pb-2 bg-gradient-to-r from-indigo-500/50 to-transparent">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500/50 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-indigo-300">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="6"></circle>
              <circle cx="12" cy="12" r="2"></circle>
            </svg>
          </div>
          <CardTitle className="text-lg text-white font-bold">Competitor Analysis</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-base whitespace-pre-line text-white font-medium">{analysis}</p>
      </CardContent>
    </Card>
  );
};

export default ResultCompetitorAnalysis;
