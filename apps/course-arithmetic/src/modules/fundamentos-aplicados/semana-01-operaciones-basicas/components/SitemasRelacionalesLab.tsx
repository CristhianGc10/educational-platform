// components/SistemasRelacionalesLab.tsx
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
    BookOpen,
    Clock,
    Lightbulb,
    Pause,
    Play,
    RotateCcw,
    Settings,
    Target,
    Trophy,
    Users,
} from 'lucide-react';
import { LAB_CONFIG, PHASE_CONFIGS } from '../config/lab-config';
import { LabState, PhaseResults } from '../types/phases';
import React, { useCallback, useEffect, useState } from 'react';

import AchievementCelebration from './ui/AchievementCelebration';
import Phase1Discovery from './phases/Phase1Discovery';
import PhaseTransition from './ui/PhaseTransition';
import ProgressIndicator from './ui/ProgressIndicator';
import { useAnalytics } from '../hooks/useAnalytics';
import { useProgressTracking } from '../hooks/useProgressTracking';

// Import phase components (will create these next)

// Import UI components (will create these next)

interface SistemasRelacionalesLabProps {
    weekId: string;
    exerciseId: string;
    userId: string;
    onComplete?: (results: PhaseResults) => void;
    className?: string;
}

const SistemasRelacionalesLab: React.FC<SistemasRelacionalesLabProps> = ({
    weekId,
    exerciseId,
    userId,
    onComplete,
    className = '',
}) => {
    // Hooks
    const progressTracking = useProgressTracking();
    const analytics = useAnalytics();

    // Local state
    const [isLabActive, setIsLabActive] = useState(false);
    const [currentPhase, setCurrentPhase] = useState(1);
    const [showSettings, setShowSettings] = useState(false);
    const [showAchievements, setShowAchievements] = useState(false);
    const [newAchievement, setNewAchievement] = useState<string | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Initialize lab when component mounts
    useEffect(() => {
        progressTracking.initializeProgress(userId, LAB_CONFIG.id);
        analytics.startSession(userId, LAB_CONFIG.id);

        return () => {
            analytics.endSession();
        };
    }, [userId, progressTracking, analytics]);

    // Track current phase changes
    useEffect(() => {
        setCurrentPhase(progressTracking.currentPhase);
    }, [progressTracking.currentPhase]);

    // Handle lab start/pause
    const handleLabToggle = useCallback(() => {
        if (!isLabActive) {
            setIsLabActive(true);
            analytics.trackEvent({
                userId,
                labId: LAB_CONFIG.id,
                type: 'interaction',
                category: 'lab_control',
                action: 'start',
                properties: { phase: currentPhase },
            });

            // Start current phase
            const phaseConfig = PHASE_CONFIGS.find(
                (p) => p.order === currentPhase
            );
            if (phaseConfig) {
                progressTracking.startPhase(phaseConfig.id);
            }
        } else {
            setIsLabActive(false);
            analytics.trackEvent({
                userId,
                labId: LAB_CONFIG.id,
                type: 'interaction',
                category: 'lab_control',
                action: 'pause',
                properties: { phase: currentPhase },
            });
        }
    }, [isLabActive, currentPhase, analytics, userId, progressTracking]);

    // Handle phase completion
    const handlePhaseComplete = useCallback(
        async (phaseId: string, results: PhaseResults) => {
            try {
                setIsTransitioning(true);

                // Complete phase in progress tracking
                await progressTracking.completePhase(phaseId, results);

                // Track completion in analytics
                analytics.trackEvent({
                    userId,
                    labId: LAB_CONFIG.id,
                    type: 'achievement',
                    category: 'phase_completion',
                    action: 'complete',
                    label: phaseId,
                    value: results.score,
                    properties: {
                        timeSpent: results.timeSpent,
                        conceptsMastered: results.conceptsMastered.length,
                        score: results.score,
                    },
                });

                // Check if this was the final phase
                const phaseConfig = PHASE_CONFIGS.find((p) => p.id === phaseId);
                const isLastPhase = phaseConfig?.order === PHASE_CONFIGS.length;

                if (isLastPhase) {
                    // Lab completed
                    setIsLabActive(false);
                    onComplete?.(results);

                    analytics.trackEvent({
                        userId,
                        labId: LAB_CONFIG.id,
                        type: 'achievement',
                        category: 'lab_completion',
                        action: 'complete',
                        properties: {
                            totalScore: progressTracking.getTotalProgress(),
                            totalTime:
                                progressTracking.analytics.totalTimeSpent,
                            achievements: progressTracking.achievements.length,
                        },
                    });
                } else {
                    // Move to next phase
                    setTimeout(() => {
                        setCurrentPhase((prev) => prev + 1);
                        setIsTransitioning(false);
                    }, 2000);
                }
            } catch (error) {
                console.error('Error completing phase:', error);
                analytics.trackError(error as Error, { phaseId, userId });
                setIsTransitioning(false);
            }
        },
        [progressTracking, analytics, userId, onComplete]
    );

    // Handle achievement unlock
    const handleAchievementUnlock = useCallback(
        (achievementId: string) => {
            setNewAchievement(achievementId);

            analytics.trackAchievement(achievementId, {
                phase: currentPhase,
                timestamp: Date.now(),
            });

            // Auto-hide achievement after 3 seconds
            setTimeout(() => {
                setNewAchievement(null);
            }, 3000);
        },
        [analytics, currentPhase]
    );

    // Reset lab
    const handleReset = useCallback(() => {
        progressTracking.resetProgress();
        setIsLabActive(false);
        setCurrentPhase(1);

        analytics.trackEvent({
            userId,
            labId: LAB_CONFIG.id,
            type: 'interaction',
            category: 'lab_control',
            action: 'reset',
            properties: {},
        });
    }, [progressTracking, analytics, userId]);

    // Get current phase config
    const currentPhaseConfig = PHASE_CONFIGS.find(
        (p) => p.order === currentPhase
    );

    // Calculate progress
    const totalProgress = progressTracking.getTotalProgress();
    const estimatedTimeRemaining = progressTracking.getEstimatedTimeRemaining();

    return (
        <div
            className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${className}`}
        >
            {/* Header */}
            <header className="bg-white shadow-lg border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Lab Title */}
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    {LAB_CONFIG.title}
                                </h1>
                                <p className="text-sm text-gray-500">
                                    {LAB_CONFIG.description}
                                </p>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center space-x-4">
                            {/* Progress */}
                            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                                <Clock className="h-4 w-4" />
                                <span>
                                    {Math.round(estimatedTimeRemaining)} min
                                    restantes
                                </span>
                            </div>

                            {/* Lab Controls */}
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={handleLabToggle}
                                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                                        isLabActive
                                            ? 'bg-orange-600 hover:bg-orange-700'
                                            : 'bg-green-600 hover:bg-green-700'
                                    } transition-colors`}
                                    disabled={isTransitioning}
                                >
                                    {isLabActive ? (
                                        <>
                                            <Pause className="h-4 w-4 mr-2" />
                                            Pausar
                                        </>
                                    ) : (
                                        <>
                                            <Play className="h-4 w-4 mr-2" />
                                            {totalProgress > 0
                                                ? 'Continuar'
                                                : 'Comenzar'}
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={handleReset}
                                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                    title="Reiniciar laboratorio"
                                >
                                    <RotateCcw className="h-5 w-5" />
                                </button>

                                <button
                                    onClick={() => setShowSettings(true)}
                                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                    title="Configuración"
                                >
                                    <Settings className="h-5 w-5" />
                                </button>

                                <button
                                    onClick={() => setShowAchievements(true)}
                                    className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                    title="Logros"
                                >
                                    <Trophy className="h-5 w-5" />
                                    {progressTracking.achievements.length >
                                        0 && (
                                        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {
                                                progressTracking.achievements
                                                    .length
                                            }
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Progress Bar */}
            <ProgressIndicator
                currentPhase={currentPhase}
                totalPhases={PHASE_CONFIGS.length}
                progress={totalProgress}
                phaseConfigs={PHASE_CONFIGS}
                achievements={progressTracking.achievements}
            />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <AnimatePresence mode="wait">
                    {isTransitioning ? (
                        <PhaseTransition
                            key="transition"
                            fromPhase={currentPhase - 1}
                            toPhase={currentPhase}
                            onComplete={() => setIsTransitioning(false)}
                        />
                    ) : (
                        <motion.div
                            key={`phase-${currentPhase}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full"
                        >
                            {/* Phase Content */}
                            {currentPhase === 1 && (
                                <Phase1Discovery
                                    isActive={isLabActive}
                                    onComplete={(results) =>
                                        handlePhaseComplete(
                                            'phase-1-discovery',
                                            results
                                        )
                                    }
                                    onAchievementUnlock={
                                        handleAchievementUnlock
                                    }
                                    userId={userId}
                                />
                            )}

                            {currentPhase === 2 && (
                                <div className="text-center py-12">
                                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <Lightbulb className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                                        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                                            Fase 2: Construcción de Algoritmos
                                        </h3>
                                        <p className="text-yellow-700">
                                            Esta fase estará disponible
                                            próximamente. Aquí construirás
                                            algoritmos para automatizar el
                                            descubrimiento de patrones.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {currentPhase === 3 && (
                                <div className="text-center py-12">
                                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                                        <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                                        <h3 className="text-lg font-semibold text-purple-800 mb-2">
                                            Fase 3: Aplicación Empresarial
                                        </h3>
                                        <p className="text-purple-700">
                                            Esta fase estará disponible
                                            próximamente. Aquí aplicarás
                                            conceptos a escenarios empresariales
                                            reales.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {currentPhase === 4 && (
                                <div className="text-center py-12">
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                        <h3 className="text-lg font-semibold text-green-800 mb-2">
                                            Fase 4: Innovación
                                        </h3>
                                        <p className="text-green-700">
                                            Esta fase estará disponible
                                            próximamente. Aquí desarrollarás
                                            soluciones innovadoras y presentarás
                                            ideas originales.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Achievement Celebration */}
            <AnimatePresence>
                {newAchievement && (
                    <AchievementCelebration
                        achievementId={newAchievement}
                        onClose={() => setNewAchievement(null)}
                    />
                )}
            </AnimatePresence>

            {/* Debug Info (only in development) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg text-xs max-w-sm">
                    <h4 className="font-semibold mb-2">Debug Info</h4>
                    <div className="space-y-1">
                        <div>Fase actual: {currentPhase}</div>
                        <div>Progreso: {totalProgress.toFixed(1)}%</div>
                        <div>
                            Laboratorio activo: {isLabActive ? 'Sí' : 'No'}
                        </div>
                        <div>
                            Logros: {progressTracking.achievements.length}
                        </div>
                        <div>Tiempo estimado: {estimatedTimeRemaining} min</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SistemasRelacionalesLab;
