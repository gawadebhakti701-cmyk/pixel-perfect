import { Link } from "@tanstack/react-router";
import { ArrowRight, Users, Repeat, Clock, IndianRupee } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { MODES, badgeFor, formatFare, formatTime, type Crowd, type Mode, type TransitRoute } from "@/lib/transit-data";
import bus from "@/assets/bus.jpg";
import local from "@/assets/local-train.jpg";
import metro from "@/assets/metro.jpg";
import express from "@/assets/express.jpg";
import cab from "@/assets/cab.jpg";

export const MODE_IMAGES: Record<Mode, string> = { bus, local, metro, express, cab };

export const CROWD_NOTE = "Crowd levels shown are typical/estimated values for demonstration and are not live data.";
export const FARE_NOTE = "Fares and journey times shown are estimated values for demonstration and may vary by transport provider, route and travel conditions.";

export function CrowdBadge({ crowd }: { crowd: Crowd }) {
  const style =
    crowd === "Low" ? "bg-success-soft text-success border-success/30"
    : crowd === "High" ? "bg-warning-soft text-warning border-warning/30"
    : "bg-muted text-foreground border-border";
  const bars = crowd === "Low" ? 1 : crowd === "Moderate" ? 2 : 3;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-sm font-semibold ${style}`}>
      <Users className="size-4" aria-hidden />
      {crowd}
      <span aria-hidden className="flex items-end gap-0.5">
        {[1, 2, 3].map((b) => (
          <span key={b} className={`w-1 rounded-sm bg-current ${b <= bars ? "" : "opacity-25"}`} style={{ height: 4 + b * 3 }} />
        ))}
      </span>
    </span>
  );
}

export function Stat({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="flex items-center gap-1 text-sm text-muted-foreground">{icon}{label}</dt>
      <dd className="mt-0.5 font-bold">{children}</dd>
    </div>
  );
}

export function RouteStats({ r }: { r: TransitRoute }) {
  return (
    <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <Stat icon={<IndianRupee className="size-4" aria-hidden />} label="Estimated fare">{formatFare(r)}</Stat>
      <Stat icon={<Clock className="size-4" aria-hidden />} label="Estimated time">{formatTime(r.minutes)}</Stat>
      <Stat icon={<Users className="size-4" aria-hidden />} label="Typical crowd"><CrowdBadge crowd={r.crowd} /></Stat>
      <Stat icon={<Repeat className="size-4" aria-hidden />} label="Changes">{r.changes}</Stat>
    </dl>
  );
}

export function ModeTag({ mode }: { mode: Mode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 text-sm font-semibold text-secondary-foreground">
      <span aria-hidden>{MODES[mode].emoji}</span>{MODES[mode].label}
    </span>
  );
}

export function RouteCard({ r, highlight, label }: { r: TransitRoute; highlight?: boolean; label?: string }) {
  const badge = label ?? badgeFor(r);
  return (
    <article className={`flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-card ${highlight ? "border-2 border-primary" : ""}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ModeTag mode={r.mode} />
        {badge && (
          <span className={`rounded-full px-3 py-1 text-sm font-semibold ${highlight ? "bg-primary text-primary-foreground" : "bg-success-soft text-success"}`}>
            {badge}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-xl font-bold">{r.origin} → {r.destination}</h3>
        <p className="text-sm text-muted-foreground">{r.name}</p>
      </div>
      <p className="text-sm"><span className="font-semibold">Stops: </span>{r.stops.join(" → ")}</p>
      <RouteStats r={r} />
      <Button asChild variant={highlight ? "default" : "outline"} className="mt-auto self-start">
        <Link to="/route/$routeId" params={{ routeId: r.id }} search={{ from: r.origin }}>
          View Route <ArrowRight />
        </Link>
      </Button>
    </article>
  );
}

export function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="border-b bg-card">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {children && <div className="mt-2 max-w-2xl text-lg text-muted-foreground">{children}</div>}
      </div>
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return <p className="rounded-lg border bg-secondary/50 px-4 py-3 text-sm text-secondary-foreground">ℹ️ {children}</p>;
}

export function LocationSelect({ id, label, value, onChange, placeholder, exclude }: {
  id: string; label: string; value: string; onChange: (v: string) => void; placeholder: string; exclude?: string;
}) {
  return (
    <div className="flex-1">
      <label htmlFor={id} className="mb-1.5 block font-semibold">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-lg border border-input bg-background px-3 text-base"
      >
        <option value="">{placeholder}</option>
        {LOCS.filter((l) => l !== exclude).map((l) => <option key={l} value={l}>{l}</option>)}
      </select>
    </div>
  );
}
import { LOCATIONS as LOCS } from "@/lib/transit-data";
