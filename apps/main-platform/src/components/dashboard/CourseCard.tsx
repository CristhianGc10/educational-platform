// apps/main-platform/src/components/dashboard/CourseCard.tsx
'use client';

import { ArrowRight, BookOpen, Clock, Trophy } from 'lucide-react';

import Link from 'next/link';

interface CourseCardProps {
    course: {
        id: string;
        title: string;
        description: string;
        progress: number;
        totalModules: number;
        completedModules: number;
        url: string;
        status: 'available' | 'coming_soon' | 'locked';
        estimatedTime: string;
    };
}

export function CourseCard({ course }: CourseCardProps) {
    const isAvailable = course.status === 'available';

    return (
        <div
            className={`
      relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:shadow-lg
      ${
          isAvailable
              ? 'border-indigo-200 bg-white hover:border-indigo-300'
              : 'border-gray-200 bg-gray-50'
      }
    `}
        >
            {/* Progress bar */}
            <div className="h-1 bg-gray-200">
                <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                />
            </div>

            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div
                            className={`
              p-2 rounded-lg 
              ${isAvailable ? 'bg-indigo-100' : 'bg-gray-200'}
            `}
                        >
                            <BookOpen
                                className={`
                h-6 w-6 
                ${isAvailable ? 'text-indigo-600' : 'text-gray-400'}
              `}
                            />
                        </div>

                        <div>
                            <h3
                                className={`
                font-semibold text-lg
                ${isAvailable ? 'text-gray-900' : 'text-gray-500'}
              `}
                            >
                                {course.title}
                            </h3>

                            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                <span className="flex items-center space-x-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{course.estimatedTime}</span>
                                </span>

                                <span className="flex items-center space-x-1">
                                    <Trophy className="h-4 w-4" />
                                    <span>
                                        {course.completedModules}/
                                        {course.totalModules} módulos
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {course.status === 'coming_soon' && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            Próximamente
                        </span>
                    )}
                </div>

                {/* Description */}
                <p
                    className={`
          text-sm mb-4 leading-relaxed
          ${isAvailable ? 'text-gray-600' : 'text-gray-400'}
        `}
                >
                    {course.description}
                </p>

                {/* Progress stats */}
                <div className="flex items-center justify-between mb-4">
                    <div className="text-sm">
                        <span className="text-gray-500">Progreso: </span>
                        <span className="font-medium text-gray-900">
                            {course.progress}%
                        </span>
                    </div>

                    {course.progress > 0 && (
                        <div className="text-xs text-gray-500">
                            Último acceso: hace 2 días
                        </div>
                    )}
                </div>

                {/* Action button */}
                {isAvailable ? (
                    <Link
                        href={`/courses/${course.id}`}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 px-4 rounded-lg font-medium transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 flex items-center justify-center space-x-2 group"
                    >
                        <span>
                            {course.progress === 0
                                ? 'Comenzar Curso'
                                : 'Continuar'}
                        </span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                ) : (
                    <button
                        disabled
                        className="w-full bg-gray-200 text-gray-500 py-2.5 px-4 rounded-lg font-medium cursor-not-allowed"
                    >
                        No Disponible
                    </button>
                )}
            </div>
        </div>
    );
}
