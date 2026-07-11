import { useState, useRef, useEffect } from "react";
import { ChatInput } from "./panel/ChatInput.jsx";
import { TPIcon } from "@dhspl-tatvacare/tesseract-ui";
import { useAgentPatient } from "./stores/patientContext.js";
import { useAgentOpen, closePanel } from "./stores/panelStore.js";
import { useWorkspaceContext } from "./stores/workspaceStore.js";
import { openProgressPrint } from "./stores/progressPrintStore.js";
import { AiBrandSpark } from "./panel/AiBrandSpark.jsx";
import { welcomeIcon } from "./panel/WelcomeIcons.jsx";
import { AgentCardShell, AgentCardSkeleton } from "./cards/AgentCardShell.jsx";
import { buildCardForMessage } from "./engine/cardBuilders.js";
import { fetchDoctorEntries, fetchDoctorTasks, fetchProgressTimeline } from "./services/doctorAgentService.js";
import { sectionMeta } from "./engine/sectionMeta.js";
import { PANEL } from "./constants.js";

let _msgSeq = 0;
const nextId = () => `da-${Date.now()}-${_msgSeq++}`;

/** Render **bold** spans in the assistant's summary line (patient / count get
 *  emphasised so the doctor can anchor at a glance). */
function renderRich(text) {
  return String(text || "").split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} style={{ fontWeight: 700, color: "var(--tp-slate-900, #171725)" }}>{p.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

/**
 * The Doctor Agent panel - a right-docked companion (does not block the form).
 * A verbatim visual port of the source Dr.Agent chat surface: rotating AI wash,
 * glass brand header, ChatGPT-style welcome, streaming-style bubbles with the
 * exact CardShell cards, canned pills, and the ported ChatInput.
 */
export function DoctorAgentPanel() {
  const open = useAgentOpen();
  const patient = useAgentPatient();
  const { section } = useWorkspaceContext();
  const view = patient ? "patient" : "list";
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [tasks, setTasks] = useState(null);
  const scrollRef = useRef(null);

  // Ward-level pending doctor items (aggregated, patient-independent).
  useEffect(() => {
    let alive = true;
    fetchDoctorTasks().then((t) => { if (alive) setTasks(t); });
    return () => { alive = false; };
  }, []);

  // Pull the doctor's entries for the current patient from the :4000 backend
  // (falls back to built-in demo data inside the builders on failure).
  const patientKey = patient?.admissionId ?? patient?.patientId ?? null;
  useEffect(() => {
    let alive = true;
    if (patientKey == null) { setEntries(null); setTimeline(null); return undefined; }
    fetchDoctorEntries(patient).then((e) => { if (alive) setEntries(e); });
    fetchProgressTimeline(patient).then((t) => { if (alive) setTimeline(t); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientKey]);

  useEffect(() => {
    setMessages([]);
    setInput("");
  }, [patientKey]);

  const meta = sectionMeta(view, section);
  const patientName =
    patient?.name && patient.name !== "Unknown Patient" ? patient.name : null;
  const patientMeta = patient?.age
    ? `${String(patient.gender || patient.sex || "").trim().charAt(0)}|${patient.age}y`
    : undefined;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  if (!open) return null;

  function send(text) {
    const clean = String(text || "").trim();
    if (!clean) return;
    const userMsg = { id: nextId(), role: "user", text: clean };
    const loadingId = nextId();
    setMessages((m) => [...m, userMsg, { id: loadingId, role: "assistant", loading: true }]);
    setInput("");

    const built = buildCardForMessage(clean, { patient, view, section, entries, timeline, tasks });
    const scope = patientName ? `${patientName}` : "this patient";
    const resolved = {
      id: loadingId,
      role: "assistant",
      text: built
        ? built.intro
        : `I could not find matching nursing data for ${scope}${meta.label ? ` under ${meta.label}` : ""} yet.`,
      card: built ? built.config || null : null,
      cards: built && built.cards ? built.cards : null,
      sources: built ? built.sources || (built.config && built.config.sources) || null : null,
      print: built ? built.print || null : null,
    };
    window.setTimeout(() => {
      setMessages((m) => m.map((msg) => (msg.id === loadingId ? resolved : msg)));
    }, 550);
  }

  return (
    <aside className="da-panel" role="dialog" aria-modal="false" aria-label="Doctor Agent">
      {/* z-0 animated wash */}
      <div className="da-gradient-wash" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }} aria-hidden />

      {/* z-30 floating glass header */}
      <div style={{ position: "absolute", insetInline: 0, top: 0, zIndex: 30 }}>
        <Header onClose={closePanel} />
      </div>

      {/* z-10 chat scroll */}
      <div style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "transparent" }}>
        <div
          ref={scrollRef}
          className="da-chat-scroll"
          style={{ flex: 1, overflowY: "auto", paddingTop: PANEL.headerHeight, display: "flex", flexDirection: "column" }}
        >
          {messages.length === 0 ? (
            <Welcome meta={meta} patientName={patientName} onPick={send} />
          ) : (
            <Thread messages={messages} onPill={send} />
          )}
        </div>
      </div>

      {/* z-10 sticky footer: soft fade + pills + input */}
      <div style={{ position: "sticky", bottom: 0, zIndex: 10, flexShrink: 0, background: "#fff" }}>
        <div
          aria-hidden
          style={{ position: "absolute", top: -24, left: 0, right: 0, height: 24, pointerEvents: "none", background: "linear-gradient(to top, #fff, rgba(255,255,255,0.6) 45%, transparent)" }}
        />
        {meta.pills.length > 0 && (
          <div className="da-suggestion-scroll" style={{ display: "flex", gap: 6, overflowX: "auto", padding: "8px 8px 4px" }}>
            {meta.pills.map((p) => (
              <button key={p.label} type="button" className="da-pill" onClick={() => send(p.message)} aria-label={p.label}>
                <span className="da-pill__text">{p.label}</span>
              </button>
            ))}
          </div>
        )}
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={() => send(input)}
          onAttach={() => {}}
          patientName={patientName || meta.contextLabel || "This patient"}
          patientMeta={patientMeta}
          placeholder={meta.placeholder}
        />
      </div>
    </aside>
  );
}

