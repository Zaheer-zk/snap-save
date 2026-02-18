import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Download, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  error: string | null;
}

const INSTAGRAM_URL_REGEX = /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv|reels)\/[\w-]+\/?/;

const UrlInput = ({ onSubmit, isLoading, error }: UrlInputProps) => {
  const [url, setUrl] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const validate = useCallback((value: string) => {
    if (!value.trim()) return null;
    if (value.length > 500) return "URL is too long";
    if (!INSTAGRAM_URL_REGEX.test(value)) return "Please enter a valid Instagram post, reel, or IGTV URL";
    return null;
  }, []);

  const handleSubmit = () => {
    const err = validate(url);
    if (err) {
      setValidationError(err);
      return;
    }
    if (!url.trim()) return;
    setValidationError(null);
    onSubmit(url.trim());
  };

  // Auto-detect paste
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const text = e.clipboardData?.getData("text") ?? "";
      if (INSTAGRAM_URL_REGEX.test(text)) {
        setUrl(text);
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const displayError = validationError || error;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-card transition-shadow focus-within:shadow-glow">
        <div className="flex flex-1 items-center gap-2 px-2">
          <div className="flex items-center text-muted-foreground shrink-0">
            <Link2 className="h-5 w-5" />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setValidationError(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Paste Instagram video link here..."
            className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground md:text-base min-w-0"
            maxLength={500}
            disabled={isLoading}
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !url.trim()}
          className="h-12 w-full sm:w-auto rounded-xl px-6 gradient-instagram text-primary-foreground font-semibold transition-all hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Download className="mr-2 h-5 w-5" />
              Download
            </>
          )}
        </Button>
      </div>

      <AnimatePresence>
        {displayError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-3 flex items-center gap-2 text-sm text-destructive"
          >
            <AlertCircle className="h-4 w-4" />
            {displayError}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Example: https://www.instagram.com/reel/ABC123...
      </p>
    </div>
  );
};

export default UrlInput;
