import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { ChurchIcon } from "lucide-react";

const linkBase =
  "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15">
            <ChurchIcon className="h-5 w-5 text-accent" />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-foreground">Faith Compass</div>
            <div className="text-xs text-muted-foreground">State College, PA</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={linkBase} activeClassName="text-foreground">
            Home
          </NavLink>
          <NavLink
            to="/match"
            className={linkBase}
            activeClassName="text-foreground"
          >
            Find My Match
          </NavLink>
          <NavLink
            to="/churches"
            className={linkBase}
            activeClassName="text-foreground"
          >
            Browse Churches
          </NavLink>
          <NavLink
            to="/about"
            className={linkBase}
            activeClassName="text-foreground"
          >
            How It Works
          </NavLink>
          <NavLink
            to="/contact"
            className={linkBase}
            activeClassName="text-foreground"
          >
            Contact
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/auth" className="hidden md:block">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/match">
            <Button className="bg-gradient-spiritual hover:opacity-95">
              Find My Match
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
