import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChurchIcon, Menu, Settings as SettingsIcon } from "lucide-react";

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
          <NavLink
            to="/settings"
            className={linkBase}
            activeClassName="text-foreground"
          >
            Settings
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          {/* Mobile nav */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="mt-2 space-y-4">
                  <div>
                    <div className="text-sm font-semibold text-foreground">Faith Compass</div>
                    <div className="text-xs text-muted-foreground">State College, PA</div>
                  </div>

                  <div className="grid gap-2">
                    <SheetClose asChild>
                      <Link to="/" className="text-sm font-medium text-foreground">
                        Home
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/match" className="text-sm font-medium text-foreground">
                        Find My Match
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/churches" className="text-sm font-medium text-foreground">
                        Browse Churches
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/about" className="text-sm font-medium text-foreground">
                        How It Works
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/contact" className="text-sm font-medium text-foreground">
                        Contact
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/settings" className="text-sm font-medium text-foreground">
                        Settings
                      </Link>
                    </SheetClose>
                  </div>

                  <div className="pt-2">
                    <SheetClose asChild>
                      <Link to="/auth">
                        <Button variant="outline" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link to="/settings" className="hidden md:block">
            <Button variant="ghost" size="icon" aria-label="Settings">
              <SettingsIcon className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/auth" className="hidden md:block">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/match">
            <Button className="bg-gradient-spiritual hover:opacity-95" size="sm">
              <span className="hidden sm:inline">Find My Match</span>
              <span className="sm:hidden">Match</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
