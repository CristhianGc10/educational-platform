export default function DashboardPage() {
    return (
        <div>
            {/* Encabezado */}
            <div style={{ marginBottom: '2rem' }}>
                <h1
                    style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        marginBottom: '0.5rem',
                    }}
                >
                    ¡Hola, Estudiante!
                </h1>
                <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
                    Bienvenido a la plataforma educativa
                </p>
            </div>

            {/* Curso de Aritmética */}
            <div style={{ marginBottom: '3rem' }}>
                <h2
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        marginBottom: '1rem',
                        color: '#1f2937',
                    }}
                >
                    Cursos Disponibles
                </h2>

                <div
                    style={{
                        backgroundColor: 'white',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        border: '1px solid #e5e7eb',
                    }}
                >
                    <h3
                        style={{
                            fontSize: '1.25rem',
                            fontWeight: 600,
                            color: '#1f2937',
                            marginBottom: '0.5rem',
                        }}
                    >
                        Aritmética Aplicada
                    </h3>
                    <p
                        style={{
                            color: '#6b7280',
                            marginBottom: '1rem',
                            lineHeight: 1.5,
                        }}
                    >
                        Curso completo de aritmética con aplicaciones del mundo
                        real
                    </p>

                    {/* Barra de progreso */}
                    <div style={{ marginBottom: '1rem' }}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '0.5rem',
                                fontSize: '0.875rem',
                                color: '#6b7280',
                            }}
                        >
                            <span>Progreso del curso</span>
                            <span>0%</span>
                        </div>
                        <div
                            style={{
                                width: '100%',
                                backgroundColor: '#e5e7eb',
                                borderRadius: '9999px',
                                height: '8px',
                            }}
                        >
                            <div
                                style={{
                                    backgroundColor: '#3b82f6',
                                    height: '8px',
                                    borderRadius: '9999px',
                                    width: '0%',
                                }}
                            />
                        </div>
                    </div>

                    {/* Fila inferior: semanas + botón */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <span
                            style={{ fontSize: '0.875rem', color: '#6b7280' }}
                        >
                            0 de 11 semanas completadas
                        </span>

                        <a
                            href="/courses/arithmetic"
                            style={{
                                display: 'inline-block',
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '6px',
                                fontWeight: 500,
                                fontSize: '0.875rem',
                            }}
                        >
                            Comenzar Curso
                        </a>
                    </div>
                </div>
            </div>

            {/* Estadísticas */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem',
                }}
            >
                {/* Tarjeta 1 */}
                <div
                    style={{
                        backgroundColor: 'white',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                >
                    <h3
                        style={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            marginBottom: '0.5rem',
                            color: '#1f2937',
                        }}
                    >
                        Tu Progreso
                    </h3>
                    <p
                        style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: '#3b82f6',
                            margin: '0.5rem 0',
                        }}
                    >
                        0%
                    </p>
                    <p
                        style={{
                            fontSize: '0.875rem',
                            color: '#6b7280',
                            margin: 0,
                        }}
                    >
                        Completado
                    </p>
                </div>

                {/* Tarjeta 2 */}
                <div
                    style={{
                        backgroundColor: 'white',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                >
                    <h3
                        style={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            marginBottom: '0.5rem',
                            color: '#1f2937',
                        }}
                    >
                        Tiempo Invertido
                    </h3>
                    <p
                        style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: '#10b981',
                            margin: '0.5rem 0',
                        }}
                    >
                        0h
                    </p>
                    <p
                        style={{
                            fontSize: '0.875rem',
                            color: '#6b7280',
                            margin: 0,
                        }}
                    >
                        Esta semana
                    </p>
                </div>

                {/* Tarjeta 3 */}
                <div
                    style={{
                        backgroundColor: 'white',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                >
                    <h3
                        style={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            marginBottom: '0.5rem',
                            color: '#1f2937',
                        }}
                    >
                        Ejercicios Resueltos
                    </h3>
                    <p
                        style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: '#8b5cf6',
                            margin: '0.5rem 0',
                        }}
                    >
                        0
                    </p>
                    <p
                        style={{
                            fontSize: '0.875rem',
                            color: '#6b7280',
                            margin: 0,
                        }}
                    >
                        Total
                    </p>
                </div>
            </div>

            {/* Estado del sistema */}
            <div
                style={{
                    backgroundColor: '#dbeafe',
                    border: '1px solid #93c5fd',
                    borderRadius: '8px',
                    padding: '1rem',
                }}
            >
                <h3
                    style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#1e40af',
                        marginBottom: '0.5rem',
                    }}
                >
                    ✅ Sistema Funcionando Correctamente
                </h3>
                <p
                    style={{
                        fontSize: '0.875rem',
                        color: '#1e40af',
                        margin: 0,
                        lineHeight: 1.5,
                    }}
                >
                    Dashboard básico funcionando. El sistema de autenticación y
                    contenido dinámico se implementará en las siguientes
                    iteraciones.
                </p>
            </div>
        </div>
    );
}
