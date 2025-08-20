
export const fmtMoney = (n: number) =>
  new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK', maximumFractionDigits: 0 }).format(n);
export const fmtDate = (d: Date | string) =>
  new Intl.DateTimeFormat('sv-SE', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(d));
export const fmtCpc = (spendKr: number, clicks: number) =>
  clicks > 0 ? fmtMoney(Math.round(spendKr / clicks)) + '/klick' : '—';
