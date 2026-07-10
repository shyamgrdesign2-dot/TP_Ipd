import { useState } from "react";
import { SectionCard, Badge, Button, Divider, TPIcon, Skeleton } from "@dhspl-tatvacare/tesseract-ui";
import { Sep } from "../shared/Sep.jsx";
import { ALERT_TIER } from "../constants.js";

/**
 * AgentCardShell - the Doctor Agent card, COMPOSED FROM TESSERACT atoms:
 *   - shell        Tesseract <SectionCard> (icon + title/subtitle + collapse
 *                  chevron + headerExtra + footer), wrapped in a liquid-glass
 *                  layer (our SVG + AI-tinted stroke + bigger radius).
 *   - count tag    Tesseract <Badge> (soft / neutral).
 *   - CTAs         Tesseract <Button> - "Copy all" tonal/neutral (bigger radius),
 *                  "Create..." solid/primary; both with bulk CDN glyphs.
 *   - separators   Tesseract <Divider> between medication rows.
 *   - icons        TP CDN via <TPIcon variant="bulk">, the header glyph repainted
 *                  with the AI gradient (.da-grad-icon mask override).
 * Config-driven, deterministic (AI-last).
 *
 * config: { kind, header:{icon,title,date,badge:{label,tone},collapsible,defaultCollapsed},
 *           content: ContentBlock[], footer:{primary,secondary}, sources? }
 */

const BTN_THEME = { brand: "primary", neutral: "neutral", critical: "error" };
const BADGE_COLOR = { critical: "error", warning: "warning", info: "neutral", success: "success", neutral: "neutral" };

/* Header chip — a liquid-glass tile (our SVG bg) holding a Tesseract BULK icon
   repainted with the AI gradient via the .da-grad-icon CSS mask override. */
function GradBulkIcon({ name }) {
  return (
    <span className="da-card-icon" aria-hidden="true">
      <span className="da-grad-icon" style={{ display: "inline-flex" }}>
        <TPIcon name={name || "clipboard-text"} variant="bulk" size={16} color="#673AAC" />
      </span>
    </span>
  );
}

export function AgentCardShell({ config, collapsed, onCollapsedChange }) {
  if (!config) return null;
  const h = config.header || {};
  // Controlled collapse (for the progress-notes accordion) when `collapsed` is
  // passed; otherwise the card manages its own state via defaultCollapsed.
  const collapseProps = collapsed === undefined
    ? { defaultCollapsed: !!h.defaultCollapsed }
    : { collapsed, onCollapsedChange };
  const badgeNode = h.badge ? (
    <Badge variant="soft" color={BADGE_COLOR[h.badge.tone] || "neutral"} size="xs" radius="6" icons="none">
      {h.badge.label}
    </Badge>
  ) : null;
  // Keep the count tag INLINE on the subtitle line (owner: never a new line).
  const subtitleNode = (h.date || badgeNode) ? (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, minWidth: 0, verticalAlign: "middle" }}>
      {h.date && <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.date}</span>}
      {badgeNode}
    </span>
  ) : undefined;
  const footerNode = buildFooter(config.footer);
  const bothCtas = !!(config.footer && config.footer.primary && config.footer.secondary);

  return (
    <div className="da-card-glass">
      <SectionCard
        className="da-card-sc"
        icon={<GradBulkIcon name={h.icon} />}
        title={h.title || "Doctor Agent"}
        subtitle={subtitleNode}
        collapsible={h.collapsible !== false}
        {...collapseProps}
        collapseIcon="chevron-down"
        collapseIconPosition="right"
        bordered={false}
        divided={false}
        headerFill="none"
        surface="transparent"
      >
        {/* Body + CTAs live INSIDE the collapse zone, so a collapsed card shows
            only the header (owner: hide the footer when collapsed). */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {(config.content || []).map((block, i) => (
            <ContentBlock key={i} block={block} />
          ))}
          {footerNode && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2, justifyContent: bothCtas ? "space-between" : "flex-end" }}>
              {footerNode}
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}

