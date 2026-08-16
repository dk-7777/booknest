import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("BookNest App Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#05070d',
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            overflow: 'hidden',
            marginBottom: '20px',
            boxShadow: '0 0 25px rgba(56, 189, 248, 0.4)',
            border: '2px solid rgba(56, 189, 248, 0.5)'
          }}>
            <img src="/logo.png" alt="BookNest Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>BookNest ⚡</h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', maxWidth: '400px', marginBottom: '24px' }}>
            We encountered a minor display glitch. Click below to refresh your private library.
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('booknest_auth_user_id');
              window.location.reload();
            }}
            style={{
              padding: '12px 24px',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              fontWeight: 'bold',
              borderRadius: '16px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              boxShadow: '0 0 20px rgba(14, 165, 233, 0.5)'
            }}
          >
            🔄 Reset & Reload Library
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
