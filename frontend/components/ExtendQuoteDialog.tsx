"use client"

import * as React from "react"

interface ExtendQuoteDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (days: number) => void
  title?: string
  confirmText?: string
  cancelText?: string
}

export default function ExtendQuoteDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Extend Quote Expiry",
  confirmText = "Extend",
  cancelText = "Cancel",
}: ExtendQuoteDialogProps) {
  const [days, setDays] = React.useState(14);
  const isValidDays = days >= 1 && days <= 90;

  if (!isOpen) return null;

  return (
    <div className="dashboard-modal-bg">
      <div className="dashboard-modal-card" style={{ maxWidth: '450px' }}>
        <h2 style={{fontWeight:'bold', fontSize:'1.5rem', marginBottom:'1rem'}}>{title}</h2>
        
        <div style={{marginBottom: '1.5rem'}}>
          <label htmlFor="days" style={{display: 'block', fontSize: '1rem', fontWeight: '500', marginBottom: '0.5rem'}}>
            Number of days to extend (1-90)
          </label>
          <input 
            type="number" 
            id="days"
            min={1}
            max={90}
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value, 10) || 0)}
            className="quoteform-input"
            style={{width: '100%'}}
          />
          {!isValidDays && (
            <p style={{marginTop: '0.5rem', color: '#e53935', fontSize: '0.9rem'}}>
              Please enter a number between 1 and 90
            </p>
          )}
        </div>
        
        <div style={{display: 'flex', justifyContent: 'space-between', gap: '15px'}}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '0.8rem 0',
              background: '#f0f2f5',
              color: '#333',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
              transition: 'background 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#e4e6eb'}
            onMouseOut={(e) => e.currentTarget.style.background = '#f0f2f5'}
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              if (isValidDays) {
                onConfirm(days);
                onClose();
              }
            }}
            disabled={!isValidDays}
            style={{
              flex: 1,
              padding: '0.8rem 0',
              background: '#1877f2',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: isValidDays ? 'pointer' : 'not-allowed',
              boxShadow: '0 2px 8px 0 rgba(24, 119, 242, 0.08)',
              opacity: isValidDays ? 1 : 0.6,
              transition: 'background 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => {
              if (isValidDays) {
                e.currentTarget.style.background = '#155db2';
                e.currentTarget.style.boxShadow = '0 4px 16px 0 rgba(24, 119, 242, 0.16)';
              }
            }}
            onMouseOut={(e) => {
              if (isValidDays) {
                e.currentTarget.style.background = '#1877f2';
                e.currentTarget.style.boxShadow = '0 2px 8px 0 rgba(24, 119, 242, 0.08)';
              }
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
} 