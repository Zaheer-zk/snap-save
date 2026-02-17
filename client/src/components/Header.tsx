import { Link } from "react-router-dom";
import { Download } from "lucide-react";

const Header = () => (
  <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
    <div className="container flex h-16 items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-instagram">
          <Download className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-display text-xl font-bold">snapInsta</span>
      </Link>
      <nav className="hidden items-center gap-6 md:flex">
        <Link to="/how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
          How It Works
        </Link>
        <Link to="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
          Privacy
        </Link>
        <Link to="/terms" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
          Terms
        </Link>
      </nav>
    </div>
  </header>
);

export default Header;
