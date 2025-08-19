import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function ChannelChart({ data }: { data: any[] }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="impressions" stroke="#8884d8" />
          <Line type="monotone" dataKey="clicks" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
