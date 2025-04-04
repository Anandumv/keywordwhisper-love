
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { TrendData } from "@/types/trend";
import KeywordGenerator from "./KeywordGenerator";
import TrendHeader from "./TrendHeader";
import TrendFeasibility from "./TrendFeasibility";
import TrendSummary from "./TrendSummary";
import TrendSources from "./TrendSources";
import TrendKeywords from "./TrendKeywords";
import TrendRawData from "./TrendRawData";
import TrendMessageBar from "./TrendMessageBar";
import TrendLoadingSkeleton from "./TrendLoadingSkeleton";
import TrendEmptyState from "./TrendEmptyState";

interface TrendDetailProps {
  trend: TrendData | null;
  isLoading: boolean;
  onUpdateTrend?: (updatedTrend: TrendData) => void;
  hasGeminiKey?: boolean;
}

const TrendDetail = ({ trend, isLoading, onUpdateTrend, hasGeminiKey = false }: TrendDetailProps) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [generatingReport, setGeneratingReport] = useState(false);
  const { toast } = useToast();

  if (isLoading && !trend) {
    return <TrendLoadingSkeleton />;
  }

  if (!trend) {
    return <TrendEmptyState />;
  }

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
${[1, 2, 3].map(i => {
  const title = trend[`news_item_title${i}` as keyof TrendData];
  const source = trend[`news_item_source${i}` as keyof TrendData];
  return title ? `${i}. ${title} (${source || "Unknown source"})` : null;
}).filter(Boolean).join("\n")}

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
      
      toast({
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
      
      toast({
        title: "Feasibility Updated",
        description: `Keyword feasibility set to ${value}`,
      });
    }
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
        <TrendHeader 
          trend={trend} 
          onGenerateReport={generateKeywordReport}
          generatingReport={generatingReport}
        />

        <TrendFeasibility
          trend={trend}
          onUpdateFeasibility={handleSetFeasibility}
        />

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
            <TrendSummary trend={trend} />
          </TabsContent>
          
          <TabsContent value="sources" className="space-y-4">
            <TrendSources trend={trend} />
          </TabsContent>
          
          {trend.relatedKeywords && trend.relatedKeywords.length > 0 && (
            <TabsContent value="keywords" className="space-y-4">
              <TrendKeywords trend={trend} />
            </TabsContent>
          )}
          
          <TabsContent value="data">
            <TrendRawData trend={trend} />
          </TabsContent>
        </Tabs>

        <TrendMessageBar 
          onGenerateReport={generateKeywordReport}
          generatingReport={generatingReport}
        />
      </div>
    </div>
  );
};

export default TrendDetail;
