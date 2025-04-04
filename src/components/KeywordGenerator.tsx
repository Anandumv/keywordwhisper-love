
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { generateKeywordSuggestions } from "@/lib/gemini";
import { toast } from "sonner";
import { Sparkles, Download, Copy } from "lucide-react";

interface KeywordGeneratorProps {
  trendKeyword?: string;
  onKeywordsGenerated?: (keywords: string[]) => void;
  hasGeminiKey: boolean;
}

const KeywordGenerator = ({ 
  trendKeyword = "", 
  onKeywordsGenerated, 
  hasGeminiKey 
}: KeywordGeneratorProps) => {
  const [productQuery, setProductQuery] = useState("");
  const [generatingKeywords, setGeneratingKeywords] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [options, setOptions] = useState({
    includeCategories: true,
    includeAgeGroups: true,
    includeBenefits: true
  });

  const handleOptionChange = (option: keyof typeof options) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const handleGenerateKeywords = async () => {
    if (!hasGeminiKey) {
      toast.error("Gemini API key is required. Please set it in API Settings.");
      return;
    }

    if (!productQuery.trim()) {
      toast.error("Please enter a product to analyze and generate keywords for.");
      return;
    }

    setGeneratingKeywords(true);
    
    try {
      const generatedKeywords = await generateKeywordSuggestions(
        trendKeyword || productQuery, 
        productQuery
      );
      
      if (generatedKeywords.length > 0) {
        setKeywords(generatedKeywords);
        
        if (onKeywordsGenerated) {
          onKeywordsGenerated(generatedKeywords);
        }
        
        toast.success(`Generated ${generatedKeywords.length} e-commerce SEO keywords`);
      } else {
        toast.error("Failed to generate keyword suggestions");
      }
    } catch (error) {
      console.error("Error generating keywords:", error);
      toast.error("Failed to generate keywords: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setGeneratingKeywords(false);
    }
  };

  const handleCopyKeywords = () => {
    if (keywords.length > 0) {
      navigator.clipboard.writeText(keywords.join('\n'));
      toast.success("Keywords copied to clipboard");
    }
  };

  const handleDownloadKeywords = () => {
    if (keywords.length > 0) {
      const content = keywords.join('\n');
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `seo_keywords_${productQuery.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Keywords downloaded");
    }
  };

  return (
    <Card className="p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-800 mb-4">E-commerce SEO Keyword Generator</h3>
      
      <div className="mb-4">
        <Textarea
          placeholder="Enter a specific product (e.g., 'iPhone 13 Pro', 'Nike Air Max 270', 'Lego Star Wars set')"
          className="resize-none mb-3"
          value={productQuery}
          onChange={(e) => setProductQuery(e.target.value)}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <Switch 
              id="categories" 
              checked={options.includeCategories}
              onCheckedChange={() => handleOptionChange('includeCategories')}
            />
            <Label htmlFor="categories">Categories</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="ageGroups" 
              checked={options.includeAgeGroups}
              onCheckedChange={() => handleOptionChange('includeAgeGroups')}
            />
            <Label htmlFor="ageGroups">Age Groups</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="benefits" 
              checked={options.includeBenefits}
              onCheckedChange={() => handleOptionChange('includeBenefits')}
            />
            <Label htmlFor="benefits">Benefits/Features</Label>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={handleGenerateKeywords}
            disabled={generatingKeywords || !productQuery.trim()}
            className="shrink-0 bg-[#128C7E] hover:bg-[#0e7166]"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {generatingKeywords ? "Analyzing..." : "Generate Keywords"}
          </Button>
          
          {keywords.length > 0 && (
            <>
              <Button
                variant="outline" 
                size="icon"
                onClick={handleCopyKeywords}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline" 
                size="icon"
                onClick={handleDownloadKeywords}
              >
                <Download className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {keywords.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Generated Keywords</h4>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
            {keywords.map((keyword, index) => (
              <Badge key={index} variant="outline" className="bg-[#e8f5e9] text-[#2e7d32] border-[#a5d6a7] px-3 py-1">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default KeywordGenerator;
