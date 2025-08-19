import React, { useEffect, useState } from 'react';
// Update the path below to the correct relative path where AddCampaignWizard is located
import AddCampaignWizard from './AddCampaignWizard';

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => {
    fetch('/api/campaigns', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => res.json())
      .then(data => setCampaigns(data))
      .catch(err => console.error(err));
  }, []);

  const kpis = [
    { name: "Google Ads", spend: "$1200", clicks: 540, impressions: 12000 },
    { name: "Meta Ads", spend: "$800", clicks: 410, impressions: 9000 },
    { name: "LinkedIn Ads", spend: "$300", clicks: 120, impressions: 2500 },
    { name: "Display Ads", spend: "$600", clicks: 230, impressions: 5000 },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <button
          onClick={() => setShowWizard(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 shadow rounded p-4">
            <h3 className="text-lg font-semibold">{kpi.name}</h3>
            <p className="text-gray-600 dark:text-gray-300">Spend: {kpi.spend}</p>
            <p className="text-gray-600 dark:text-gray-300">Clicks: {kpi.clicks}</p>
            <p className="text-gray-600 dark:text-gray-300">Impressions: {kpi.impressions}</p>
          </div>
        ))}
      </div>

      {showWizard && <AddCampaignWizard onClose={() => setShowWizard(false)} />}
    </div>
  );
}
