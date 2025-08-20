
export const formatMoney = (value: number) =>
  new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK', maximumFractionDigits: 0 }).format(value);
export const formatDate = (d: Date | string) =>
  new Intl.DateTimeFormat('sv-SE', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(d));
export const formatRatio = (value: number) => `${value.toFixed(2)}%`;