/* ── Header (glass brand tag + minimize) ────────────────────────────────────── */
function Header({ onClose }) {
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", height: PANEL.headerHeight, background: "transparent" }}>
      <span className="da-agent-brand-tag" style={{ display: "inline-flex", alignItems: "center", gap: 7, borderRadius: 10, padding: "5px 11px 5px 6px" }}>
        <AiBrandSpark size={22} withBackground style={{ borderRadius: 7 }} />
        <span style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1, color: "var(--tp-slate-700, #454551)", letterSpacing: 0.1 }}>Dr. Agent</span>
      </span>
      <button
        type="button"
        className="da-agent-collapse-tag"
        aria-label="Minimize agent"
        onClick={onClose}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 32, width: 32, borderRadius: 10, border: "none", cursor: "pointer", color: "var(--tp-slate-600, #545460)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="3.5" stroke="currentColor" strokeWidth="1.7" />
          <path d="M9 3v18" stroke="currentColor" strokeWidth="1.7" />
          <path d="M13 9l3 3-3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

/* ── Welcome (ChatGPT-style intro) ──────────────────────────────────────────── */
function Welcome({ meta, patientName, onPick }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px 12px", position: "relative" }}>
      {/* Spark tile — 36px, animated gradient GIF underlay + rotating white spark */}
      <div style={{ position: "relative", zIndex: 1, marginBottom: 10 }}>
        <span style={{ pointerEvents: "none", userSelect: "none", position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", overflow: "hidden", width: 36, height: 36, borderRadius: 36 * 0.24 }} aria-hidden="true">
          <span style={{ position: "absolute", inset: 0, background: "#fff", borderRadius: 36 * 0.24 }} />
          <span style={{ position: "absolute", inset: 0, backgroundImage: "url(/icons/dr-agent/chat-bg.gif)", backgroundSize: "cover", backgroundPosition: "center", borderRadius: 36 * 0.24, opacity: 0.3 }} />
          <img src="/icons/dr-agent/agent-spark.svg" width={27} height={27} alt="" className="welcome-spark-rotate" draggable={false} style={{ position: "relative", zIndex: 10 }} />
        </span>
      </div>

      <h2 style={{ position: "relative", zIndex: 1, margin: 0, fontSize: 18, fontWeight: 600, lineHeight: "24px", textAlign: "center", color: "var(--tp-slate-800, #2C2C35)", fontFamily: "'Mulish', 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
        {patientName || meta.greeting}
      </h2>
      <p style={{ position: "relative", zIndex: 1, margin: "4px 0 0", fontSize: 14, lineHeight: "18px", textAlign: "center", color: "var(--tp-slate-400, #A2A2A8)", maxWidth: 300 }}>
        {meta.subtitle}
      </p>

      {meta.cannedCards.length > 0 && (
        <div style={{ position: "relative", zIndex: 1, marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%" }}>
          {meta.cannedCards.map((c) => (
            <button key={c.title} type="button" className="welcome-canned-card" onClick={() => onPick(c.message)}>
              <span aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "url(/icons/dr-agent/chat-bg.gif)", backgroundSize: "cover", opacity: 0.06, borderRadius: 14 }} />
              <span className="welcome-icon-grad" style={{ position: "relative", zIndex: 1, marginBottom: 8, opacity: 0.85, display: "inline-flex" }}>
                {welcomeIcon(c)}
              </span>
              <span style={{ position: "relative", zIndex: 1, fontSize: 12, fontWeight: 600, lineHeight: "15px", width: "100%", color: "var(--tp-slate-700, #454551)" }}>{c.title}</span>
              <span className="welcome-card-subtitle" style={{ position: "relative", zIndex: 1, marginTop: 4, fontSize: 11, fontWeight: 400, lineHeight: "15px", width: "100%", color: "var(--tp-slate-400, #A2A2A8)" }}>{c.subtitle}</span>
            </button>
          ))}
        </div>
      )}

      {/* Gradient def for the welcome-card icons */}
      <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
        <defs>
          <linearGradient id="welcomeIconGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#BE6DCF" />
            <stop offset="100%" stopColor="#5351BD" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ── Thread (ChatBubble port) ───────────────────────────────────────────────── */
function Thread({ messages, onPill }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "14px 12px 12px", gap: 14 }}>
      {messages.map((m) =>
        m.role === "user" ? (
          <div key={m.id} style={{ display: "flex", width: "100%", justifyContent: "flex-end" }}>
            <div style={{ maxWidth: "85%", borderRadius: "12px 12px 0 12px", padding: "8px 12px", fontSize: 14, lineHeight: "18px", color: "var(--tp-slate-800, #2C2C35)", background: "rgba(255,255,255,0.94)", backdropFilter: "blur(14px) saturate(1.4)", WebkitBackdropFilter: "blur(14px) saturate(1.4)" }}>
              <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{m.text}</p>
            </div>
          </div>
        ) : m.loading ? (
          <div key={m.id} style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "flex-start" }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <AiBrandSpark size={22} className="da-spark-rotate" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 14, lineHeight: "18px", color: "var(--tp-slate-500, #717179)" }}>Surfacing the doctor's orders...</span>
            </div>
            <div style={{ marginLeft: 30, marginTop: 6, width: "calc(100% - 30px)" }}>
              <AgentCardSkeleton />
            </div>
          </div>
        ) : (
          <AssistantBubble key={m.id} message={m} onPill={onPill} />
        ),
      )}
    </div>
  );
}

