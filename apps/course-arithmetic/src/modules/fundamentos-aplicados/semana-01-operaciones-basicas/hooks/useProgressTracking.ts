// hooks/useProgressTracking.ts

import {
    ACHIEVEMENT_DEFINITIONS,
    PHASE_CONFIGS,
    SCORING_WEIGHTS,
} from '../config/lab-config';
import {
    LabAnalytics,
    LabState,
    PhaseAchievement,
    PhaseProgress,
    PhaseResults,
    PhaseValidation,
    UserPreferences,
} from '../types/phases';
import { useCallback, useEffect, useRef, useState } from 'react';

interface ProgressTrackingState extends LabState {
    isLoading: boolean;
    error: string | null;
    sessionStartTime: Date;
    currentSessionDuration: number;
}

interface ProgressTrackingActions {
    initializeProgress: (userId: string, labId: string) => void;
    startPhase: (phaseId: string) => void;
    completePhase: (phaseId: string, results: PhaseResults) => Promise<void>;
    updatePhaseProgress: (
        phaseId: string,
        updates: Partial<PhaseProgress>
    ) => void;
    unlockAchievement: (achievementId: string) => void;
    validatePhase: (phaseId: string) => PhaseValidation;
    saveProgress: () => Promise<void>;
    loadProgress: () => Promise<void>;
    resetProgress: () => void;
    updatePreferences: (preferences: Partial<UserPreferences>) => void;
    getPhaseProgress: (phaseId: string) => PhaseProgress | undefined;
    getTotalProgress: () => number;
    getEstimatedTimeRemaining: () => number;
    canAdvanceToPhase: (phaseId: string) => boolean;
}

interface UseProgressTrackingReturn
    extends ProgressTrackingState,
        ProgressTrackingActions {}

const DEFAULT_PREFERENCES: UserPreferences = {
    visualStyle: 'mixed',
    difficultyPreference: 'adaptive',
    feedbackType: 'immediate',
    collaborationMode: false,
    notificationsEnabled: true,
    language: 'es',
};

const DEFAULT_ANALYTICS: LabAnalytics = {
    totalTimeSpent: 0,
    sessionsCount: 0,
    averageSessionDuration: 0,
    conceptsMastered: [],
    strugglingAreas: [],
    learningVelocity: 0,
    engagementScore: 0,
    retentionRate: 0,
    transferabilityScore: 0,
};

const INITIAL_STATE: ProgressTrackingState = {
    userId: '',
    labId: '',
    currentPhase: 1,
    phases: [],
    overallProgress: 0,
    startTime: new Date(),
    lastActivity: new Date(),
    achievements: [],
    learningPath: [],
    preferences: DEFAULT_PREFERENCES,
    analytics: DEFAULT_ANALYTICS,
    isLoading: false,
    error: null,
    sessionStartTime: new Date(),
    currentSessionDuration: 0,
};

