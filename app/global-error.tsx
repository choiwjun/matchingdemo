'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f9fafb',
                    padding: '1rem',
                }}>
                    <div style={{
                        maxWidth: '400px',
                        width: '100%',
                        backgroundColor: 'white',
                        borderRadius: '1rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        padding: '2rem',
                        textAlign: 'center',
                    }}>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
                            システムエラー
                        </h1>
                        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                            申し訳ございません。システムエラーが発生しました。
                        </p>
                        {error.digest && (
                            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '1rem' }}>
                                Error ID: {error.digest}
                            </p>
                        )}
                        <button
                            onClick={reset}
                            style={{
                                padding: '0.5rem 1.5rem',
                                backgroundColor: '#2563eb',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                            }}
                        >
                            再試行
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
