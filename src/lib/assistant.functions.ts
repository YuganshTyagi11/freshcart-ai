import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  prompt: z.string().min(2).max(500),
  catalog: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        unit: z.string(),
        category: z.string(),
      }),
    )
    .max(200),
});

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { error: "AI service is not configured.", items: [], message: "" };
    }

    const catalogStr = data.catalog
      .map((p) => `${p.id} | ${p.name} | ₹${p.price} per ${p.unit} | ${p.category}`)
      .join("\n");

    const systemPrompt = `You are FreshCart's helpful grocery shopping assistant.
The user gives a budget or recipe request. You pick items ONLY from this catalog:

${catalogStr}

Always respond using the suggest_cart tool. Stay within budget when given. Be concise.`;

    try {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: data.prompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "suggest_cart",
                description: "Suggest a cart of items from the catalog.",
                parameters: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      description: "Short friendly explanation (1-2 sentences).",
                    },
                    items: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string", description: "Catalog product id" },
                          qty: { type: "number" },
                          reason: { type: "string" },
                        },
                        required: ["id", "qty"],
                      },
                    },
                  },
                  required: ["message", "items"],
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "suggest_cart" } },
        }),
      });

      if (!response.ok) {
        if (response.status === 429)
          return { error: "Too many requests. Try again in a moment.", items: [], message: "" };
        if (response.status === 402)
          return { error: "AI credits exhausted. Add credits in workspace settings.", items: [], message: "" };
        return { error: `AI error (${response.status})`, items: [], message: "" };
      }

      const json = await response.json();
      const toolCall = json.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall) return { error: "No suggestion returned.", items: [], message: "" };

      const parsed = JSON.parse(toolCall.function.arguments) as {
        message: string;
        items: { id: string; qty: number; reason?: string }[];
      };

      // Filter to known IDs
      const validIds = new Set(data.catalog.map((c) => c.id));
      const items = parsed.items.filter((i) => validIds.has(i.id));

      return { error: null, message: parsed.message, items };
    } catch (e) {
      console.error("askAssistant error:", e);
      return { error: "Something went wrong.", items: [], message: "" };
    }
  });