/* Footer CTAs — Tesseract Buttons. "Copy all" = tonal/neutral with a bigger
   corner radius (owner directive); "Create..." = solid/primary. Bulk glyphs. */
function buildFooter(footer) {
  if (!footer) return undefined;
  const { primary, secondary } = footer;
  if (!primary && !secondary) return undefined;
  return (
    <>
      {secondary && (
        <Button variant="tonal" theme={BTN_THEME[secondary.tone] || "neutral"} size="sm" radius="10" leftIcon={<TPIcon name={secondary.icon || "copy"} variant="bulk" size={16} />} onClick={secondary.onClick}>
          {secondary.label}
        </Button>
      )}
      {primary && (
        <Button variant="solid" theme={BTN_THEME[primary.tone] || "primary"} size="sm" radius="10" leftIcon={<TPIcon name={primary.icon || "add-circle"} variant="bulk" size={16} color="#fff" />} onClick={primary.onClick}>
          {primary.label}
        </Button>
      )}
    </>
  );
}

/* ── Content block renderers ─────────────────────────────────────────────────── */
function ContentBlock({ block }) {
  if (!block) return null;
  switch (block.type) {
    case "text": return <TextBlock block={block} />;
    case "keyvalue": return <KeyValueBlock items={block.items} />;
    case "metricgrid": return <MetricGrid items={block.items} />;
    case "medlist": return <MedList meds={block.meds} />;
    case "table": return <MiniTable columns={block.columns} rows={block.rows} />;
    case "tasklist": return <TaskList tasks={block.tasks} onTaskClick={block.onTaskClick} />;
    case "banner": return <Banner block={block} />;
    case "notestack": return <NoteStack notes={block.notes} />;
    case "deflist": return <DefList items={block.items} />;
    case "sections": return <SectionsBlock items={block.items} />;
    case "linechart": return <LineChart block={block} />;
    default: return null;
  }
}

/* Sectioned body: each charted cluster gets a full-width section heading, with its
   content (vital chips or a sentence) below it. Reads like a real progress note. */
function SectionsBlock({ items = [] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      {items.map((s, i) => (
        <div key={i}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, color: "var(--tesseract-fg-secondary, #475467)", background: "var(--tesseract-slate-100, #f1f1f5)", padding: "3px 8px", borderRadius: 5, marginBottom: 5 }}>
            <TPIcon name={s.icon || "note-2"} variant="linear" size={12} color="var(--tesseract-fg-secondary, #475467)" />
            <span>{s.heading}</span>
          </div>
          {Array.isArray(s.chips) && s.chips.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "0 2px" }}>
              {s.chips.map((c, ci) => (
                <span key={ci} style={{ display: "inline-flex", alignItems: "baseline", gap: 4, fontSize: 12, lineHeight: "18px", padding: "1px 8px", borderRadius: 6, background: "var(--tesseract-slate-50, #fafafb)", border: "1px solid var(--tesseract-slate-100, #f1f1f5)" }}>
                  <span style={{ color: "var(--tesseract-fg-tertiary, #98a2b3)" }}>{c.key}</span>
                  <span style={{ fontWeight: 600, color: "var(--tesseract-fg-primary, #101828)" }}>{c.value}</span>
                </span>
              ))}
            </div>
          )}
          {s.body && (
            <p style={{ margin: 0, padding: "0 2px", fontSize: 12, lineHeight: "17px", color: "var(--tesseract-fg-primary, #101828)" }}>{s.body}</p>
          )}
        </div>
      ))}
    </div>
  );
}

/* Definition list: label + full (wrapping) value, one row per charted field. */
function DefList({ items = [] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", gap: 8, fontSize: 12, lineHeight: "17px", alignItems: "baseline" }}>
          <span style={{ flexShrink: 0, width: 104, color: "var(--tesseract-fg-tertiary, #98a2b3)" }}>{it.key}</span>
          <span style={{ flex: 1, minWidth: 0, color: "var(--tesseract-fg-primary, #101828)" }}>{it.value}</span>
        </div>
      ))}
    </div>
  );
}

