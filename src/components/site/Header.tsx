import { Link } from "@tanstack/react-router";
import { Menu, MessageCircle, X, TramFront } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAssistant } from "./Assistant";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/routes", label: "Routes" },
  { to: "/stops", label: "Stops" },
  { to: "/fare", label: "Fare & Compare" },
  { to: "/transport", label: "Transport" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { open: openChat } = useAssistant();
  const linkCls = "rounded-md px-3 py-2 font-medium hover:bg-secondary";
  return (
    <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground"><TramFront className="size-5" aria-hidden /></span>
          TransitGuide
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className={linkCls} activeOptions={{ exact: n.to === "/" }}
              activeProps={{ className: "bg-secondary text-secondary-foreground" }}>{n.label}</Link>
          ))}
          <Button variant="outline" className="ml-2" onClick={() => openChat()}><MessageCircle /> Ask TransitGuide</Button>
        </nav>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X className="size-6!" /> : <Menu className="size-6!" />}
        </Button>
      </div>
      {open && (
        <nav aria-label="Mobile" className="flex flex-col gap-1 border-t px-4 py-3 lg:hidden">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className={`${linkCls} py-3`}
              activeOptions={{ exact: n.to === "/" }} activeProps={{ className: "bg-secondary" }}>{n.label}</Link>
          ))}
          <Button className="mt-2" onClick={() => { setOpen(false); openChat(); }}><MessageCircle /> Ask TransitGuide</Button>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t bg-card">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">TransitGuide</p>
        <p className="mt-1">A demo directory of predefined routes, stops and estimated fares. No live tracking, booking or payments.</p>
        <p className="mt-1">Ticketing and booking availability depends on the transport provider.</p>
      </div>
    </footer>
  );
}
