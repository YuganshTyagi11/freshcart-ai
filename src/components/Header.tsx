import { Link } from "@tanstack/react-router";
import { ShoppingCart, Sparkles, LayoutDashboard, Leaf, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useState } from "react";
import { CartSheet } from "./CartSheet";

export function Header() {
  const items = useCart((s) => s.items);
  const count = items.reduce((a, i) => a + i.qty, 0);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
              <Leaf className="h-5 w-5" />
            </span>
            <span>
              Fresh<span className="text-primary">Cart</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <Link
              to="/"
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeOptions={{ exact: true }}
              activeProps={{
                className:
                  "rounded-full px-4 py-2 text-sm font-medium bg-secondary text-foreground",
              }}
            >
              Shop
            </Link>
            <Link
              to="/assistant"
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{
                className:
                  "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium bg-secondary text-foreground",
              }}
            >
              <Sparkles className="h-4 w-4 text-accent" />
              AI Assistant
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{
                className:
                  "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium bg-secondary text-foreground",
              }}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              className="relative flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition-transform hover:scale-105"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {count > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold text-accent-foreground">
                  {count}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-secondary md:hidden"
              aria-label="Menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-border bg-background/95 backdrop-blur-lg md:hidden">
            <nav className="container mx-auto flex flex-col gap-1 px-4 py-3">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{
                  className:
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium bg-secondary text-foreground",
                }}
              >
                🛒 Shop
              </Link>
              <Link
                to="/assistant"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{
                  className:
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium bg-secondary text-foreground",
                }}
              >
                <Sparkles className="h-4 w-4 text-accent" />
                AI Assistant
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{
                  className:
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium bg-secondary text-foreground",
                }}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </nav>
          </div>
        )}
      </header>
      <CartSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}
