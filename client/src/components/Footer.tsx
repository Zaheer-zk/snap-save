import { Link } from "react-router-dom";
import { Download } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-muted/30">
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <Link to="/" className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-instagram">
              <Download className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">snapInsta</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Fast, free Instagram video downloader. No login required.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-display text-sm font-semibold">Pages</h4>
          <div className="flex flex-col gap-2">
            <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground">How It Works</Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-3 font-display text-sm font-semibold">Disclaimer</h4>
          <p className="text-xs text-muted-foreground">
            snapInsta is not affiliated with Instagram. Users are responsible for ensuring they have the right to download content. Only publicly accessible content can be downloaded.
          </p>
        </div>
      </div>
      <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} snapInsta. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
