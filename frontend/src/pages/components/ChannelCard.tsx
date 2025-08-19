import React from 'react';

export function ChannelCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex flex-col items-center">
      <h4 className="text-gray-600 dark:text-gray-300">{title}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
