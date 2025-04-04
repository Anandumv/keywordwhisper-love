
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ResultFeatureSectionsProps {
  longTailKeywords: string[];
  productFeatures: string[];
  targetAudience: string[];
  seoRecommendations: string[];
}

const ResultFeatureSections = ({ 
  longTailKeywords,
  productFeatures,
  targetAudience,
  seoRecommendations 
}: ResultFeatureSectionsProps) => {
  return (
    <>
      {/* Long-tail Keywords and Product Features cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-purple-950/90 to-pink-900/80 backdrop-blur-sm overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="pb-2 bg-gradient-to-r from-purple-500/50 to-transparent">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-500/50 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-purple-300">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
              </div>
              <CardTitle className="text-lg text-white font-bold">Long-tail Keywords</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-2">
              {longTailKeywords.map((keyword: string, index: number) => (
                <span key={index} className="bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white px-2 py-1.5 rounded-full text-base font-medium shadow-md hover:shadow-lg transition-all duration-300">
                  {keyword}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-indigo-950/90 to-blue-900/80 backdrop-blur-sm overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="pb-2 bg-gradient-to-r from-indigo-500/50 to-transparent">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-500/50 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-indigo-300">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <CardTitle className="text-lg text-white font-bold">Product Features</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="list-disc list-inside text-base space-y-1.5">
              {productFeatures.map((feature: string, index: number) => (
                <li key={index} className="text-white font-medium">{feature}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Target Audience and SEO Recommendations cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-pink-950/90 to-red-900/80 backdrop-blur-sm overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="pb-2 bg-gradient-to-r from-pink-500/50 to-transparent">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-pink-500/50 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-pink-300">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
              </div>
              <CardTitle className="text-lg text-white font-bold">Target Audience</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="list-disc list-inside text-base space-y-1.5">
              {targetAudience.map((audience: string, index: number) => (
                <li key={index} className="text-white font-medium">{audience}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-yellow-950/90 to-orange-900/80 backdrop-blur-sm overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="pb-2 bg-gradient-to-r from-yellow-500/50 to-transparent">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-yellow-500/50 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-yellow-300">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <path d="M13 2v7h7"></path>
                </svg>
              </div>
              <CardTitle className="text-lg text-white font-bold">SEO Recommendations</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="list-disc list-inside text-base space-y-1.5">
              {seoRecommendations.map((recommendation: string, index: number) => (
                <li key={index} className="text-white font-medium">{recommendation}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ResultFeatureSections;
