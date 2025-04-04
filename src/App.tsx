import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import KeywordGenerator from "@/components/KeywordGenerator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const Home = () => (
  <main className="min-h-screen bg-background p-4">
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">
        SEO Content Generator
      </h1>
      <KeywordGenerator />
    </div>
  </main>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
