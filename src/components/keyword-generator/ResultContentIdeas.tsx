
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ResultContentIdeasProps {
  ideas: string[];
}

const ResultContentIdeas = ({ ideas }: ResultContentIdeasProps) => {
  return (
    <Card className="border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-yellow-950/90 to-amber-900/80 backdrop-blur-sm overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <CardHeader className="pb-2 bg-gradient-to-r from-yellow-500/50 to-transparent">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-yellow-500/50 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-yellow-300">
              <path d="M12 2L.5 8.66l11.5 6.34m0 0l11.5-6.34L12 2"></path>
              <path d="M2 19.5l10 4 10-4"></path>
              <path d="M2 15l10 4 10-4"></path>
            </svg>
          </div>
          <CardTitle className="text-lg text-white font-bold">Content Ideas</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <ul className="list-disc list-inside text-base space-y-1.5">
          {ideas.map((idea: string, index: number) => (
            <li key={index} className="text-white font-medium">{idea}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ResultContentIdeas;
