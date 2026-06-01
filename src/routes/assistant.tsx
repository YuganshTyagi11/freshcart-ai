import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { AIAssistant } from "@/components/AIAssistant";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "FreshCart" },
      {
        name: "description",
        content: "Tell our AI your budget or recipe and get a complete cart instantly.",
      },
      { property: "og:title", content: "FreshCart AI Assistant" },
      { property: "og:description", content: "Smart grocery shopping powered by AI." },
    ],
  }),
  component: AssistantPage,
});

function AssistantPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 text-center">
          <h1 className="font-display text-4xl font-bold md:text-5xl">Your AI grocery sidekick</h1>
          <p className="mt-3 text-muted-foreground">
            Give it a budget, a craving, or a recipe — get a smart cart in seconds.
          </p>
        </div>
        <AIAssistant />
      </section>
    </div>
  );
}
