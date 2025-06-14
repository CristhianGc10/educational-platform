export default function Page() {
    return (
        <div
            style={{
                padding: '3rem 2rem',
                maxWidth: '800px',
                margin: '0 auto',
                textAlign: 'center',
            }}
        >
            <h1
                style={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    color: '#1e293b',
                    background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                Curso de Aritmética Aplicada
            </h1>

            <div
                style={{
                    backgroundColor: '#f0f9ff',
                    border: '2px solid #0ea5e9',
                    borderRadius: '12px',
                    padding: '2rem',
                    marginBottom: '2rem',
                }}
            >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                <h2
                    style={{
                        color: '#0369a1',
                        fontWeight: '600',
                        fontSize: '1.5rem',
                        margin: 0,
                    }}
                >
                    ¡Aplicación funcionando correctamente!
                </h2>
            </div>

            <p
                style={{
                    color: '#64748b',
                    lineHeight: '1.6',
                    fontSize: '1.1rem',
                    marginBottom: '2rem',
                }}
            >
                Bienvenido al curso interactivo de aritmética con aplicaciones
                del mundo real. El contenido completo del curso se implementará
                en las siguientes iteraciones.
            </p>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    marginTop: '2rem',
                }}
            >
                <div
                    style={{
                        backgroundColor: '#fefce8',
                        border: '1px solid #facc15',
                        borderRadius: '8px',
                        padding: '1rem',
                    }}
                >
                    <h3 style={{ color: '#a16207', margin: '0 0 0.5rem 0' }}>
                        🎯 Características
                    </h3>
                    <ul
                        style={{
                            textAlign: 'left',
                            color: '#713f12',
                            margin: 0,
                            paddingLeft: '1rem',
                        }}
                    >
                        <li>Calculadoras 3D interactivas</li>
                        <li>Problemas del mundo real</li>
                        <li>Seguimiento de progreso</li>
                    </ul>
                </div>

                <div
                    style={{
                        backgroundColor: '#f0fdf4',
                        border: '1px solid #22c55e',
                        borderRadius: '8px',
                        padding: '1rem',
                    }}
                >
                    <h3 style={{ color: '#166534', margin: '0 0 0.5rem 0' }}>
                        📚 Módulos
                    </h3>
                    <ul
                        style={{
                            textAlign: 'left',
                            color: '#14532d',
                            margin: 0,
                            paddingLeft: '1rem',
                        }}
                    >
                        <li>Fundamentos Aplicados</li>
                        <li>Finanzas y Comercio</li>
                        <li>Estadística Aplicada</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
