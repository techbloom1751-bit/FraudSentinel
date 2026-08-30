import React, { useState } from 'react';
import { runSentinelCheck, InvoiceData } from './checkScript';

// 1. We added this interface to tell TypeScript exactly what an invoice looks like
interface ExtendedInvoice extends InvoiceData {
  status: string;
  fraudFlags: string[];
  verifiedPhone: string;
}

export default function App() {
  // 2. We added <ExtendedInvoice[]> right here so 'prev' and 'inv' are no longer "any" type
  const [invoices, setInvoices] = useState<ExtendedInvoice[]>(() => {
    const rawBatch: InvoiceData[] = [
      { id: "INV-2026-001", vendorId: "VEND-001", vendorName: "Acme Logistics", submittedAmount: 42000, submittedAccountNo: "987654321011", submittedPhone: "+91-98765-43210" },
      { id: "INV-2026-002", vendorId: "VEND-002", vendorName: "Global Tech", submittedAmount: 480000, submittedAccountNo: "999888777000", submittedPhone: "+91-88888-00000" }
    ];

    return rawBatch.map(inv => ({ ...inv, ...runSentinelCheck(inv) }));
  });

  const handleManualRelease = (id: string) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'MANUALLY_RELEASED' } : inv));
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#0d1117', color: '#c9d1d9', minHeight: '100vh', fontFamily: 'system-ui' }}>
      <h1 style={{ color: '#58a6ff' }}>🛡️ AP Payment Fraud Sentinel</h1>
      <p style={{ color: '#8b949e' }}>Real-time AP Email & Invoice Fraud Prevention Engine</p>
      
      {invoices.map((inv, index) => {
        const isHeld = inv.status === 'HELD_SUSPICIOUS';
        const isReleased = inv.status === 'MANUALLY_RELEASED';

        return (
          <div key={inv.id} style={{
            backgroundColor: isHeld ? '#211215' : '#161b22',
            border: isHeld ? '2px solid #f85149' : '1px solid #30363d',
            padding: '20px', marginBottom: '16px', borderRadius: '8px'
          }}>
            <h3 style={{ margin: 0, color: '#f0f6fc' }}>{inv.vendorName} — ${inv.submittedAmount}</h3>
            <p style={{ color: isHeld ? '#f85149' : '#3fb950', fontWeight: 'bold' }}>Status: {inv.status}</p>

            {isHeld && (
              <div style={{ padding: '16px', backgroundColor: '#1c1214', border: '1px solid #f85149', borderRadius: '6px' }}>
                <h4 style={{ color: '#f85149', margin: '0 0 10px 0' }}>🚨 Fraud Flags:</h4>
                <ul>{inv.fraudFlags.map((flag, i) => <li key={i} style={{ color: '#ff7b72' }}>{flag}</li>)}</ul>
                
                <div style={{ marginTop: '14px', padding: '12px', backgroundColor: '#0d1117', borderLeft: '4px solid #58a6ff' }}>
                  <b>📞 OUT-OF-BAND VERIFICATION</b><br/>
                  ❌ Do not call invoice phone: {inv.submittedPhone}<br/>
                  ✅ Call Official Master Record: <span style={{ color: '#3fb950' }}>{inv.verifiedPhone}</span>
                </div>

                <button onClick={() => handleManualRelease(inv.id)} style={{ marginTop: '16px', padding: '10px', backgroundColor: '#d29922', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px' }}>
                  🔓 Manually Release Payment
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}