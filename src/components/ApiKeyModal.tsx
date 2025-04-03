
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, HelpCircle, ExternalLink } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string, geminiApiKey: string) => void;
  initialValue: string;
  initialGeminiValue: string;
}

const ApiKeyModal = ({ isOpen, onClose, onSave, initialValue, initialGeminiValue }: ApiKeyModalProps) => {
  const [apiKey, setApiKey] = useState(initialValue);
  const [geminiApiKey, setGeminiApiKey] = useState(initialGeminiValue);
  const [webhookUrl, setWebhookUrl] = useState(localStorage.getItem("webhookUrl") || "");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!apiKey) {
      setError("Please enter your Jina AI API key");
      return;
    }
    
    if (webhookUrl) {
      localStorage.setItem("webhookUrl", webhookUrl);
    }
    
    onSave(apiKey, geminiApiKey);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>API Settings</DialogTitle>
          <DialogDescription>
            Configure your API keys to fetch trend data and enable webhook integration for automated workflows.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="jina-api-key">Jina AI API Key (Required)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Jina AI is used to extract and analyze content from trending articles.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="jina-api-key"
              type="password"
              placeholder="Enter your Jina AI API key"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setError("");
              }}
            />
            <p className="text-xs text-gray-500 flex items-center">
              <ExternalLink className="h-3 w-3 mr-1" />
              <a 
                href="https://jina.ai/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                jina.ai
              </a>
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="gemini-api-key">Gemini API Key (Optional)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Gemini API is used to generate related keywords and content suggestions.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="gemini-api-key"
              type="password"
              placeholder="Enter your Gemini API key"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
            />
            <p className="text-xs text-gray-500 flex items-center">
              <ExternalLink className="h-3 w-3 mr-1" />
              <a 
                href="https://ai.google.dev/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                ai.google.dev
              </a>
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="webhook-url">Webhook URL (Optional)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Connect to Zapier, Make.com or n8n to automate workflows when trends are updated.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="webhook-url"
              type="text"
              placeholder="Enter your webhook URL"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Used to trigger external workflows when trend data is updated. Compatible with Zapier, Make.com, and n8n.
            </p>
          </div>
          
          <Alert className="bg-blue-50 border-blue-200">
            <div className="flex items-start">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 mr-2" />
              <AlertDescription className="text-blue-800 text-xs">
                TrendWhisper stores all data locally in your browser. No server is needed, but you'll need to use the same browser to access your saved trends.
              </AlertDescription>
            </div>
          </Alert>
        </div>
        
        <DialogFooter className="sm:justify-end">
          {initialValue && (
            <Button variant="outline" onClick={onClose} className="mr-2">
              Cancel
            </Button>
          )}
          <Button onClick={handleSave} className="bg-[#128C7E] hover:bg-[#0e7166]">
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyModal;
