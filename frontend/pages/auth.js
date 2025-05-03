import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useToast } from '../hooks/use-toast';

const API_URL = 'http://localhost:3001/api/auth';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        router.replace('/home');
      }
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'signup' ? { username, password, role } : { username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error');
      
      if (mode === 'login') {
        localStorage.setItem('jwt_token', data.data.token);
        toast({
          title: "Success",
          description: "Login successful! Redirecting..."
        });
        setTimeout(() => router.replace('/home'), 1200);
      } else {
        toast({
          title: "Success",
          description: "Signup successful! Please log in with your new account."
        });
        setTimeout(() => setMode('login'), 1200);
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Authentication failed"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>{mode === 'login' ? 'Login' : 'Sign Up'} - Quote Management</title>
      </Head>
      <main style={{ 
        padding: '2rem 1rem', 
        fontFamily: 'Inter, Arial, sans-serif', 
        background: '#f6f8fa', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="login-container">
          <h1 className="login-title">{mode === 'login' ? 'Login' : 'Sign Up'}</h1>
          <form onSubmit={handleSubmit}>
            <label className="login-label">
              Username
              <input 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                type="text" 
                required 
                autoComplete="username" 
                className="login-input"
              />
            </label>
            <label className="login-label">
              Password
              <input 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                type="password" 
                required 
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'} 
                className="login-input"
              />
            </label>
            {mode === 'signup' && (
              <label className="login-label">
                Role
                <select 
                  value={role} 
                  onChange={e => setRole(e.target.value)} 
                  className="login-input"
                >
                  <option value="buyer">Buyer</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
            )}
            <button type="submit" className="login-button" disabled={isSubmitting}>
              {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign Up'}
            </button>
          </form>
          <div>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setMode(mode === 'login' ? 'signup' : 'login');
              }} 
              className="login-link"
            >
              {mode === 'login' ? 'Need an account? Sign Up' : 'Already have an account? Login'}
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
