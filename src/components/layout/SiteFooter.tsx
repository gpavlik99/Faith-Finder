import { Link } from "react-router-dom";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-20 py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Faith Compass. Helping you explore
              church communities in and around State College, PA.
            </p>
            <p className="text-xs text-muted-foreground">
              Faith Compass is independent and non-affiliated. Recommendations
              are informational and meant to support your own decision.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              to="/about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/churches"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Browse Churches
            </Link>
            <Link
              to="/admin"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
