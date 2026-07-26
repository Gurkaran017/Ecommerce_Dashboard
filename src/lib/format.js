const inrWhole = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const inrPaise = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** ₹29,990 — the only way money is rendered in this app. */
export const formatPrice = (value) => {
  const amount = Number(value) || 0;
  return Number.isInteger(amount)
    ? inrWhole.format(amount)
    : inrPaise.format(amount);
};

/**
 * ₹48.2K — compact money for KPI tiles. The previous build printed "48.2K"
 * with no unit at all, which is not a number anyone can act on.
 */
export const formatCompactPrice = (value) => {
  const amount = Number(value) || 0;
  if (amount < 1000) return `₹${amount}`;
  if (amount < 1_000_000) return `₹${trim(amount / 1000)}K`;
  if (amount < 1_000_000_000) return `₹${trim(amount / 1_000_000)}M`;
  return `₹${trim(amount / 1_000_000_000)}B`;
};

export const formatCompactNumber = (value) => {
  const amount = Number(value) || 0;
  if (amount < 1000) return String(amount);
  if (amount < 1_000_000) return `${trim(amount / 1000)}K`;
  if (amount < 1_000_000_000) return `${trim(amount / 1_000_000)}M`;
  return `${trim(amount / 1_000_000_000)}B`;
};

const trim = (n) => n.toFixed(1).replace(/\.0$/, "");

export const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/** Stock is an integer; three meaningful states, shared with the storefront. */
export const stockState = (stock) => {
  const count = Number(stock) || 0;
  if (count > 5) return { key: "in-stock", label: "In stock", tone: "positive" };
  if (count > 0) return { key: "limited", label: "Low stock", tone: "notice" };
  return { key: "out-of-stock", label: "Sold out", tone: "danger" };
};

/**
 * The stats endpoint returns orderStatusCounts values as strings, so a plain
 * reduce concatenates them — this is why the old summary read "02121".
 */
export const sumCounts = (counts = {}) =>
  Object.values(counts).reduce((total, count) => total + (Number(count) || 0), 0);

/** Percentage change with a single, unambiguous caption. */
export const revenueDelta = (today, yesterday) => {
  const current = Number(today) || 0;
  const previous = Number(yesterday) || 0;

  if (previous === 0) {
    /* No baseline to compare against — the old code claimed +100% here even
       when today was also zero. */
    return current === 0
      ? { value: null, label: "No sales yesterday", tone: "muted" }
      : { value: null, label: "First sales since yesterday", tone: "positive" };
  }

  const change = ((current - previous) / previous) * 100;
  return {
    value: change,
    label: `${change >= 0 ? "+" : ""}${change.toFixed(1)}% vs yesterday`,
    tone: change >= 0 ? "positive" : "danger",
  };
};
