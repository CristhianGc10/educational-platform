// ============================================================================
// COMPONENTE PRINCIPAL DEL LABORATORIO DE SISTEMAS RELACIONALES
// ============================================================================

import {
    ACHIEVEMENTS_CONFIG,
    ALL_FAMILIES,
    AVAILABLE_BLOCKS,
    LAB_CONFIG,
} from '../config/lab-config';
import {
    Achievement,
    ConstructedAlgorithm,
    DiscoveredPattern,
    FamilyDataset,
    Hypothesis,
    LabSettings,
    LabState,
    PhaseState,
} from '../types/relationships';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Award,
    BarChart3,
    BookOpen,
    CheckCircle,
    Clock,
    Lightbulb,
    Pause,
    Play,
    RotateCcw,
    Settings,
    Target,
    Users,
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import AlgorithmBuilder from './tools/AlgorithmBuilder';
import Phase1Discovery from './phases/Phase1Discovery';

// Importaciones de tipos

// Importaciones de componentes

// Importaciones de configuración

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

interface SistemasRelacionalesLabProps {
    initialState?: Partial<LabState>;
    onStateChange?: (state: LabState) => void;
    onComplete?: (results: any) => void;
    settings?: Partial<LabSettings>;
    readOnly?: boolean;
    className?: string;
}

interface LabProgress {
    currentPhase: number;
    overallProgress: number;
    phaseProgress: number;
    timeSpent: number;
    achievementsUnlocked: number;
    totalScore: number;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const SistemasRelacionalesLab: React.FC<SistemasRelacionalesLabProps> = ({
    initialState,
    onStateChange,
    onComplete,
    settings = {},
    readOnly = false,
    className = '',
}) => {
    // ========================================================================
    // ESTADO DEL LABORATORIO
    // ========================================================================

    const [labState, setLabState] = useState<LabState>(() => {
        const defaultState: LabState = {
            id: `lab_${Date.now()}`,
            sessionId: `session_${Date.now()}`,
            startTime: new Date(),
            lastActiveTime: new Date(),
            currentPhase: 1,
            phases: [
                {
                    currentPhase: 1,
                    isActive: true,
                    progress: 0,
                    objectives: [
                        {
                            id: 'explore-families',
                            title: 'Explorar Familias',
                            description:
                                'Analiza al menos 3 familias diferentes',
                            type: 'discovery',
                            priority: 'high',
                            estimatedTime: 15,
                            isCompleted: false,
                            progress: 0,
                            successCriteria: [
                                'Seleccionar 3 familias',
                                'Analizar relaciones',
                                'Identificar patrones',
                            ],
                        },
                        {
                            id: 'discover-patterns',
                            title: 'Descubrir Patrones',
                            description:
                                'Encuentra al menos 2 patrones matemáticos',
                            type: 'discovery',
                            priority: 'high',
                            estimatedTime: 20,
                            isCompleted: false,
                            progress: 0,
                            successCriteria: [
                                'Identificar patrones',
                                'Validar descubrimientos',
                            ],
                        },
                    ],
                    completedObjectives: [],
                    artifacts: [],
                    timeSpent: 0,
                    interactions: [],
                    achievements: [],
                    reflections: [],
                },
            ],
            globalProgress: 0,
            totalTimeSpent: 0,
            selectedFamilies: [],
            discoveredPatterns: [],
            createdHypotheses: [],
            constructedAlgorithms: [],
            completedTests: [],
            achievements: [],
            totalScore: 0,
            skillLevels: [],
            masteryIndicators: [],
            settings: {
                difficulty: 'intermediate',
                showHints: true,
                autoSave: true,
                soundEnabled: true,
                animationsEnabled: true,
                language: 'es',
                theme: 'light',
                accessibility: {
                    highContrast: false,
                    largeText: false,
                    reducedMotion: false,
                    screenReaderMode: false,
                    keyboardNavigation: true,
                },
            },
            preferences: {
                favoritePatternTypes: [],
                preferredVisualizationTypes: [],
                notificationSettings: {
                    achievementUnlocked: true,
                    phaseCompleted: true,
                    hintAvailable: true,
                    errorOccurred: true,
                    sessionReminder: true,
                    progressMilestone: true,
                },
                privacySettings: {
                    shareProgress: true,
                    shareAchievements: true,
                    allowAnalytics: true,
                    saveLocalData: true,
                    shareWithInstructors: true,
                },
                exportFormats: ['json', 'pdf'],
            },
            statistics: {
                totalSessions: 1,
                totalTimeSpent: 0,
                averageSessionDuration: 0,
                patternsDiscovered: 0,
                hypothesesCreated: 0,
                algorithmsBuilt: 0,
                successfulTests: 0,
                failedTests: 0,
                hintsUsed: 0,
                errorsEncountered: 0,
                achievementsUnlocked: 0,
                favoriteActivity: '',
                strongestSkill: '',
                improvementAreas: [],
                progressTrend: 'stable',
                lastSessionQuality: 'good',
            },
        };

        return { ...defaultState, ...initialState };
    });

    // Estados adicionales
    const [isRunning, setIsRunning] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showAchievements, setShowAchievements] = useState(false);
    const [currentView, setCurrentView] = useState<
        'lab' | 'results' | 'analytics'
    >('lab');

