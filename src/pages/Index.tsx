import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UrlInput from "@/components/UrlInput";
import FeatureCards from "@/components/FeatureCards";
import FaqSection from "@/components/FaqSection";
import ResultCard from "@/components/ResultCard";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    thumbnail: string;
    title: string;
    duration: string;
    qualities: string[];
    downloadUrl: string;
  } | null>(null);

  const handleSubmit = (url: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    // Simulate extraction (replace with real API call)
    setTimeout(() => {
      setIsLoading(false);
      setResult({
        thumbnail: heroBg,
        title: "Instagram Reel — Downloaded via snapInsta",
        duration: "0:30",
        qualities: ["1080p", "720p", "480p"],
        downloadUrl: url,
      });
    }, 2000);
  };

  const handleDownload = (quality: string) => {
    toast.success(`Downloading in ${quality}...`, {
      description: "Your file will be ready in a moment.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative hero-bg overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="container relative z-10 flex flex-col items-center px-4 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary"
          >
            ✨ Free & No Login Required
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-4 max-w-3xl text-center font-display text-4xl font-bold leading-tight md:text-6xl"
          >
            Download Instagram Videos{" "}
            <span className="gradient-text">Instantly</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-10 max-w-lg text-center text-muted-foreground md:text-lg"
          >
            Paste any public Instagram Reel, Post, or IGTV link and download in original quality. No watermarks, no signup.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full"
          >
            <UrlInput onSubmit={handleSubmit} isLoading={isLoading} error={error} />
          </motion.div>

          {/* Result */}
          {result && (
            <div className="mt-10 w-full">
              <ResultCard
                thumbnail={result.thumbnail}
                title={result.title}
                duration={result.duration}
                qualities={result.qualities}
                onDownload={handleDownload}
                downloadUrl={result.downloadUrl}
              />
            </div>
          )}
        </div>
      </section>

      <FeatureCards />
      <FaqSection />
      <Footer />
    </div>
  );
};

export default Index;
