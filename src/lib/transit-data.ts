export type Mode = "bus" | "local" | "metro" | "express" | "cab";
export type Crowd = "Low" | "Moderate" | "High";
export type Preference = "fastest" | "cheapest" | "crowd" | "changes" | "easy";

export interface TransitRoute {
  id: string;
  name: string;
  mode: Mode;
  origin: string;
  destination: string;
  stops: string[];
  fareMin: number;
  fareMax: number;
  minutes: number;
  crowd: Crowd;
  changes: number;
  changeAt?: string[];
  operator: string;
}

export const LOCATIONS = [
  "Virar", "Nallasopara", "Vasai Road", "Bhayandar", "Borivali", "Andheri",
  "Bandra", "Dadar", "Churchgate", "CSMT", "Thane", "Ghatkopar",
] as const;

export const MODES: Record<Mode, { label: string; short: string; emoji: string; blurb: string }> = {
  bus: { label: "Public Bus", short: "Bus", emoji: "🚌", blurb: "Browse city and intercity bus routes." },
  local: { label: "Local Train", short: "Local Train", emoji: "🚆", blurb: "Browse suburban train routes and stations." },
  metro: { label: "Metro", short: "Metro", emoji: "🚇", blurb: "Browse metro lines and stations." },
  express: { label: "Express Train", short: "Express", emoji: "🚄", blurb: "Browse predefined express routes." },
  cab: { label: "Cab", short: "Cab", emoji: "🚕", blurb: "Browse estimated cab journeys." },
};

export const PREFERENCES: Record<Preference, { label: string; emoji: string; blurb: string }> = {
  fastest: { label: "Fastest", emoji: "⚡", blurb: "Find the shortest estimated journey." },
  cheapest: { label: "Cheapest", emoji: "💰", blurb: "Find the lowest estimated fare." },
  crowd: { label: "Less Crowded", emoji: "👥", blurb: "Prefer lower typical crowd levels." },
  changes: { label: "Fewer Changes", emoji: "🔄", blurb: "Prefer simpler journeys." },
  easy: { label: "Easier Journey", emoji: "♿", blurb: "Prefer fewer transfers and easier navigation." },
};

export const ROUTES: TransitRoute[] = [
  { id: "virar-dadar-local", name: "Western Line Slow", mode: "local", origin: "Virar", destination: "Dadar",
    stops: ["Virar", "Nallasopara", "Vasai Road", "Bhayandar", "Borivali", "Dadar"],
    fareMin: 20, fareMax: 20, minutes: 80, crowd: "High", changes: 0, operator: "Western Railway (suburban)" },
  { id: "virar-dadar-bus", name: "Bus via Borivali", mode: "bus", origin: "Virar", destination: "Dadar",
    stops: ["Virar", "Nallasopara", "Vasai Road", "Bhayandar", "Borivali", "Andheri", "Bandra", "Dadar"],
    fareMin: 50, fareMax: 50, minutes: 130, crowd: "Moderate", changes: 1, changeAt: ["Borivali"], operator: "City & municipal bus services" },
  { id: "virar-dadar-cab", name: "Cab via Western Express Highway", mode: "cab", origin: "Virar", destination: "Dadar",
    stops: ["Virar", "Vasai Road", "Borivali", "Andheri", "Dadar"],
    fareMin: 700, fareMax: 900, minutes: 90, crowd: "Low", changes: 0, operator: "App-based & metered taxis" },
  { id: "churchgate-borivali-local", name: "Western Line Fast", mode: "local", origin: "Churchgate", destination: "Borivali",
    stops: ["Churchgate", "Dadar", "Bandra", "Andheri", "Borivali"],
    fareMin: 15, fareMax: 15, minutes: 55, crowd: "High", changes: 0, operator: "Western Railway (suburban)" },
  { id: "bandra-churchgate-local", name: "Western Line Slow", mode: "local", origin: "Bandra", destination: "Churchgate",
    stops: ["Bandra", "Dadar", "Churchgate"],
    fareMin: 10, fareMax: 10, minutes: 30, crowd: "Moderate", changes: 0, operator: "Western Railway (suburban)" },
  { id: "thane-csmt-local", name: "Central Line Slow", mode: "local", origin: "Thane", destination: "CSMT",
    stops: ["Thane", "Ghatkopar", "Dadar", "CSMT"],
    fareMin: 15, fareMax: 15, minutes: 60, crowd: "High", changes: 0, operator: "Central Railway (suburban)" },
  { id: "ghatkopar-andheri-metro", name: "Metro Line 1", mode: "metro", origin: "Ghatkopar", destination: "Andheri",
    stops: ["Ghatkopar", "Andheri"],
    fareMin: 40, fareMax: 40, minutes: 25, crowd: "Moderate", changes: 0, operator: "Metro operator" },
  { id: "dadar-andheri-metro", name: "Metro via Ghatkopar", mode: "metro", origin: "Dadar", destination: "Andheri",
    stops: ["Dadar", "Ghatkopar", "Andheri"],
    fareMin: 50, fareMax: 50, minutes: 45, crowd: "Low", changes: 1, changeAt: ["Ghatkopar"], operator: "Metro operator" },
  { id: "csmt-thane-express", name: "Express (Dadar, Thane halts)", mode: "express", origin: "CSMT", destination: "Thane",
    stops: ["CSMT", "Dadar", "Thane"],
    fareMin: 145, fareMax: 145, minutes: 35, crowd: "Moderate", changes: 0, operator: "Indian Railways" },
  { id: "dadar-vasai-express", name: "Express (Borivali halt)", mode: "express", origin: "Dadar", destination: "Vasai Road",
    stops: ["Dadar", "Borivali", "Vasai Road"],
    fareMin: 120, fareMax: 120, minutes: 45, crowd: "Low", changes: 0, operator: "Indian Railways" },
  { id: "thane-borivali-bus", name: "Intercity Bus via Ghodbunder Road", mode: "bus", origin: "Thane", destination: "Borivali",
    stops: ["Thane", "Borivali"],
    fareMin: 60, fareMax: 60, minutes: 90, crowd: "Moderate", changes: 0, operator: "Intercity bus services" },
  { id: "virar-thane-bus", name: "Intercity Bus", mode: "bus", origin: "Virar", destination: "Thane",
    stops: ["Virar", "Vasai Road", "Thane"],
    fareMin: 90, fareMax: 90, minutes: 110, crowd: "Moderate", changes: 0, operator: "Intercity bus services" },
  { id: "dadar-ghatkopar-bus", name: "City Bus", mode: "bus", origin: "Dadar", destination: "Ghatkopar",
    stops: ["Dadar", "Ghatkopar"],
    fareMin: 25, fareMax: 25, minutes: 45, crowd: "Moderate", changes: 0, operator: "City & municipal bus services" },
  { id: "andheri-bandra-cab", name: "Cab via S.V. Road", mode: "cab", origin: "Andheri", destination: "Bandra",
    stops: ["Andheri", "Bandra"],
    fareMin: 250, fareMax: 350, minutes: 30, crowd: "Low", changes: 0, operator: "App-based & metered taxis" },
  { id: "andheri-dadar-cab", name: "Cab via Western Express Highway", mode: "cab", origin: "Andheri", destination: "Dadar",
    stops: ["Andheri", "Bandra", "Dadar"],
    fareMin: 300, fareMax: 400, minutes: 40, crowd: "Low", changes: 0, operator: "App-based & metered taxis" },
];

