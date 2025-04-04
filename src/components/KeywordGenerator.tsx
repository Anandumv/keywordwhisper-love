
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { generateSEOContent } from '@/api/generate';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence } from 'framer-motion';

import KeywordGeneratorHeader from './keyword-generator/KeywordGeneratorHeader';
import InputSection from './keyword-generator/InputSection';
import ErrorMessage from './keyword-generator/ErrorMessage';
import LoadingState from './keyword-generator/LoadingState';
import ResultsView from './keyword-generator/ResultsView';

export default function KeywordGenerator({ 
  trendKeyword, 
  onKeywordsGenerated,
  hasGeminiKey = false
}: { 
  trendKeyword?: string; 
  onKeywordsGenerated?: (keywords: string[]) => void;
  hasGeminiKey?: boolean;
}) {
  const [productDescription, setProductDescription] = useState(trendKeyword || '');
  const [isLoading, setIsLoading] = useState(false);
  const [seoContent, setSeoContent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [whatsAppSuccess, setWhatsAppSuccess] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState('generate');
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!productDescription.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setRetryAfter(null);
    setSeoContent(null);
    
    try {
      console.log('Sending request to generate SEO content...');
      const data = await generateSEOContent(productDescription);
      console.log('Received SEO content:', data);
      setSeoContent(data);
      setActiveTab('results');
      
      if (onKeywordsGenerated && data.keywords) {
        onKeywordsGenerated(data.keywords);
      }
    } catch (error) {
      console.error('Error in KeywordGenerator:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('quota') || error.message.includes('rate limit')) {
          setError('API quota exceeded. Please wait a minute before trying again.');
          setRetryAfter(60); // 60 seconds
          
          // Start countdown
          const countdownInterval = setInterval(() => {
            setRetryAfter(prev => {
              if (prev === null || prev <= 1) {
                clearInterval(countdownInterval);
                return null;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          setError(error.message);
        }
      } else {
        setError('Failed to generate SEO content. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopied(section);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleReset = () => {
    setProductDescription('');
    setSeoContent(null);
    setError(null);
    setRetryAfter(null);
    setActiveTab('generate');
  };

  const handleWhatsAppStatusChange = (success: boolean | null) => {
    setWhatsAppSuccess(success);
  };

  const handleSendingWhatsAppChange = (sending: boolean) => {
    setIsSendingWhatsApp(sending);
  };

  const handlePhoneNumberChange = (number: string) => {
    setPhoneNumber(number);
  };

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-purple-900 to-black p-4 md:p-8 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMXYxaC0xeiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvZz48L3N2Zz4=')] opacity-10"></div>
      
      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/30 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full filter blur-3xl opacity-20"></div>
      
      <div className="relative space-y-6 max-w-6xl mx-auto">
        <KeywordGeneratorHeader />
        
        <div className="border border-white/30 shadow-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl overflow-hidden relative rounded-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="bg-gradient-to-r from-indigo-500/50 via-purple-500/50 to-pink-500/50 pb-4 rounded-t-lg border-b border-white/30 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500/50 to-purple-500/50 rounded-lg shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-yellow-300 animate-pulse">
                  <path d="M15 4h3a2 2 0 0 1 2 2v3"></path>
                  <path d="M9 4H6a2 2 0 0 0-2 2v3"></path>
                  <path d="M15 20h3a2 2 0 0 0 2-2v-3"></path>
                  <path d="M9 20H6a2 2 0 0 1-2-2v-3"></path>
                  <path d="m8 9 2 2 4-4"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white drop-shadow-md">
                  SEO Content Generator
                </h2>
                <p className="text-white text-lg mt-2 font-medium">
                  Create comprehensive SEO content for your product with just a description
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-8 bg-indigo-950/80 border border-white/30">
                <TabsTrigger value="generate" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/50 data-[state=active]:to-purple-500/50 data-[state=active]:text-white text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                    <path d="M15 4h3a2 2 0 0 1 2 2v3"></path>
                    <path d="M9 4H6a2 2 0 0 0-2 2v3"></path>
                    <path d="M15 20h3a2 2 0 0 0 2-2v-3"></path>
                    <path d="M9 20H6a2 2 0 0 1-2-2v-3"></path>
                    <path d="m8 9 2 2 4-4"></path>
                  </svg>
                  Generate Content
                </TabsTrigger>
                <TabsTrigger value="results" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/50 data-[state=active]:to-purple-500/50 data-[state=active]:text-white text-white" disabled={!seoContent}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                    <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-7h-2c0-1-1-1.5-1-1.5"></path>
                    <path d="M2 9v1c0 1.1.9 2 2 2h1"></path>
                    <path d="M16 11h0"></path>
                  </svg>
                  Results
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="generate" className="space-y-8 mt-0">
                <InputSection
                  productDescription={productDescription}
                  setProductDescription={setProductDescription}
                  isLoading={isLoading}
                  retryAfter={retryAfter}
                  handleGenerate={handleGenerate}
                />

                {error && (
                  <ErrorMessage 
                    error={error} 
                    retryAfter={retryAfter} 
                  />
                )}

                {isLoading && (
                  <LoadingState />
                )}
              </TabsContent>
              
              <TabsContent value="results" className="space-y-8 mt-0">
                <AnimatePresence>
                  {seoContent && !isLoading && (
                    <ResultsView
                      seoContent={seoContent}
                      copied={copied}
                      handleCopy={handleCopy}
                      handleReset={handleReset}
                      phoneNumber={phoneNumber}
                      onPhoneNumberChange={handlePhoneNumberChange}
                      isSendingWhatsApp={isSendingWhatsApp}
                      onSendingWhatsAppChange={handleSendingWhatsAppChange}
                      whatsAppSuccess={whatsAppSuccess}
                      onWhatsAppStatusChange={handleWhatsAppStatusChange}
                    />
                  )}
                </AnimatePresence>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
