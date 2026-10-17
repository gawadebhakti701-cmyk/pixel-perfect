import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, Repeat, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeTag, RouteStats, Note, CROWD_NOTE, FARE_NOTE, MODE_IMAGES } from "@/components/site/parts";
import { useAssistant, useAssistantContext } from "@/components/site/Assistant";
import { MODES, getRoute, formatFare } from "@/lib/transit-data";

export const Route = createFileRoute("/route/$routeId")({
  validateSearch: (s: Record<string, unknown>): { from?: string } => (typeof s.from === "string" ? { from: s.from } : {}),
  loader: ({ params }) => {
    const r = getRoute(params.routeId);
    if (!r) throw notFound();
    return r;
  },
  head: ({ loaderData: r }) => ({
    meta: r
      ? [
          { title: `${r.origin} → ${r.destination} by ${MODES[r.mode].label} — TransitGuide` },
          { name: "description", content: `${MODES[r.mode].label} from ${r.origin} to ${r.destination}: estimated fare ${formatFare(r)}, stops and typical crowd.` },
          { property: "og:title", content: `${r.origin} → ${r.destination} — TransitGuide` },
          { property: "og:description", content: `Stops, estimated fare and journey time by ${MODES[r.mode].label}.` },
        ]
      : [{ title: "Route unavailable — TransitGuide" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Route not found</h1>
      <Button asChild className="mt-6"><Link to="/routes">Back to Routes</Link></Button>
    </div>
  ),
  component: RouteDetails,
});

function RouteDetails() {
  const base = Route.useLoaderData();
  const { from } = Route.useSearch();
  const r = from === base.destination
    ? { ...base, origin: base.destination, destination: base.origin, stops: [...base.stops].reverse() }
    : base;
  const { open } = useAssistant();
  useAssistantContext({ title: `${MODES[r.mode].label}, ${r.origin} → ${r.destination}`, routes: [r], focusId: r.id });

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <Button asChild variant="ghost"><Link to="/routes"><ArrowLeft /> Back to Routes</Link></Button>
      <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
        <img src={MODE_IMAGES[r.mode]} alt={MODES[r.mode].label} width={944} height={704} className="h-48 w-full object-cover sm:h-60" />
        <div className="space-y-5 p-6">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">{r.origin} → {r.destination}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2"><ModeTag mode={r.mode} /><span className="text-muted-foreground">{r.name}</span></div>
          </div>
          <RouteStats r={r} />
          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={() => open()}><MessageCircle /> Ask TransitGuide</Button>
            <Button size="lg" variant="outline" asChild><Link to="/fare" search={{ from: r.origin, to: r.destination }}>Compare options</Link></Button>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border bg-card p-6 shadow-card">
        <h2 className="text-2xl font-bold">Stops</h2>
        <ol className="mt-5">
          {r.stops.map((s, i) => {
            const last = i === r.stops.length - 1;
            const change = r.changeAt?.includes(s);
            return (
              <li key={s} className="relative flex gap-4 pb-6 last:pb-0">
                {!last && <span aria-hidden className="absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-1 rounded bg-secondary" />}
                <span className={`grid size-10 shrink-0 place-items-center rounded-full border-2 text-lg ${i === 0 || last ? "border-primary bg-primary text-primary-foreground" : "border-primary bg-card"}`} aria-hidden>
                  {i === 0 || last ? MODES[r.mode].emoji : "•"}
                </span>
                <div className="pt-1.5">
                  <p className="text-lg font-bold">{s}</p>
                  <p className="text-sm text-muted-foreground">
                    {i === 0 ? "Start" : last ? "Destination" : `Stop ${i}`}
                    {change && <span className="ml-2 inline-flex items-center gap-1 font-semibold text-warning"><Repeat className="size-4" aria-hidden />Change here</span>}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="rounded-2xl border bg-card p-6">
        <h2 className="flex items-center gap-2 text-xl font-bold"><Ticket className="text-primary" aria-hidden /> Ticketing Information</h2>
        <p className="mt-2">Operator: {r.operator}. Ticketing and booking availability depends on the transport provider.</p>
      </section>
      <div className="space-y-2"><Note>{FARE_NOTE}</Note><Note>{CROWD_NOTE}</Note></div>
    </div>
  );
}
