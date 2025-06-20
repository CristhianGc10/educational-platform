// apps/main-platform/src/app/dashboard/page.tsx

import { BookOpen, Clock, Trophy } from 'lucide-react';

import { CourseCard } from '@/components/dashboard/CourseCard';

const courses = [
    {
        id: 'arithmetic',
        title: 'Aritmética Aplicada',
        description:
            'Domina operaciones, porcentajes, proporciones y aplicaciones financieras a través de experiencias interactivas y simulaciones 3D.',
        progress: 0,
        totalModules: 8,
        completedModules: 0,
        url: 'http://localhost:3001',
        status: 'available' as const,
        estimatedTime: '12-16 semanas',
    },
    {
        id: 'algebra',
        title: 'Álgebra Interactiva',
        description:
            'Explora ecuaciones, funciones y sistemas algebraicos con herramientas visuales y resolvedores paso a paso.',
        progress: 0,
        totalModules: 10,
        completedModules: 0,
        url: '/courses/algebra',
        status: 'coming_soon' as const,
        estimatedTime: '16-20 semanas',
    },
    {
        id: 'geometry',
        title: 'Geometría Inmersiva',
        description:
            'Construye y manipula figuras geométricas en espacios 2D y 3D para comprender propiedades y teoremas.',
        progress: 0,
        totalModules: 12,
        completedModules: 0,
        url: '/courses/geometry',
        status: 'coming_soon' as const,
        estimatedTime: '18-22 semanas',
    },
];

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Mi Dashboard de Aprendizaje
                    </h1>
                    <p className="text-gray-600">
                        Continúa tu viaje de aprendizaje matemático interactivo
                    </p>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>

                {/* Quick Stats */}
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Trophy className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">
                                    Conceptos Dominados
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    0
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Clock className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">
                                    Tiempo de Estudio
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    0h
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <BookOpen className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">
                                    Ejercicios Resueltos
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    0
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
