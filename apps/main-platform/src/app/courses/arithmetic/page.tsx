// apps/main-platform/src/app/courses/arithmetic/page.tsx
'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

export default function ArithmeticCoursePage() {
    const [isRedirecting, setIsRedirecting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Implementar navegación suave a course-arithmetic
        const handleRedirect = () => {
            setIsRedirecting(true);

            // En desarrollo: redirect directo
            if (process.env.NODE_ENV === 'development') {
                window.location.href = 'http://localhost:3001';
            } else {
                // En producción: usar subdomain o path
                window.location.href = '/arithmetic';
            }
        };

        // Delay para mostrar loading state
        const timer = setTimeout(handleRedirect, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center space-y-6">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Cargando Curso de Aritmética
                    </h1>
                    <p className="text-gray-600">
                        Preparando tu experiencia de aprendizaje inmersiva...
                    </p>
                </div>

                {isRedirecting && (
                    <div className="bg-white rounded-lg p-4 shadow-lg max-w-md mx-auto">
                        <p className="text-sm text-gray-500">
                            Redirigiendo a la plataforma de Aritmética
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
