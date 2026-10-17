import {
  CROWD_RANK, MODES, PREFERENCES, formatFare, formatTime, recommend, recommendReason,
  sortByPreference, type Preference, type TransitRoute,
} from "./transit-data";

export interface AssistantContext {
  title: string;
  routes: TransitRoute[];
  preference?: Preference;
  focusId?: string;
}

const name = (r: TransitRoute) => `${MODES[r.mode].label.toLowerCase()} (${r.origin} → ${r.destination})`;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function answer(q: string, ctx: AssistantContext): string {
  const t = q.toLowerCase();
  const routes = ctx.routes;
  if (!routes.length)
    return "There are no routes on this page yet. Choose a From and To location, and I can help compare the options shown.";
  const focus = routes.find((r) => r.id === ctx.focusId);
  const pref = ctx.preference ?? "cheapest";
  const single = routes.length === 1;

  const has = (...w: string[]) => w.some((x) => t.includes(x));

  if (has("live", "real-time", "realtime", "right now", "where is the", "track", "delay"))
    return "I don't have live information. I can only explain the predefined estimates shown in this demo: fares, journey times, stops, typical crowd and changes.";

  if (has("book", "ticket", "pay", "upi"))
    return "TransitGuide doesn't sell tickets. Ticketing and booking availability depends on the transport provider.";

  if (has("why", "recommend", "explain")) {
    const r = focus ?? recommend(routes, pref)!;
    return recommendReason(r, pref) + (ctx.preference ? "" : " (Using “Cheapest” as the default preference.)");
  }

  if (has("cheap", "fare", "cost", "budget", "price", "money")) {
    const s = sortByPreference(routes, "cheapest");
    if (single) return `The estimated fare for the ${name(s[0])} is ${formatFare(s[0])}.`;
    return `The ${name(s[0])} is the cheapest option shown, with an estimated fare of ${formatFare(s[0])}. ` +
      s.slice(1).map((r) => `The ${MODES[r.mode].label.toLowerCase()} is ${formatFare(r)}.`).join(" ");
  }

  if (has("fast", "quick", "time", "long", "duration")) {
    const s = sortByPreference(routes, "fastest");
    if (single) return `The ${name(s[0])} takes about ${formatTime(s[0].minutes)} (estimated).`;
    return `The ${name(s[0])} is the fastest, at about ${formatTime(s[0].minutes)}. ` +
      s.slice(1).map((r) => `The ${MODES[r.mode].label.toLowerCase()} takes about ${formatTime(r.minutes)}.`).join(" ");
  }

  if (has("crowd", "busy", "rush", "packed", "seat")) {
    const s = [...routes].sort((a, b) => CROWD_RANK[a.crowd] - CROWD_RANK[b.crowd]);
    if (single) return `The ${name(s[0])} has a ${s[0].crowd.toLowerCase()} typical crowd level. This is a typical value, not live data.`;
    return `The ${name(s[0])} has the lowest typical crowd level (${s[0].crowd}). ` +
      s.slice(1).map((r) => `The ${MODES[r.mode].label.toLowerCase()} is typically ${r.crowd.toLowerCase()}.`).join(" ") +
      " These are typical values, not live data.";
  }

  if (has("change", "transfer", "switch", "interchange")) {
    const list = focus ? [focus] : routes;
    return list.map((r) =>
      r.changes === 0
        ? `The ${name(r)} has no changes.`
        : `The ${name(r)} has ${r.changes} change, at ${r.changeAt?.join(", ") ?? "an intermediate stop"}.`,
    ).join(" ");
  }

  if (has("stop", "station", "via", "pass")) {
    const list = focus ? [focus] : routes;
    return list.map((r) => `${cap(name(r))} stops: ${r.stops.join(" → ")}.`).join(" ");
  }

  if (has("easy", "easiest", "first", "simple", "senior", "elder", "luggage", "wheelchair", "access")) {
    const r = recommend(routes, "easy")!;
    return `For a first-time traveller, the ${name(r)} is the simplest choice: ${r.changes === 0 ? "no changes" : `${r.changes} change`}, ${r.crowd.toLowerCase()} typical crowd and about ${formatTime(r.minutes)}.`;
  }

  if (has("hi", "hello", "hey", "help"))
    return `Hello! I'm looking at ${ctx.title}. Ask me about fares, journey time, crowd, changes or stops.`;

  return `I can only answer using the transport information shown in this demo (${ctx.title}). Try asking which option is cheapest, fastest, less crowded, has fewer changes, or what the stops are.`;
}

export const SUGGESTIONS = [
  "Which route is cheapest?",
  "Which route is fastest?",
  "Which option has fewer changes?",
  "Which route is less crowded?",
  "Explain the recommended route.",
  "Where do I need to change?",
  "What are the stops?",
  "Why was this route recommended?",
  "Which option is easiest for a first-time traveller?",
];

export const prefLabel = (p?: Preference) => (p ? PREFERENCES[p].label : undefined);