/* Stacked, individually-collapsible progress-note cards. The doctor scans headers
   ("Progress note 1" + time), expands the ones they care about. Newest expanded,
   older collapsed by default (owner directive). */
function NoteStack({ notes = [] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {notes.map((n, i) => (
        <NoteCard key={i} note={n} />
      ))}
    </div>
  );
}

function NoteCard({ note }) {
  const [open, setOpen] = useState(!note.defaultCollapsed);
  const byLine = [note.author, note.authorRole].filter(Boolean).join(", ");
  return (
    <div style={{ borderRadius: 10, border: "1px solid var(--tesseract-border-subtle, #e6e6ee)", background: "rgba(255,255,255,0.55)", overflow: "hidden" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 10px", border: "none", background: "transparent", cursor: "pointer", textAlign: "left" }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, flexShrink: 0, borderRadius: 7, background: "rgba(103,58,172,0.08)" }}>
          <TPIcon name="note-2" variant="bulk" size={13} color="var(--tesseract-fg-brand, #4b4ad5)" />
        </span>
        <span style={{ minWidth: 0, flex: 1 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, lineHeight: "16px", color: "var(--tesseract-fg-primary, #101828)" }}>{note.title}</span>
            {note.tag && (
              <span style={{ flexShrink: 0, borderRadius: 5, padding: "1px 6px", fontSize: 9.5, fontWeight: 600, background: "rgba(103,58,172,0.08)", color: "var(--tesseract-fg-brand, #4b4ad5)" }}>{note.tag}</span>
            )}
          </span>
          {note.time && (
            <span style={{ display: "block", fontSize: 11, lineHeight: "15px", color: "var(--tesseract-fg-tertiary, #98a2b3)" }}>{note.time}</span>
          )}
        </span>
        <TPIcon name="arrow-down" size={13} color="var(--tesseract-fg-tertiary, #98a2b3)" style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s ease" }} />
      </button>
      {open && (
        <div style={{ padding: "0 10px 10px 40px", display: "flex", flexDirection: "column", gap: 6 }}>
          {byLine && (
            <span style={{ fontSize: 11, lineHeight: "15px", color: "var(--tesseract-fg-tertiary, #98a2b3)" }}>{byLine}</span>
          )}
          {note.summary && (
            <p style={{ margin: 0, fontSize: 12, lineHeight: "17px", color: "var(--tesseract-fg-secondary, #475467)" }}>{note.summary}</p>
          )}
          {Array.isArray(note.rows) && note.rows.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {note.rows.map((r, ri) => (
                <div key={ri} style={{ display: "flex", gap: 6, fontSize: 12, lineHeight: "17px" }}>
                  <span style={{ flexShrink: 0, minWidth: 96, color: "var(--tesseract-fg-tertiary, #98a2b3)" }}>{r.key}</span>
                  <span style={{ fontWeight: 500, color: "var(--tesseract-fg-primary, #101828)" }}>{r.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* Filterable ward task list (the aggregated home view). */
const TASK_ICON = { medication: "capsule", wound: "band-aids", lab: "ai-flask", transfusion: "blood", round: "clipboard-text", preop: "clipboard-tick", Meds: "capsule", Labs: "ai-flask", Wound: "band-aids", Referral: "arrow-swap-horizontal", OT: "scissor" };
const TASK_FILTERS = [
  { key: "all", label: "All" },
  { key: "Labs", label: "Labs" },
  { key: "Meds", label: "Meds" },
  { key: "Referral", label: "Referrals" },
  { key: "OT", label: "OT" },
  { key: "Wound", label: "Wound" },
];
const PRIORITY_TONE = { Urgent: "critical", Today: "info", Info: "neutral" };

function TaskList({ tasks = [], onTaskClick }) {
  const [filter, setFilter] = useState("all");
  const present = new Set(tasks.map((t) => t.kind));
  const filters = TASK_FILTERS.filter((f) => f.key === "all" || present.has(f.key));
  const showFilters = filters.length > 2;
  const rows = filter === "all" ? tasks : tasks.filter((t) => t.kind === filter);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {showFilters && <div className="da-suggestion-scroll" style={{ display: "flex", gap: 6, overflowX: "auto" }}>
        {filters.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              style={{ flexShrink: 0, borderRadius: 9999, padding: "3px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", border: `1px solid ${active ? "transparent" : "var(--tesseract-border-subtle, #e6e6ee)"}`, background: active ? "var(--tesseract-fg-brand, #4b4ad5)" : "#fff", color: active ? "#fff" : "var(--tesseract-fg-secondary, #475467)" }}
            >
              {f.label}
            </button>
          );
        })}
      </div>}
      {/* Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2, maxHeight: 320, overflowY: "auto" }} className="da-suggestion-scroll">
        {rows.map((t, i) => {
          const tier = ALERT_TIER[PRIORITY_TONE[t.priority] || "neutral"];
          return (
            <button
              key={`${t.patientId}-${i}`}
              type="button"
              className="da-task-row"
              onClick={() => onTaskClick?.(t)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", background: "transparent", border: "none", cursor: onTaskClick ? "pointer" : "default", textAlign: "left", width: "100%" }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, flexShrink: 0, borderRadius: 7, background: "rgba(103,58,172,0.08)" }}>
                <TPIcon name={TASK_ICON[t.kind] || "clipboard-text"} variant="bulk" size={13} color="var(--tesseract-fg-brand, #4b4ad5)" />
              </span>
              <span style={{ minWidth: 0, flex: 1 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, lineHeight: "16px", color: "var(--tesseract-fg-primary, #101828)" }}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.patientName}</span>
                  <span style={{ fontSize: 10.5, fontWeight: 500, color: "var(--tesseract-fg-tertiary, #98a2b3)" }}>{t.bed}</span>
                </span>
                <span style={{ display: "block", fontSize: 11.5, lineHeight: "15px", color: "var(--tesseract-fg-secondary, #475467)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  <strong style={{ fontWeight: 600 }}>{t.title}</strong>
                  {t.summary ? ` - ${t.summary}` : ""}
                </span>
              </span>
              {t.priority && (
                <span style={{ flexShrink: 0, borderRadius: 6, padding: "2px 7px", fontSize: 10, fontWeight: 600, background: tier.bg, color: tier.color }}>{t.priority}</span>
              )}
              {onTaskClick && (
                <TPIcon name="arrow-right2" size={13} color="var(--tesseract-fg-tertiary, #98a2b3)" className="da-task-chevron" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TextBlock({ block }) {
  if (block.variant === "heading") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, color: "var(--tesseract-fg-secondary, #475467)", background: "var(--tesseract-slate-100, #f1f1f5)", padding: "3px 8px", borderRadius: 5, marginTop: 4 }}>
        <span>{block.body}</span>
      </div>
    );
  }
  const color = block.variant === "alert" ? "var(--tesseract-fg-error, #c8102e)" : "var(--tesseract-fg-secondary, #475467)";
  return <p style={{ margin: 0, fontSize: 12, lineHeight: "17px", color }}>{block.body}</p>;
}

function KeyValueBlock({ items = [] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", fontSize: 12, lineHeight: "18px", color: "var(--tesseract-fg-primary, #101828)" }}>
      {items.map((it, i) => (
        <span key={it.key} style={{ display: "inline-flex", alignItems: "center" }}>
          <span style={{ color: "var(--tesseract-fg-tertiary, #98a2b3)" }}>{it.key}:&nbsp;</span>
          <span style={{ fontWeight: 600 }}>{it.value}</span>
          {i < items.length - 1 && <Sep />}
        </span>
      ))}
    </div>
  );
}

/* Metric chips - each vital individually tap-to-copy (with a copy affordance on
   hover), alongside the card's Copy-all / Fill footer actions. */
function MetricGrid({ items = [] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
      {items.map((m, i) => (
        <button
          key={i}
          type="button"
          className="da-metric-chip"
          onClick={m.onCopy}
          title={`Copy ${m.key}`}
        >
          <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
            <span style={{ fontSize: 9.5, textTransform: "uppercase", letterSpacing: 0.2, color: "var(--tesseract-fg-tertiary, #98a2b3)" }}>{m.key}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--tesseract-fg-primary, #101828)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.value}</span>
          </span>
          <TPIcon name="copy" variant="bulk" size={13} color="var(--tesseract-fg-brand, #4b4ad5)" className="da-metric-copy" />
        </button>
      ))}
    </div>
  );
}

/* Plain list - each row separated by a Tesseract <Divider>. Individual copy per
   row (Tesseract Button), alongside the card's common footer action. */
function MedList({ meds = [] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {meds.map((m, i) => (
        <div key={`${m.name}-${i}`}>
          {i > 0 && <Divider />}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 12.5, lineHeight: "16px", color: "var(--tesseract-fg-primary, #101828)" }}>
                <strong style={{ fontWeight: 600 }}>{m.name}</strong>
                {m.dose && <span style={{ marginLeft: 6, color: "var(--tesseract-fg-secondary, #475467)" }}>{m.dose}</span>}
              </div>
              {(m.timing || m.duration || m.note) && (
                <div style={{ fontSize: 11, lineHeight: "15px", marginTop: 1, color: "var(--tesseract-fg-tertiary, #98a2b3)", display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                  {m.timing && <span>{m.timing}</span>}
                  {m.timing && m.duration && <Sep />}
                  {m.duration && <span>{m.duration}</span>}
                  {m.note && <span style={{ marginLeft: 6, fontStyle: "italic" }}>{m.note}</span>}
                </div>
              )}
            </div>
            {m.onCopy && (
              <Button shape="icon-only" variant="ghost" theme="primary" size="sm" icon={<TPIcon name="copy" variant="bulk" size={16} color="var(--tesseract-fg-brand, #4b4ad5)" />} aria-label={`Copy ${m.name}`} onClick={m.onCopy} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniTable({ columns = [], rows = [] }) {
  const grid = `repeat(${columns.length}, 1fr)`;
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: grid, padding: "0 0 5px", fontSize: 10.5, fontWeight: 600, letterSpacing: 0.2, color: "var(--tesseract-fg-tertiary, #98a2b3)", borderBottom: "1px solid var(--tesseract-slate-100, #f1f1f5)" }}>
        {columns.map((c) => <span key={c}>{c}</span>)}
      </div>
      {rows.map((r, ri) => (
        <div key={ri} style={{ display: "grid", gridTemplateColumns: grid, padding: "5px 0", fontSize: 12, borderTop: ri === 0 ? "none" : "0.5px solid var(--tesseract-slate-100, #f1f1f5)" }}>
          {r.map((cell, ci) => (
            <span key={ci} style={{ fontWeight: ci === 0 ? 600 : 400, color: ci === 0 ? "var(--tesseract-fg-primary, #101828)" : "var(--tesseract-fg-secondary, #475467)" }}>{cell}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

function LineChart({ block }) {
  const { title: chartTitle, series = [], labels = [], unit = "", normalRange } = block;
  if (!series.length || !labels.length) return null;
  const allVals = series.flatMap((s) => s.data.filter((v) => v != null));
  const rawMin = Math.min(...allVals);
  const rawMax = Math.max(...allVals);
  const pad = (rawMax - rawMin) * 0.15 || 5;
  const lo = normalRange ? Math.min(rawMin, normalRange[0]) - pad : rawMin - pad;
  const hi = normalRange ? Math.max(rawMax, normalRange[1]) + pad : rawMax + pad;
  const W = 280, H = 100, PL = 32, PR = 4, PT = 4, PB = 18;
  const cw = W - PL - PR, ch = H - PT - PB;
  const xStep = labels.length > 1 ? cw / (labels.length - 1) : cw;
  const toY = (v) => PT + ch - ((v - lo) / (hi - lo)) * ch;
  const toX = (i) => PL + i * xStep;
  const COLORS = ["#673AAC", "#E8590C", "#2563EB", "#059669"];
  const gridLines = 4;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {chartTitle && (
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, color: "var(--tesseract-fg-secondary, #475467)", background: "var(--tesseract-slate-100, #f1f1f5)", padding: "3px 8px", borderRadius: 5 }}>
          <span>{chartTitle}</span>
          {unit && <span style={{ fontWeight: 500, textTransform: "none" }}>({unit})</span>}
        </div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
        {Array.from({ length: gridLines + 1 }, (_, gi) => {
          const v = lo + ((hi - lo) * gi) / gridLines;
          const y = toY(v);
          return (
            <g key={gi}>
              <line x1={PL} x2={W - PR} y1={y} y2={y} stroke="var(--tesseract-slate-100, #f1f1f5)" strokeWidth="0.5" />
              <text x={PL - 3} y={y + 3} textAnchor="end" fontSize="7" fill="var(--tesseract-fg-tertiary, #98a2b3)">{Math.round(v)}</text>
            </g>
          );
        })}
        {normalRange && (
          <rect x={PL} y={toY(normalRange[1])} width={cw} height={toY(normalRange[0]) - toY(normalRange[1])} fill="rgba(5,150,105,0.06)" rx="2" />
        )}
        {series.map((s, si) => {
          const pts = s.data.map((v, i) => (v != null ? `${toX(i)},${toY(v)}` : null)).filter(Boolean);
          const color = COLORS[si % COLORS.length];
          return (
            <g key={si}>
              <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
              {s.data.map((v, i) => v != null ? <circle key={i} cx={toX(i)} cy={toY(v)} r="2.5" fill="#fff" stroke={color} strokeWidth="1.2" /> : null)}
            </g>
          );
        })}
        {labels.map((l, i) => (
          <text key={i} x={toX(i)} y={H - 2} textAnchor="middle" fontSize="6.5" fill="var(--tesseract-fg-tertiary, #98a2b3)">{l}</text>
        ))}
      </svg>
      {series.length > 1 && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", padding: "0 2px" }}>
          {series.map((s, si) => (
            <span key={si} style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[si % COLORS.length] }} />
              <span style={{ color: "var(--tesseract-fg-secondary, #475467)" }}>{s.label}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Banner({ block }) {
  const tier = ALERT_TIER[block.tone] || ALERT_TIER.info;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 9px", borderRadius: 10, background: tier.bg, color: tier.color, fontSize: 12, fontWeight: 500 }}>
      <TPIcon name={block.icon || "info-circle"} variant="bulk" size={15} color={tier.color} />
      <span>{block.text}</span>
    </div>
  );
}

/* ── Auto-loading skeleton ───────────────────────────────────────────────────── */
export function AgentCardSkeleton() {
  return (
    <div className="da-card-glass" style={{ padding: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, borderBottom: "1px solid var(--tp-slate-50, #FAFAFB)" }}>
        <Skeleton variant="rectangular" width={28} height={28} radius="8" />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
          <Skeleton variant="rectangular" width="55%" height={11} radius="4" />
          <Skeleton variant="rectangular" width="30%" height={9} radius="4" />
        </div>
      </div>
      <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        <Skeleton variant="rectangular" width="90%" height={12} radius="4" />
        <Skeleton variant="rectangular" width="100%" height={34} radius="8" />
      </div>
    </div>
  );
}
