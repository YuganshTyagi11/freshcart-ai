import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Zap, Truck, Shield, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { AIAssistant } from "@/components/AIAssistant";
import { CATEGORIES, PRODUCTS, RECIPES, findProduct } from "@/lib/products";
import { useCart } from "@/lib/cart-store";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("all");
  const addMany = useCart((s) => s.addMany);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      if (activeCat !== "all" && p.category !== activeCat) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.unit.toLowerCase().includes(q)
      );
    });
  }, [query, activeCat]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-hero opacity-60" />
        <div className="absolute -top-24 -right-24 -z-10 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 -z-10 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

        <div className="container mx-auto grid gap-6 px-4 py-8 md:grid-cols-2 md:py-12">
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-background/70 px-3 py-1 text-xs font-medium text-primary backdrop-blur">
              <Zap className="h-3 w-3 fill-accent stroke-accent" /> Delivery in 15 min
            </span>
            <h1 className="font-display text-4xl font-bold leading-[1.05] text-balance md:text-6xl">
              Fresh groceries{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">delivered</span>{" "}
              in minutes
            </h1>
            <p className="mt-4 max-w-lg text-base text-muted-foreground md:text-lg">
              Shop smarter with AI: discover recipes, build carts on a budget, and skip the queue.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-6 flex items-center gap-2 rounded-full border border-border bg-card p-2 shadow-card focus-within:border-primary"
            >
              <Search className="ml-3 h-5 w-5 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What do you need today? Milk, Fruits, Rice..."
                className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
              />
              <button className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background shrink-0">
                Search
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-primary" /> Free over ₹500
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-primary" /> Quality guaranteed
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-primary" /> 15-min express
              </span>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="grid grid-cols-2 gap-3">
              {["🥑", "🍓", "🥖", "🥬"].map((e, i) => (
                <div
                  key={i}
                  className="flex aspect-square items-center justify-center rounded-3xl bg-card text-7xl shadow-card transition-transform hover:-translate-y-1"
                  style={{ animation: `float 6s ease-in-out ${i * 0.4}s infinite` }}
                >
                  {e}
                </div>
              ))}
            </div>
            <style>{`@keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }`}</style>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container mx-auto px-4 py-6">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Shop by category</h2>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
          <button
            onClick={() => setActiveCat("all")}
            className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition hover:-translate-y-1 hover:shadow-glow ${activeCat === "all" ? "border-primary bg-primary/5" : "border-border bg-card"}`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-3xl">
              🛒
            </div>
            <span className="text-sm font-medium">All</span>
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCat(c.id)}
              className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition hover:-translate-y-1 hover:shadow-glow ${activeCat === c.id ? "border-primary bg-primary/5" : "border-border bg-card"}`}
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl"
                style={{ backgroundColor: c.color }}
              >
                {c.emoji}
              </div>
              <span className="text-sm font-medium">{c.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* AI ASSISTANT */}
      <section className="container mx-auto px-4 py-6">
        <div className="grid gap-6 md:grid-cols-5">
          <div className="md:col-span-3">
            <AIAssistant />
          </div>
          <div className="md:col-span-2">
            <div className="flex h-full flex-col rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-glow">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
                Why FreshCart
              </span>
              <h3 className="mt-2 font-display text-2xl font-bold leading-tight">
                The smartest way to fill your fridge.
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex gap-2">
                  <ChevronRight className="h-5 w-5 shrink-0" /> AI assistant builds carts to your
                  budget
                </li>
                <li className="flex gap-2">
                  <ChevronRight className="h-5 w-5 shrink-0" /> One-tap recipe shopping
                </li>
                <li className="flex gap-2">
                  <ChevronRight className="h-5 w-5 shrink-0" /> Schedule delivery to fit your day
                </li>
                <li className="flex gap-2">
                  <ChevronRight className="h-5 w-5 shrink-0" /> Live order tracking
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* RECIPES */}
      <section className="container mx-auto px-4 py-6">
        <div className="mb-5">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Recipe-based shopping</h2>
          <p className="text-sm text-muted-foreground">
            Pick a recipe — we'll add every ingredient.
          </p>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {RECIPES.map((r) => {
            const total = r.ingredients.reduce((acc, id) => acc + (findProduct(id)?.price ?? 0), 0);
            return (
              <div
                key={r.id}
                className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-1 hover:shadow-glow"
              >
                <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-secondary text-7xl">
                  {r.emoji}
                </div>
                <h3 className="mt-3 font-display text-lg font-bold">{r.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {r.time} · {r.ingredients.length} ingredients
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {r.ingredients.slice(0, 4).map((id) => {
                    const p = findProduct(id);
                    return p ? (
                      <span key={id} className="rounded-full bg-secondary px-2 py-0.5 text-[11px]">
                        {p.emoji} {p.name}
                      </span>
                    ) : null;
                  })}
                </div>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="font-display font-bold">₹{total}</span>
                  <button
                    onClick={() => addMany(r.ingredients)}
                    className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-soft transition hover:scale-105"
                  >
                    Add all
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="container mx-auto px-4 py-6">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold md:text-3xl">
            {activeCat === "all"
              ? "Fresh picks for you"
              : CATEGORIES.find((c) => c.id === activeCat)?.name}
          </h2>
          <span className="text-sm text-muted-foreground">{filtered.length} items</span>
        </div>
        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No matches. Try a different search.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <footer className="mt-12 border-t border-border bg-card">
        <div className="container mx-auto flex flex-col items-center gap-2 px-4 py-8 text-sm text-muted-foreground md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} FreshCart — fresh, fast, smart.</p>
          <p>Made with 🌿 for hungry humans.</p>
        </div>
      </footer>
    </div>
  );
}
