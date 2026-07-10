# IPD Doctor Agent — Nursing → Doctor Rounds Data Catalog

> The source of truth for **what nursing data the Doctor Agent surfaces to the
> doctor/MO on IPD rounds, and how**. Deterministic, **AI-last** (no LLM) — every
> value comes straight from what the nurse already charted in the HIMS nursing
> modules. The guiding rule: **surface what changes a rounds decision, in priority
> order — never dump the whole chart.**

Owner: Design (design@tatvacare.in) · Branch: `ipd-doctor-agent` · Living doc.

---

## 0. The rounds mental model

A doctor/MO on a morning IPD round, per patient, is asking — in this order:

1. **Is this patient stable or deteriorating?** (early-warning, trend of vitals)
2. **What happened since I last saw them?** (overnight events, interventions, SOS)
3. **Are my orders being carried out?** (MAR: given / held / missed / refused)
4. **Any red-flag values?** (critical labs, low urine output, high sugar, high pain)
5. **What do I need to act on / decide now?** (nurse escalations, pending tasks, tapering, discharge readiness)

So the agent leads with a **Rounds snapshot**, then lets the doctor drill into any
domain. Everything below maps a nursing data source to one of those questions.

## 1. Relevance legend

| Tier | Meaning | Behaviour |
|---|---|---|
| 🟥 **Always** | Core rounds data — show on the summary by default | Lead card / in the snapshot |
| 🟧 **On-signal** | Show only when abnormal / present (deterioration, a device, a specialty) | Auto-promoted when the alert engine flags it |
| 🟦 **On-demand** | Available via a pill / question, not shown unprptd | Pill + drill-in card |
| 📄 **Reference** | Free-text / narrative — surfaced to read, not decision-critical | In the Nursing-record print view |

Alerting is **deterministic** (`alertEngine.js`): each metric has fixed thresholds
→ `critical` / `warning` / null. Anything that trips a threshold is auto-promoted
from 🟧 to the top of the snapshot with its tier badge.

---

## 2. The catalog — nursing module → doctor rounds

| Nursing source (HIMS module) | What nursing captures | What the doctor needs on rounds | Tier | Card / display |
|---|---|---|---|---|
| **Vitals** (Daily Progress / Summary arrival vitals) | BP, HR, SpO2, Temp, RR, (RBS) per reading, by nurse+time | Latest set + **trend** + any abnormal, and *how fresh* | 🟥 | `vitals` card (latest + tier badge); trend sparkline |
| **Early-warning (NEWS/MEWS)** derived from vitals | computed aggregate score | **Deteriorating?** one number the doctor trusts | 🟥 | headline chip on the Rounds snapshot (critical → red) |
| **MAR** (drug administration) | per-dose status: given / due / **held** / **missed** / **refused**, time, nurse | Are my orders happening? **Exceptions first** (held/missed/refused) | 🟥 | `mar` card — exceptions surfaced, full list on demand |
| **Fluid balance / I&O** (Fluid Balance) | intake, output, net, urine output, drains | Net balance + **low urine output** (AKI signal) | 🟥 | `fluid` card (net + tier); oliguria → warning |
| **Blood sugar** (Diabetic Chart) | RBS series, insulin given, sliding-scale response | For diabetics: **trend + hypos/hypers**, insulin given | 🟧 | `glucose` card (series + flags) — promoted if diabetic |
| **Pain** (Pain Assessment) | NRS/VAS/Wong-Baker score, site, breakthrough, PRN analgesia given | **Uncontrolled pain** + breakthrough frequency | 🟧 | `pain` card (score trend) — promoted if score ≥ threshold |
| **Flagged labs** (Lab Reports) | value, flag (H/L), reference, critical flag | **Critical / abnormal** results since last round | 🟥 | `labs` card — critical first, tiered |
| **Risk scores** (Summary & Assessment) | Morse (fall), Braden (pressure), GCS, VIP | Fall/pressure/neuro risk — **worsening** ones | 🟧 | `risk` card — promoted when a score crosses a band |
| **Wound / pressure injury** (Wound Mgmt / Body Map) | region, stage, exudate, dressing done, photo | Wound **stage / deterioration**, dressing status | 🟧 | `wound` card — promoted if stage ≥ II or new |
| **Devices & lines** (assessment / I&O) | IV cannula, urinary catheter, CVC, drains + **insertion date** | Line **dwell time** (infection/CLABSI/CAUTI risk) → remove? | 🟧 | `lines` card — promoted when dwell > threshold |
| **Nursing notes / SBAR handover** (Daily Progress / Shift Handover) | shift narrative, general condition, plan, events | **Overnight events** + nurse's concerns | 🟥 | `notes` card (last 1-2) + full in print view |
| **Nurse SOS / escalation** (Tasks / alerts) | flagged deterioration, call-doctor events | **Act now** items the nurse raised for the doctor | 🟥 | ward `task_list` (SOS first) + per-patient banner |
| **Intake — nutrition / diet** (Diet Order) | diet type, NPO status, feeds tolerated | NPO before procedure? feeding tolerance | 🟦 | in Rounds snapshot / `diet` on demand |
| **Mobility / ADL** (Daily Progress) | bed activity, ambulation, self-care level | **Discharge readiness**, DVT/pressure risk | 🟦 | `adl` on demand (discharge planning) |
| **Transfusion monitoring** (Blood Transfusion) | component, vitals per unit, reaction watch | **Ongoing transfusion** + any reaction | 🟧 | `transfusion` card — promoted while active |
| **Dialysis** (Dialysis) | session, pre/post weight, fluid removed, access | Session done? fluid removed, access status | 🟧 | `dialysis` card — promoted on dialysis days |
| **Systemic exam** (Daily Progress systemic checklist) | per-system nurse findings (resp/CVS/GI/GU/CNS) | Corroborate/triage before the doctor examines | 📄 | in the Nursing-record print view |
| **Chemotherapy / infection control / OT checklist** (specialty modules) | protocol-specific nurse charting | Only if the patient is on that pathway | 🟧 | specialty card — promoted by pathway |

