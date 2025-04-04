
import { FormEvent, useState } from "react";
import { Download, Save, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TrendMessageBarProps {
  onGenerateReport: () => void;
  generatingReport: boolean;
}

const TrendMessageBar = ({ onGenerateReport, generatingReport }: TrendMessageBarProps) => {
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent."
    });
    setMessage("");
  };

  return (
    <form onSubmit={handleSendMessage} className="p-3 bg-white rounded-lg shadow-sm mb-6">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Type a message to analyze this trend..."
          className="flex-1 bg-transparent focus:outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button 
          type="button"
          className="p-2 rounded-full text-[#128C7E]"
          onClick={onGenerateReport}
          disabled={generatingReport}
        >
          <Download className="h-5 w-5" />
        </button>
        <button 
          type="button"
          className="p-2 rounded-full text-[#128C7E]"
        >
          <Save className="h-5 w-5" />
        </button>
        <button 
          type="submit" 
          className="p-2 rounded-full bg-[#128C7E] text-white ml-2"
          disabled={!message.trim()}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};

export default TrendMessageBar;
