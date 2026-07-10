/**
 * Bulk-style welcome-card icons (iconsax visual language). Each path uses
 * fill="currentColor" so the `.welcome-icon-grad` rule can repaint them with the
 * vertical AI gradient (url(#welcomeIconGrad)) exactly like the source WelcomeScreen.
 */
const SIZE = 18;
const svg = (children) => (
  <svg width={SIZE} height={SIZE} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {children}
  </svg>
);

const Capsule = svg(
  <>
    <path opacity=".4" d="M12.79 3.53 3.53 12.79a4.99 4.99 0 0 0 7.06 7.06l9.26-9.26a4.99 4.99 0 1 0-7.06-7.06Z" fill="currentColor" />
    <path d="M11.87 4.45 4.45 11.87l7.06 7.06 7.42-7.42-7.06-7.06Z" fill="currentColor" />
  </>,
);
const Flask = svg(
  <>
    <path opacity=".4" d="M9 2.75a.75.75 0 0 0 0 1.5h.25V9.4L4.6 17.1a2.75 2.75 0 0 0 2.36 4.15h10.08a2.75 2.75 0 0 0 2.36-4.15L14.75 9.4V4.25H15a.75.75 0 0 0 0-1.5H9Z" fill="currentColor" />
    <path d="M8.4 14.5h7.2l1.9 3.1a1 1 0 0 1-.86 1.5H7.36a1 1 0 0 1-.86-1.5l1.9-3.1Z" fill="currentColor" />
  </>,
);
const Document = svg(
  <>
    <path opacity=".4" d="M16 2H8C5 2 4 3.79 4 6v12c0 2.21 1 4 4 4h8c3 0 4-1.79 4-4V6c0-2.21-1-4-4-4Z" fill="currentColor" />
    <path d="M15.5 11.25h-7a.75.75 0 0 1 0-1.5h7a.75.75 0 0 1 0 1.5Zm-2 4h-5a.75.75 0 0 1 0-1.5h5a.75.75 0 0 1 0 1.5Z" fill="currentColor" />
  </>,
);
const Chart = svg(
  <>
    <path opacity=".4" d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81v8.37C2 19.83 4.17 22 7.81 22h8.37c3.64 0 5.81-2.17 5.81-5.81V7.81C22 4.17 19.83 2 16.19 2Z" fill="currentColor" />
    <path d="M6.88 18.9c-.41 0-.75-.34-.75-.75v-2.07a.75.75 0 0 1 1.5 0v2.07c0 .42-.34.75-.75.75ZM12 18.9c-.41 0-.75-.34-.75-.75V14a.75.75 0 0 1 1.5 0v4.15c0 .42-.34.75-.75.75ZM17.12 18.9c-.41 0-.75-.34-.75-.75v-6.22a.75.75 0 0 1 1.5 0v6.22c0 .42-.33.75-.75.75Z" fill="currentColor" />
  </>,
);
const Heart = svg(
  <>
    <path d="M22 8.69c0 1.19-.19 2.29-.52 3.31H2.52A10.4 10.4 0 0 1 2 8.69C2 5.6 4.49 3.1 7.56 3.1c1.81 0 3.43.88 4.44 2.23a5.55 5.55 0 0 1 4.44-2.23c3.07 0 5.56 2.5 5.56 5.59Z" fill="currentColor" />
    <path opacity=".4" d="M21.48 12c-1.58 5-6.45 7.99-8.86 8.81-.34.12-.9.12-1.24 0C8.97 19.99 4.1 17 2.52 12h18.96Z" fill="currentColor" />
  </>,
);
const Cross = svg(
  <>
    <path opacity=".4" d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2Z" fill="currentColor" />
    <path d="M15 11h-2V9a1 1 0 0 0-2 0v2H9a1 1 0 0 0 0 2h2v2a1 1 0 0 0 2 0v-2h2a1 1 0 0 0 0-2Z" fill="currentColor" />
  </>,
);
const Clipboard = svg(
  <>
    <path opacity=".4" d="M16.19 2h-1.09c.19.36.28.78.28 1.25v1.13c0 1.14-.93 2.07-2.07 2.07h-2.62c-1.14 0-2.07-.93-2.07-2.07V3.25c0-.47.09-.89.28-1.25H7.81C4.17 2 2 4.17 2 7.81v8.37C2 19.83 4.17 22 7.81 22h8.37c3.64 0 5.81-2.17 5.81-5.81V7.81C22 4.17 19.83 2 16.19 2Z" fill="currentColor" />
    <path d="M12.75 4.38h-1.5c-.6 0-1.09-.49-1.09-1.09s.49-1.1 1.09-1.1h1.5c.6 0 1.09.49 1.09 1.1 0 .6-.49 1.09-1.09 1.09ZM11.5 14.75l1 1 3-3" stroke="currentColor" strokeWidth="0" fill="currentColor" />
  </>,
);

const ICONS = {
  medication: Capsule,
  lab: Flask,
  wound: Heart,
  round: Document,
  monitoring: Chart,
  ot: Cross,
  tasks: Clipboard,
  orders: Document,
};

/** Pick a welcome-card icon from the card's message/title keywords. */
export function welcomeIcon({ message = "", title = "" } = {}) {
  const s = `${message} ${title}`.toLowerCase();
  if (/(med|drug|mar|prn|dose)/.test(s)) return ICONS.medication;
  if (/(lab|invest|panel|blood work)/.test(s)) return ICONS.lab;
  if (/(wound|dress|care instruction)/.test(s)) return ICONS.wound;
  if (/(monitor|vital|target|threshold)/.test(s)) return ICONS.monitoring;
  if (/(pre-op|preop|ot |anaesth|surg|procedure)/.test(s)) return ICONS.ot;
  if (/(ward task|pending|task)/.test(s)) return ICONS.tasks;
  if (/(round|note|plan|progress|assessment)/.test(s)) return ICONS.round;
  return ICONS.orders;
}
