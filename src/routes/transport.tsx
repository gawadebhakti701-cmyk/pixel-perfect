import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHeader, MODE_IMAGES } from "@/components/site/parts";
import { MODES, ROUTES, type Mode } from "@/lib/transit-data";

export const Route = createFileRoute("/transport")({
  head: () => ({
    meta: [
      { title: "Explore Transport — TransitGuide" },
      { name: "description", content: "Browse public buses, local trains, metro, express trains and cabs." },
      { property: "og:title", content: "Explore Transport — TransitGuide" },
      { property: "og:description", content: "Choose a transport type to browse its predefined routes." },
    ],
  }),
  component: TransportPage,
});

function TransportPage() {
  return (
    <>
      <PageHeader title="Explore Transport">Choose a transport type to see its routes, stops and estimated fares.</PageHeader>
      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-8 sm:grid-cols-2 lg:grid-cols-3">
        {(Object.keys(MODES) as Mode[]).map((m) => {
          const count = ROUTES.filter((r) => r.mode === m).length;
          return (
            <Link key={m} to="/routes" search={{ mode: m }} className="group overflow-hidden rounded-xl border bg-card shadow-card hover:border-primary">
              <img src={MODE_IMAGES[m]} alt={MODES[m].label} loading="lazy" width={944} height={704} className="aspect-video w-full object-cover" />
              <div className="p-5">
                <h2 className="text-xl font-bold"><span aria-hidden>{MODES[m].emoji} </span>{MODES[m].label}</h2>
                <p className="text-muted-foreground">{MODES[m].blurb}</p>
                <p className="mt-3 flex items-center gap-1 font-semibold text-primary">{count} route{count === 1 ? "" : "s"} <ArrowRight className="size-4" /></p>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
