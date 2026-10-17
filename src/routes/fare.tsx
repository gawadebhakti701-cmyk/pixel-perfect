import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeftRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, RouteCard, LocationSelect, CrowdBadge, Note, CROWD_NOTE, FARE_NOTE, RouteStats, ModeTag } from "@/components/site/parts";
import { useAssistant, useAssistantContext } from "@/components/site/Assistant";
import {
  MODES, PREFERENCES, formatFare, formatTime, isLocation, isMode, isPreference, journeyRoutes, recommend,
  recommendReason, sortByPreference, LOCATIONS, type Mode, type Preference,
} from "@/lib/transit-data";

type S = { from?: string; to?: string; pref?: Preference; mode?: Mode };

export const Route = createFileRoute("/fare")({
  validateSearch: (s: Record<string, unknown>): S => ({
    from: typeof s.from === "string" && isLocation(s.from) ? s.from : undefined,
    to: typeof s.to === "string" && isLocation(s.to) ? s.to : undefined,
    pref: isPreference(s.pref) ? s.pref : undefined,
    mode: isMode(s.mode) ? s.mode : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Fare & Compare — TransitGuide" },
      { name: "description", content: "Compare estimated fares, journey times, changes and typical crowd across transport options." },
      { property: "og:title", content: "Fare & Compare — TransitGuide" },
      { property: "og:description", content: "See which bus, train, metro or cab suits your journey best." },
    ],
  }),
  component: FarePage,
});