export const useProgressTracking = (): UseProgressTrackingReturn => {
    const [state, setState] = useState<ProgressTrackingState>(INITIAL_STATE);
    const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
    const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Session timer
    useEffect(() => {
        sessionTimerRef.current = setInterval(() => {
            setState((prev) => ({
                ...prev,
                currentSessionDuration:
                    Date.now() - prev.sessionStartTime.getTime(),
                lastActivity: new Date(),
            }));
        }, 1000);

        return () => {
            if (sessionTimerRef.current) {
                clearInterval(sessionTimerRef.current);
            }
        };
    }, []);

    // Auto-save timer
    useEffect(() => {
        autoSaveTimerRef.current = setInterval(() => {
            saveProgress();
        }, 30000); // Auto-save every 30 seconds

        return () => {
            if (autoSaveTimerRef.current) {
                clearInterval(autoSaveTimerRef.current);
            }
        };
    }, []);

    const initializeProgress = useCallback((userId: string, labId: string) => {
        const initialPhases: PhaseProgress[] = PHASE_CONFIGS.map((config) => ({
            phaseId: config.id,
            status: config.order === 1 ? 'available' : 'locked',
            score: 0,
            maxScore: 100,
            completedTasks: [],
            achievements: [],
            timeSpent: 0,
            attempts: 0,
        }));

        setState((prev) => ({
            ...prev,
            userId,
            labId,
            phases: initialPhases,
            startTime: new Date(),
            sessionStartTime: new Date(),
            analytics: {
                ...DEFAULT_ANALYTICS,
                sessionsCount: prev.analytics.sessionsCount + 1,
            },
        }));

        // Try to load existing progress
        loadProgress();
    }, []);

    const startPhase = useCallback((phaseId: string) => {
        setState((prev) => {
            const updatedPhases = prev.phases.map((phase) =>
                phase.phaseId === phaseId
                    ? {
                          ...phase,
                          status: 'in_progress' as const,
                          startTime: new Date(),
                          attempts: phase.attempts + 1,
                      }
                    : phase
            );

            const phaseOrder =
                PHASE_CONFIGS.find((c) => c.id === phaseId)?.order || 1;

            return {
                ...prev,
                phases: updatedPhases,
                currentPhase: phaseOrder,
            };
        });
    }, []);

    const completePhase = useCallback(
        async (phaseId: string, results: PhaseResults) => {
            setState((prev) => {
                const phase = prev.phases.find((p) => p.phaseId === phaseId);
                if (!phase) return prev;

                const endTime = new Date();
                const timeSpent = phase.startTime
                    ? endTime.getTime() - phase.startTime.getTime()
                    : 0;

                const updatedPhase: PhaseProgress = {
                    ...phase,
                    status: 'completed',
                    endTime,
                    score: results.score,
                    timeSpent: phase.timeSpent + timeSpent,
                    completedTasks: [
                        ...phase.completedTasks,
                        ...results.conceptsMastered,
                    ],
                };

                const updatedPhases = prev.phases.map((p) =>
                    p.phaseId === phaseId ? updatedPhase : p
                );

                // Unlock next phase if criteria are met
                const currentPhaseConfig = PHASE_CONFIGS.find(
                    (c) => c.id === phaseId
                );
                if (currentPhaseConfig) {
                    const nextPhaseConfig = PHASE_CONFIGS.find(
                        (c) => c.order === currentPhaseConfig.order + 1
                    );
                    if (
                        nextPhaseConfig &&
                        results.score >=
                            nextPhaseConfig.unlockCriteria.minimumScore
                    ) {
                        const nextPhaseIndex = updatedPhases.findIndex(
                            (p) => p.phaseId === nextPhaseConfig.id
                        );
                        if (nextPhaseIndex >= 0) {
                            updatedPhases[nextPhaseIndex] = {
                                ...updatedPhases[nextPhaseIndex],
                                status: 'available',
                            };
                        }
                    }
                }

                // Update analytics
                const updatedAnalytics: LabAnalytics = {
                    ...prev.analytics,
                    totalTimeSpent: prev.analytics.totalTimeSpent + timeSpent,
                    averageSessionDuration:
                        (prev.analytics.averageSessionDuration *
                            (prev.analytics.sessionsCount - 1) +
                            timeSpent) /
                        prev.analytics.sessionsCount,
                    conceptsMastered: [
                        ...new Set([
                            ...prev.analytics.conceptsMastered,
                            ...results.conceptsMastered,
                        ]),
                    ],
                    strugglingAreas: [
                        ...prev.analytics.strugglingAreas,
                        ...results.difficultiesEncountered,
                    ],
                    learningVelocity: calculateLearningVelocity(updatedPhases),
                    engagementScore: calculateEngagementScore(
                        updatedPhases,
                        timeSpent
                    ),
                    retentionRate: calculateRetentionRate(results),
                    transferabilityScore:
                        calculateTransferabilityScore(results),
                };

                return {
                    ...prev,
                    phases: updatedPhases,
                    overallProgress: calculateOverallProgress(updatedPhases),
                    analytics: updatedAnalytics,
                    learningPath: [...prev.learningPath, phaseId],
                };
            });

            // Check for achievements
            checkForAchievements(results);

            // Save progress
            await saveProgress();
        },
        []
    );

    const calculateLearningVelocity = (phases: PhaseProgress[]): number => {
        const completedPhases = phases.filter((p) => p.status === 'completed');
        if (completedPhases.length === 0) return 0;

        const totalTime = completedPhases.reduce(
            (sum, phase) => sum + phase.timeSpent,
            0
        );
        const totalConcepts = completedPhases.reduce(
            (sum, phase) => sum + phase.completedTasks.length,
            0
        );

        return totalConcepts / (totalTime / (1000 * 60)); // concepts per minute
    };

    const calculateEngagementScore = (
        phases: PhaseProgress[],
        sessionTime: number
    ): number => {
        const completedPhases = phases.filter(
            (p) => p.status === 'completed'
        ).length;
        const totalPhases = phases.length;
        const completionRate = completedPhases / totalPhases;

        const timeEngagement = Math.min(sessionTime / (30 * 60 * 1000), 1); // Max 30 minutes

        return (completionRate * 0.7 + timeEngagement * 0.3) * 100;
    };

    const calculateRetentionRate = (results: PhaseResults): number => {
        // Simulate retention calculation based on performance
        return Math.max(0, Math.min(100, results.score * 0.8 + 20));
    };

    const calculateTransferabilityScore = (results: PhaseResults): number => {
        // Simulate transferability based on strategies used
        const strategiesUsed = results.strategiesUsed.length;
        return Math.min(100, strategiesUsed * 20);
    };

    const updatePhaseProgress = useCallback(
        (phaseId: string, updates: Partial<PhaseProgress>) => {
            setState((prev) => ({
                ...prev,
                phases: prev.phases.map((phase) =>
                    phase.phaseId === phaseId ? { ...phase, ...updates } : phase
                ),
            }));
        },
        []
    );

    const unlockAchievement = useCallback((achievementId: string) => {
        const achievementDef = ACHIEVEMENT_DEFINITIONS.find(
            (a) => a.id === achievementId
        );
        if (!achievementDef) return;

        const achievement: PhaseAchievement = {
            ...achievementDef,
            unlockedAt: new Date(),
        };

        setState((prev) => {
            // Check if achievement already exists
            if (prev.achievements.some((a) => a.id === achievementId)) {
                return prev;
            }

            return {
                ...prev,
                achievements: [...prev.achievements, achievement],
            };
        });
    }, []);

    const checkForAchievements = useCallback(
        (results: PhaseResults) => {
            ACHIEVEMENT_DEFINITIONS.forEach((achievement) => {
                const criteria = achievement.criteria as any;
                let shouldUnlock = false;

                // Check specific criteria
                if (criteria.patternsDiscovered && results.score >= 85) {
                    shouldUnlock = true;
                }
                if (criteria.hypothesisAccuracy && results.score === 100) {
                    shouldUnlock = true;
                }
                if (
                    criteria.phase1Time &&
                    results.timeSpent < criteria.phase1Time
                ) {
                    shouldUnlock = true;
                }

                if (shouldUnlock) {
                    unlockAchievement(achievement.id);
                }
            });
        },
        [unlockAchievement]
    );

    const validatePhase = useCallback(
        (phaseId: string): PhaseValidation => {
            const phase = state.phases.find((p) => p.phaseId === phaseId);
            const config = PHASE_CONFIGS.find((c) => c.id === phaseId);

            if (!phase || !config) {
                return {
                    phaseId,
                    criteria: [],
                    passed: false,
                    score: 0,
                    feedback: ['Fase no encontrada'],
                    nextRecommendations: [],
                };
            }

            const criteria = config.objectives.map((objective, index) => ({
                id: `criteria-${index}`,
                description: objective,
                weight: 1 / config.objectives.length,
                passed: phase.completedTasks.length >= index + 1,
                score: phase.completedTasks.length >= index + 1 ? 100 : 0,
                evidence: phase.completedTasks,
            }));

            const totalScore = criteria.reduce(
                (sum, c) => sum + c.score * c.weight,
                0
            );
            const passed = totalScore >= config.unlockCriteria.minimumScore;

            return {
                phaseId,
                criteria,
                passed,
                score: totalScore,
                feedback: passed
                    ? [
                          '¡Excelente trabajo! Has completado exitosamente esta fase.',
                      ]
                    : ['Necesitas completar más objetivos para avanzar.'],
                nextRecommendations: passed
                    ? ['Procede a la siguiente fase']
                    : [
                          'Revisa los objetivos pendientes',
                          'Practica más con los conceptos difíciles',
                      ],
            };
        },
        [state.phases]
    );

    const calculateOverallProgress = useCallback(
        (phases: PhaseProgress[]): number => {
            const totalPhases = phases.length;
            const completedPhases = phases.filter(
                (p) => p.status === 'completed'
            ).length;
            const inProgressPhases = phases.filter(
                (p) => p.status === 'in_progress'
            ).length;

            return (
                ((completedPhases + inProgressPhases * 0.5) / totalPhases) * 100
            );
        },
        []
    );

    const saveProgress = useCallback(async (): Promise<void> => {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        try {
            // Simulate API call
            const progressData = {
                userId: state.userId,
                labId: state.labId,
                phases: state.phases,
                achievements: state.achievements,
                preferences: state.preferences,
                analytics: state.analytics,
                lastSaved: new Date(),
            };

            // In a real implementation, this would save to a backend
            localStorage.setItem(
                `progress-${state.userId}-${state.labId}`,
                JSON.stringify(progressData)
            );

            await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

            setState((prev) => ({ ...prev, isLoading: false }));
        } catch (error) {
            setState((prev) => ({
                ...prev,
                isLoading: false,
                error: 'Error al guardar el progreso',
            }));
        }
    }, [
        state.userId,
        state.labId,
        state.phases,
        state.achievements,
        state.preferences,
        state.analytics,
    ]);

    const loadProgress = useCallback(async (): Promise<void> => {
        if (!state.userId || !state.labId) return;

        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        try {
            const savedData = localStorage.getItem(
                `progress-${state.userId}-${state.labId}`
            );

            if (savedData) {
                const progressData = JSON.parse(savedData);

                setState((prev) => ({
                    ...prev,
                    phases: progressData.phases || prev.phases,
                    achievements: progressData.achievements || [],
                    preferences: {
                        ...prev.preferences,
                        ...progressData.preferences,
                    },
                    analytics: { ...prev.analytics, ...progressData.analytics },
                    overallProgress: calculateOverallProgress(
                        progressData.phases || prev.phases
                    ),
                    isLoading: false,
                }));
            } else {
                setState((prev) => ({ ...prev, isLoading: false }));
            }
        } catch (error) {
            setState((prev) => ({
                ...prev,
                isLoading: false,
                error: 'Error al cargar el progreso',
            }));
        }
    }, [state.userId, state.labId, calculateOverallProgress]);

    const resetProgress = useCallback(() => {
        setState((prev) => ({
            ...INITIAL_STATE,
            userId: prev.userId,
            labId: prev.labId,
            preferences: prev.preferences,
            sessionStartTime: new Date(),
        }));
    }, []);

    const updatePreferences = useCallback(
        (preferences: Partial<UserPreferences>) => {
            setState((prev) => ({
                ...prev,
                preferences: { ...prev.preferences, ...preferences },
            }));
        },
        []
    );

    const getPhaseProgress = useCallback(
        (phaseId: string): PhaseProgress | undefined => {
            return state.phases.find((p) => p.phaseId === phaseId);
        },
        [state.phases]
    );

    const getTotalProgress = useCallback((): number => {
        return state.overallProgress;
    }, [state.overallProgress]);

    const getEstimatedTimeRemaining = useCallback((): number => {
        const remainingPhases = state.phases.filter(
            (p) => p.status !== 'completed'
        );
        const averageTimePerPhase =
            PHASE_CONFIGS.reduce((sum, config) => sum + config.duration, 0) /
            PHASE_CONFIGS.length;

        return remainingPhases.length * averageTimePerPhase;
    }, [state.phases]);

    const canAdvanceToPhase = useCallback(
        (phaseId: string): boolean => {
            const phaseConfig = PHASE_CONFIGS.find((c) => c.id === phaseId);
            if (!phaseConfig) return false;

            // Check prerequisites
            for (const prerequisiteId of phaseConfig.prerequisites) {
                const prerequisitePhase = state.phases.find(
                    (p) => p.phaseId === prerequisiteId
                );
                if (
                    !prerequisitePhase ||
                    prerequisitePhase.status !== 'completed'
                ) {
                    return false;
                }

                if (
                    prerequisitePhase.score <
                    phaseConfig.unlockCriteria.minimumScore
                ) {
                    return false;
                }
            }

            return true;
        },
        [state.phases]
    );

    return {
        ...state,
        initializeProgress,
        startPhase,
        completePhase,
        updatePhaseProgress,
        unlockAchievement,
        validatePhase,
        saveProgress,
        loadProgress,
        resetProgress,
        updatePreferences,
        getPhaseProgress,
        getTotalProgress,
        getEstimatedTimeRemaining,
        canAdvanceToPhase,
    };
};

export default useProgressTracking;