/* Progress-notes render as an accordion: every card starts collapsed, and opening
   one collapses the others (one open at a time) to keep the thread compact. */
function AccordionCards({ cards }) {
  const [openIndex, setOpenIndex] = useState(-1);
  return (
    <div style={{ marginLeft: 30, marginTop: 6, width: "calc(100% - 30px)", display: "flex", flexDirection: "column", gap: 10 }}>
      {cards.map((c, i) => (
        <AgentCardShell
          key={i}
          config={c}
          collapsed={openIndex !== i}
          onCollapsedChange={(isCollapsed) => setOpenIndex(isCollapsed ? -1 : i)}
        />
      ))}
    </div>
  );
}

function AssistantBubble({ message, onPill }) {
  return (
    <div style={{ display: "flex", width: "100%", justifyContent: "flex-start" }}>
      <div style={{ display: "flex", width: "100%", flexDirection: "column", alignItems: "flex-start" }}>
        {message.text && (
          <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
            <AiBrandSpark size={22} style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ margin: 0, fontSize: 14, lineHeight: "18px", color: "var(--tp-slate-700, #454551)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {renderRich(message.text)}
            </p>
          </div>
        )}
        {message.cards && message.cards.length ? (
          <AccordionCards cards={message.cards} />
        ) : message.card ? (
          <div style={{ marginLeft: 30, marginTop: 6, width: "calc(100% - 30px)" }}>
            <AgentCardShell config={message.card} onPill={onPill} />
          </div>
        ) : null}
        <FeedbackRow hasCard={!!(message.card || (message.cards && message.cards.length))} sources={message.sources || message.card?.sources} print={message.print} />
      </div>
    </div>
  );
}

