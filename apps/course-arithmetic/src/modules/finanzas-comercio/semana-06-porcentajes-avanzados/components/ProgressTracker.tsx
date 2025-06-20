// apps/course-arithmetic/src/modules/finanzas-comercio/semana-06-porcentajes-avanzados/components/ProgressTracker.tsx
'use client';

import { Clock, Target, TrendingUp, Trophy } from 'lucide-react';

import React from 'react';
import { motion } from 'framer-motion';

interface ProgressTrackerProps {
    completedExercises: number;
    totalExercises: number;
    timeSpent: number;
}

export default function ProgressTracker({
    completedExercises,
    totalExercises,
    timeSpent,
}: ProgressTrackerProps) {
    const progressPercentage = (completedExercises / totalExercises) * 100;

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                Tu Progreso esta Semana
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                        <Trophy className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                        {completedExercises}
                    </div>
                    <div className="text-sm text-gray-600">
                        Ejercicios Completados
                    </div>
                </div>

                <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                        <Target className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                        {progressPercentage.toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-600">Progreso Total</div>
                </div>

                <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                        <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                        {timeSpent}min
                    </div>
                    <div className="text-sm text-gray-600">
                        Tiempo de Estudio
                    </div>
                </div>
            </div>

            {/* Barra de progreso */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <motion.div
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                />
            </div>

            <div className="flex justify-between text-xs text-gray-600">
                <span>
                    {completedExercises} de {totalExercises} ejercicios
                </span>
                <span>{progressPercentage.toFixed(1)}% completado</span>
            </div>
        </div>
    );
}
