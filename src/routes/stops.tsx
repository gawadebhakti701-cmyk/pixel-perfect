import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MapPin, Search } from "lucide-react";
import { useState } from "react";
import { PageHeader, RouteCard, ModeTag } from "@/components/site/parts";
import { useAssistantContext } from "@/components/site/Assistant";
import { LOCATIONS, ROUTES, routesAtStop, type Mode } from "@/lib/transit-data";

export const Route = createFileRoute("/stops")({
  validateSearch: (s: Record<string, unknown>): { stop?: string } =>
    typeof s.stop === "string" && (LOCATIONS as readonly string[]).includes(s.stop) ? { stop: s.stop } : {},
  head: () => ({
    meta: [
      { title: "Browse Stops & Stations — TransitGuide" },
      { name: "description", content: "Find a stop or station and see which buses, trains, metro and cabs serve it." },
      { property: "og:title", content: "Browse Stops & Stations — TransitGuide" },
      { property: "og:description", content: "See transport available and routes passing through each stop." },
    ],
  }),
  component: StopsPage,
});

function StopsPage() {
  const { stop } = Route.useSearch();
  const navigate = useNavigate({ from: "/stops" });
  const [q, setQ] = useState("");
  const t = q.trim().toLowerCase();
  const matches = LOCATIONS.filter((l) => l.toLowerCase().includes(t));
  const routes = stop ? routesAtStop(stop) : [];
  const modes = [...new Set(routes.map((r) => r.mode))] as Mode[];

  useAssistantContext({ title: stop ? `routes through ${stop}` : "all routes in the directory", routes: stop ? routes : ROUTES });

  return (
    <>
      <PageHeader title="Browse Stops & Stations">Pick a stop to see the transport available and the routes passing through it.</PageHeader>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <div className="relative">
          <label htmlFor="stop-search" className="sr-only">Search for a stop or station</label>
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input id="stop-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for a stop or station"
            className="h-12 w-full rounded-lg border border-input bg-card pl-11 pr-3" />
        </div>
        {matches.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {matches.map((l) => (
              <button key={l} aria-pressed={stop === l} onClick={() => navigate({ search: { stop: l } })}
                className={`flex items-center gap-2 rounded-xl border-2 p-4 text-left font-semibold ${stop === l ? "border-primary bg-secondary" : "border-border bg-card hover:border-primary/50"}`}>
                <MapPin className="size-5 shrink-0 text-primary" aria-hidden />{l}
                <span className="sr-only">, {routesAtStop(l).length} routes</span>
              </button>
            ))}
          </div>
        ) : (
          <p role="alert" className="rounded-xl border bg-card p-6 font-medium">
            This location is not available in our current route directory. Try selecting one of the suggested locations.
          </p>
        )}

        {stop && (
          <section aria-labelledby="stop-title" className="space-y-5 pt-4">
            <h2 id="stop-title" className="text-3xl font-bold">{stop}</h2>
            <div>
              <h3 className="mb-2 text-lg font-bold">Transport available</h3>
              <div className="flex flex-wrap gap-2">{modes.map((m) => <ModeTag key={m} mode={m} />)}</div>
            </div>
            <h3 className="text-xl font-bold">Routes passing through {stop}</h3>
            <div className="grid gap-5 md:grid-cols-2">{routes.map((r) => <RouteCard key={r.id} r={r} />)}</div>
          </section>
        )}
      </div>
    </>
  );
}
