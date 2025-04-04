
import { Card } from "@/components/ui/card";
import { TrendData } from "@/types/trend";

interface TrendRawDataProps {
  trend: TrendData;
}

const TrendRawData = ({ trend }: TrendRawDataProps) => {
  return (
    <Card className="bg-white p-4 rounded-lg shadow-sm">
      <pre className="text-xs overflow-x-auto">
        {JSON.stringify(trend, null, 2)}
      </pre>
    </Card>
  );
};

export default TrendRawData;
