import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { answer, SUGGESTIONS, type AssistantContext } from "@/lib/assistant";
import { ROUTES } from "@/lib/transit-data";

type Msg = { from: "bot" | "user"; text: string };
const GREETING = "Hi! I can help you understand and compare the transport options shown on this website.";
const DEFAULT_CTX: AssistantContext = { title: "all routes in the directory", routes: ROUTES };

const Ctx = createContext<{
  open: (q?: string) => void;
  setContext: (c: AssistantContext | null) => void;
}>({ open: () => {}, setContext: () => {} });

export const useAssistant = () => useContext(Ctx);

/** Register what the assistant should "see" on the current page. */
export function useAssistantContext(c: AssistantContext) {
  const { setContext } = useAssistant();
  const key = c.routes.map((r) => r.id).join(",") + c.preference + c.focusId + c.title;
  useEffect(() => {
    setContext(c);
    return () => setContext(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [ctx, setCtx] = useState<AssistantContext | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", text: GREETING }]);
  const [input, setInput] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const active = ctx ?? DEFAULT_CTX;

  const ask = (q: string) => {
    if (!q.trim()) return;
    setMsgs((m) => [...m, { from: "user", text: q }, { from: "bot", text: answer(q, active) }]);
    setInput("");
  };

  const open = (q?: string) => {
    setOpen(true);
    if (q) ask(q);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [msgs, isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Ctx.Provider value={{ open, setContext: setCtx }}>
      {children}
      {!isOpen && (
        <Button
          onClick={() => open()}
          size="lg"
          className="fixed bottom-5 right-5 z-40 rounded-full shadow-card"
          aria-label="Ask TransitGuide assistant"
        >
          <MessageCircle /> Ask TransitGuide
        </Button>
      )}
      {isOpen && (
        <section
          role="dialog"
          aria-label="TransitGuide Assistant"
          className="fixed inset-x-0 bottom-0 z-50 flex h-[85dvh] flex-col border bg-card shadow-card sm:inset-x-auto sm:bottom-5 sm:right-5 sm:h-[600px] sm:w-[400px] sm:rounded-2xl"
        >
          <header className="flex items-center justify-between gap-2 border-b px-4 py-3">
            <div>
              <h2 className="text-lg font-bold">💬 TransitGuide Assistant</h2>
              <p className="text-sm text-muted-foreground">Looking at: {active.title}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close assistant">
              <X className="size-5!" />
            </Button>
          </header>
          <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={m.from === "user" ? "flex justify-end" : "flex"}>
                <p
                  className={
                    m.from === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2 text-primary-foreground"
                      : "max-w-[85%] rounded-2xl rounded-bl-sm bg-secondary px-4 py-2 text-secondary-foreground"
                  }
                >
                  {m.text}
                </p>
              </div>
            ))}
            <div className="pt-2">
              <p className="mb-2 text-sm font-semibold text-muted-foreground">Suggested questions</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => ask(s)}
                    className="rounded-full border bg-background px-3 py-1.5 text-sm hover:border-primary hover:text-primary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); ask(input); }}
            className="flex gap-2 border-t px-3 pt-3"
          >
            <label htmlFor="chat-input" className="sr-only">Type your question</label>
            <input
              id="chat-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about these routes…"
              className="h-11 flex-1 rounded-lg border border-input bg-background px-3"
            />
            <Button type="submit" aria-label="Send question"><Send /> Send</Button>
          </form>
          <p className="px-4 py-2 text-xs text-muted-foreground">
            TransitGuide Assistant uses the transport information available in this demo.
          </p>
        </section>
      )}
    </Ctx.Provider>
  );
}
