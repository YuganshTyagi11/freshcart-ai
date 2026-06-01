import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { AIAssistant } from "@/components/AIAssistant";

export const Route = createFileRoute("/assistant")({
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
