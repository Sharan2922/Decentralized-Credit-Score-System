import React, { useState } from 'react';
import { api } from './api';

type ScoreResponse = {
  score: number;
  bucket: string;
  reasons: string[];
  features: Record<string, number>;
};

export default function App() {
  const [form, setForm] = useState({
    repaymentOnTimePct: 95,
    utilizationPct: 25,
    dtiPct: 30,
    monthsSinceLastDPD: 24,
    hardInquiries12m: 1,
    avgAccountAgeMonths: 36,
    numActiveAccounts: 3
  });

  const [result, setResult] = useState<ScoreResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const analyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/api/score', {
        ...Object.fromEntries(Object.entries(form).map(([k,v]) => [k, Number(v)]))
      });
      setResult(res.data);
    } catch (e: any) {
      setError(e?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 880, margin: '40px auto', fontFamily: 'Inter, system-ui, Arial' }}>
      <h1>Risk Chain Analyzer – Decentralized Credit Score (Demo)</h1>
      <p style={{ color: '#555' }}>Transparent, points-based scorecard. Change inputs and compute score.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginTop: 24 }}>
        {Object.entries(form).map(([name, value]) => (
          <label key={name} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#333' }}>{name}</span>
            <input
              type="number"
              name={name}
              value={value as number}
              onChange={handleChange}
              style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
            />
          </label>
        ))}
      </div>

      <button onClick={analyze} disabled={loading} style={{ marginTop: 16, padding: '12px 16px', borderRadius: 10, border: 'none', background: '#111', color: 'white' }}>
        {loading ? 'Scoring...' : 'Compute Score'}
      </button>

      {error && <p style={{ color: 'crimson', marginTop: 12 }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 24, padding: 16, border: '1px solid #eee', borderRadius: 12 }}>
          <h3 style={{ marginTop: 0 }}>Result</h3>
          <p><b>Score:</b> {result.score} &nbsp; <b>Bucket:</b> {result.bucket}</p>
          <p><b>Top reasons:</b></p>
          <ul>
            {result.reasons.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
          <details>
            <summary>Features used</summary>
            <pre>{JSON.stringify(result.features, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
}
