import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeftRight, ArrowRight, MapPin, SlidersHorizontal, Scale, MessageCircle, Search, GitCompare, IndianRupee, Accessibility } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LocationSelect, MODE_IMAGES } from "@/components/site/parts";
import { MODES, PREFERENCES, type Mode, type Preference } from "@/lib/transit-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TransitGuide — Compare buses, trains, metro & cabs" },
      { name: "description", content: "Browse predefined routes, stops and estimated fares across buses, trains, metro and cabs, and compare your options." },
      { property: "og:title", content: "TransitGuide — Find the right way to get there" },
      { property: "og:description", content: "Browse routes, stops and estimated fares and compare transport options in one place." },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [pref, setPref] = useState<Preference>("cheapest");
  const [error, setError] = useState("");
  const ready = from && to;

  const go = () => {
    if (!from || !to) return setError("Please choose both a starting point and a destination.");
    if (from === to) return setError("Starting point and destination must be different.");
    navigate({ to: "/fare", search: { from, to, pref } });
  };

  return (
    <>
      <section className="border-b bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-12">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">Find the Right Way to Get There</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Browse routes, stops and estimated fares across buses, trains, metro and cabs — then compare your options in one place.
          </p>

          <div className="mt-8 rounded-2xl border bg-card p-5 shadow-card sm:p-7">
            <h2 className="text-2xl font-bold">Where are you travelling?</h2>
            <div className="mt-5 flex flex-col items-stretch gap-3 md:flex-row md:items-end">
              <LocationSelect id="from" label="From" value={from} onChange={(v) => { setFrom(v); setError(""); }} placeholder="Choose starting point" />
              <Button variant="outline" size="icon" className="self-center md:mb-0.5" aria-label="Swap From and To"
                onClick={() => { setFrom(to); setTo(from); }}>
                <ArrowLeftRight className="size-5! rotate-90 md:rotate-0" />
              </Button>
              <LocationSelect id="to" label="To" value={to} onChange={(v) => { setTo(v); setError(""); }} placeholder="Choose destination" />
            </div>

            {ready && (
              <fieldset className="mt-7">
                <legend className="text-xl font-bold">What matters most to you?</legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {(Object.keys(PREFERENCES) as Preference[]).map((p) => {
                    const sel = pref === p;
                    return (
                      <button key={p} type="button" aria-pressed={sel} onClick={() => setPref(p)}
                        className={`rounded-xl border-2 p-4 text-left transition-colors ${sel ? "border-primary bg-secondary" : "border-border bg-card hover:border-primary/50"}`}>
                        <span className="text-2xl" aria-hidden>{PREFERENCES[p].emoji}</span>
                        <span className="mt-1 block font-bold">{PREFERENCES[p].label}{sel && <span className="sr-only"> (selected)</span>}</span>
                        <span className="block text-sm text-muted-foreground">{PREFERENCES[p].blurb}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {error && <p role="alert" className="mt-4 font-semibold text-destructive">{error}</p>}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" onClick={go}><Search /> Find My Routes</Button>
              {ready && (
                <Button size="lg" variant="outline" asChild>
                  <Link to="/fare" search={{ from, to }}>Compare All Options</Link>
                </Button>
              )}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Try <button className="font-semibold text-primary underline" onClick={() => { setFrom("Virar"); setTo("Dadar"); }}>Virar → Dadar</button> to see buses, trains and cabs compared.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-3xl font-bold">Explore by Transport</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {(Object.keys(MODES) as Mode[]).map((m) => (
            <Link key={m} to="/routes" search={{ mode: m }}
              className="group overflow-hidden rounded-xl border bg-card shadow-card transition-colors hover:border-primary">
              <img src={MODE_IMAGES[m]} alt={`${MODES[m].label} in Mumbai`} loading="lazy" width={944} height={704} className="aspect-[4/3] w-full object-cover" />
              <div className="p-4">
                <h3 className="font-bold"><span aria-hidden>{MODES[m].emoji} </span>{MODES[m].label}</h3>
                <p className="text-sm text-muted-foreground">{MODES[m].blurb}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary">Browse <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y bg-card">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { i: MapPin, t: "Choose your journey", d: "Enter your starting point and destination." },
              { i: SlidersHorizontal, t: "Set your preference", d: "Choose fastest, cheapest, less crowded, fewer changes or easier journey." },
              { i: Scale, t: "Compare routes", d: "See estimated fare, time, stops and crowd level." },
              { i: MessageCircle, t: "Ask TransitGuide", d: "Ask questions about the displayed transport options." },
            ].map((s, n) => (
              <li key={s.t}>
                <span className="grid size-12 place-items-center rounded-full bg-secondary text-primary"><s.i aria-hidden /></span>
                <h3 className="mt-3 text-lg font-bold">{n + 1}. {s.t}</h3>
                <p className="text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-3xl font-bold">Why TransitGuide</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { i: Search, t: "Easy to Browse", d: "Find routes and stops without complicated navigation." },
            { i: GitCompare, t: "Compare Options", d: "See different transport modes side by side." },
            { i: IndianRupee, t: "Clear Fare Information", d: "Understand estimated costs before choosing." },
            { i: Accessibility, t: "Accessible for Everyone", d: "Simple design, readable information and clear navigation." },
          ].map((c) => (
            <div key={c.t} className="rounded-xl border bg-card p-5 shadow-card">
              <c.i className="text-primary" aria-hidden />
              <h3 className="mt-2 font-bold">{c.t}</h3>
              <p className="text-sm text-muted-foreground">{c.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