    // ========================================================================
    // CÁLCULOS Y ESTADOS DERIVADOS
    // ========================================================================

    const progress = useMemo((): LabProgress => {
        const currentPhaseState = labState.phases[labState.currentPhase - 1];
        const totalObjectives = currentPhaseState?.objectives.length || 1;
        const completedObjectives =
            currentPhaseState?.completedObjectives.length || 0;

        return {
            currentPhase: labState.currentPhase,
            overallProgress: labState.globalProgress,
            phaseProgress: (completedObjectives / totalObjectives) * 100,
            timeSpent: labState.totalTimeSpent,
            achievementsUnlocked: labState.achievements.length,
            totalScore: labState.totalScore,
        };
    }, [labState]);

    // ========================================================================
    // FUNCIONES DE MANEJO DE ESTADO
    // ========================================================================

    /**
     * Actualizar estado del laboratorio
     */
    const updateLabState = useCallback(
        (updates: Partial<LabState> | ((prev: LabState) => LabState)) => {
            setLabState((prev) => {
                const newState =
                    typeof updates === 'function'
                        ? updates(prev)
                        : { ...prev, ...updates };
                newState.lastActiveTime = new Date();
                onStateChange?.(newState);
                return newState;
            });
        },
        [onStateChange]
    );

    /**
     * Avanzar a la siguiente fase
     */
    const nextPhase = useCallback(() => {
        if (labState.currentPhase < LAB_CONFIG.totalPhases) {
            updateLabState((prev) => ({
                ...prev,
                currentPhase: prev.currentPhase + 1,
                phases: prev.phases.map((phase, index) => ({
                    ...phase,
                    isActive: index === prev.currentPhase, // Next phase becomes active
                })),
            }));
        }
    }, [labState.currentPhase, updateLabState]);

    /**
     * Reiniciar laboratorio
     */
    const resetLab = useCallback(() => {
        if (
            confirm(
                '¿Estás seguro de que quieres reiniciar el laboratorio? Se perderá todo el progreso.'
            )
        ) {
            const resetState: LabState = {
                ...labState,
                currentPhase: 1,
                globalProgress: 0,
                totalTimeSpent: 0,
                selectedFamilies: [],
                discoveredPatterns: [],
                createdHypotheses: [],
                constructedAlgorithms: [],
                completedTests: [],
                totalScore: 0,
                startTime: new Date(),
                phases: labState.phases.map((phase, index) => ({
                    ...phase,
                    isActive: index === 0,
                    progress: 0,
                    completedObjectives: [],
                    artifacts: [],
                    timeSpent: 0,
                    objectives: phase.objectives.map((obj) => ({
                        ...obj,
                        isCompleted: false,
                        progress: 0,
                    })),
                })),
            };
            setLabState(resetState);
            setIsRunning(false);
        }
    }, [labState]);

