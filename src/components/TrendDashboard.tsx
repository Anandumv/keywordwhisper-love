
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendData } from "@/types/trend";
import { formatDistanceToNow } from "date-fns";

interface TrendDashboardProps {
  trends: TrendData[];
  isLoading: boolean;
}

const TrendDashboard = ({ trends, isLoading }: TrendDashboardProps) => {
  const [sortBy, setSortBy] = useState<"traffic" | "date">("traffic");
  
  const sortedTrends = [...trends].sort((a, b) => {
    if (sortBy === "traffic") {
      return b.approx_traffic - a.approx_traffic;
    } else {
      return new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime();
    }
  });

  if (isLoading && trends.length === 0) {
    return (
      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Skeleton className="h-10 w-60 mb-4" />
            <Skeleton className="h-6 w-96" />
          </div>
          
          <div className="mb-6">
            <Skeleton className="h-12 w-72" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-4/5 mb-2" />
                  <Skeleton className="h-4 w-2/5" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full mb-4" />
                  <div className="flex space-x-2 mb-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-5 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Trending Topics Dashboard</h1>
          <p className="text-gray-600">
            Monitor the latest trending topics and their traffic data
          </p>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <Tabs 
            defaultValue="traffic" 
            value={sortBy} 
            onValueChange={(value) => setSortBy(value as "traffic" | "date")}
          >
            <TabsList>
              <TabsTrigger value="traffic">Sort by Traffic</TabsTrigger>
              <TabsTrigger value="date">Sort by Date</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="text-sm text-gray-500">
            {trends.length} {trends.length === 1 ? 'trend' : 'trends'} found
          </div>
        </div>

        {trends.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-lg shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No trends found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Try refreshing the page or adjusting your API settings to get the latest trending topics.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTrends.map((trend) => {
              const newsItems = [
                {
                  url: trend.news_item_url1,
                  title: trend.news_item_title1,
                },
                {
                  url: trend.news_item_url2,
                  title: trend.news_item_title2,
                },
                {
                  url: trend.news_item_url3,
                  title: trend.news_item_title3,
                },
              ].filter((item) => item.url && item.title);
              
              return (
                <Card key={trend.trending_keyword} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{trend.trending_keyword}</CardTitle>
                      <Badge variant="outline" className="bg-[#E1F5FE] text-[#0288D1] border-[#0288D1]">
                        {trend.approx_traffic}+
                      </Badge>
                    </div>
                    <CardDescription>
                      {trend.pubDate && formatDistanceToNow(new Date(trend.pubDate), { addSuffix: true })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {trend.abstract || "Trending topic with multiple news sources."}
                    </p>
                    <div className="flex space-x-2 flex-wrap">
                      <Badge variant="secondary" className="mb-2">
                        {trend.status || "new"}
                      </Badge>
                      <Badge variant="outline" className="mb-2">
                        {newsItems.length} {newsItems.length === 1 ? 'source' : 'sources'}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="text-sm text-gray-600 pt-0">
                    <div className="truncate">
                      Sources: {newsItems.map(item => item.title).join(" • ")}
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendDashboard;
