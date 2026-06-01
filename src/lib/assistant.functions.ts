type CatalogItem = { id: string; name: string; price: number; unit: string; category: string };
export type CartItem = { id: string; qty: number; reason?: string };

// ── Local Smart Fallback (works without any API key) ────────────────────────

function extractBudget(prompt: string): number | null {
  const m = prompt.match(/(\d{2,6})/);
  return m ? parseInt(m[1], 10) : null;
}

function matchCategories(prompt: string): string[] {
  const p = prompt.toLowerCase();
  const cats: string[] = [];
  if (/milk|cheese|yogurt|butter|dairy|paneer/.test(p)) cats.push("dairy");
  if (/fruit|apple|banana|strawberr|orange|smoothie|juice/.test(p)) cats.push("fruits");
  if (/veget|salad|spinach|tomato|garlic|carrot|basil|onion/.test(p)) cats.push("vegetables");
  if (/bread|bakery|croissant|bagel|pasta|sauce|noodle/.test(p)) cats.push("bakery");
  if (/drink|beverage|juice|coffee|water|cold brew|tea/.test(p)) cats.push("beverages");
  if (/snack|chocolate|chip|nut|cookie|munchies/.test(p)) cats.push("snacks");
  return cats;
}

function matchRecipes(prompt: string): string[][] {
  const p = prompt.toLowerCase();
  const recipes: string[][] = [];
  if (/pasta|spaghetti|italian/.test(p)) recipes.push(["p22", "p23", "p11", "p3", "p24"]);
  if (/breakfast|morning/.test(p)) recipes.push(["p14", "p4", "p16", "p2"]);
  if (/salad|garden|healthy|light/.test(p)) recipes.push(["p10", "p9", "p12", "p24"]);
  if (/smoothie|fruit|blended/.test(p)) recipes.push(["p6", "p7", "p2", "p1"]);
  if (/movie|netflix|night|snack|party/.test(p)) recipes.push(["p19", "p20", "p21", "p18"]);
  return recipes;
}

function localAssistant(
  prompt: string,
  catalog: CatalogItem[],
): { message: string; items: CartItem[] } {
  const budget = extractBudget(prompt);
  const cats = matchCategories(prompt);
  const recipes = matchRecipes(prompt);

  let selected: CartItem[] = [];
  let message = "";

  if (recipes.length > 0) {
    selected = recipes[0].map((id) => ({ id, qty: 1 }));
    message = "Here's everything you need for that recipe!";
  } else if (cats.length > 0) {
    const pool = catalog.filter((p) => cats.includes(p.category));
    selected = pool.slice(0, 5).map((p) => ({ id: p.id, qty: 1 }));
    message = `Found some great ${cats.join(" & ")} items for you!`;
  } else {
    selected = [
      { id: "p1", qty: 1, reason: "Fresh milk - a staple" },
      { id: "p6", qty: 1, reason: "Bananas - healthy snack" },
      { id: "p9", qty: 1, reason: "Tomatoes - versatile ingredient" },
      { id: "p13", qty: 1, reason: "Sourdough bread - fresh today" },
    ];
    message = "Here are some popular picks to get you started!";
  }

  if (budget) {
    let total = 0;
    const withinBudget: CartItem[] = [];
    for (const item of selected) {
      const product = catalog.find((p) => p.id === item.id);
      if (!product) continue;
      const itemCost = product.price * item.qty;
      if (total + itemCost <= budget) {
        withinBudget.push(item);
        total += itemCost;
      }
    }
    if (withinBudget.length > 0) {
      selected = withinBudget;
      message += ` Total: ₹${total} (within your ₹${budget} budget).`;
    } else {
      const sorted = [...catalog].sort((a, b) => a.price - b.price);
      let remaining = budget;
      const budgetItems: CartItem[] = [];
      for (const p of sorted) {
        if (remaining >= p.price) {
          budgetItems.push({ id: p.id, qty: 1 });
          remaining -= p.price;
        }
      }
      selected = budgetItems;
      message = `Here's what I could fit in your ₹${budget} budget!`;
    }
  }

  return { message, items: selected };
}

// ── Gemini API (client-side, optional) ──────────────────────────────────────

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

function buildSystemPrompt(catalog: CatalogItem[]) {
  const catalogStr = catalog
    .map((p) => `${p.id} | ${p.name} | ₹${p.price} per ${p.unit} | ${p.category}`)
    .join("\n");

  return `You are FreshCart's grocery shopping assistant. You ONLY suggest items from the catalog below.

CATALOG:
${catalogStr}

RULES:
- When the user gives a budget, stay within it.
- When the user describes a meal/recipe, pick all necessary ingredients.
- Respond ONLY with valid JSON (no markdown, no code fences).
- JSON format:
{
  "message": "Short friendly explanation (1-2 sentences)",
  "items": [
    { "id": "product_id", "qty": 1, "reason": "why this item" }
  ]
}
- Use exact product IDs from the catalog.
- If the request doesn't match any catalog items, return { "message": "Sorry, I can only suggest items from our catalog.", "items": [] }`;
}

async function callGemini(
  prompt: string,
  catalog: CatalogItem[],
): Promise<{ message: string; items: CartItem[] } | null> {
  const apiKey = (import.meta as unknown as { env: Record<string, string | undefined> }).env
    .VITE_GOOGLE_API_KEY;
  if (!apiKey) return null;

  const systemPrompt = buildSystemPrompt(catalog);

  try {
    const url = `${GEMINI_URL}?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1024,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) return null;

    const json = await response.json();
    const text: string | undefined = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    let parsed: { message: string; items: CartItem[] };
    try {
      parsed = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) return null;
      parsed = JSON.parse(match[0]);
    }

    const validIds = new Set(catalog.map((c) => c.id));
    const items = (parsed.items || []).filter((i) => validIds.has(i.id));
    return { message: parsed.message || "", items };
  } catch {
    return null;
  }
}

// ── Main Export ─────────────────────────────────────────────────────────────

export async function askAssistant(prompt: string, catalog: CatalogItem[]) {
  const aiResult = await callGemini(prompt, catalog);
  if (aiResult && aiResult.items.length > 0) {
    return { error: null, ...aiResult };
  }
  const localResult = localAssistant(prompt, catalog);
  return { error: null, ...localResult };
}
