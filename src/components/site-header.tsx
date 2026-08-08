import { Link } from "@tanstack/react-router";
import { Brain, Moon, Sun, MessageSquareHeart, Home } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { InstallButton } from "@/components/install-button";
import { SidebarTrigger } from "@/components/ui/sidebar";


export function SiteHeader({
  withSidebarTrigger = false,
  onOpenFeedback,
}: {
  withSidebarTrigger?: boolean;
  onOpenFeedback?: () => void;
} = {}) {
  const { isDark, toggle } = useTheme();

  return (
    <header className="no-print no-profile-print border-b border-border bg-card/70 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-5 py-5">
        {withSidebarTrigger ? <SidebarTrigger className="min-h-11 min-w-11" /> : null}
        <Link to="/" className="flex items-center gap-3 rounded-lg">

          <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Brain className="size-6" aria-hidden="true" />
          </span>
          <span>
            <span className="block font-display text-xl font-bold tracking-tight text-foreground">
              Hyper-Mapper
            </span>
            <span className="block text-sm text-muted-foreground">
              Translate abstract concepts into your cognitive framework
            </span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-3">
          <Link
            to="/"
            className="hidden items-center gap-2 rounded-full bg-primary-soft px-4 py-2 text-xs font-semibold text-accent-foreground transition-colors hover:bg-primary/20 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring sm:inline-flex"
            aria-label="Return to the concept mapper home page"
          >
            <Home className="size-3.5" aria-hidden="true" />
            Designed &amp; Tested with NNEA Self-Advocates
          </Link>
          {onOpenFeedback ? (
            <Button
              type="button"
              variant="ghost"
              onClick={onOpenFeedback}
              className="min-h-11 gap-2"
            >
              <MessageSquareHeart className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Tester feedback</span>
            </Button>
          ) : (
            <Button asChild variant="ghost" className="min-h-11 gap-2">
              <Link to="/tester-feedback">
                <MessageSquareHeart className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Tester feedback</span>
              </Link>
            </Button>
          )}
          <InstallButton />
          <Button

            type="button"
            variant="outline"
            onClick={toggle}
            aria-pressed={isDark}
            aria-label={
              isDark ? "Switch to warm light mode" : "Switch to high-contrast dark mode"
            }
            className="min-h-11 min-w-11 gap-2"
          >
            {isDark ? (
              <Sun className="size-4" aria-hidden="true" />
            ) : (
              <Moon className="size-4" aria-hidden="true" />
            )}
            <span className="hidden md:inline">
              {isDark ? "Light mode" : "High contrast"}
            </span>
          </Button>
        </div>

        <Link
          to="/"
          className="flex items-center gap-2 rounded-full bg-primary-soft px-4 py-2 text-xs font-semibold text-accent-foreground transition-colors hover:bg-primary/20 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring sm:hidden"
          aria-label="Return to the concept mapper home page"
        >
          <Home className="size-3.5" aria-hidden="true" />
          Designed &amp; Tested with NNEA Self-Advocates
        </Link>
      </div>
    </header>
  );
}
