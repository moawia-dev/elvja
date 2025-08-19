import React, { useState } from 'react';

export default function AddCampaignWizard({ onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<{ name: string; budget: string; channels: string[] }>({ name: '', budget: '', channels: [] });

  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);

  const toggleChannel = (channel) => {
    setForm((prev) => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel],
    }));
  };

  const submit = () => {
    fetch('/api/campaigns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then(() => onClose())
      .catch((err) => console.error(err));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded shadow-lg p-6 w-full max-w-lg">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Step 1: Campaign Name</h2>
            <input
              type="text"
              placeholder="Campaign Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border p-2 rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button onClick={next} className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Step 2: Budget</h2>
            <input
              type="number"
              placeholder="Budget ($)"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              className="w-full border p-2 rounded mb-4"
            />
            <div className="flex justify-between gap-2">
              <button onClick={prev} className="px-4 py-2 border rounded">Back</button>
              <button onClick={next} className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Step 3: Select Channels</h2>
            {['Google', 'Meta', 'LinkedIn', 'Display'].map((ch) => (
              <label key={ch} className="block mb-2">
                <input
                  type="checkbox"
                  checked={form.channels.includes(ch)}
                  onChange={() => toggleChannel(ch)}
                  className="mr-2"
                />
                {ch}
              </label>
            ))}
            <div className="flex justify-between gap-2 mt-4">
              <button onClick={prev} className="px-4 py-2 border rounded">Back</button>
              <button onClick={next} className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Step 4: Preview</h2>
            <p><strong>Name:</strong> {form.name}</p>
            <p><strong>Budget:</strong> {form.budget}</p>
            <p><strong>Channels:</strong> {form.channels.join(', ')}</p>
            <div className="flex justify-between gap-2 mt-4">
              <button onClick={prev} className="px-4 py-2 border rounded">Back</button>
              <button onClick={submit} className="bg-green-600 text-white px-4 py-2 rounded">Publish</button>
            </div>
          </div>
        )}

        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✕</button>
      </div>
    </div>
  );
}
