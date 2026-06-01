import { Heart, Plus } from "lucide-react";
import type { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-store";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const wishlist = useCart((s) => s.wishlist);
  const toggleWishlist = useCart((s) => s.toggleWishlist);
  const inCart = useCart((s) => s.items.find((i) => i.productId === product.id)?.qty ?? 0);
  const liked = wishlist.includes(product.id);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
      <button
        onClick={() => toggleWishlist(product.id)}
        className="absolute right-3 top-3 z-10 rounded-full bg-background/80 p-1.5 backdrop-blur transition-colors hover:bg-background"
        aria-label="Wishlist"
      >
        <Heart
          className={`h-4 w-4 transition ${liked ? "fill-destructive stroke-destructive" : "stroke-muted-foreground"}`}
        />
      </button>

      <div className="flex aspect-square items-center justify-center rounded-xl bg-secondary text-6xl transition-transform duration-500 group-hover:scale-110">
        {product.emoji}
      </div>

      {product.tag && (
        <span className="absolute left-3 top-3 rounded-full bg-accent/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-foreground">
          {product.tag}
        </span>
      )}

      <div className="mt-3 flex flex-1 flex-col">
        <p className="text-xs text-muted-foreground">{product.unit}</p>
        <h3 className="font-medium leading-tight">{product.name}</h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-lg font-bold">₹{product.price}</span>
          <button
            onClick={() => add(product.id)}
            className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-105"
          >
            {inCart > 0 ? (
              `In cart · ${inCart}`
            ) : (
              <>
                <Plus className="h-3 w-3" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
