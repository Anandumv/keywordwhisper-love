
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { TrendData } from "@/types/trend";

interface TrendHeaderProps {
  trend: TrendData;
  onGenerateReport: () => void;
  generatingReport: boolean;
}

const TrendHeader = ({ trend, onGenerateReport, generatingReport }: TrendHeaderProps) => {
  return (
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
          onClick={onGenerateReport}
          disabled={generatingReport}
        >
          <Download className="h-4 w-4 mr-2" />
          {generatingReport ? "Generating..." : "Report"}
        </Button>
      </div>
    </div>
  );
};

export default TrendHeader;
