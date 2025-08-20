
export function ChannelDrawer({ open, onClose, name }:{ open:boolean; onClose:()=>void; name:string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40">
      <div className="absolute right-0 top-0 h-full w-[420px] bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{name}</h2>
          <button onClick={onClose} className="text-sm opacity-70">Stäng</button>
        </div>
        <div className="mt-6 text-sm opacity-80">Detaljer, ads, målgrupper och spend per dag.</div>
      </div>
    </div>
  );
}
