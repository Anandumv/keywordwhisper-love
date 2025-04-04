
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendData } from "@/types/trend";

interface TrendKeywordsProps {
  trend: TrendData;
}

const TrendKeywords = ({ trend }: TrendKeywordsProps) => {
  if (!trend.relatedKeywords || trend.relatedKeywords.length === 0) {
    return null;
  }

  return (
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
  );
};

export default TrendKeywords;
