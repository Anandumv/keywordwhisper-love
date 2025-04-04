import KeywordGenerator from '@/components/KeywordGenerator';

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">
          SEO Content Generator
        </h1>
        <KeywordGenerator />
      </div>
    </main>
  );
} 