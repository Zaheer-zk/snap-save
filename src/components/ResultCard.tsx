import { motion } from "framer-motion";
import { Download, Copy, Check, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ResultCardProps {
  thumbnail: string;
  title: string;
  duration: string;
  qualities: string[];
  onDownload: (quality: string) => void;
  downloadUrl: string;
}

const ResultCard = ({ thumbnail, title, duration, qualities, onDownload, downloadUrl }: ResultCardProps) => {
  const [copied, setCopied] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState(qualities[0]);

  const handleCopy = () => {
    navigator.clipboard.writeText(downloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-lg mx-auto rounded-2xl border border-border bg-card p-6 shadow-card"
    >
      <div className="relative mb-4 overflow-hidden rounded-xl bg-muted aspect-video">
        <img src={thumbnail} alt={title} className="h-full w-full object-cover" />
        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-foreground/70 px-2 py-1 text-xs text-background">
          <Film className="h-3 w-3" />
          {duration}
        </div>
      </div>

      <h3 className="mb-3 font-display text-lg font-semibold line-clamp-2">{title}</h3>

      <div className="mb-4 flex flex-wrap gap-2">
        {qualities.map((q) => (
          <button
            key={q}
            onClick={() => setSelectedQuality(q)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              selectedQuality === q
                ? "gradient-instagram text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {q}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => onDownload(selectedQuality)}
          className="flex-1 h-12 rounded-xl gradient-instagram text-primary-foreground font-semibold hover:opacity-90"
        >
          <Download className="mr-2 h-5 w-5" />
          Download {selectedQuality}
        </Button>
        <Button
          variant="outline"
          onClick={handleCopy}
          className="h-12 rounded-xl px-4"
        >
          {copied ? <Check className="h-5 w-5 text-primary" /> : <Copy className="h-5 w-5" />}
        </Button>
      </div>
    </motion.div>
  );
};

export default ResultCard;
