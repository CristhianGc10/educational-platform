// components/phases/Phase1Discovery.tsx
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
    Box,
    ChevronLeft,
    ChevronRight,
    Clock,
    Eye,
    Grid3X3,
    Lightbulb,
    Pause,
    Play,
    RotateCcw,
    Settings,
    Sparkles,
    Target,
    Trophy,
    Users,
} from 'lucide-react';
import {
    DiscoveredPattern,
    Family,
    HypothesisResult,
    StudentHypothesis,
} from '../../types/relationships';
import React, { Suspense, useCallback, useEffect, useState } from 'react';

import { DIFFICULTY_SETTINGS } from '../../config/lab-config';
import FamilyScene3D from '../3d/FamilyScene3D';
import { PhaseResults } from '../../types/phases';
import RelationshipNetworkVisualizer from '../tools/RelationshipNetworkVisualizer';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useRelationshipSolver } from '../../hooks/useRelationshipSolver';

// Import tools (will create these next)



interface Phase1DiscoveryProps {
    isActive: boolean;
    onComplete: (results: PhaseResults) => void;
    onAchievementUnlock: (achievementId: string) => void;
    userId: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    className?: string;
}

const Phase1Discovery: React.FC<Phase1DiscoveryProps> = ({
    isActive,
    onComplete,
    onAchievementUnlock,
    userId,
    difficulty = 'intermediate',
    className = '',
}) => {
    // Hooks
    const solver = useRelationshipSolver();
    const analytics = useAnalytics();

    // Local state
    const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
    const [showPatterns, setShowPatterns] = useState(true);
    const [showHypothesisModal, setShowHypothesisModal] = useState(false);
    const [currentHypothesis, setCurrentHypothesis] = useState('');
    const [sessionStartTime] = useState(Date.now());
    const [timeSpent, setTimeSpent] = useState(0);
    const [showInsights, setShowInsights] = useState(false);

    const difficultyConfig = DIFFICULTY_SETTINGS[difficulty];
    const currentFamily = solver.families[solver.currentFamilyIndex];

    // Timer for session tracking
    useEffect(() => {
        if (!isActive) return;

        const timer = setInterval(() => {
            setTimeSpent(Date.now() - sessionStartTime);
        }, 1000);

        return () => clearInterval(timer);
    }, [isActive, sessionStartTime]);

    // Track analytics
    useEffect(() => {
        if (isActive) {
            analytics.trackPageView('phase-1-discovery', {
                familyId: currentFamily?.id,
                viewMode,
                difficulty,
            });
        }
    }, [isActive, analytics, currentFamily?.id, viewMode, difficulty]);

    // Auto-save progress and check completion
    useEffect(() => {
        if (isActive) {
            checkPhaseCompletion();
        }
    }, [
        solver.discoveredPatterns,
        solver.explorationState.completedTests,
        isActive,
    ]);

    // Handle family navigation
    const handleFamilyChange = useCallback(
        (direction: 'next' | 'prev') => {
            const currentIndex = solver.currentFamilyIndex;
            const maxIndex = solver.families.length - 1;

            let newIndex;
            if (direction === 'next') {
                newIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
            } else {
                newIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
            }

            solver.selectFamily(newIndex);

            analytics.trackInteraction('family_navigation', direction, {
                fromFamily: currentFamily?.id,
                toFamily: solver.families[newIndex]?.id,
                familyIndex: newIndex,
            });
        },
        [solver, currentFamily, analytics]
    );

    // Handle member selection
    const handleMemberSelect = useCallback(
        (memberId: string) => {
            solver.selectMember(memberId);

            analytics.trackInteraction('member_select', 'click', {
                memberId,
                familyId: currentFamily?.id,
                selectionCount: solver.selectedMembers.length,
            });
        },
        [solver, currentFamily, analytics]
    );

    // Handle pattern discovery
    const handlePatternDiscovery = useCallback(
        (pattern: DiscoveredPattern) => {
            // Check for achievements
            if (solver.discoveredPatterns.length === 0) {
                onAchievementUnlock('pattern-seeker');
            }

            if (solver.discoveredPatterns.length >= 3) {
                onAchievementUnlock('explorer');
            }

            analytics.trackEvent({
                userId,
                labId: 'phase-1-discovery',
                type: 'achievement',
                category: 'pattern_discovery',
                action: 'discover',
                label: pattern.type,
                value: pattern.confidence,
                properties: {
                    patternId: pattern.id,
                    familyId: currentFamily?.id,
                    totalPatterns: solver.discoveredPatterns.length + 1,
                },
            });
        },
        [
            solver.discoveredPatterns.length,
            onAchievementUnlock,
            analytics,
            userId,
            currentFamily,
        ]
    );

    // Create hypothesis
    const handleCreateHypothesis = useCallback(() => {
        if (!currentHypothesis.trim()) return;

        const hypothesis: Omit<StudentHypothesis, 'id' | 'timestamp'> = {
            description: currentHypothesis,
            confidence: 0.7,
            variables: solver.selectedMembers,
            expectedOutcome: 'Pattern will be validated',
            testable: true,
        };

        solver.createHypothesis(hypothesis);
        setCurrentHypothesis('');
        setShowHypothesisModal(false);

        analytics.trackInteraction('hypothesis_create', 'submit', {
            description: currentHypothesis,
            familyId: currentFamily?.id,
            selectedMembers: solver.selectedMembers.length,
        });
    }, [currentHypothesis, solver, currentFamily, analytics]);

    // Test hypothesis
    const handleTestHypothesis = useCallback(
        async (hypothesisId: string) => {
            try {
                const result = await solver.testHypothesis(hypothesisId);

                if (result.passed && result.accuracy === 100) {
                    onAchievementUnlock('hypothesis-master');
                }

                analytics.trackEvent({
                    userId,
                    labId: 'phase-1-discovery',
                    type: 'achievement',
                    category: 'hypothesis_testing',
                    action: 'test',
                    value: result.accuracy,
                    properties: {
                        hypothesisId,
                        passed: result.passed,
                        accuracy: result.accuracy,
                        familyId: currentFamily?.id,
                    },
                });
            } catch (error) {
                analytics.trackError(error as Error, {
                    context: 'hypothesis_testing',
                    hypothesisId,
                    familyId: currentFamily?.id,
                });
            }
        },
        [solver, onAchievementUnlock, analytics, userId, currentFamily]
    );

    // Check phase completion
    const checkPhaseCompletion = useCallback(() => {
        const {
            familiesRequired,
            patternsRequired,
            hypothesesRequired,
            accuracyThreshold,
        } = difficultyConfig;

        const familiesExplored = new Set(
            solver.explorationState.interactions
                .filter((i) => i.type === 'family_select')
                .map((i) => i.data.familyId)
        ).size;

        const patternsDiscovered = solver.discoveredPatterns.length;
        const hypothesesTested = solver.explorationState.completedTests.length;
        const avgAccuracy =
            hypothesesTested > 0
                ? solver.explorationState.completedTests.reduce(
                      (sum, test) => sum + test.accuracy,
                      0
                  ) / hypothesesTested
                : 0;

        const phaseTimeMinutes = timeSpent / (1000 * 60);

        // Check if all requirements are met
        const isComplete =
            familiesExplored >= familiesRequired &&
            patternsDiscovered >= patternsRequired &&
            hypothesesTested >= hypothesesRequired &&
            avgAccuracy >= accuracyThreshold;

        if (isComplete) {
            // Check for speed achievement
            if (phaseTimeMinutes < difficultyConfig.timeLimit) {
                onAchievementUnlock('speed-demon');
            }

            // Calculate final score
            const explorationScore = Math.min(
                100,
                (familiesExplored / familiesRequired) * 100
            );
            const patternScore = Math.min(
                100,
                (patternsDiscovered / patternsRequired) * 100
            );
            const hypothesisScore = Math.min(100, avgAccuracy);
            const timeBonus =
                phaseTimeMinutes < difficultyConfig.timeLimit ? 10 : 0;

            const finalScore = Math.round(
                explorationScore * 0.3 +
                    patternScore * 0.4 +
                    hypothesisScore * 0.3 +
                    timeBonus
            );

            const results: PhaseResults = {
                phaseId: 'phase-1-discovery',
                userId,
                score: finalScore,
                timeSpent: Math.round(phaseTimeMinutes),
                conceptsMastered: [
                    'pattern-recognition',
                    'hypothesis-testing',
                    'data-exploration',
                    'mathematical-reasoning',
                ],
                difficultiesEncountered: [],
                strategiesUsed: [
                    viewMode === '3d' ? '3d-visualization' : '2d-analysis',
                    'systematic-exploration',
                    'hypothesis-driven-investigation',
                ],
                feedback: `Excelente trabajo explorando ${familiesExplored} familias y descubriendo ${patternsDiscovered} patrones únicos.`,
                recommendations: [
                    'Continúa aplicando el pensamiento sistemático',
                    'Practica la formulación de hipótesis precisas',
                ],
                nextSteps: [
                    'Avanza a la construcción de algoritmos',
                    'Aplica los patrones descubiertos a nuevos contextos',
                ],
            };

            onComplete(results);
        }
    }, [
        difficultyConfig,
        solver.explorationState,
        solver.discoveredPatterns.length,
        timeSpent,
        onAchievementUnlock,
        onComplete,
        userId,
        viewMode,
    ]);

    // Calculate progress
    const getProgress = () => {
        const { familiesRequired, patternsRequired, hypothesesRequired } =
            difficultyConfig;

        const familiesExplored = new Set(
            solver.explorationState.interactions
                .filter((i) => i.type === 'family_select')
                .map((i) => i.data.familyId)
        ).size;

        return {
            families: Math.min(
                100,
                (familiesExplored / familiesRequired) * 100
            ),
            patterns: Math.min(
                100,
                (solver.discoveredPatterns.length / patternsRequired) * 100
            ),
            hypotheses: Math.min(
                100,
                (solver.explorationState.completedTests.length /
                    hypothesesRequired) *
                    100
            ),
        };
    };

    const progress = getProgress();

    if (!currentFamily) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando familias...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`max-w-7xl mx-auto space-y-6 ${className}`}>
            {/* Phase Header */}
            <motion.div
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Eye className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Fase 1: Descubrimiento de Patrones
                            </h2>
                            <p className="text-gray-600">
                                Explora las familias y descubre patrones
                                matemáticos únicos
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <div className="text-sm text-gray-500">
                                Tiempo transcurrido
                            </div>
                            <div className="text-lg font-semibold text-gray-900">
                                {Math.floor(timeSpent / 60000)}:
                                {String(
                                    Math.floor((timeSpent % 60000) / 1000)
                                ).padStart(2, '0')}
                            </div>
                        </div>

                        <button
                            onClick={() => setShowInsights(!showInsights)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Ver insights"
                        >
                            <Lightbulb className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Progress Indicators */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                        <div className="text-sm text-gray-600 mb-1">
                            Familias Exploradas
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                            <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${progress.families}%` }}
                            />
                        </div>
                        <div className="text-xs text-gray-500">
                            {progress.families.toFixed(0)}% completado
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="text-sm text-gray-600 mb-1">
                            Patrones Descubiertos
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                            <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${progress.patterns}%` }}
                            />
                        </div>
                        <div className="text-xs text-gray-500">
                            {solver.discoveredPatterns.length} de{' '}
                            {difficultyConfig.patternsRequired}
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="text-sm text-gray-600 mb-1">
                            Hipótesis Probadas
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                            <div
                                className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${progress.hypotheses}%` }}
                            />
                        </div>
                        <div className="text-xs text-gray-500">
                            {solver.explorationState.completedTests.length} de{' '}
                            {difficultyConfig.hypothesesRequired}
                        </div>
                    </div>
                </div>

                {/* Insights Panel */}
                <AnimatePresence>
                    {showInsights && (
                        <motion.div
                            className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <h4 className="font-semibold text-blue-900 mb-2">
                                Insights de Progreso
                            </h4>
                            <div className="space-y-1 text-sm text-blue-800">
                                {solver
                                    .generateInsights()
                                    .map((insight, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center space-x-2"
                                        >
                                            <Sparkles className="h-3 w-3 text-blue-500" />
                                            <span>{insight}</span>
                                        </div>
                                    ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Controls */}
            <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                    {/* Family Navigation */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => handleFamilyChange('prev')}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            disabled={!isActive}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        <div className="text-center">
                            <div className="text-sm text-gray-500">Familia</div>
                            <div className="font-semibold text-gray-900">
                                {solver.currentFamilyIndex + 1} de{' '}
                                {solver.families.length}
                            </div>
                            <div className="text-xs text-gray-600">
                                {currentFamily.name}
                            </div>
                        </div>

                        <button
                            onClick={() => handleFamilyChange('next')}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            disabled={!isActive}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>

                    {/* View Controls */}
                    <div className="flex items-center space-x-2">
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('2d')}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                    viewMode === '2d'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <Grid3X3 className="h-4 w-4 inline mr-1" />
                                2D
                            </button>
                            <button
                                onClick={() => setViewMode('3d')}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                    viewMode === '3d'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <Box className="h-4 w-4 inline mr-1" />
                                3D
                            </button>
                        </div>

                        <button
                            onClick={() => setShowPatterns(!showPatterns)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                showPatterns
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Patrones
                        </button>

                        <button
                            onClick={() => setShowHypothesisModal(true)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                            disabled={
                                !isActive || solver.selectedMembers.length === 0
                            }
                        >
                            <Target className="h-4 w-4 inline mr-1" />
                            Crear Hipótesis
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Visualization */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="h-96">
                    {viewMode === '2d' ? (
                        <RelationshipNetworkVisualizer
                            family={currentFamily}
                            selectedMembers={solver.selectedMembers}
                            onMemberSelect={handleMemberSelect}
                            onRelationshipHover={() => {}}
                            discoveredPatterns={solver.discoveredPatterns}
                            showPatterns={showPatterns}
                            view3D={false}
                        />
                    ) : (
                        <Suspense
                            fallback={
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                                        <p className="text-sm text-gray-600">
                                            Cargando vista 3D...
                                        </p>
                                    </div>
                                </div>
                            }
                        >
                            <FamilyScene3D
                                family={currentFamily}
                                selectedMembers={solver.selectedMembers}
                                onMemberSelect={handleMemberSelect}
                                cameraPosition={[0, 5, 10] as any}
                                showRelationships={showPatterns}
                                animateTransitions={true}
                            />
                        </Suspense>
                    )}
                </div>
            </div>

            {/* Side Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Discovered Patterns */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Eye className="h-5 w-5 mr-2 text-blue-500" />
                        Patrones Descubiertos (
                        {solver.discoveredPatterns.length})
                    </h3>

                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        {solver.discoveredPatterns.length === 0 ? (
                            <p className="text-gray-500 text-sm">
                                Selecciona miembros de la familia para descubrir
                                patrones matemáticos.
                            </p>
                        ) : (
                            solver.discoveredPatterns.map((pattern) => (
                                <div
                                    key={pattern.id}
                                    className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-blue-900">
                                            {pattern.type.replace(/_/g, ' ')}
                                        </span>
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                            {Math.round(
                                                pattern.confidence * 100
                                            )}
                                            %
                                        </span>
                                    </div>
                                    <p className="text-sm text-blue-800">
                                        {pattern.description}
                                    </p>
                                    {pattern.examples.length > 0 && (
                                        <div className="mt-2 text-xs text-blue-600">
                                            Ejemplo: {pattern.examples[0]}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Hypotheses */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Target className="h-5 w-5 mr-2 text-green-500" />
                        Hipótesis ({solver.hypotheses.length})
                    </h3>

                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        {solver.hypotheses.length === 0 ? (
                            <p className="text-gray-500 text-sm">
                                Crea hipótesis basadas en los patrones que
                                observes.
                            </p>
                        ) : (
                            solver.hypotheses.map((hypothesis) => {
                                const testResult =
                                    solver.explorationState.completedTests.find(
                                        (test) =>
                                            test.hypothesisId === hypothesis.id
                                    );

                                return (
                                    <div
                                        key={hypothesis.id}
                                        className="p-3 bg-gray-50 border border-gray-200 rounded-lg"
                                    >
                                        <p className="text-sm text-gray-900 mb-2">
                                            {hypothesis.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">
                                                Confianza:{' '}
                                                {Math.round(
                                                    hypothesis.confidence * 100
                                                )}
                                                %
                                            </span>
                                            {testResult ? (
                                                <span
                                                    className={`text-xs px-2 py-1 rounded ${
                                                        testResult.passed
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    {testResult.passed
                                                        ? '✓ Validada'
                                                        : '✗ Rechazada'}
                                                    {testResult.accuracy &&
                                                        ` (${testResult.accuracy}%)`}
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        handleTestHypothesis(
                                                            hypothesis.id
                                                        )
                                                    }
                                                    className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                                                    disabled={!isActive}
                                                >
                                                    Probar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Hypothesis Creation Modal */}
            <AnimatePresence>
                {showHypothesisModal && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Crear Nueva Hipótesis
                            </h3>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Describe tu hipótesis sobre los patrones que
                                    observas:
                                </label>
                                <textarea
                                    value={currentHypothesis}
                                    onChange={(e) =>
                                        setCurrentHypothesis(e.target.value)
                                    }
                                    className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                                    rows={4}
                                    placeholder="Ej: Las edades de los padres sumadas siempre es mayor que la suma de las edades de los hijos..."
                                />
                            </div>

                            <div className="flex items-center justify-end space-x-3">
                                <button
                                    onClick={() =>
                                        setShowHypothesisModal(false)
                                    }
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleCreateHypothesis}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                    disabled={!currentHypothesis.trim()}
                                >
                                    Crear Hipótesis
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Phase1Discovery;
