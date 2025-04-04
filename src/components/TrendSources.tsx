
import { Card } from "@/components/ui/card";
import { TrendData } from "@/types/trend";

interface TrendSourcesProps {
  trend: TrendData;
}

const TrendSources = ({ trend }: TrendSourcesProps) => {
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

  if (newsItems.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg">
        <p className="text-gray-500">No news sources available for this trend.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {newsItems.map((item, index) => (
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
      ))}
    </div>
  );
};

export default TrendSources;
