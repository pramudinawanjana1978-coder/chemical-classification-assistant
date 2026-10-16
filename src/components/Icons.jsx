const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const FlaskIcon = ({ size = 24 }) => (
  <svg {...base} width={size} height={size}>
    <path d="M9 3h6" />
    <path d="M10 3v6.2L4.6 18.1A2 2 0 0 0 6.3 21h11.4a2 2 0 0 0 1.7-2.9L14 9.2V3" />
    <path d="M7.5 15h9" />
  </svg>
);

export const SearchIcon = ({ size = 20 }) => (
  <svg {...base} width={size} height={size}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const MicIcon = ({ size = 20 }) => (
  <svg {...base} width={size} height={size}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0" />
    <path d="M12 18v3" />
  </svg>
);

export const CloseIcon = ({ size = 18 }) => (
  <svg {...base} width={size} height={size}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const AtomIcon = ({ size = 22 }) => (
  <svg {...base} width={size} height={size}>
    <circle cx="12" cy="12" r="1.6" />
    <ellipse cx="12" cy="12" rx="9" ry="3.8" />
    <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(120 12 12)" />
  </svg>
);

export const LayersIcon = ({ size = 22 }) => (
  <svg {...base} width={size} height={size}>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 13 9 5 9-5" />
  </svg>
);

export const InfoIcon = ({ size = 20 }) => (
  <svg {...base} width={size} height={size}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5" />
    <path d="M12 7.6v.1" />
  </svg>
);

export const AlertIcon = ({ size = 20 }) => (
  <svg {...base} width={size} height={size}>
    <path d="M12 3 2.5 20h19L12 3Z" />
    <path d="M12 10v4.5" />
    <path d="M12 17.6v.1" />
  </svg>
);

export const CheckIcon = ({ size = 18 }) => (
  <svg {...base} width={size} height={size}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const DatabaseIcon = ({ size = 22 }) => (
  <svg {...base} width={size} height={size}>
    <ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" />
    <path d="M4.5 5.5v6.5c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8V5.5" />
    <path d="M4.5 12v6.5c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8V12" />
  </svg>
);

export const ServerIcon = ({ size = 22 }) => (
  <svg {...base} width={size} height={size}>
    <rect x="3" y="4" width="18" height="7" rx="2" />
    <rect x="3" y="13" width="18" height="7" rx="2" />
    <path d="M7 7.5v.1M7 16.5v.1" />
  </svg>
);

export const HashIcon = ({ size = 22 }) => (
  <svg {...base} width={size} height={size}>
    <path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16" />
  </svg>
);
