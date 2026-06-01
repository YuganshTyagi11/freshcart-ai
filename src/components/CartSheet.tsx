import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { cartTotal, itemsWithProduct, useCart } from "@/lib/cart-store";

export function CartSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const checkout = useCart((s) => s.checkout);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (open) setSuccess(null);
  }, [open]);

  const rows = itemsWithProduct(items);
  const total = cartTotal(items);
  const delivery = total > 0 ? (total > 500 ? 0 : 40) : 0;

  return (
    <div
      className={`fixed inset-0 z-50 transition ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-foreground/40 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-2xl transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold">
            <ShoppingBag className="h-5 w-5 text-primary" /> Your Cart
          </h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-secondary">
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
              ✅
            </div>
            <h3 className="font-display text-xl font-bold">Order placed!</h3>
            <p className="text-sm text-muted-foreground">
              Order <span className="font-mono font-semibold text-foreground">{success}</span> is
              being prepared. Track it from your Dashboard.
            </p>
            <button
              onClick={onClose}
              className="mt-2 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground"
            >
              Continue shopping
            </button>
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground">
            <ShoppingBag className="h-12 w-12 opacity-30" />
            <p>Your cart is empty.</p>
            <p className="text-xs">Add fresh picks or ask the AI assistant.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {rows.map(({ item, product }) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-3xl">
                    {product.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.unit} · ₹{product.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-secondary p-1">
                    <button
                      onClick={() => setQty(item.productId, item.qty - 1)}
                      className="rounded-full p-1 hover:bg-background"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.qty}</span>
                    <button
                      onClick={() => setQty(item.productId, item.qty + 1)}
                      className="rounded-full p-1 hover:bg-background"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => remove(item.productId)}
                    className="rounded-full p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={clear}
                className="w-full rounded-full py-2 text-xs font-medium text-muted-foreground hover:text-destructive"
              >
                Clear cart
              </button>
            </div>

            <div className="space-y-3 border-t border-border p-5">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{total}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  <span>{delivery === 0 ? "FREE" : `₹${delivery}`}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 font-display text-base font-bold">
                  <span>Total</span>
                  <span>₹{total + delivery}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  const id = checkout();
                  setSuccess(id);
                }}
                className="w-full rounded-full bg-gradient-primary py-3 font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
              >
                Schedule delivery · ₹{total + delivery}
              </button>
              <p className="text-center text-xs text-muted-foreground">
                Free delivery on orders over ₹500
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
