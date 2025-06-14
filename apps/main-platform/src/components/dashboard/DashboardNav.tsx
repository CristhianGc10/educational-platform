// ===== apps/main-platform/src/components/dashboard/DashboardNav.tsx =====
'use client';

import { signOut } from 'next-auth/react';

interface User {
    id: string;
    name?: string | null;
    email: string;
    role: string;
}

interface DashboardNavProps {
    user: User;
}

export function DashboardNav({ user }: DashboardNavProps) {
    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <h2 className="text-xl font-bold text-gray-900">
                                Plataforma Educativa
                            </h2>
                        </div>
                        <div className="hidden md:ml-6 md:flex md:space-x-8">
                            <a
                                href="/dashboard"
                                className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium"
                            >
                                Dashboard
                            </a>
                            <a
                                href="/dashboard/courses"
                                className="text-gray-500 hover:text-gray-600 px-3 py-2 text-sm font-medium"
                            >
                                Cursos
                            </a>
                            <a
                                href="/dashboard/progress"
                                className="text-gray-500 hover:text-gray-600 px-3 py-2 text-sm font-medium"
                            >
                                Mi Progreso
                            </a>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-700">
                            {user.name || user.email}
                        </span>
                        <button
                            onClick={() =>
                                signOut({ callbackUrl: '/auth/signin' })
                            }
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
