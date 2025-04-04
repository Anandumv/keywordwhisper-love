
import { Card } from "@/components/ui/card";
import { TrendData } from "@/types/trend";

interface TrendSummaryProps {
  trend: TrendData;
}

const TrendSummary = ({ trend }: TrendSummaryProps) => {
  return (
    <Card className="bg-white p-5 rounded-lg shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-3">Topic Overview</h3>
      <div className="whitespace-pre-line text-gray-700">
        {trend.abstract || trend.summary || "No summary available for this trend."}
      </div>
    </Card>
  );
};

export default TrendSummary;