/* ── Feedback + Source trust markers ────────────────────────────────────────── */
function FeedbackRow({ hasCard, sources, print }) {
  const [vote, setVote] = useState(null);
  const [srcOpen, setSrcOpen] = useState(false);
  const list = hasCard ? (sources && sources.length ? sources : DEFAULT_SOURCES) : null;
  const isProgress = print && print.kind === "progress";
  return (
    <div style={{ position: "relative", marginLeft: 30, marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <IconBtn active={vote === "up"} activeColor="var(--tp-success-500, #10B981)" onClick={() => setVote(vote === "up" ? null : "up")} label="Helpful">
          <ThumbSvg up filled={vote === "up"} />
        </IconBtn>
        <IconBtn active={vote === "down"} activeColor="var(--tp-error-500, #E11D48)" onClick={() => setVote(vote === "down" ? null : "down")} label="Not helpful">
          <ThumbSvg filled={vote === "down"} />
        </IconBtn>
      </div>

      {list && (
        <>
          <span style={{ height: 12, width: 1, flexShrink: 0, background: "linear-gradient(180deg, transparent 0%, rgba(148,163,184,0.25) 50%, transparent 100%)" }} />
          <button
            type="button"
            onClick={() => setSrcOpen((v) => !v)}
            aria-expanded={srcOpen}
            style={{ display: "flex", alignItems: "center", gap: 3, borderRadius: 4, padding: "2px 5px", border: "none", cursor: "pointer", background: srcOpen ? "var(--tp-blue-50, #EEEEFF)" : "transparent", color: srcOpen ? "var(--tp-blue-600, #3C3BB5)" : "var(--tp-slate-500, #717179)" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M8 12h8M8 16h5M9 2v3M15 2v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M20 8v9c0 3-1.5 4.5-4.5 4.5h-7C5.5 21.5 4 20 4 17V8c0-3 1.5-4.5 4.5-4.5h7C18.5 3.5 20 5 20 8Z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span ref={el => { if (el) el.style.setProperty("color", srcOpen ? "#3C3BB5" : "#717179", "important"); }} style={{ fontSize: 12, fontWeight: 500, lineHeight: 1 }}>Source</span>
          </button>
          {srcOpen && (
            <div style={{ position: "absolute", bottom: "100%", left: 44, marginBottom: 6, zIndex: 60, width: 240, borderRadius: 8, background: "#fff", boxShadow: "0 8px 30px rgba(0,0,0,0.14), 0 0 0 1px rgba(148,163,184,0.12)" }}>
              <div style={{ padding: "7px 12px", borderBottom: "1px solid rgba(148,163,184,0.10)", fontSize: 12, fontWeight: 600, color: "var(--tp-slate-500, #717179)" }}>
                Compiled from {list.length} source{list.length > 1 ? "s" : ""}
              </div>
              <div style={{ padding: "6px 10px" }}>
                {list.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7, padding: "4px 0" }}>
                    <span style={{ marginTop: 5, flexShrink: 0, height: 5, width: 5, borderRadius: "50%", background: "#7C3AED" }} />
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "var(--tp-slate-700, #454551)" }}>
                      <span style={{ fontWeight: 600 }}>{s.label}</span>
                      <span style={{ color: "var(--tp-slate-400, #A2A2A8)", margin: "0 4px" }}>&middot;</span>
                      <span style={{ color: "var(--tp-slate-500, #717179)" }}>{s.description}</span>
                    </p>
                  </div>
                ))}
              </div>
              {isProgress && print.label && (
                <button
                  type="button"
                  onClick={() => { setSrcOpen(false); openProgressPrint(print.noteKind); }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", padding: "8px 12px", border: "none", borderTop: "1px solid rgba(148,163,184,0.12)", background: "var(--tp-blue-50, #EEEEFF)", color: "var(--tp-blue-600, #3C3BB5)", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
                >
                  <TPIcon name="document-text" variant="bulk" size={14} color="var(--tp-blue-600, #3C3BB5)" />
                  {print.label}
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

const DEFAULT_SOURCES = [{ label: "IPD clinical record", description: "Charted in the IPD modules by clinical staff" }];

function IconBtn({ children, active, activeColor, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      style={{ display: "flex", height: 20, width: 20, alignItems: "center", justifyContent: "center", borderRadius: 4, border: "none", cursor: "pointer", background: "transparent", color: active ? activeColor : "var(--tp-slate-400, #A2A2A8)", transition: "color 0.15s ease" }}
    >
      {children}
    </button>
  );
}

function ThumbSvg({ up, filled }) {
  const t = up ? "" : "rotate(180 12 12)";
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} aria-hidden="true">
      <g transform={t}>
        <path d="M7.48 18.35l3.1 2.4c.4.4 1.3.6 1.9.6h3.8c1.2 0 2.5-.9 2.8-2.1l2.4-7.3c.5-1.4-.4-2.6-1.9-2.6h-4c-.6 0-1.1-.5-1-1.2l.5-3.2c.2-.9-.4-1.9-1.3-2.2-.8-.3-1.8.1-2.2.7l-4.1 6.1" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" />
        <path d="M2.38 18.35v-9.8c0-1.4.6-1.9 2-1.9h1c1.4 0 2 .5 2 1.9v9.8c0 1.4-.6 1.9-2 1.9h-1c-1.4 0-2-.5-2-1.9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
