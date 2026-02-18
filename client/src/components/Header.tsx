import { useState } from "react";
import { Link } from "react-router-dom";
import { Download, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-instagram">
            <Download className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold">snapInsta</span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            How It Works
          </Link>
          <Link to="/privacy" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Privacy
          </Link>
          <Link to="/terms" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Terms
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-md md:hidden hover:bg-muted"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-b border-border/50 bg-background/95 backdrop-blur-lg"
          >
            <nav className="flex flex-col space-y-4 p-6">
              <Link 
                to="/how-it-works" 
                className="text-base font-medium text-foreground hover:text-primary transition-colors"
                onClick={closeMenu}
              >
                How It Works
              </Link>
              <Link 
                to="/privacy" 
                className="text-base font-medium text-foreground hover:text-primary transition-colors"
                onClick={closeMenu}
              >
                Privacy
              </Link>
              <Link 
                to="/terms" 
                className="text-base font-medium text-foreground hover:text-primary transition-colors"
                onClick={closeMenu}
              >
                Terms
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
