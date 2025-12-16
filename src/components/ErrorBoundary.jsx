import React from 'react';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // eslint-disable-next-line no-console
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0a0e27',
                    padding: '20px'
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            maxWidth: '600px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '20px',
                            padding: '40px',
                            border: '2px solid rgba(255, 255, 255, 0.1)',
                            textAlign: 'center'
                        }}
                    >
                        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🚀💥</div>
                        <h1 style={{ color: '#fff', fontSize: '32px', marginBottom: '16px' }}>
                            Houston, we have a problem!
                        </h1>
                        <p style={{ color: '#aaa', fontSize: '16px', marginBottom: '24px', lineHeight: '1.6' }}>
                            Something went wrong while exploring the solar system.
                            Don't worry, our engineers are on it!
                        </p>

                        {this.state.error && (
                            <details style={{
                                marginBottom: '24px',
                                textAlign: 'left',
                                background: 'rgba(0, 0, 0, 0.3)',
                                padding: '16px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                color: '#ff6b6b'
                            }}>
                                <summary style={{ cursor: 'pointer', marginBottom: '8px', fontWeight: 'bold' }}>
                                    Error Details
                                </summary>
                                <pre style={{
                                    overflow: 'auto',
                                    fontSize: '12px',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word'
                                }}>
                                    {this.state.error.toString()}
                                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                                onClick={() => window.location.reload()}
                                style={{
                                    padding: '12px 24px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            >
                                🔄 Reload Page
                            </button>

                            <button
                                onClick={() => window.location.href = '/'}
                                style={{
                                    padding: '12px 24px',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '2px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'scale(1.05)';
                                    e.target.style.borderColor = '#667eea';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'scale(1)';
                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                }}
                            >
                                🏠 Go Home
                            </button>
                        </div>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
