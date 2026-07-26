/**
 * Recharts renders SVG that cannot inherit CSS custom properties for fills and
 * strokes, so chart colours are read off the document at runtime instead of
 * being duplicated as hex literals. One source of truth, and it follows the
 * active theme.
 */
export const token = (name, fallback = "#000") => {
  if (typeof window === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(`--${name}`)
    .trim();
  return raw ? `rgb(${raw})` : fallback;
};

export const chartPalette = () => ({
  ink: token("ink"),
  muted: token("muted"),
  line: token("line"),
  surface: token("surface"),
  plate: token("plate"),
  accent: token("accent"),
  positive: token("positive"),
  notice: token("notice"),
  danger: token("danger"),
});

/** Order statuses carry meaning, so their colours are semantic, not decorative. */
export const statusColour = (status, palette = chartPalette()) =>
  ({
    Processing: palette.notice,
    Shipped: palette.ink,
    Delivered: palette.positive,
    Cancelled: palette.danger,
  }[status] ?? palette.muted);
