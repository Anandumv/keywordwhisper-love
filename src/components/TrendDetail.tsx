
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendData } from "@/types/trend";
import { formatDistanceToNow } from "date-fns";

interface TrendDetailProps {
  trend: TrendData | null;
  isLoading: boolean;
}

const TrendDetail = ({ trend, isLoading }: TrendDetailProps) => {
  const [activeTab, setActiveTab] = useState("summary");

  if (isLoading && !trend) {
    return (
      <div className="flex-1 p-6 bg-[#efeae2] overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-10 w-2/3 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-5 w-full mb-3" />
            <Skeleton className="h-5 w-full mb-3" />
            <Skeleton className="h-5 w-2/3" />
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-1/3 mb-2" />
                  <Skeleton className="h-20 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!trend) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f0f2f5]">
        <div className="text-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="text-lg font-medium mb-2">No Trend Selected</h3>
          <p className="text-gray-600">Select a trend from the sidebar to view details</p>
        </div>
      </div>
    );
  }

  const newsItems = [
    {
      url: trend.news_item_url1,
      title: trend.news_item_title1,
      image: trend.news_item_picture1,
      source: trend.news_item_source1,
    },
    {
      url: trend.news_item_url2,
      title: trend.news_item_title2,
      image: trend.news_item_picture2,
      source: trend.news_item_source2,
    },
    {
      url: trend.news_item_url3,
      title: trend.news_item_title3,
      image: trend.news_item_picture3,
      source: trend.news_item_source3,
    },
  ].filter((item) => item.url && item.title);

  return (
    <div className="flex-1 p-4 bg-[#efeae2] overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{trend.trending_keyword}</h2>
            <div className="flex items-center text-gray-600 mt-1">
              <span className="mr-3">
                {trend.pubDate && formatDistanceToNow(new Date(trend.pubDate), { addSuffix: true })}
              </span>
              <Badge variant="outline" className="bg-[#E1F5FE] text-[#0288D1] border-[#0288D1]">
                {trend.approx_traffic}+ traffic
              </Badge>
            </div>
          </div>
        </div>

        <Tabs 
          defaultValue="summary" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="mb-6"
        >
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="sources">News Sources</TabsTrigger>
            <TabsTrigger value="data">Raw Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-4">
            <Card className="bg-white p-5 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Topic Overview</h3>
              <div className="whitespace-pre-line text-gray-700">
                {trend.abstract || trend.summary || "No summary available for this trend."}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="sources" className="space-y-4">
            {newsItems.length > 0 ? (
              newsItems.map((item, index) => (
                <Card key={index} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex space-x-3">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-md" 
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-1M8 7h6" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-500">{item.source || "News Source"}</span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#128C7E] text-sm hover:underline"
                      >
                        Read full article
                      </a>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center p-8 bg-white rounded-lg">
                <p className="text-gray-500">No news sources available for this trend.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="data">
            <Card className="bg-white p-4 rounded-lg shadow-sm">
              <pre className="text-xs overflow-x-auto">
                {JSON.stringify(trend, null, 2)}
              </pre>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="p-3 bg-white rounded-lg shadow-sm mb-6">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Type a message to analyze this trend..."
              className="flex-1 bg-transparent focus:outline-none"
              disabled
            />
            <button className="p-2 rounded-full text-[#128C7E] disabled:text-gray-400" disabled>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button className="p-2 rounded-full bg-[#128C7E] text-white ml-2" disabled>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendDetail;
