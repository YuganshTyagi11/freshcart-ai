import { useState } from "react";
import { Sparkles, Send, Loader2, Check } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { askAssistant } from "@/lib/assistant.functions";
import { PRODUCTS, findProduct } from "@/lib/products";
import { useCart } from "@/lib/cart-store";

const EXAMPLES = [
  "I have ₹500 and want ingredients for pasta",
  "Healthy breakfast for 2 under ₹300",
  "Snacks for a movie night",
  "Quick salad ingredients",
];

type Suggestion = { id: string; qty: number; reason?: string };

export function AIAssistant({ compact = false }: { compact?: boolean }) {
  const callAssistant = useServerFn(askAssistant);
  const addMany = useCart((s) => s.addMany);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [items, setItems] = useState<Suggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  async function submit(text?: string) {
    const q = (text ?? prompt).trim();
    if (!q) return;
    setPrompt(q);
    setLoading(true);
    setError(null);
    setItems([]);
    setMessage("");
    setAdded(false);
    try {
      const res = await callAssistant({
        data: {
          prompt: q,
          catalog: PRODUCTS.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            unit: p.unit,
            category: p.category,
          })),
        },
      });
      if (res.error) setError(res.error);
      else {
        setMessage(res.message);
        setItems(res.items);
      }
    } catch (e) {
      setError("Failed to reach the assistant.");
    } finally {
      setLoading(false);
    }
  }

  const total = items.reduce((acc, it) => {
    const p = findProduct(it.id);
    return acc + (p ? p.price * it.qty : 0);
  }, 0);

  return (
    <div
      className={`rounded-3xl border border-border bg-card p-5 shadow-card ${compact ? "" : "md:p-8"}`}
    >
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-display font-bold leading-tight">AI Shopping Assistant</h3>
          <p className="text-xs text-muted-foreground">
            Tell it your budget or recipe — get a full cart in seconds.
          </p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="mt-4 flex items-center gap-2 rounded-full border border-border bg-background p-1.5 shadow-soft focus-within:border-primary"
      >
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. ₹500 budget for pasta night"
          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex h-9 items-center gap-1.5 rounded-full bg-gradient-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Ask
        </button>
      </form>

      {!items.length && !loading && !error && (
        <div className="mt-4 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => submit(ex)}
              className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary hover:text-foreground"
            >
              {ex}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-secondary px-4 py-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Thinking up your perfect cart…
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-5 space-y-3">
          {message && (
            <p className="rounded-2xl bg-secondary px-4 py-3 text-sm text-foreground">{message}</p>
          )}
          <div className="space-y-2">
            {items.map((it) => {
              const p = findProduct(it.id);
              if (!p) return null;
              return (
                <div
                  key={it.id}
                  className="flex items-center gap-3 rounded-2xl border border-border p-3"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-2xl">
                    {p.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      {p.name} <span className="text-xs text-muted-foreground">× {it.qty}</span>
                    </p>
                    {it.reason && (
                      <p className="truncate text-xs text-muted-foreground">{it.reason}</p>
                    )}
                  </div>
                  <span className="font-display font-semibold">₹{p.price * it.qty}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-secondary px-4 py-3">
            <span className="text-sm text-muted-foreground">Estimated total</span>
            <span className="font-display text-lg font-bold">₹{total}</span>
          </div>
          <button
            onClick={() => {
              const expanded: string[] = [];
              items.forEach((it) => {
                for (let i = 0; i < it.qty; i++) expanded.push(it.id);
              });
              addMany(expanded);
              setAdded(true);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary py-3 font-semibold text-primary-foreground shadow-glow"
          >
            {added ? (
              <>
                <Check className="h-4 w-4" /> Added to cart
              </>
            ) : (
              "Add all to cart"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
