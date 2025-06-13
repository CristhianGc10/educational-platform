'use client';

import {
    Award,
    BookOpen,
    Calculator,
    ChevronRight,
    Clock,
    Target,
    TrendingUp,
    Zap,
} from 'lucide-react';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DashboardPage() {
    const courses = [
        {
            id: 'arithmetic',
            title: 'Aritmética Inmersiva',
            progress: 0,
            totalModules: 8,
            completedModules: 0,
            currentModule: 'Fundamentos Aplicados',
            nextLesson: 'Operaciones Básicas en Contexto',
            estimatedTime: '25 min',
            difficulty: 'Intermedio',
            color: 'from-orange-400 to-red-500',
            icon: Calculator,
            available: true,
        },
        {
            id: 'algebra',
            title: 'Álgebra Visual',
            progress: 0,
            totalModules: 10,
            completedModules: 0,
            currentModule: 'Próximamente',
            nextLesson: 'Coming Soon',
            estimatedTime: '30 min',
            difficulty: 'Avanzado',
            color: 'from-blue-400 to-purple-500',
            icon: TrendingUp,
            available: false,
        },
    ];

    const stats = [
        { label: 'Tiempo Total', value: '0h', icon: Clock },
        { label: 'Módulos Completados', value: '0', icon: BookOpen },
        { label: 'Logros Desbloqueados', value: '0', icon: Award },
        { label: 'Racha de Aprendizaje', value: '0 días', icon: Zap },
    ];

    const recentActivity = [
        {
            type: 'welcome',
            title: '¡Bienvenido a la Plataforma!',
            description:
                'Tu viaje de aprendizaje matemático inmersivo comienza aquí',
            time: 'Ahora',
            color: 'bg-green-500',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Panel de Control
                            </h1>
                            <p className="text-gray-600 mt-1">
                                ¡Bienvenido de vuelta! Continúa tu viaje de
                                aprendizaje.
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                        >
                            ← Volver al Inicio
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-50 rounded-lg mr-4">
                                    <stat.icon className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stat.value}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {stat.label}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Courses Section */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Mis Cursos
                            </h2>
                            <Link
                                href="/courses"
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Ver todos
                            </Link>
                        </div>

                        <div className="space-y-6">
                            {courses.map((course, index) => (
                                <motion.div
                                    key={course.id}
                                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.2 }}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center">
                                            <div
                                                className={`p-3 bg-gradient-to-r ${course.color} rounded-xl mr-4`}
                                            >
                                                <course.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                                    {course.title}
                                                </h3>
                                                <p className="text-gray-600">
                                                    {course.completedModules} de{' '}
                                                    {course.totalModules}{' '}
                                                    módulos completados
                                                </p>
                                            </div>
                                        </div>
                                        {course.available && (
                                            <span
                                                className={`px-3 py-1 bg-gradient-to-r ${course.color} text-white text-sm font-medium rounded-full`}
                                            >
                                                {course.difficulty}
                                            </span>
                                        )}
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                                            <span>Progreso</span>
                                            <span>{course.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 bg-gradient-to-r ${course.color} rounded-full transition-all duration-500`}
                                                style={{
                                                    width: `${course.progress}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">
                                                Siguiente lección:
                                            </p>
                                            <p className="font-medium text-gray-900">
                                                {course.nextLesson}
                                            </p>
                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                <Clock className="w-4 h-4 mr-1" />
                                                {course.estimatedTime}
                                            </div>
                                        </div>

                                        {course.available ? (
                                            <Link
                                                href={`http://localhost:3001`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${course.color} text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200`}
                                            >
                                                Continuar
                                                <ChevronRight className="ml-1 w-4 h-4" />
                                            </Link>
                                        ) : (
                                            <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-400 font-medium rounded-lg cursor-not-allowed">
                                                Próximamente
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Actividad Reciente
                            </h3>
                            <div className="space-y-4">
                                {recentActivity.map((activity, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start"
                                    >
                                        <div
                                            className={`w-2 h-2 ${activity.color} rounded-full mt-2 mr-3 flex-shrink-0`}
                                        ></div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 text-sm">
                                                {activity.title}
                                            </h4>
                                            <p className="text-gray-600 text-sm">
                                                {activity.description}
                                            </p>
                                            <p className="text-gray-400 text-xs mt-1">
                                                {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Acciones Rápidas
                            </h3>
                            <div className="space-y-3">
                                <Link
                                    href="/profile"
                                    className="w-full flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                >
                                    <Target className="w-5 h-5 mr-3" />
                                    Configurar Objetivos
                                </Link>
                                <Link
                                    href="/help"
                                    className="w-full flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                >
                                    <BookOpen className="w-5 h-5 mr-3" />
                                    Centro de Ayuda
                                </Link>
                            </div>
                        </div>

                        {/* Motivational Quote */}
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white">
                            <h3 className="font-semibold mb-2">
                                💡 Tip del día
                            </h3>
                            <p className="text-sm opacity-90">
                                "La matemática no es solo números, es el
                                lenguaje del universo. Cada concepto que dominas
                                te acerca más a entender el mundo que te rodea."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