function FarePage() {
  const { from = "", to = "", pref, mode } = Route.useSearch();
  const navigate = useNavigate({ from: "/fare" });
  const { open } = useAssistant();
  const set = (patch: Partial<S>) => navigate({ search: (p) => ({ ...p, ...patch }) });
  const p = pref ?? "cheapest";
  const all = from && to ? journeyRoutes(from, to) : [];
  const sorted = sortByPreference(all, p);
  const best = recommend(all, p);
  const chosen = mode ? all.find((r) => r.mode === mode) : best;
  const modesHere = [...new Set(all.map((r) => r.mode))];

  useAssistantContext({ title: from && to ? `${from} → ${to}` : "no journey selected", routes: sorted, preference: pref });

  return (
    <>
      <PageHeader title={from && to ? "Compare Your Routes" : "Fare & Compare"}>
        Compare estimated fares, journey times, changes and typical crowd for your journey.
      </PageHeader>
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        <div className="rounded-2xl border bg-card p-5 shadow-card">
          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <LocationSelect id="f-from" label="From" value={from} onChange={(v) => set({ from: v || undefined, mode: undefined })} placeholder="Choose starting point" />
            <Button variant="outline" size="icon" className="self-center" aria-label="Swap From and To" onClick={() => set({ from: to || undefined, to: from || undefined })}>
              <ArrowLeftRight className="size-5! rotate-90 md:rotate-0" />
            </Button>
            <LocationSelect id="f-to" label="To" value={to} onChange={(v) => set({ to: v || undefined, mode: undefined })} placeholder="Choose destination" />
            <div className="flex-1">
              <label htmlFor="f-mode" className="mb-1.5 block font-semibold">Transport Type</label>
              <select id="f-mode" value={mode ?? ""} onChange={(e) => set({ mode: (e.target.value || undefined) as Mode | undefined })}
                className="h-12 w-full rounded-lg border border-input bg-background px-3">
                <option value="">Any (recommended)</option>
                {(Object.keys(MODES) as Mode[]).map((m) => <option key={m} value={m} disabled={!!all.length && !modesHere.includes(m)}>{MODES[m].label}</option>)}
              </select>
            </div>
          </div>
          <div role="group" aria-label="What matters most to you?" className="mt-4 flex flex-wrap items-center gap-2">
            <span className="font-semibold">What matters most?</span>
            {(Object.keys(PREFERENCES) as Preference[]).map((k) => (
              <button key={k} aria-pressed={p === k} onClick={() => set({ pref: k })}
                className={`rounded-full border px-3 py-1.5 font-medium ${p === k ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:border-primary"}`}>
                <span aria-hidden>{PREFERENCES[k].emoji} </span>{PREFERENCES[k].label}
              </button>
            ))}
          </div>
        </div>

        {!from || !to ? (
          <p className="text-lg text-muted-foreground">Choose a starting point and destination to compare options. Try Virar → Dadar.</p>
        ) : from === to ? (
          <p role="alert" className="font-semibold text-destructive">Starting point and destination must be different.</p>
        ) : !all.length ? (
          <div role="alert" className="rounded-xl border bg-card p-6">
            <p className="font-semibold">No predefined routes connect {from} and {to} in this demo directory.</p>
            <p className="mt-1 text-muted-foreground">Try one of these journeys:</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[["Virar", "Dadar"], ["Thane", "CSMT"], ["Ghatkopar", "Andheri"], ["Churchgate", "Borivali"]].map(([a, b]) => (
                <Button key={a} variant="outline" size="sm" onClick={() => set({ from: a, to: b, mode: undefined })}>{a} → {b}</Button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {chosen && (
              <section aria-labelledby="est" className="rounded-2xl border-2 border-primary bg-card p-6 shadow-card">
                <div className="flex flex-wrap items-center gap-2"><ModeTag mode={chosen.mode} />
                  {chosen.id === best?.id && <span className="rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">🥇 Recommended — {PREFERENCES[p].label}</span>}
                </div>
                <h2 id="est" className="mt-3 text-lg font-semibold text-muted-foreground">Estimated Fare</h2>
                <p className="text-5xl font-bold text-primary">{formatFare(chosen)}</p>
                <div className="mt-5"><RouteStats r={chosen} /></div>
                {chosen.id === best?.id && <p className="mt-4">{recommendReason(chosen, p)}</p>}
                <Button variant="outline" className="mt-4" onClick={() => open("Why was this route recommended?")}><MessageCircle /> Ask why</Button>
              </section>
            )}

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">All options: {from} → {to}</h2>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {sorted.map((r) => (
                  <RouteCard key={r.id} r={r} highlight={r.id === best?.id} label={r.id === best?.id ? "🥇 Recommended" : undefined} />
                ))}
              </div>
            </section>

            {sorted.length > 1 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Side-by-side comparison</h2>
                <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
                  <table className="w-full text-left">
                    <thead className="bg-secondary">
                      <tr><th scope="col" className="p-4"><span className="sr-only">Measure</span></th>
                        {sorted.map((r) => <th key={r.id} scope="col" className="p-4 font-bold">{MODES[r.mode].emoji} {MODES[r.mode].short}{r.id === best?.id && " 🥇"}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr><th scope="row" className="p-4 font-semibold">Estimated Fare</th>{sorted.map((r) => <td key={r.id} className="p-4">{formatFare(r)}</td>)}</tr>
                      <tr><th scope="row" className="p-4 font-semibold">Estimated Time</th>{sorted.map((r) => <td key={r.id} className="p-4">{formatTime(r.minutes)}</td>)}</tr>
                      <tr><th scope="row" className="p-4 font-semibold">Changes</th>{sorted.map((r) => <td key={r.id} className="p-4">{r.changes}</td>)}</tr>
                      <tr><th scope="row" className="p-4 font-semibold">Typical Crowd</th>{sorted.map((r) => <td key={r.id} className="p-4"><CrowdBadge crowd={r.crowd} /></td>)}</tr>
                    </tbody>
                  </table>
                </div>
                <div className="space-y-3 md:hidden">
                  {sorted.map((r) => (
                    <div key={r.id} className="rounded-xl border bg-card p-4">
                      <p className="mb-3 font-bold">{MODES[r.mode].emoji} {MODES[r.mode].label}{r.id === best?.id && " — 🥇 Recommended"}</p>
                      <RouteStats r={r} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
        <div className="space-y-2"><Note>{FARE_NOTE}</Note><Note>{CROWD_NOTE}</Note></div>
        <span hidden>{LOCATIONS.length}</span>
      </div>
    </>
  );
}
