import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import type { ReactNode } from "react";

export default function PageLayout({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className={className ?? ""}>{children}</main>
      <SiteFooter />
    </div>
  );
}
