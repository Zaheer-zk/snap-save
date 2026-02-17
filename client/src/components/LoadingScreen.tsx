
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-muted"></div>
          <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-t-transparent border-primary"></div>
          <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-spin text-primary" />
        </div>
        <h3 className="font-display text-xl font-bold animate-pulse">Extracting Video...</h3>
        <p className="text-muted-foreground">Please wait while we fetch your video</p>
      </div>
    </motion.div>
  );
};
