// ============================================================
// Grúas Luaidesa — Set de iconos de línea
// Trazo consistente (1.5–1.75), sin relleno, 24x24 base.
// Sustituye a los emojis para dar un acabado profesional/serio.
// ============================================================
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconPhone(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 4h3.4l1.4 4.2-2 1.4a12.5 12.5 0 0 0 5.1 5.1l1.4-2 4.2 1.4v3.4c0 .9-.7 1.6-1.6 1.5-6.9-.5-12.4-6-12.9-12.9C3 5.2 3.7 4.4 4.5 4z" />
    </svg>
  );
}

export function IconWhatsApp(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.78-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.48s1.07 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.7.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.34zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26C2.16 6.5 6.6 2.07 12.05 2.07c2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88zm8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.9c0 2.09.55 4.13 1.59 5.94L.06 24l6.31-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.16-3.49-8.4z" />
    </svg>
  );
}

export function IconTruck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2 8h11v8H2z" />
      <path d="M13 11h4.2l3.3 3.3V16h-7.5" />
      <circle cx="6" cy="17.5" r="1.7" />
      <circle cx="16.5" cy="17.5" r="1.7" />
      <path d="M2 12h5" />
    </svg>
  );
}

export function IconRoute(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="5" cy="6" r="2" />
      <circle cx="19" cy="18" r="2" />
      <path d="M5 8v3a4 4 0 0 0 4 4h6a4 4 0 0 1 4 4" strokeDasharray="2.2 3" />
    </svg>
  );
}

export function IconAlert(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 21 19H3L12 3.5z" />
      <path d="M12 10v3.2" />
      <circle cx="12" cy="16.3" r="0.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconShield(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3 4.5 5.8v5.4c0 4.6 3.1 8.4 7.5 9.8 4.4-1.4 7.5-5.2 7.5-9.8V5.8L12 3z" />
      <path d="M9 12.2l2 2 4-4.4" />
    </svg>
  );
}

export function IconBolt(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M13 2 4.5 13.5H11L10.5 22 19.5 10H13l.5-8z" />
    </svg>
  );
}

export function IconTag(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12.6 3H4v8.6L14.4 22 21 15.4 10.6 5 12.6 3z" />
      <circle cx="8" cy="8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconPin(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21.5s7-6.7 7-12.2a7 7 0 1 0-14 0c0 5.5 7 12.2 7 12.2z" />
      <circle cx="12" cy="9.3" r="2.3" />
    </svg>
  );
}

export function IconClock(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.7" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />
    </svg>
  );
}

export function IconChevronDown(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 8.5 12 15.5 19 8.5" />
    </svg>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12h15.5" />
      <path d="M13.5 6 19.5 12 13.5 18" />
    </svg>
  );
}

export function IconInvoice(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 2.5h9l3 3V21a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5V3a.5.5 0 0 1 .5-.5z" />
      <path d="M9 9h6M9 12.5h6M9 16h4" />
    </svg>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 6.5h16M4 12h16M4 17.5h16" />
    </svg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 5l14 14M19 5 5 19" />
    </svg>
  );
}
