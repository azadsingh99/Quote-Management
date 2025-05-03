import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import QuoteForm from '../components/QuoteForm';
import ConfirmDialog from '../components/ConfirmDialog';
import ExtendQuoteDialog from '../components/ExtendQuoteDialog';
import { useToast } from '../hooks/use-toast';

const API_URL = 'http://localhost:3001/api/quotes';

export default function HomePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [viewHistoryQuote, setViewHistoryQuote] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  
  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });
  
  // Extend quote dialog state
  const [extendDialog, setExtendDialog] = useState({
    isOpen: false,
    quoteId: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      router.replace('/auth');
      return;
    }
    fetchQuotes();
  }, [router]);

  const fetchQuotes = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('jwt_token');
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch quotes');
      setQuotes(data.data.quotes);
    } catch (err) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to fetch quotes"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingQuote(null);
    setShowForm(true);
  };

  const handleEdit = (quote) => {
    setEditingQuote(quote);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Quote",
      description: "Are you sure you want to delete this quote? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('jwt_token');
          const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error('Failed to delete quote');
          toast({
            title: "Success",
            description: "Quote deleted successfully",
          });
          fetchQuotes();
        } catch (err) {
          toast({
            variant: "destructive",
            title: "Error",
            description: err.message || "Failed to delete quote"
          });
        }
      }
    });
  };

  const handleExtend = (id) => {
    setExtendDialog({
      isOpen: true,
      quoteId: id,
    });
  };
  
  const performExtend = async (id, days) => {
    try {
      const token = localStorage.getItem('jwt_token');
      const res = await fetch(`${API_URL}/${id}/extend`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ days }),
      });
      if (!res.ok) throw new Error('Failed to extend expiry');
      toast({
        title: "Success",
        description: `Quote expiry extended by ${days} days`,
      });
      fetchQuotes();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to extend quote expiry"
      });
    }
  };

  const handleHistory = async (id) => {
    setHistoryLoading(true);
    setViewHistoryQuote(id);
    try {
      const token = localStorage.getItem('jwt_token');
      const res = await fetch(`${API_URL}/${id}/versions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error('Failed to fetch history');
      setHistory(data.data.versions);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to fetch version history"
      });
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    router.replace('/auth');
  };

  return (
    <div className="dashboard-bg">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Saved Quotes</h1>
          <button onClick={handleLogout} className="dashboard-logout">Logout</button>
        </div>
        <button onClick={handleCreate} className="dashboard-create">Create New Quote</button>
        {loading ? (
          <p style={{color:'#888',fontWeight:'500'}}>Loading...</p>
        ) : error ? (
          <p style={{color:'#e53935',fontWeight:'bold'}}>{error}</p>
        ) : quotes.length === 0 ? (
          <p style={{color:'#555',fontSize:'1.12rem'}}>No saved quotes yet.</p>
        ) : (
          <div className="dashboard-table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Products</th>
                  <th>Notes</th>
                  <th>Created</th>
                  <th>Expires</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((q) => (
                  <tr key={q._id}>
                    <td>{q.products.map((p) => `${p.name} x${p.quantity}`).join(', ')}</td>
                    <td>{q.notes}</td>
                    <td>{new Date(q.createdAt).toLocaleDateString()}</td>
                    <td>{new Date(q.expiresAt).toLocaleDateString()}</td>
                    <td className={q.isExpired ? 'status-expired' : 'status-active'}>{q.isExpired ? 'Expired' : 'Active'}</td>
                    <td>
                      <button onClick={() => handleEdit(q)} className="action-btn edit-btn">Edit</button>
                      <button onClick={() => handleDelete(q._id)} className="action-btn delete-btn">Delete</button>
                      <button onClick={() => handleExtend(q._id)} className="action-btn extend-btn">Extend</button>
                      <button onClick={() => handleHistory(q._id)} className="action-btn history-btn">History</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {showForm && (
          <div className="dashboard-modal-bg">
            <div className="dashboard-modal-card">
              <QuoteForm
                initialProducts={editingQuote ? editingQuote.products : []}
                initialNotes={editingQuote ? editingQuote.notes : ''}
                isSubmitting={false}
                onSubmit={async (products, notes) => {
                  const token = localStorage.getItem('jwt_token');
                  try {
                    const res = await fetch(editingQuote ? `${API_URL}/${editingQuote._id}` : API_URL, {
                      method: editingQuote ? 'PUT' : 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({ products, notes }),
                    });
                    if (!res.ok) throw new Error('Failed to save quote');
                    
                    toast({
                      title: "Success",
                      description: editingQuote ? "Quote updated successfully" : "Quote created successfully",
                    });
                    
                    setShowForm(false);
                    setEditingQuote(null);
                    fetchQuotes();
                  } catch (err) {
                    toast({
                      variant: "destructive",
                      title: "Error",
                      description: err.message || "Failed to save quote"
                    });
                  }
                }}
              />
              <button onClick={() => { setShowForm(false); setEditingQuote(null); }} className="dashboard-modal-close">Cancel</button>
            </div>
          </div>
        )}
        {viewHistoryQuote && (
          <div className="dashboard-modal-bg">
            <div className="dashboard-modal-card" style={{maxHeight:'80vh',overflowY:'auto'}}>
              <h2 style={{fontWeight:'bold',fontSize:'1.25rem',color:'#1877f2',marginBottom:'1.2rem'}}>Version History</h2>
              {historyLoading ? <p style={{color:'#888'}}>Loading...</p> : history.length === 0 ? <p style={{color:'#888'}}>No history found.</p> : (
                <ul style={{padding:0,listStyle:'none'}}>
                  {history.map((v, i) => (
                    <li key={v._id} style={{marginBottom:16,borderBottom:'1px solid #eee',paddingBottom:8}}>
                      <b>Version {v.versionNumber}</b> <span style={{color:'#888',fontSize:12}}>({new Date(v.createdAt).toLocaleString()})</span>
                      <ul style={{margin:'6px 0 0 0',padding:0,listStyle:'none'}}>
                        {v.products.map((p, j) => (
                          <li key={j}>{p.name} x {p.quantity}</li>
                        ))}
                      </ul>
                      <div style={{fontSize:13,color:'#555'}}>Notes: {v.notes}</div>
                      <div style={{fontSize:12,color:'#999'}}>Reason: {v.reason || 'N/A'}</div>
                    </li>
                  ))}
                </ul>
              )}
              <button onClick={() => { setViewHistoryQuote(null); setHistory([]); }} className="dashboard-modal-close">Close</button>
            </div>
          </div>
        )}
        
        {/* Dialogs */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
          onConfirm={confirmDialog.onConfirm}
          title={confirmDialog.title}
          description={confirmDialog.description}
          confirmText="Delete"
          cancelText="Cancel"
        />
        
        <ExtendQuoteDialog
          isOpen={extendDialog.isOpen}
          onClose={() => setExtendDialog({ ...extendDialog, isOpen: false })}
          onConfirm={(days) => performExtend(extendDialog.quoteId, days)}
        />
      </div>
    </div>
  );
}