    /**
     * Completar un objetivo
     */
    const completeObjective = useCallback(
        (objectiveId: string) => {
            updateLabState((prev) => {
                const currentPhaseIndex = prev.currentPhase - 1;
                const updatedPhases = [...prev.phases];
                const currentPhase = { ...updatedPhases[currentPhaseIndex] };

                // Marcar objetivo como completado
                currentPhase.objectives = currentPhase.objectives.map((obj) =>
                    obj.id === objectiveId
                        ? { ...obj, isCompleted: true, progress: 100 }
                        : obj
                );

                // Actualizar lista de objetivos completados
                if (!currentPhase.completedObjectives.includes(objectiveId)) {
                    currentPhase.completedObjectives = [
                        ...currentPhase.completedObjectives,
                        objectiveId,
                    ];
                }

                // Recalcular progreso de la fase
                const totalObjectives = currentPhase.objectives.length;
                const completed = currentPhase.completedObjectives.length;
                currentPhase.progress = (completed / totalObjectives) * 100;

                updatedPhases[currentPhaseIndex] = currentPhase;

                // Verificar si se pueden desbloquear logros
                const newAchievements = checkForNewAchievements(prev);

                return {
                    ...prev,
                    phases: updatedPhases,
                    globalProgress: calculateGlobalProgress(updatedPhases),
                    achievements: [...prev.achievements, ...newAchievements],
                };
            });
        },
        [updateLabState]
    );

    // ========================================================================
    // FUNCIONES DE MANEJO DE DATOS
    // ========================================================================

    /**
     * Agregar familia seleccionada
     */
    const addSelectedFamily = useCallback(
        (family: FamilyDataset) => {
            updateLabState((prev) => {
                if (prev.selectedFamilies.find((f) => f.id === family.id)) {
                    return prev; // Ya está seleccionada
                }

                return {
                    ...prev,
                    selectedFamilies: [...prev.selectedFamilies, family],
                };
            });
        },
        [updateLabState]
    );

    /**
     * Agregar patrón descubierto
     */
    const addDiscoveredPattern = useCallback(
        (pattern: DiscoveredPattern) => {
            updateLabState((prev) => ({
                ...prev,
                discoveredPatterns: [...prev.discoveredPatterns, pattern],
                totalScore: prev.totalScore + 100, // Puntos por descubrir patrón
            }));
        },
        [updateLabState]
    );

    /**
     * Agregar hipótesis creada
     */
    const addCreatedHypothesis = useCallback(
        (hypothesis: Hypothesis) => {
            updateLabState((prev) => ({
                ...prev,
                createdHypotheses: [...prev.createdHypotheses, hypothesis],
                totalScore: prev.totalScore + 150, // Puntos por crear hipótesis
            }));
        },
        [updateLabState]
    );

    /**
     * Agregar algoritmo construido
     */
    const addConstructedAlgorithm = useCallback(
        (algorithm: ConstructedAlgorithm) => {
            updateLabState((prev) => ({
                ...prev,
                constructedAlgorithms: [
                    ...prev.constructedAlgorithms,
                    algorithm,
                ],
                totalScore: prev.totalScore + 200, // Puntos por construir algoritmo
            }));
        },
        [updateLabState]
    );

    // ========================================================================
    // FUNCIONES AUXILIARES
    // ========================================================================

    /**
     * Verificar nuevos logros
     */
    const checkForNewAchievements = useCallback(
        (state: LabState): Achievement[] => {
            const newAchievements: Achievement[] = [];
            const unlockedIds = new Set(state.achievements.map((a) => a.id));

            ACHIEVEMENTS_CONFIG.forEach((achievement) => {
                if (unlockedIds.has(achievement.id)) return;

                let shouldUnlock = false;

                // Verificar criterios según el tipo de logro
                if (
                    achievement.criteria.patternsDiscovered &&
                    state.discoveredPatterns.length >=
                        achievement.criteria.patternsDiscovered
                ) {
                    shouldUnlock = true;
                }

                if (
                    achievement.criteria.familiesExplored === 'all' &&
                    state.selectedFamilies.length >= ALL_FAMILIES.length
                ) {
                    shouldUnlock = true;
                }

                if (
                    achievement.criteria.algorithmsBuilt &&
                    state.constructedAlgorithms.length >=
                        achievement.criteria.algorithmsBuilt
                ) {
                    shouldUnlock = true;
                }

                if (shouldUnlock) {
                    newAchievements.push({
                        ...achievement,
                        unlockedAt: new Date(),
                    });
                }
            });

            return newAchievements;
        },
        []
    );

