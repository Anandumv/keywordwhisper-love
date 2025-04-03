
export interface TrendData {
  trending_keyword: string;
  approx_traffic: number;
  pubDate: string;
  status: string;
  feasibility?: "high" | "medium" | "low";
  news_item_url1?: string;
  news_item_title1?: string;
  news_item_picture1?: string;
  news_item_source1?: string;
  news_item_url2?: string;
  news_item_title2?: string;
  news_item_picture2?: string;
  news_item_source2?: string;
  news_item_url3?: string;
  news_item_title3?: string;
  news_item_picture3?: string;
  news_item_source3?: string;
  abstract?: string;
  summary?: string;
}
