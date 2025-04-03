
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendData } from "@/types/trend";
import { formatDistanceToNow } from "date-fns";

interface SidebarChatProps {
  trends: TrendData[];
  selectedTrend: TrendData | null;
  onSelectTrend: (trend: TrendData) => void;
  isLoading: boolean;
}

const SidebarChat = ({ trends, selectedTrend, onSelectTrend, isLoading }: SidebarChatProps) => {
  if (isLoading && trends.length === 0) {
    return (
      <div className="w-1/3 bg-white border-r overflow-y-auto">
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Search trends..."
              className="w-full bg-gray-100 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#128C7E]"
              disabled
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="divide-y">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-1" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-1/3 bg-white border-r overflow-y-auto">
      <div className="p-4 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Search trends..."
            className="w-full bg-gray-100 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#128C7E]"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="divide-y">
        {trends.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mb-2">No trends found</p>
            <p className="text-sm">Try refreshing or adjusting your settings</p>
          </div>
        ) : (
          trends.map((trend) => (
            <div
              key={trend.trending_keyword}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${
                selectedTrend?.trending_keyword === trend.trending_keyword ? "bg-[#f0f2f5]" : ""
              }`}
              onClick={() => onSelectTrend(trend)}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-gray-900 truncate">{trend.trending_keyword}</h3>
                <span className="text-xs text-gray-500">
                  {trend.pubDate ? formatDistanceToNow(new Date(trend.pubDate), { addSuffix: true }) : "Recently"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600 truncate">
                  {trend.news_item_title1 || "New trending topic"}
                </p>
                <Badge variant="outline" className="ml-2 bg-[#E1F5FE] text-[#0288D1] border-[#0288D1]">
                  {trend.approx_traffic}+
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SidebarChat;