    /**
     * Calcular progreso global
     */
    const calculateGlobalProgress = useCallback(
        (phases: PhaseState[]): number => {
            const totalProgress = phases.reduce(
                (sum, phase) => sum + phase.progress,
                0
            );
            return totalProgress / phases.length;
        },
        []
    );

    // ========================================================================
    // EFECTOS
    // ========================================================================

    // Contador de tiempo cuando está activo
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning) {
            interval = setInterval(() => {
                updateLabState((prev) => ({
                    ...prev,
                    totalTimeSpent: prev.totalTimeSpent + 1,
                    phases: prev.phases.map((phase, index) =>
                        index === prev.currentPhase - 1
                            ? { ...phase, timeSpent: phase.timeSpent + 1 }
                            : phase
                    ),
                }));
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, updateLabState]);

    // Auto-guardado
    useEffect(() => {
        if (labState.settings.autoSave) {
            const saveInterval = setInterval(() => {
                localStorage.setItem('lab_state', JSON.stringify(labState));
            }, 30000); // Guardar cada 30 segundos

            return () => clearInterval(saveInterval);
        }
    }, [labState]);

    // ========================================================================
    // HANDLERS DE EVENTOS
    // ========================================================================

    const handleStartPause = useCallback(() => {
        setIsRunning((prev) => !prev);
    }, []);

    const handlePhaseComplete = useCallback(() => {
        const currentPhaseState = labState.phases[labState.currentPhase - 1];
        const allObjectivesCompleted = currentPhaseState.objectives.every(
            (obj) => obj.isCompleted
        );

        if (allObjectivesCompleted) {
            if (labState.currentPhase < LAB_CONFIG.totalPhases) {
                nextPhase();
            } else {
                // Laboratorio completado
                onComplete?.(labState);
                setCurrentView('results');
            }
        }
    }, [labState, nextPhase, onComplete]);

    // ========================================================================
    // RENDER DE COMPONENTES POR FASE
    // ========================================================================

    const renderCurrentPhase = () => {
        const currentPhaseState = labState.phases[labState.currentPhase - 1];

        switch (labState.currentPhase) {
            case 1:
                return (
                    <Phase1Discovery
                        families={ALL_FAMILIES}
                        onFamilySelect={addSelectedFamily}
                        onPatternDiscovered={addDiscoveredPattern}
                        onHypothesisCreated={addCreatedHypothesis}
                        selectedFamilies={labState.selectedFamilies}
                        discoveredPatterns={labState.discoveredPatterns}
                        createdHypotheses={labState.createdHypotheses}
                        config={{
                            id: 'phase-1',
                            name: 'Descubrimiento',
                            description:
                                'Fase de exploración y descubrimiento de patrones',
                            objectives: currentPhaseState.objectives,
                            estimatedDuration: 30,
                            difficulty: 'intermediate',
                            prerequisites: [],
                            resources: [],
                            assessmentCriteria: [],
                            hints: [],
                            supportMaterials: [],
                            familiesRequired: 3,
                            patternsRequired: 2,
                            explorationDepth: 'moderate',
                            guidanceLevel: 'medium',
                            visualizationTypes: ['2d', '3d', 'graph'],
                        }}
                        state={currentPhaseState}
                        onStateUpdate={(updates) => {
                            updateLabState((prev) => {
                                const newPhases = [...prev.phases];
                                newPhases[prev.currentPhase - 1] = {
                                    ...newPhases[prev.currentPhase - 1],
                                    ...updates,
                                };
                                return { ...prev, phases: newPhases };
                            });
                        }}
                        hints={[]}
                        showHints={labState.settings.showHints}
                        interactive={!readOnly}
                        viewMode="3d"
                        onViewModeChange={(mode) =>
                            console.log('View mode changed:', mode)
                        }
                    />
                );

            case 2:
                return (
                    <AlgorithmBuilder
                        availableBlocks={AVAILABLE_BLOCKS}
                        onAlgorithmChange={addConstructedAlgorithm}
                        onExecute={async (algorithm) => {
                            console.log('Ejecutando algoritmo:', algorithm);
                            return {
                                success: true,
                                result: 'Algoritmo ejecutado correctamente',
                            };
                        }}
                        onSave={(algorithm) => {
                            console.log('Guardando algoritmo:', algorithm);
                        }}
                        readOnly={readOnly}
                        showGrid={true}
                        enableZoom={true}
                        enableValidation={true}
                    />
                );

            default:
                return (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-gray-500">
                            Fase {labState.currentPhase} en desarrollo...
                        </p>
                    </div>
                );
        }
    };

    // ========================================================================
    // RENDER PRINCIPAL
    // ========================================================================

    return (
        <div className={`h-full flex flex-col bg-gray-50 ${className}`}>
            {/* Header del laboratorio */}
            <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {LAB_CONFIG.name}
                        </h1>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>
                                Fase {progress.currentPhase} de{' '}
                                {LAB_CONFIG.totalPhases}
                            </span>
                            <span>•</span>
                            <span>
                                {Math.round(progress.phaseProgress)}% completado
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Información de progreso */}
                        <div className="flex items-center space-x-6 text-sm">
                            <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span>
                                    {Math.floor(progress.timeSpent / 60)}:
                                    {(progress.timeSpent % 60)
                                        .toString()
                                        .padStart(2, '0')}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Award className="h-4 w-4 text-yellow-500" />
                                <span>{progress.achievementsUnlocked}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Target className="h-4 w-4 text-blue-500" />
                                <span>{progress.totalScore} pts</span>
                            </div>
                        </div>

                        {/* Controles */}
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleStartPause}
                                disabled={readOnly}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                            >
                                {isRunning ? (
                                    <Pause className="h-4 w-4" />
                                ) : (
                                    <Play className="h-4 w-4" />
                                )}
                                <span>
                                    {isRunning ? 'Pausar' : 'Continuar'}
                                </span>
                            </button>

                            <button
                                onClick={resetLab}
                                disabled={readOnly}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Reiniciar laboratorio"
                            >
                                <RotateCcw className="h-4 w-4" />
                            </button>

                            <button
                                onClick={() => setShowSettings(true)}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Configuración"
                            >
                                <Settings className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Barra de progreso */}
                <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Progreso de la fase</span>
                        <span>{Math.round(progress.phaseProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                            className="bg-blue-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress.phaseProgress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>
            </header>

            {/* Contenido principal */}
            <main className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={labState.currentPhase}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                    >
                        {renderCurrentPhase()}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Footer con botones de navegación */}
            <footer className="bg-white border-t border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setShowAchievements(true)}
                            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <Award className="h-4 w-4" />
                            <span>
                                Logros ({progress.achievementsUnlocked})
                            </span>
                        </button>
                    </div>

                    <div className="flex items-center space-x-2">
                        {labState.currentPhase > 1 && (
                            <button
                                onClick={() =>
                                    updateLabState((prev) => ({
                                        ...prev,
                                        currentPhase: prev.currentPhase - 1,
                                    }))
                                }
                                disabled={readOnly}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Fase Anterior
                            </button>
                        )}

                        <button
                            onClick={handlePhaseComplete}
                            disabled={progress.phaseProgress < 100 || readOnly}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                        >
                            <CheckCircle className="h-4 w-4" />
                            <span>
                                {labState.currentPhase < LAB_CONFIG.totalPhases
                                    ? 'Siguiente Fase'
                                    : 'Finalizar'}
                            </span>
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default SistemasRelacionalesLab;
