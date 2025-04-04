
import { useState, FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { TrendData } from "@/types/trend";
import { formatDistanceToNow } from "date-fns";
import { Download, Send, Save } from "lucide-react";
import { toast } from "sonner";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import KeywordGenerator from "./KeywordGenerator";

interface TrendDetailProps {
  trend: TrendData | null;
  isLoading: boolean;
  onUpdateTrend?: (updatedTrend: TrendData) => void;
  hasGeminiKey?: boolean;
}

const TrendDetail = ({ trend, isLoading, onUpdateTrend, hasGeminiKey = false }: TrendDetailProps) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [message, setMessage] = useState("");
  const [generatingReport, setGeneratingReport] = useState(false);
  const { toast: uiToast } = useToast();

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
  
  const generateKeywordReport = () => {
    setGeneratingReport(true);
    
    setTimeout(() => {
      const reportContent = `
# Keyword Feasibility Report

## Trend: ${trend.trending_keyword}
- Traffic: ${trend.approx_traffic}+
- Feasibility: ${trend.feasibility || "Not rated yet"}
- Date: ${trend.pubDate ? new Date(trend.pubDate).toLocaleDateString() : "Unknown"}

## Summary
${trend.abstract || trend.summary || "No summary available."}

## Related News Sources
${newsItems.map((item, i) => `${i+1}. ${item.title} (${item.source || "Unknown source"})`).join("\n")}

${trend.relatedKeywords && trend.relatedKeywords.length > 0 ? 
`## Related Keywords
${trend.relatedKeywords.map((keyword, i) => `${i+1}. ${keyword}`).join("\n")}` : ""}

## Feasibility Analysis
This keyword has ${trend.feasibility || "unrated"} feasibility for product integration.
${trend.feasibility === "high" ? "Recommended for immediate content creation and product targeting." : 
  trend.feasibility === "medium" ? "Consider for secondary content and product strategies." :
  trend.feasibility === "low" ? "Monitor but low priority for product integration." :
  "Rate this keyword's feasibility to receive recommendations."}

Report generated: ${new Date().toLocaleString()}
      `;
      
      // Create blob and download
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${trend.trending_keyword.replace(/\s+/g, '_')}_report.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setGeneratingReport(false);
      
      // Add message to chat
      setMessage("");
      uiToast({
        title: "Report Generated",
        description: "Keyword report has been downloaded successfully."
      });
    }, 800);
  };
  
  const handleSetFeasibility = (value: "high" | "medium" | "low") => {
    if (onUpdateTrend && trend) {
      const updatedTrend = {
        ...trend,
        feasibility: value
      };
      onUpdateTrend(updatedTrend);
      
      uiToast({
        title: "Feasibility Updated",
        description: `Keyword feasibility set to ${value}`,
      });
    }
  };
  
  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    uiToast({
      title: "Message Sent",
      description: "Your message has been sent."
    });
    setMessage("");
  };

  const handleKeywordsGenerated = (keywords: string[]) => {
    if (onUpdateTrend) {
      const updatedTrend = {
        ...trend,
        relatedKeywords: keywords
      };
      onUpdateTrend(updatedTrend);
      setActiveTab("keywords");
    }
  };

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
              {trend.feasibility && (
                <Badge 
                  variant="outline" 
                  className={`ml-2 ${
                    trend.feasibility === "high" ? "bg-green-100 text-green-800 border-green-300" :
                    trend.feasibility === "medium" ? "bg-yellow-100 text-yellow-800 border-yellow-300" :
                    "bg-red-100 text-red-800 border-red-300"
                  }`}
                >
                  {trend.feasibility} feasibility
                </Badge>
              )}
            </div>
          </div>
          <div className="space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              className="bg-white"
              onClick={generateKeywordReport}
              disabled={generatingReport}
            >
              <Download className="h-4 w-4 mr-2" />
              {generatingReport ? "Generating..." : "Report"}
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <Card className="p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">Set feasibility:</span>
              <Select
                onValueChange={(value: "high" | "medium" | "low") => handleSetFeasibility(value)}
                defaultValue={trend.feasibility}
              >
                <SelectTrigger className="w-32 h-8 text-sm">
                  <SelectValue placeholder="Rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        </div>

        {hasGeminiKey && (
          <div className="mb-4">
            <KeywordGenerator 
              trendKeyword={trend.trending_keyword}
              onKeywordsGenerated={handleKeywordsGenerated}
              hasGeminiKey={hasGeminiKey}
            />
          </div>
        )}

        <Tabs 
          defaultValue="summary" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="mb-6"
        >
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="sources">News Sources</TabsTrigger>
            {trend.relatedKeywords && trend.relatedKeywords.length > 0 && (
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
            )}
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
          
          {trend.relatedKeywords && trend.relatedKeywords.length > 0 && (
            <TabsContent value="keywords" className="space-y-4">
              <Card className="bg-white p-5 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Related Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {trend.relatedKeywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="bg-[#e8f5e9] text-[#2e7d32] border-[#a5d6a7] px-3 py-1">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </Card>
            </TabsContent>
          )}
          
          <TabsContent value="data">
            <Card className="bg-white p-4 rounded-lg shadow-sm">
              <pre className="text-xs overflow-x-auto">
                {JSON.stringify(trend, null, 2)}
              </pre>
            </Card>
          </TabsContent>
        </Tabs>

        <form onSubmit={handleSendMessage} className="p-3 bg-white rounded-lg shadow-sm mb-6">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Type a message to analyze this trend..."
              className="flex-1 bg-transparent focus:outline-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button 
              type="button"
              className="p-2 rounded-full text-[#128C7E]"
              onClick={generateKeywordReport}
              disabled={generatingReport}
            >
              <Download className="h-5 w-5" />
            </button>
            <button 
              type="button"
              className="p-2 rounded-full text-[#128C7E]"
            >
              <Save className="h-5 w-5" />
            </button>
            <button 
              type="submit" 
              className="p-2 rounded-full bg-[#128C7E] text-white ml-2"
              disabled={!message.trim()}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrendDetail;
