import { useCallback, useState, useEffect, useRef } from "react";
import { Sep } from "../shared/Sep.jsx";
import { AI_GRADIENT } from "../constants.js";

/**
 * ChatInput - two-row box (textarea on top; patient chip bottom-left; attach / mic /
 * send bottom-right, exact SVGs), a focus-within border, a pre-filled animated
 * gradient border, a voice recording mode, and the trust line.
 */

const cn = (...a) => a.filter(Boolean).join(" ");

/* ── Recording wave animation bars ── */
function WaveAnimation() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 20 }}>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div
          key={i}
          style={{ width: 2.5, borderRadius: 9999, background: AI_GRADIENT, animation: `daWaveBar 1s ease-in-out ${i * 0.1}s infinite alternate`, height: 6 }}
        />
      ))}
    </div>
  );
}

/* ── Recording timer — pauses when isPaused is true ── */
function RecordingTimer({ isPaused }) {
  const [elapsed, setElapsed] = useState(0);
  const lastTickRef = useRef(Date.now());
  useEffect(() => {
    if (isPaused) return undefined;
    lastTickRef.current = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      setElapsed((prev) => prev + Math.round((now - lastTickRef.current) / 1000));
      lastTickRef.current = now;
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  return <span style={{ fontSize: 14, fontWeight: 500, fontVariantNumeric: "tabular-nums", color: "var(--tp-slate-500, #717179)" }}>{mm}:{ss}</span>;
}

/** Patient chip — shows name + (meta) inside the input box. */
function PatientChip({ name, meta, isClinic }) {
  const metaParts = meta ? meta.split(/[|/]/) : [];
  const gender = metaParts[0]?.trim() || "";
  const age = metaParts[1]?.trim() || "";
  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "var(--tp-slate-100, #f1f5f9)", borderRadius: 6, padding: "3px 5px 3px 6px", height: 24, maxWidth: 175, minWidth: 0, border: "none", cursor: "default" }}
        aria-label={`Patient context: ${name}`}
      >
        <span style={{ flexShrink: 0, color: "var(--tp-slate-600, #667085)", display: "inline-flex" }}>
          {isClinic ? (
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none">
              <path opacity="0.4" d="M2 22H22" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17 2H7C4 2 3 3.79 3 6V22H21V6C21 3.79 20 2 17 2Z" fill="currentColor" opacity="0.4" />
              <path d="M14.06 15H9.93996C9.47996 15 9.09998 15.38 9.09998 15.84V22H14.9V15.84C14.9 15.38 14.52 15 14.06 15Z" fill="currentColor" />
              <path d="M10 11H8C7.45 11 7 10.55 7 10V8.5C7 7.95 7.45 7.5 8 7.5H10C10.55 7.5 11 7.95 11 8.5V10C11 10.55 10.55 11 10 11Z" fill="currentColor" />
              <path d="M16 11H14C13.45 11 13 10.55 13 10V8.5C13 7.95 13.45 7.5 14 7.5H16C16.55 7.5 17 7.95 17 8.5V10C17 10.55 16.55 11 16 11Z" fill="currentColor" />
            </svg>
          ) : (
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none">
              <path opacity="0.4" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" fill="currentColor" />
              <path d="M12 14.5c-5.01 0-9.09 3.36-9.09 7.5 0 .28.22.5.5.5h17.18c.28 0 .5-.22.5-.5 0-4.14-4.08-7.5-9.09-7.5Z" fill="currentColor" />
            </svg>
          )}
        </span>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 10, fontWeight: 600, color: "#3D3D4E", lineHeight: "12px" }}>{name}</span>
        {meta && (
          <span style={{ flexShrink: 0, whiteSpace: "nowrap", display: "flex", alignItems: "center", fontSize: 10, lineHeight: "12px" }}>
            <span style={{ color: "#B0B7C3", fontWeight: 400 }}>(</span>
            <span style={{ color: "#B0B7C3", fontWeight: 400 }}>{gender}</span>
            {age && (
              <>
                <span style={{ margin: "0 2px", color: "#D0D5DD", fontWeight: 400 }}>|</span>
                <span style={{ color: "#B0B7C3", fontWeight: 400 }}>{age}</span>
              </>
            )}
            <span style={{ color: "#B0B7C3", fontWeight: 400 }}>)</span>
          </span>
        )}
      </button>
    </div>
  );
}

