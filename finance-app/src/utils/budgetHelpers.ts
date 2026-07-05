export type ProgressLevel = "ok" | "warn" | "over";

export const getLevel = (pct: number, exceeded: boolean): ProgressLevel =>
  exceeded ? "over" : pct >= 80 ? "warn" : "ok";

export const fmt = (n: number) =>
  n.toLocaleString("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 2,
  });


  export const formatLKR = (amount: number) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
  }).format(amount);