export const CROWD_RANK: Record<Crowd, number> = { Low: 0, Moderate: 1, High: 2 };

export const getRoute = (id: string) => ROUTES.find((r) => r.id === id);

export const isLocation = (s: string) =>
  LOCATIONS.some((l) => l.toLowerCase() === s.trim().toLowerCase());

export function formatFare(r: TransitRoute) {
  return r.fareMin === r.fareMax ? `₹${r.fareMin}` : `₹${r.fareMin}–₹${r.fareMax}`;
}

export function formatTime(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return `${m} min`;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

export function findRoutes(from: string, to: string) {
  return ROUTES.filter(
    (r) => (r.origin === from && r.destination === to) || (r.origin === to && r.destination === from),
  );
}

/** Routes for a journey with stops in travel order. */
export function journeyRoutes(from: string, to: string) {
  return findRoutes(from, to).map((r) =>
    r.origin === from ? r : { ...r, origin: from, destination: to, stops: [...r.stops].reverse(), changeAt: r.changeAt },
  );
}

export function routesAtStop(stop: string) {
  return ROUTES.filter((r) => r.stops.includes(stop));
}

type Cmp = (a: TransitRoute, b: TransitRoute) => number;
const byFare: Cmp = (a, b) => a.fareMin - b.fareMin;
const byTime: Cmp = (a, b) => a.minutes - b.minutes;
const byCrowd: Cmp = (a, b) => CROWD_RANK[a.crowd] - CROWD_RANK[b.crowd];
const byChanges: Cmp = (a, b) => a.changes - b.changes;
const chain = (...cs: Cmp[]): Cmp => (a, b) => {
  for (const c of cs) { const v = c(a, b); if (v) return v; }
  return 0;
};

export const PREF_SORT: Record<Preference, Cmp> = {
  cheapest: chain(byFare, byTime),
  fastest: chain(byTime, byFare),
  crowd: chain(byCrowd, byTime),
  changes: chain(byChanges, byFare),
  easy: chain(byChanges, byCrowd, byTime),
};

export function sortByPreference<T extends TransitRoute>(routes: T[], pref: Preference): T[] {
  return [...routes].sort(PREF_SORT[pref]);
}

export function recommend<T extends TransitRoute>(routes: T[], pref: Preference): T | undefined {
  return sortByPreference(routes, pref)[0];
}

export function recommendReason(r: TransitRoute, pref: Preference) {
  const m = MODES[r.mode].label.toLowerCase();
  switch (pref) {
    case "cheapest": return `The ${m} is recommended because you selected “Cheapest”. It has an estimated fare of ${formatFare(r)} and ${r.changes === 0 ? "no changes" : `${r.changes} change`}.`;
    case "fastest": return `The ${m} is recommended because you selected “Fastest”. Its estimated journey time is ${formatTime(r.minutes)}, the shortest of the options shown.`;
    case "crowd": return `The ${m} is recommended because you selected “Less Crowded”. It has a ${r.crowd.toLowerCase()} typical crowd level.`;
    case "changes": return `The ${m} is recommended because you selected “Fewer Changes”. It has ${r.changes === 0 ? "no changes" : `${r.changes} change`} and an estimated fare of ${formatFare(r)}.`;
    case "easy": return `The ${m} is recommended because you selected “Easier Journey”. It has ${r.changes === 0 ? "no transfers" : `${r.changes} transfer`} and a ${r.crowd.toLowerCase()} typical crowd.`;
  }
}

export function badgeFor(r: TransitRoute): string | undefined {
  if (r.mode === "local" || r.fareMin <= 20) return "Best for Budget";
  if (r.crowd === "Low" && r.changes === 0) return "Most Comfortable";
  if (r.minutes <= 35) return "Quick Trip";
  return undefined;
}

export const isPreference = (p: unknown): p is Preference =>
  typeof p === "string" && p in PREFERENCES;
export const isMode = (m: unknown): m is Mode => typeof m === "string" && m in MODES;
