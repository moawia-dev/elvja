import React from 'react';

const channels = [
  { name: 'Meta', icon: '/icons/meta.svg' },
  { name: 'LinkedIn', icon: '/icons/linkedin.svg' },
  { name: 'Google', icon: '/icons/google.svg' },
  { name: 'Display', icon: '/icons/display.svg' },
];

export function ChannelStrip({ onSelect }: { onSelect: (channel: string) => void }) {
  return (
    <div className="flex gap-4 p-4 bg-gray-900 text-white rounded-lg">
      {channels.map(c => (
        <button key={c.name} onClick={() => onSelect(c.name)} className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700">
          <img src={c.icon} alt={c.name} className="w-6 h-6" />
          {c.name}
        </button>
      ))}
    </div>
  );
}
