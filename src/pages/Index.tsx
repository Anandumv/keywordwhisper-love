
import { useState, useEffect } from "react";
import TrendDashboard from "@/components/TrendDashboard";
import SidebarChat from "@/components/SidebarChat";
import TrendDetail from "@/components/TrendDetail";
import ApiKeyModal from "@/components/ApiKeyModal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { TrendData } from "@/types/trend";
import { fetchTrends } from "@/lib/api";

const STORAGE_KEY = "trendWhisperData";

const Index = () => {
  const [selectedTrend, setSelectedTrend] = useState<TrendData | null>(null);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [jinaApiKey, setJinaApiKey] = useState<string | null>(
    localStorage.getItem("jinaApiKey")
  );
  const [geminiApiKey, setGeminiApiKey] = useState<string | null>(
    localStorage.getItem("geminiApiKey")
  );
  const [showApiModal, setShowApiModal] = useState(!jinaApiKey);
  const [view, setView] = useState<"chat" | "dashboard">("chat");
  const { toast } = useToast();

  // Load saved trends from localStorage on app start
  useEffect(() => {
    const savedTrends = localStorage.getItem(STORAGE_KEY);
    if (savedTrends) {
      try {
        const parsedTrends = JSON.parse(savedTrends);
        setTrends(parsedTrends);
        if (parsedTrends.length > 0 && !selectedTrend) {
          setSelectedTrend(parsedTrends[0]);
        }
      } catch (error) {
        console.error("Error parsing saved trends:", error);
      }
    }
  }, []);

  const handleSaveApiKey = (jina: string, gemini: string) => {
    localStorage.setItem("jinaApiKey", jina);
    setJinaApiKey(jina);
    
    if (gemini) {
      localStorage.setItem("geminiApiKey", gemini);
      setGeminiApiKey(gemini);
    }
    
    setShowApiModal(false);
    toast({
      title: "API Keys Saved",
      description: `Your API keys have been saved successfully${gemini ? ' including Gemini API' : ''}.`,
    });
    loadTrendData();
  };

  const loadTrendData = async () => {
    if (!jinaApiKey) return;
    
    setIsLoading(true);
    try {
      const data = await fetchTrends();
      
      // Merge with existing trends, preserving feasibility ratings
      const mergedTrends = [...data].map(newTrend => {
        const existingTrend = trends.find(t => t.trending_keyword === newTrend.trending_keyword);
        if (existingTrend) {
          return { 
            ...newTrend, 
            feasibility: existingTrend.feasibility,
            relatedKeywords: existingTrend.relatedKeywords
          };
        }
        return newTrend;
      });
      
      setTrends(mergedTrends);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedTrends));
      
      if (mergedTrends.length > 0 && !selectedTrend) {
        setSelectedTrend(mergedTrends[0]);
      }
    } catch (error) {
      console.error("Error fetching trends:", error);
      toast({
        title: "Error",
        description: "Failed to load trend data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (jinaApiKey) {
      loadTrendData();
    }
  }, [jinaApiKey]);

  const handleRefresh = () => {
    loadTrendData();
    toast({
      title: "Refreshing",
      description: "Fetching the latest trend data...",
    });
  };

  const toggleView = () => {
    setView(view === "chat" ? "dashboard" : "chat");
  };
  
  const handleUpdateTrend = (updatedTrend: TrendData) => {
    const updatedTrends = trends.map(trend => 
      trend.trending_keyword === updatedTrend.trending_keyword ? updatedTrend : trend
    );
    
    setTrends(updatedTrends);
    setSelectedTrend(updatedTrend);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrends));
    
    // Trigger any webhooks if configured
    const webhookUrl = localStorage.getItem("webhookUrl");
    if (webhookUrl) {
      try {
        fetch(webhookUrl, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            event: "trend_updated",
            trend: updatedTrend,
            timestamp: new Date().toISOString()
          })
        }).catch(err => console.log("Webhook notification error (non-critical):", err));
      } catch (error) {
        console.log("Webhook error (non-critical):", error);
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#f0f2f5]">
      {/* Header */}
      <header className="bg-[#128C7E] text-white px-4 py-3 shadow-md">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
              <path d="M12.002 2C6.478 2 2 6.478 2 12.002c0 5.523 4.478 10.002 10.002 10.002 5.523 0 10.002-4.479 10.002-10.002C22.004 6.478 17.525 2 12.002 2zm.001 5c.39 0 .733.204.93.51.066.099.124.2.176.306l.013.03c.074.15.118.322.118.506 0 .086-.027.213-.08.38-.064.203-.157.391-.275.563l-.021.03c-.136.198-.296.372-.48.522-.147.151-.464.3-.944.45-.476.147-.965.228-1.468.244l-.042.002a.55.55 0 00-.42.248l-.023.05c-.094.225-.14.45-.14.676 0 .226.046.45.14.676l.023.05a.55.55 0 00.42.248l.042.002c.743.024 1.468.2 2.17.526.701.322 1.33.795 1.866 1.4l.04.044c.126.142.258.287.385.435.291.334.52.711.688 1.118.308.744.452 1.568.434 2.404-.018.836-.19 1.65-.51 2.384-.319.725-.773 1.381-1.344 1.937-.57.556-1.25.993-2.002 1.288-.742.293-1.534.44-2.33.44-.795 0-1.591-.147-2.339-.44a5.85 5.85 0 01-2.022-1.288c-.576-.556-1.03-1.212-1.354-1.937-.323-.733-.502-1.548-.527-2.384-.026-.836.118-1.66.426-2.404.169-.407.4-.784.689-1.118.125-.148.253-.293.368-.426l.016-.018.026-.029c.534-.61 1.166-1.086 1.87-1.412.704-.323 1.428-.506 2.17-.531l.042-.002a.55.55 0 00.42-.247l.023-.05c.094-.226.14-.45.14-.676 0-.227-.046-.45-.14-.676l-.023-.05a.55.55 0 00-.42-.247l-.042-.002c-.503-.016-.992-.097-1.468-.245-.48-.15-.797-.299-.944-.45a2.501 2.501 0 01-.48-.522l-.021-.03c-.117-.172-.211-.36-.275-.562-.053-.168-.08-.295-.08-.38 0-.184.044-.356.118-.507l.013-.03a1.34 1.34 0 01.176-.305c.197-.306.54-.51.93-.51z"></path>
            </svg>
            <h1 className="text-xl font-bold">TrendWhisper</h1>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              onClick={toggleView}
              className="text-white hover:bg-[#0e7166]"
            >
              {view === "chat" ? "Dashboard" : "Chat View"}
            </Button>
            <Button 
              variant="ghost" 
              onClick={handleRefresh}
              disabled={isLoading}
              className="text-white hover:bg-[#0e7166]"
            >
              {isLoading ? "Loading..." : "Refresh"}
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setShowApiModal(true)}
              className="text-white hover:bg-[#0e7166]"
            >
              API Settings
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {view === "chat" ? (
          <>
            <SidebarChat 
              trends={trends} 
              selectedTrend={selectedTrend} 
              onSelectTrend={setSelectedTrend}
              isLoading={isLoading}
            />
            <TrendDetail 
              trend={selectedTrend} 
              isLoading={isLoading} 
              onUpdateTrend={handleUpdateTrend}
              hasGeminiKey={!!geminiApiKey}
            />
          </>
        ) : (
          <TrendDashboard trends={trends} isLoading={isLoading} />
        )}
      </main>

      {/* API Key Modal */}
      <ApiKeyModal 
        isOpen={showApiModal} 
        onClose={() => jinaApiKey && setShowApiModal(false)} 
        onSave={handleSaveApiKey} 
        initialValue={jinaApiKey || ""}
        initialGeminiValue={geminiApiKey || ""}
      />
    </div>
  );
};

export default Index;
