
import { CurrencyText } from './CurrencyText';
export function TotalsCard({ totals }: { totals: { spend: number; clicks: number; roasKr: number } }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-4 rounded-xl border">
        <div className="text-xs opacity-70">Spend</div>
        <div className="text-xl font-semibold"><CurrencyText value={totals.spend} /></div>
      </div>
      <div className="p-4 rounded-xl border">
        <div className="text-xs opacity-70">Klick</div>
        <div className="text-xl font-semibold">{totals.clicks.toLocaleString('sv-SE')}</div>
      </div>
      <div className="p-4 rounded-xl border">
        <div className="text-xs opacity-70">ROAS</div>
        <div className="text-xl font-semibold"><CurrencyText value={totals.roasKr} /></div>
      </div>
    </div>
  );
}
