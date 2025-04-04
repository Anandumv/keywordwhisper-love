
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendData } from "@/types/trend";

interface TrendFeasibilityProps {
  trend: TrendData;
  onUpdateFeasibility: (value: "high" | "medium" | "low") => void;
}

const TrendFeasibility = ({ trend, onUpdateFeasibility }: TrendFeasibilityProps) => {
  return (
    <div className="mb-4">
      <Card className="p-4 bg-white rounded-lg shadow-sm">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700">Set feasibility:</span>
          <Select
            onValueChange={(value: "high" | "medium" | "low") => onUpdateFeasibility(value)}
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
  );
};

export default TrendFeasibility;
