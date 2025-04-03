
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
  initialValue: string;
}

const ApiKeyModal = ({ isOpen, onClose, onSave, initialValue }: ApiKeyModalProps) => {
  const [apiKey, setApiKey] = useState(initialValue);
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
    
    onSave(apiKey);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>API Settings</DialogTitle>
          <DialogDescription>
            Configure your API keys to fetch trend data from external services.
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
            <Label htmlFor="jina-api-key">Jina AI API Key (Required)</Label>
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
            <p className="text-xs text-gray-500">
              Used to extract content from trending articles. Get your key at{" "}
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
            <Label htmlFor="webhook-url">Webhook URL (Optional)</Label>
            <Input
              id="webhook-url"
              type="text"
              placeholder="Enter your webhook URL"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Optional: Used to trigger external workflows when new trends are detected.
            </p>
          </div>
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
