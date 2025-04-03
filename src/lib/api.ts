
import { TrendData } from "@/types/trend";
import { toast } from "sonner";

// Mock data for demonstration purposes
const mockTrends: TrendData[] = [
  {
    trending_keyword: "World Cup 2026",
    approx_traffic: 20000,
    pubDate: new Date().toISOString(),
    status: "idea",
    news_item_url1: "https://www.example.com/news1",
    news_item_title1: "World Cup 2026 Host Cities Announced",
    news_item_picture1: "https://picsum.photos/200/300",
    news_item_source1: "Sports News",
    news_item_url2: "https://www.example.com/news2",
    news_item_title2: "What to Expect from World Cup 2026",
    news_item_picture2: "https://picsum.photos/200/301",
    news_item_source2: "Football Daily",
    news_item_url3: "https://www.example.com/news3",
    news_item_title3: "Economic Impact of World Cup 2026",
    news_item_picture3: "https://picsum.photos/200/302",
    news_item_source3: "Business Times",
    abstract: "The FIFA World Cup 2026 will be jointly hosted by the United States, Mexico, and Canada. This marks the first time three countries will host the tournament and the first time since 2002 that multiple countries will co-host. The tournament will feature 48 teams, expanded from 32, and is expected to generate significant economic benefits for the host cities."
  },
  {
    trending_keyword: "Artificial Intelligence Ethics",
    approx_traffic: 15000,
    pubDate: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    status: "planned",
    news_item_url1: "https://www.example.com/ai1",
    news_item_title1: "New AI Ethics Framework Proposed",
    news_item_picture1: "https://picsum.photos/200/303",
    news_item_source1: "Tech Review",
    news_item_url2: "https://www.example.com/ai2",
    news_item_title2: "Companies Adopt AI Ethics Guidelines",
    news_item_picture2: "https://picsum.photos/200/304",
    news_item_source2: "Business Insider",
    news_item_url3: "https://www.example.com/ai3",
    news_item_title3: "The Challenges of Regulating AI",
    news_item_picture3: "https://picsum.photos/200/305",
    news_item_source3: "Policy Today",
    abstract: "As artificial intelligence becomes more powerful and ubiquitous, questions about ethics and regulation are gaining prominence. Major tech companies are developing their own AI ethics guidelines, while governments worldwide are considering regulatory frameworks. Key issues include bias in AI systems, transparency in decision-making algorithms, privacy concerns, and ensuring human oversight of autonomous systems."
  },
  {
    trending_keyword: "Renewable Energy Breakthrough",
    approx_traffic: 12000,
    pubDate: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    status: "idea",
    news_item_url1: "https://www.example.com/energy1",
    news_item_title1: "New Solar Panel Efficiency Record",
    news_item_picture1: "https://picsum.photos/200/306",
    news_item_source1: "Science Daily",
    news_item_url2: "https://www.example.com/energy2",
    news_item_title2: "Renewable Energy Investments Surge",
    news_item_picture2: "https://picsum.photos/200/307",
    news_item_source2: "Green Energy News",
    news_item_url3: "https://www.example.com/energy3",
    news_item_title3: "Countries Pledge Carbon Neutrality",
    news_item_picture3: "https://picsum.photos/200/308",
    news_item_source3: "Climate Report",
    abstract: "Scientists have achieved a breakthrough in solar panel efficiency, reaching 39.5% conversion rate in laboratory conditions. This development could significantly reduce the cost of solar energy and accelerate the transition to renewable energy sources. Meanwhile, global investments in renewable energy have reached a record high, with particularly strong growth in emerging markets."
  },
  {
    trending_keyword: "Remote Work Trends",
    approx_traffic: 9500,
    pubDate: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    status: "in-progress",
    news_item_url1: "https://www.example.com/work1",
    news_item_title1: "Companies Adopt Permanent Remote Work",
    news_item_picture1: "https://picsum.photos/200/309",
    news_item_source1: "Workplace Today",
    news_item_url2: "https://www.example.com/work2",
    news_item_title2: "Remote Work Technology Innovations",
    news_item_picture2: "https://picsum.photos/200/310",
    news_item_source2: "Tech Insider",
    news_item_url3: "https://www.example.com/work3",
    news_item_title3: "The Impact of Remote Work on Cities",
    news_item_picture3: "https://picsum.photos/200/311",
    news_item_source3: "Urban Studies",
    abstract: "The shift to remote work, accelerated by the pandemic, is becoming permanent for many companies. Major corporations are announcing hybrid or fully remote work policies, while cities are grappling with the economic impacts of reduced commuter traffic. Meanwhile, technology companies are innovating to improve remote collaboration tools and address challenges like digital fatigue and work-life balance."
  },
  {
    trending_keyword: "Digital Currency Regulation",
    approx_traffic: 8000,
    pubDate: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
    status: "idea",
    news_item_url1: "https://www.example.com/crypto1",
    news_item_title1: "Central Banks Develop Digital Currencies",
    news_item_picture1: "https://picsum.photos/200/312",
    news_item_source1: "Finance Times",
    news_item_url2: "https://www.example.com/crypto2",
    news_item_title2: "New Cryptocurrency Regulations Proposed",
    news_item_picture2: "https://picsum.photos/200/313",
    news_item_source2: "Crypto News",
    news_item_url3: "https://www.example.com/crypto3",
    news_item_title3: "Digital Currency Market Reactions",
    news_item_picture3: "https://picsum.photos/200/314",
    news_item_source3: "Market Watch",
    abstract: "Governments worldwide are developing regulations for cryptocurrencies and digital assets. Several central banks are in advanced stages of creating their own central bank digital currencies (CBDCs), while regulatory bodies are clarifying tax treatment and investor protections for cryptocurrencies. These developments are creating both challenges and opportunities in the rapidly evolving digital currency landscape."
  }
];

// Function to simulate fetching trends from an API
export const fetchTrends = async (): Promise<TrendData[]> => {
  const jinaApiKey = localStorage.getItem("jinaApiKey");
  if (!jinaApiKey) {
    toast.error("API key not found. Please set your Jina API key in settings.");
    return [];
  }
  
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real app, this would make an actual API call using the API key
  // For demo purposes, we're returning mock data
  
  // Webhook notification (optional)
  const webhookUrl = localStorage.getItem("webhookUrl");
  if (webhookUrl) {
    try {
      // Notify webhook about new data fetch (no-cors mode to avoid CORS issues)
      fetch(webhookUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          event: "trends_fetched",
          timestamp: new Date().toISOString(),
          count: mockTrends.length
        })
      }).catch(err => console.log("Webhook notification error (non-critical):", err));
    } catch (error) {
      console.log("Webhook error (non-critical):", error);
    }
  }
  
  return mockTrends;
};

// Function to simulate triggering a workflow (would connect to real webhook in production)
export const triggerWorkflow = async (): Promise<boolean> => {
  const webhookUrl = localStorage.getItem("webhookUrl");
  
  if (!webhookUrl) {
    toast.error("Webhook URL not configured. Please set it in the settings.");
    return false;
  }
  
  try {
    await fetch(webhookUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "refresh_trends",
        timestamp: new Date().toISOString()
      })
    });
    
    toast.success("Workflow triggered successfully");
    return true;
  } catch (error) {
    console.error("Error triggering workflow:", error);
    toast.error("Failed to trigger workflow. Check your webhook configuration.");
    return false;
  }
};