const iconBtnBase = { display: "flex", flexShrink: 0, alignItems: "center", justifyContent: "center", border: "none", background: "transparent", cursor: "pointer", padding: 0 };

export function ChatInput({
  value,
  onChange,
  onSend,
  onAttach,
  onVoiceTranscription,
  disabled = false,
  placeholder = "Ask about this patient...",
  isPrefilled = false,
  patientName,
  patientMeta,
  isClinicContext = false,
}) {
  const hasText = String(value || "").trim().length > 0;
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const textareaRef = useRef(null);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const maxH = 120;
    el.style.height = `${Math.min(el.scrollHeight, maxH)}px`;
    el.style.overflowY = el.scrollHeight > maxH ? "auto" : "hidden";
  }, []);

  useEffect(() => { autoResize(); }, [value, autoResize]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey && hasText && !disabled) {
      e.preventDefault();
      onSend();
    }
  }, [hasText, disabled, onSend]);

  const handleSendRecording = useCallback(() => {
    const mock =
      "Patient stable, continue current management. Monitor vitals 4-hourly and watch for fever or rising pain score.";
    if (onVoiceTranscription) onVoiceTranscription(mock);
    else onChange(mock);
    setIsRecording(false);
    setIsPaused(false);
  }, [onChange, onVoiceTranscription]);

  return (
    <div style={{ background: "#fff", padding: "8px 10px 4px" }}>
      {isRecording ? (
        /* ── Recording mode ── */
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ display: "flex", height: 36, flex: 1, alignItems: "center", gap: 10, borderRadius: 10, padding: "0 12px", border: `1px solid ${isPaused ? "var(--tp-slate-300,#d0d5dd)" : "var(--tp-violet-300,#c89fe7)"}`, background: isPaused ? "var(--tp-slate-50,#fafafb)" : "linear-gradient(90deg, rgba(164,97,216,0.10), rgba(75,74,213,0.10))" }}>
            <span style={{ height: 6, width: 6, flexShrink: 0, borderRadius: 9999, background: isPaused ? "#a2a2a8" : "#e11d48" }} />
            {isPaused ? <span style={{ fontSize: 14, color: "#a2a2a8" }}>Paused</span> : <WaveAnimation />}
            <span style={{ flex: 1 }} />
            <RecordingTimer isPaused={isPaused} />
            <button type="button" onClick={() => setIsPaused((p) => !p)} style={{ ...iconBtnBase, height: 24, width: 24, borderRadius: 9999, color: "#717179" }} title={isPaused ? "Resume" : "Pause"}>
              {isPaused ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72a1 1 0 001.5.86l11.04-6.86a1 1 0 000-1.72L9.5 4.28a1 1 0 00-1.5.86z" /></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
              )}
            </button>
          </div>
          <button type="button" onClick={handleSendRecording} style={{ ...iconBtnBase, height: 28, width: 28, borderRadius: 9999, color: "#047857" }} title="Submit for transcription">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 13 10 18 19 6" /></svg>
          </button>
          <button type="button" onClick={() => { setIsRecording(false); setIsPaused(false); }} style={{ ...iconBtnBase, height: 28, width: 28, borderRadius: 9999, color: "#a2a2a8" }} title="Discard">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
      ) : (
        /* ── Normal input mode — two-row layout ── */
        <div className={cn("chat-input-border", isPrefilled && "chat-input-prefilled")} style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", borderRadius: 12, padding: "8px 10.5px", gap: 12, opacity: disabled ? 0.5 : 1 }}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            rows={1}
            style={{ width: "100%", resize: "none", background: "transparent", border: "none", outline: "none", padding: "0 4px", fontSize: 14, lineHeight: "16px", color: "#1D2939", fontWeight: 400, minHeight: 28, maxHeight: 120, fontFamily: "inherit" }}
          />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 24 }}>
            {patientName ? <PatientChip name={patientName} meta={patientMeta} isClinic={isClinicContext} /> : <div />}

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {onAttach && (
                <button type="button" onClick={onAttach} disabled={disabled} style={iconBtnBase} title="Add files and more">
                  <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                    <path d="M0 12C0 5.37258 5.37258 0 12 0V0C18.6274 0 24 5.37258 24 12V12C24 18.6274 18.6274 24 12 24V24C5.37258 24 0 18.6274 0 12V12Z" fill="var(--tp-slate-100, #f1f5f9)" />
                    <path d="M7.625 12H16.375" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 7.625V16.375" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}

              {hasText ? (
                <button type="button" onClick={onSend} disabled={disabled} style={iconBtnBase} title="Enter to send">
                  <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                    <path d="M0 12C0 5.37258 5.37258 0 12 0V0C18.6274 0 24 5.37258 24 12V12C24 18.6274 18.6274 24 12 24V24C5.37258 24 0 18.6274 0 12V12Z" fill="url(#daSendGrad)" />
                    <path d="M8.2063 10.4812L12 6.68745L15.7938 10.4812" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 17.3125V6.79375" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <defs>
                      <linearGradient id="daSendGrad" x1="-0.0224" y1="10.3128" x2="24.0296" y2="10.365" gradientUnits="userSpaceOnUse">
                        <stop offset="0.0304" stopColor="#D565EA" />
                        <stop offset="0.6674" stopColor="#673AAC" />
                        <stop offset="1" stopColor="#1A1994" />
                      </linearGradient>
                    </defs>
                  </svg>
                </button>
              ) : (
                <button type="button" onClick={() => { setIsRecording(true); setIsPaused(false); }} disabled={disabled} style={iconBtnBase} title="Use voice to dictate">
                  <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                    <path d="M0 12C0 5.37258 5.37258 0 12 0V0C18.6274 0 24 5.37258 24 12V12C24 18.6274 18.6274 24 12 24V24C5.37258 24 0 18.6274 0 12V12Z" fill="var(--tp-slate-100, #f1f5f9)" />
                    <g transform="translate(12 12) scale(0.67) translate(-12 -12)">
                      <path d="M19.1202 9.12035C18.7302 9.12035 18.4202 9.43035 18.4202 9.82035V11.4004C18.4202 14.9404 15.5402 17.8204 12.0002 17.8204C8.46018 17.8204 5.58018 14.9404 5.58018 11.4004V9.81035C5.58018 9.42035 5.27018 9.11035 4.88018 9.11035C4.49018 9.11035 4.18018 9.42035 4.18018 9.81035V11.3904C4.18018 15.4604 7.31018 18.8104 11.3002 19.1704V21.3004C11.3002 21.6904 11.6102 22.0004 12.0002 22.0004C12.3902 22.0004 12.7002 21.6904 12.7002 21.3004V19.1704C16.6802 18.8204 19.8202 15.4604 19.8202 11.3904V9.81035C19.8102 9.43035 19.5002 9.12035 19.1202 9.12035Z" fill="#667085" />
                      <path d="M12.0001 2C9.56008 2 7.58008 3.98 7.58008 6.42V11.54C7.58008 13.98 9.56008 15.96 12.0001 15.96C14.4401 15.96 16.4201 13.98 16.4201 11.54V6.42C16.4201 3.98 14.4401 2 12.0001 2Z" fill="#667085" />
                    </g>
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Trust indicator */}
      <div style={{ marginTop: 4, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, color: "var(--tp-slate-300, #d0d5dd)" }}>
          <path d="M12 2 4 5v6c0 5 3.4 7.7 8 9 4.6-1.3 8-4 8-9V5l-8-3Z" fill="currentColor" opacity="0.5" />
          <path d="m9 12 2 2 4-4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize: 11, lineHeight: 1.4, color: "var(--tp-slate-300, #d0d5dd)", display: "inline-flex", alignItems: "center" }}>
          Data stays private<Sep />AI-assisted, you decide
        </span>
      </div>
    </div>
  );
}
