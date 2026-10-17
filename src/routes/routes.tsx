import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader, RouteCard, Note, CROWD_NOTE } from "@/components/site/parts";
import { useAssistantContext } from "@/components/site/Assistant";
import { MODES, ROUTES, isMode, sortByPreference, type Mode, type Preference } from "@/lib/transit-data";

export const Route = createFileRoute("/routes")({
  validateSearch: (s: Record<string, unknown>): { mode?: Mode } => (isMode(s.mode) ? { mode: s.mode } : {}),
  head: () => ({
    meta: [
      { title: "Browse Routes — TransitGuide" },
      { name: "description", content: "Search and filter predefined bus, train, metro, express and cab routes with estimated fares." },
      { property: "og:title", content: "Browse Routes — TransitGuide" },
      { property: "og:description", content: "Filter and sort predefined transport routes by fare, time, changes and crowd." },
    ],
  }),
  component: RoutesPage,
});

const SORTS: { v: "recommended" | Preference; l: string }[] = [
  { v: "recommended", l: "Recommended" }, { v: "cheapest", l: "Cheapest" }, { v: "fastest", l: "Fastest" },
  { v: "changes", l: "Fewer Changes" }, { v: "crowd", l: "Less Crowded" },
];

function RoutesPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate({ from: "/routes" });
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<(typeof SORTS)[number]["v"]>("recommended");

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    let r = ROUTES.filter((x) => !mode || x.mode === mode)
      .filter((x) => !t || x.stops.some((s) => s.toLowerCase().includes(t)) || x.name.toLowerCase().includes(t) || MODES[x.mode].label.toLowerCase().includes(t));
    if (sort !== "recommended") r = sortByPreference(r, sort);
    return r;
  }, [q, mode, sort]);

  useAssistantContext({ title: mode ? `${MODES[mode].label} routes` : "routes in the directory", routes: list });

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 font-medium ${active ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary"}`;

  return (
    <>
      <PageHeader title="Browse Routes">Predefined routes with estimated fares, journey times and typical crowd levels.</PageHeader>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <div className="relative">
          <label htmlFor="route-search" className="sr-only">Search routes, stops or destinations</label>
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input id="route-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search routes, stops or destinations"
            className="h-12 w-full rounded-lg border border-input bg-card pl-11 pr-3" />
        </div>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div role="group" aria-label="Filter by transport" className="flex flex-wrap gap-2">
            <button className={chip(!mode)} aria-pressed={!mode} onClick={() => navigate({ search: {} })}>All</button>
            {(Object.keys(MODES) as Mode[]).map((m) => (
              <button key={m} className={chip(mode === m)} aria-pressed={mode === m} onClick={() => navigate({ search: { mode: m } })}>
                {MODES[m].short}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="font-semibold">Sort by</label>
            <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="h-11 rounded-lg border border-input bg-card px-3">
              {SORTS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
            </select>
          </div>
        </div>
        <p className="text-muted-foreground" aria-live="polite">{list.length} route{list.length === 1 ? "" : "s"} found</p>
        {list.length ? (
          <div className="grid gap-5 md:grid-cols-2">{list.map((r) => <RouteCard key={r.id} r={r} />)}</div>
        ) : (
          <p role="alert" className="rounded-xl border bg-card p-6 font-medium">
            This location is not available in our current route directory. Try selecting one of the suggested locations.
          </p>
        )}
        <Note>{CROWD_NOTE}</Note>
      </div>
    </>
  );
}
