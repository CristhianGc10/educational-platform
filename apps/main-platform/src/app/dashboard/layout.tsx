export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <nav
                style={{
                    backgroundColor: 'white',
                    borderBottom: '1px solid #e2e8f0',
                    padding: '1rem 2rem',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        maxWidth: '1200px',
                        margin: '0 auto',
                    }}
                >
                    <h1
                        style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: '#1e293b',
                            margin: 0,
                        }}
                    >
                        Plataforma Educativa
                    </h1>
                    <div
                        style={{
                            fontSize: '0.875rem',
                            color: '#64748b',
                        }}
                    >
                        v1.0 - Build OK
                    </div>
                </div>
            </nav>

            <main
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '2rem',
                }}
            >
                {children}
            </main>
        </div>
    );
}