---

## 3. What leads, by context (deterministic ordering)

`sectionMeta` returns an **ordered** card set. The order is driven by the alert
engine, not the doctor's phrasing:

- **Patient view, default (rounds snapshot):** `[ rounds-summary, vitals, MAR-exceptions, fluid, flagged-labs, nursing-notes ]` — then any 🟧 card the alert engine promoted (deterioration, oliguria, high sugar, uncontrolled pain, line overdue) jumps to the top with its tier badge.
- **Deteriorating patient** (any critical tier tripped): the **rounds-summary leads with the red flags**; the tripped domain card is pinned second.
- **Diabetic patient:** `glucose` promoted into the top set.
- **Post-op / on a drain / catheter:** `lines` + `wound` promoted.
- **Ward / list view:** `[ what-needs-attention (SOS + critical patients ranked), critical-patients ]` — a triage board across the doctor's in-patients.

## 4. The "Rounds snapshot" (the flagship card)

One card the doctor reads in 5 seconds, assembled deterministically from the above:
- **Stability line:** early-warning score + the single worst abnormal vital (tiered).
- **Overnight:** 1-line from the latest nursing note / SBAR (events, interventions).
- **Orders:** MAR exceptions count (held/missed/refused) — 0 is reassuring.
- **Red flags:** critical labs, low urine output, high sugar, high pain — only if present.
- **Act-now:** open nurse SOS / escalation for this patient.
- CTA: **View nursing record** (the full print-view sidebar) for the complete chart.

## 5. What we deliberately DON'T show (anti-dump rules)

- **No full vitals history** on the snapshot — latest + trend only; full series on demand.
- **No normal-range labs** — only flagged/critical.
- **No every-note narrative** — the last 1-2; the rest lives in the print view.
- **No stable/normal 🟧 domains** — a normal sugar/pain/wound stays collapsed until asked.
- **No duplicate of what the doctor ordered** — the agent shows nursing's *response* to orders (MAR status), not the order itself (that's already in the doctor's CPOE).

## 6. Provenance & trust

Every card names the **nurse + time** in the intro ("charted by Nurse Priya Nair"),
keeps the card subtitle to the timestamp, and offers **Source → View nursing
record** — a print-style sidebar of the full nursing chart (vitals, MAR, fluids,
labs, risk, notes) so the doctor can verify any surfaced value against the source.

---

## 7. Build status (this branch)

Live today: `vitals`, `mar`, `fluid`, `labs`, `risk`, `notes`, patient `summary`,
ward `task_list` — all off the `:4000` nursing data with alert tiers; the
**Nursing-record print view** (Source → View nursing record). Next per this
catalog: the **Rounds snapshot** flagship card, plus the 🟧 on-signal cards
(`glucose`, `pain`, `lines`, `wound`, `transfusion`, `dialysis`) with the
alert-engine auto-promotion, and the mock backend fields to drive them.
