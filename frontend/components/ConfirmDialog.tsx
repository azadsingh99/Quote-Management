"use client"

import * as React from "react"

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="dashboard-modal-bg">
      <div className="dashboard-modal-card" style={{ maxWidth: '450px' }}>
        <h2 style={{fontWeight:'bold', fontSize:'1.5rem', marginBottom:'0.8rem'}}>{title}</h2>
        <p style={{color:'#555', marginBottom:'1.5rem'}}>{description}</p>
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
              onConfirm();
              onClose();
            }}
            style={{
              flex: 1,
              padding: '0.8rem 0',
              background: confirmText === "Delete" ? '#e53935' : '#1877f2',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
              transition: 'background 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = confirmText === "Delete" ? '#d32f2f' : '#155db2';
              e.currentTarget.style.boxShadow = '0 4px 16px 0 rgba(0, 0, 0, 0.16)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = confirmText === "Delete" ? '#e53935' : '#1877f2';
              e.currentTarget.style.boxShadow = '0 2px 8px 0 rgba(0, 0, 0, 0.08)';
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
} 