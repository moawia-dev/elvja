
import { CurrencyText } from './CurrencyText';
export function ChannelCard({ name, spend, clicks, onClick }:{ name:string; spend:number; clicks:number; onClick:()=>void }) {
  return (
    <button onClick={onClick} className="p-4 rounded-xl border w-full text-left hover:bg-gray-50 dark:hover:bg-gray-900">
      <div className="text-sm opacity-70">{name}</div>
      <div className="mt-2 flex items-center gap-6">
        <div><span className="text-xs opacity-70">Spend</span><div className="font-semibold"><CurrencyText value={spend} /></div></div>
        <div><span className="text-xs opacity-70">Klick</span><div className="font-semibold">{clicks.toLocaleString('sv-SE')}</div></div>
      </div>
    </button>
  );
}
