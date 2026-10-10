import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  public handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#131314',
          color: '#e5e2e3',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '500px',
            padding: '32px',
            backgroundColor: '#1c1b1c',
            border: '1px solid rgba(255, 224, 141, 0.4)',
            borderRadius: '16px',
            boxShadow: '0 24px 80px rgba(0,0,0,0.9)'
          }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#ffe08d',
              marginBottom: '12px',
              fontFamily: "'JetBrains Mono', monospace",
              textTransform: 'uppercase'
            }}>
              ARTIFURA // System Notice
            </h1>
            <p style={{ fontSize: '14px', color: '#c6c6cf', lineHeight: 1.6, marginBottom: '24px' }}>
              The application encountered an unexpected runtime state. A quick reload will re-initialize the environment.
            </p>
            <button
              onClick={this.handleReload}
              style={{
                backgroundColor: '#ffe08d',
                color: '#3d2f00',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
