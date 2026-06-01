import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Package, Heart, Bookmark, MapPin, Sparkles, Check, Truck, Clock } from "lucide-react";
import { Header } from "@/components/Header";
import { AIAssistant } from "@/components/AIAssistant";
import { ProductCard } from "@/components/ProductCard";
import { useCart, itemsWithProduct } from "@/lib/cart-store";
import { PRODUCTS, findProduct } from "@/lib/products";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "FreshCart" },
      {
        name: "description",
        content: "Track orders, manage your wishlist, saved lists, and AI assistant in one place.",
      },
      { property: "og:title", content: "Your FreshCart Dashboard" },
      { property: "og:description", content: "Orders, lists, tracking, and AI — all together." },
    ],
  }),
  component: Dashboard,
});

const TABS = [
  { id: "orders", label: "Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "lists", label: "Saved Lists", icon: Bookmark },
  { id: "tracking", label: "Delivery Tracking", icon: MapPin },
  { id: "assistant", label: "AI Assistant", icon: Sparkles },
] as const;

type TabId = (typeof TABS)[number]["id"];

function Dashboard() {
  const [tab, setTab] = useState<TabId>("orders");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="container mx-auto px-4 py-6">
        <div className="mb-4">
          <h1 className="font-display text-3xl font-bold md:text-4xl">Welcome back 👋</h1>
          <p className="text-muted-foreground">Manage your cart, orders, and smart lists.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          <aside className="flex gap-1 overflow-x-auto rounded-2xl border border-border bg-card p-2 md:flex-col">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  tab === t.id
                    ? "bg-gradient-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </aside>

          <div className="min-h-[400px]">
            {tab === "orders" && <OrdersTab />}
            {tab === "wishlist" && <WishlistTab />}
            {tab === "lists" && <ListsTab />}
            {tab === "tracking" && <TrackingTab />}
            {tab === "assistant" && <AIAssistant />}
          </div>
        </div>
      </section>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  hint,
}: {
  icon: typeof Package;
  title: string;
  hint: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-border bg-card p-12 text-center">
      <Icon className="h-10 w-10 text-muted-foreground/40" />
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}

function OrdersTab() {
  const orders = useCart((s) => s.orders);
  if (orders.length === 0)
    return (
      <EmptyState
        icon={Package}
        title="No orders yet"
        hint="Place your first order to see it here."
      />
    );
  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div key={o.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-mono text-sm font-semibold">{o.id}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(o.createdAt).toLocaleString()}
              </p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {o.status}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {o.items.slice(0, 8).map((it) => {
              const p = findProduct(it.productId);
              return p ? (
                <span key={it.productId} className="rounded-full bg-secondary px-2 py-1 text-xs">
                  {p.emoji} {p.name} × {it.qty}
                </span>
              ) : null;
            })}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
            <span className="text-muted-foreground">{o.items.length} items</span>
            <span className="font-display text-lg font-bold">₹{o.total}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function WishlistTab() {
  const wishlist = useCart((s) => s.wishlist);
  const products = PRODUCTS.filter((p) => wishlist.includes(p.id));
  if (products.length === 0)
    return (
      <EmptyState
        icon={Heart}
        title="Wishlist is empty"
        hint="Tap the heart on any product to save it."
      />
    );
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

function ListsTab() {
  const items = useCart((s) => s.items);
  const lists = useCart((s) => s.savedLists);
  const saveList = useCart((s) => s.saveList);
  const addMany = useCart((s) => s.addMany);
  const [name, setName] = useState("");

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-display font-bold">Save your current cart as a list</h3>
        <p className="text-sm text-muted-foreground">Reorder it any time with one tap.</p>
        <div className="mt-3 flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Weekly essentials"
            className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary"
          />
          <button
            disabled={!name.trim() || items.length === 0}
            onClick={() => {
              saveList(
                name.trim(),
                items.map((i) => i.productId),
              );
              setName("");
            }}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            Save
          </button>
        </div>
        {items.length === 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            Your cart is empty — add items first.
          </p>
        )}
      </div>

      {lists.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved lists"
          hint="Save a cart to reorder it later."
        />
      ) : (
        <div className="space-y-3">
          {lists.map((l) => {
            const ps = l.productIds.map(findProduct).filter(Boolean);
            return (
              <div key={l.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold">{l.name}</h4>
                  <button
                    onClick={() => addMany(l.productIds)}
                    className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground"
                  >
                    Add all
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {ps.map((p) => (
                    <span key={p!.id} className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                      {p!.emoji} {p!.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TrackingTab() {
  const orders = useCart((s) => s.orders);
  const latest = orders[0];
  if (!latest)
    return (
      <EmptyState
        icon={MapPin}
        title="Nothing to track"
        hint="Your live delivery will appear here."
      />
    );

  const steps = [
    { label: "Order received", icon: Check, done: true },
    { label: "Packing", icon: Package, done: true },
    { label: "Out for delivery", icon: Truck, done: true },
    { label: "Arriving soon", icon: Clock, done: false },
  ];

  const items = itemsWithProduct(latest.items);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-glow">
        <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Live tracking</p>
        <h3 className="mt-1 font-display text-2xl font-bold">Arriving in ~12 minutes</h3>
        <p className="text-sm opacity-90">
          Order {latest.id} · ₹{latest.total}
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-5">
        <ol className="space-y-4">
          {steps.map((s, i) => (
            <li key={i} className="flex items-center gap-3">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full ${
                  s.done
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                <s.icon className="h-4 w-4" />
              </span>
              <span className={s.done ? "font-medium" : "text-muted-foreground"}>{s.label}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="rounded-2xl border border-border bg-card p-5">
        <h4 className="font-display font-bold">In this order</h4>
        <div className="mt-2 flex flex-wrap gap-2">
          {items.map(({ item, product }) => (
            <span key={item.productId} className="rounded-full bg-secondary px-3 py-1 text-sm">
              {product.emoji} {product.name} × {item.qty}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
