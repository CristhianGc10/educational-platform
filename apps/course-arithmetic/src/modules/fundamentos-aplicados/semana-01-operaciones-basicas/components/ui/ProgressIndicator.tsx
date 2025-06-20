// components/ui/ProgressIndicator.tsx
'use client';

import {
    Building,
    CheckCircle,
    Circle,
    Clock,
    Cog,
    Lightbulb,
    Lock,
    Target,
    Trophy,
    Users,
} from 'lucide-react';
import { PhaseAchievement, PhaseConfig } from '../../types/phases';

import React from 'react';
import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
    currentPhase: number;
    totalPhases: number;
    progress: number;
    phaseConfigs: PhaseConfig[];
    achievements: PhaseAchievement[];
    className?: string;
}

const phaseIcons = {
    1: Users,
    2: Cog,
    3: Building,
    4: Lightbulb,
};

const phaseColors = {
    completed: 'bg-green-500',
    current: 'bg-blue-500',
    locked: 'bg-gray-300',
    available: 'bg-yellow-500',
};

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
    currentPhase,
    totalPhases,
    progress,
    phaseConfigs,
    achievements,
    className = '',
}) => {
    const getPhaseStatus = (phaseOrder: number) => {
        if (phaseOrder < currentPhase) return 'completed';
        if (phaseOrder === currentPhase) return 'current';
        if (phaseOrder === currentPhase + 1) return 'available';
        return 'locked';
    };

    const getPhaseIcon = (phaseOrder: number, status: string) => {
        if (status === 'completed') return CheckCircle;
        if (status === 'locked') return Lock;
        return phaseIcons[phaseOrder as keyof typeof phaseIcons] || Circle;
    };

    const formatDuration = (minutes: number) => {
        if (minutes < 60) return `${minutes} min`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    return (
        <div className={`bg-white border-b border-gray-200 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {/* Overall Progress Bar */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Progreso General
                        </h2>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                                <Trophy className="h-4 w-4 text-yellow-500" />
                                <span>{achievements.length} logros</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Target className="h-4 w-4 text-blue-500" />
                                <span>{progress.toFixed(1)}% completado</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        />
                    </div>
                </div>

                {/* Phase Progress */}
                <div className="space-y-4">
                    <h3 className="text-base font-medium text-gray-900">
                        Fases del Laboratorio
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {phaseConfigs.map((config, index) => {
                            const phaseOrder = config.order;
                            const status = getPhaseStatus(phaseOrder);
                            const Icon = getPhaseIcon(phaseOrder, status);
                            const isActive = phaseOrder === currentPhase;

                            return (
                                <motion.div
                                    key={config.id}
                                    className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                                        isActive
                                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                                            : status === 'completed'
                                              ? 'border-green-500 bg-green-50'
                                              : status === 'available'
                                                ? 'border-yellow-500 bg-yellow-50'
                                                : 'border-gray-300 bg-gray-50'
                                    }`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    {/* Phase Header */}
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div
                                            className={`p-2 rounded-full ${
                                                isActive
                                                    ? 'bg-blue-500'
                                                    : status === 'completed'
                                                      ? 'bg-green-500'
                                                      : status === 'available'
                                                        ? 'bg-yellow-500'
                                                        : 'bg-gray-400'
                                            }`}
                                        >
                                            <Icon className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h4
                                                className={`font-semibold text-sm ${
                                                    isActive
                                                        ? 'text-blue-900'
                                                        : 'text-gray-900'
                                                }`}
                                            >
                                                Fase {phaseOrder}
                                            </h4>
                                            <p
                                                className={`text-xs ${
                                                    isActive
                                                        ? 'text-blue-700'
                                                        : 'text-gray-600'
                                                }`}
                                            >
                                                {config.title
                                                    .replace('Fase 1: ', '')
                                                    .replace('Fase 2: ', '')
                                                    .replace('Fase 3: ', '')
                                                    .replace('Fase 4: ', '')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Phase Details */}
                                    <div className="space-y-2">
                                        <p
                                            className={`text-xs ${
                                                isActive
                                                    ? 'text-blue-800'
                                                    : 'text-gray-700'
                                            }`}
                                        >
                                            {config.description}
                                        </p>

                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center space-x-1 text-gray-500">
                                                <Clock className="h-3 w-3" />
                                                <span>
                                                    {formatDuration(
                                                        config.duration
                                                    )}
                                                </span>
                                            </div>

                                            <div
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    status === 'completed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : status === 'current'
                                                          ? 'bg-blue-100 text-blue-800'
                                                          : status ===
                                                              'available'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {status === 'completed'
                                                    ? 'Completada'
                                                    : status === 'current'
                                                      ? 'En Progreso'
                                                      : status === 'available'
                                                        ? 'Disponible'
                                                        : 'Bloqueada'}
                                            </div>
                                        </div>

                                        {/* Objectives Progress */}
                                        {isActive && (
                                            <div className="mt-3 space-y-1">
                                                <div className="text-xs font-medium text-gray-700">
                                                    Objetivos:
                                                </div>
                                                {config.objectives
                                                    .slice(0, 2)
                                                    .map(
                                                        (
                                                            objective,
                                                            objIndex
                                                        ) => (
                                                            <div
                                                                key={objIndex}
                                                                className="flex items-center space-x-2 text-xs"
                                                            >
                                                                <div className="w-2 h-2 rounded-full bg-blue-300"></div>
                                                                <span className="text-gray-600 truncate">
                                                                    {objective}
                                                                </span>
                                                            </div>
                                                        )
                                                    )}
                                                {config.objectives.length >
                                                    2 && (
                                                    <div className="text-xs text-blue-600">
                                                        +
                                                        {config.objectives
                                                            .length - 2}{' '}
                                                        más...
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Active Phase Pulse */}
                                    {isActive && (
                                        <motion.div
                                            className="absolute inset-0 border-2 border-blue-400 rounded-lg"
                                            animate={{
                                                opacity: [0.5, 1, 0.5],
                                                scale: [1, 1.02, 1],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: 'easeInOut',
                                            }}
                                        />
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Achievements */}
                {achievements.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base font-medium text-gray-900">
                                Logros Recientes
                            </h3>
                            <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                                Ver todos
                            </button>
                        </div>

                        <div className="flex space-x-3 overflow-x-auto pb-2">
                            {achievements.slice(-5).map((achievement) => (
                                <motion.div
                                    key={achievement.id}
                                    className="flex-shrink-0 flex items-center space-x-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Trophy
                                        className={`h-4 w-4 ${
                                            achievement.rarity === 'legendary'
                                                ? 'text-purple-600'
                                                : achievement.rarity === 'rare'
                                                  ? 'text-orange-600'
                                                  : achievement.rarity ===
                                                      'uncommon'
                                                    ? 'text-blue-600'
                                                    : 'text-gray-600'
                                        }`}
                                    />
                                    <div>
                                        <div className="text-xs font-medium text-gray-900">
                                            {achievement.title}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            {achievement.points} pts
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgressIndicator;
