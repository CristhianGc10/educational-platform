// hooks/useAnalytics.ts

import { useCallback, useEffect, useRef, useState } from 'react';

import { ANALYTICS_CONFIG } from '../config/lab-config';
import { InteractionEvent } from '../types/relationships';

interface AnalyticsEvent {
    id: string;
    sessionId: string;
    userId: string;
    labId: string;
    type:
        | 'page_view'
        | 'interaction'
        | 'performance'
        | 'error'
        | 'achievement'
        | 'custom';
    category: string;
    action: string;
    label?: string;
    value?: number;
    properties: Record<string, any>;
    timestamp: Date;
    duration?: number;
}

interface PerformanceMetrics {
    timeToInteractive: number;
    renderTime: number;
    responseTime: number;
    errorRate: number;
    completionRate: number;
    engagementTime: number;
}

interface UserBehavior {
    clickPattern: string[];
    timeSpentBySection: Record<string, number>;
    navigationFlow: string[];
    difficultyCurve: number[];
    helpUsage: number;
    retryAttempts: number;
}

interface LearningAnalytics {
    conceptsLearned: string[];
    learningSpeed: number;
    retentionRate: number;
    strugglingAreas: string[];
    strongAreas: string[];
    learningStyle: 'visual' | 'kinesthetic' | 'auditory' | 'mixed';
    adaptationNeeded: boolean;
}

interface AnalyticsState {
    events: AnalyticsEvent[];
    sessionId: string;
    sessionStartTime: Date;
    isTracking: boolean;
    performanceMetrics: PerformanceMetrics;
    userBehavior: UserBehavior;
    learningAnalytics: LearningAnalytics;
    pendingEvents: AnalyticsEvent[];
    transmissionQueue: AnalyticsEvent[];
    lastTransmission: Date | null;
}

interface AnalyticsActions {
    startSession: (userId: string, labId: string) => void;
    endSession: () => void;
    trackEvent: (
        event: Omit<AnalyticsEvent, 'id' | 'sessionId' | 'timestamp'>
    ) => void;
    trackInteraction: (
        element: string,
        action: string,
        properties?: Record<string, any>
    ) => void;
    trackPerformance: (
        metric: string,
        value: number,
        properties?: Record<string, any>
    ) => void;
    trackError: (error: Error, context?: Record<string, any>) => void;
    trackAchievement: (
        achievementId: string,
        properties?: Record<string, any>
    ) => void;
    trackLearningProgress: (
        concept: string,
        mastered: boolean,
        timeSpent: number
    ) => void;
    trackPageView: (page: string, properties?: Record<string, any>) => void;
    updateUserBehavior: (behavior: Partial<UserBehavior>) => void;
    generateInsights: () => string[];
    exportAnalytics: () => any;
    clearAnalytics: () => void;
    getEngagementScore: () => number;
    getPredictedPerformance: () => number;
    getPersonalizedRecommendations: () => string[];
}

interface UseAnalyticsReturn extends AnalyticsState, AnalyticsActions {}

const INITIAL_PERFORMANCE: PerformanceMetrics = {
    timeToInteractive: 0,
    renderTime: 0,
    responseTime: 0,
    errorRate: 0,
    completionRate: 0,
    engagementTime: 0,
};

const INITIAL_BEHAVIOR: UserBehavior = {
    clickPattern: [],
    timeSpentBySection: {},
    navigationFlow: [],
    difficultyCurve: [],
    helpUsage: 0,
    retryAttempts: 0,
};

const INITIAL_LEARNING: LearningAnalytics = {
    conceptsLearned: [],
    learningSpeed: 0,
    retentionRate: 0,
    strugglingAreas: [],
    strongAreas: [],
    learningStyle: 'mixed',
    adaptationNeeded: false,
};

const INITIAL_STATE: AnalyticsState = {
    events: [],
    sessionId: '',
    sessionStartTime: new Date(),
    isTracking: false,
    performanceMetrics: INITIAL_PERFORMANCE,
    userBehavior: INITIAL_BEHAVIOR,
    learningAnalytics: INITIAL_LEARNING,
    pendingEvents: [],
    transmissionQueue: [],
    lastTransmission: null,
};

export const useAnalytics = (): UseAnalyticsReturn => {
    const [state, setState] = useState<AnalyticsState>(INITIAL_STATE);
    const transmissionTimerRef = useRef<NodeJS.Timeout | null>(null);
    const performanceObserverRef = useRef<PerformanceObserver | null>(null);

    // Setup automatic event transmission
    useEffect(() => {
        if (!ANALYTICS_CONFIG.trackingEnabled) return;

        transmissionTimerRef.current = setInterval(() => {
            transmitEvents();
        }, ANALYTICS_CONFIG.transmissionInterval);

        return () => {
            if (transmissionTimerRef.current) {
                clearInterval(transmissionTimerRef.current);
            }
        };
    }, []);

    // Setup performance monitoring
    useEffect(() => {
        if (
            !ANALYTICS_CONFIG.realTimeAnalytics ||
            typeof window === 'undefined'
        )
            return;

        try {
            performanceObserverRef.current = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    if (entry.entryType === 'navigation') {
                        const navEntry = entry as PerformanceNavigationTiming;
                        updatePerformanceMetrics({
                            timeToInteractive:
                                navEntry.domInteractive -
                                navEntry.navigationStart,
                            renderTime:
                                navEntry.loadEventEnd -
                                navEntry.navigationStart,
                        });
                    }
                });
            });

            performanceObserverRef.current.observe({
                entryTypes: ['navigation', 'paint', 'largest-contentful-paint'],
            });
        } catch (error) {
            console.warn('Performance Observer not supported');
        }

        return () => {
            if (performanceObserverRef.current) {
                performanceObserverRef.current.disconnect();
            }
        };
    }, []);

    const generateSessionId = (): string => {
        return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    };

    const startSession = useCallback((userId: string, labId: string) => {
        const sessionId = generateSessionId();
        const sessionStartTime = new Date();

        setState((prev) => ({
            ...prev,
            sessionId,
            sessionStartTime,
            isTracking: true,
            events: [],
            pendingEvents: [],
            performanceMetrics: INITIAL_PERFORMANCE,
            userBehavior: INITIAL_BEHAVIOR,
            learningAnalytics: INITIAL_LEARNING,
        }));

        // Track session start
        trackEvent({
            userId,
            labId,
            type: 'page_view',
            category: 'session',
            action: 'start',
            properties: {
                userAgent:
                    typeof window !== 'undefined'
                        ? window.navigator.userAgent
                        : '',
                screenResolution:
                    typeof window !== 'undefined'
                        ? `${window.screen.width}x${window.screen.height}`
                        : '',
                language:
                    typeof navigator !== 'undefined'
                        ? navigator.language
                        : 'unknown',
            },
        });
    }, []);

    const endSession = useCallback(() => {
        if (!state.isTracking) return;

        const sessionDuration = Date.now() - state.sessionStartTime.getTime();

        trackEvent({
            userId: '',
            labId: '',
            type: 'page_view',
            category: 'session',
            action: 'end',
            properties: {
                duration: sessionDuration,
                eventsCount: state.events.length,
                performance: state.performanceMetrics,
                behavior: state.userBehavior,
                learning: state.learningAnalytics,
            },
        });

        // Transmit remaining events
        transmitEvents();

        setState((prev) => ({
            ...prev,
            isTracking: false,
        }));
    }, [
        state.isTracking,
        state.sessionStartTime,
        state.events.length,
        state.performanceMetrics,
        state.userBehavior,
        state.learningAnalytics,
    ]);

    const trackEvent = useCallback(
        (event: Omit<AnalyticsEvent, 'id' | 'sessionId' | 'timestamp'>) => {
            if (!ANALYTICS_CONFIG.trackingEnabled || !state.isTracking) return;

            const newEvent: AnalyticsEvent = {
                ...event,
                id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                sessionId: state.sessionId,
                timestamp: new Date(),
            };

            setState((prev) => ({
                ...prev,
                events: [...prev.events, newEvent],
                pendingEvents: [...prev.pendingEvents, newEvent],
            }));

            // Update metrics based on event
            updateMetricsFromEvent(newEvent);
        },
        [state.isTracking, state.sessionId]
    );

    const trackInteraction = useCallback(
        (
            element: string,
            action: string,
            properties: Record<string, any> = {}
        ) => {
            trackEvent({
                userId: '',
                labId: '',
                type: 'interaction',
                category: 'ui',
                action,
                label: element,
                properties: {
                    element,
                    ...properties,
                    timestamp: Date.now(),
                },
            });

            // Update user behavior
            setState((prev) => ({
                ...prev,
                userBehavior: {
                    ...prev.userBehavior,
                    clickPattern: [
                        ...prev.userBehavior.clickPattern,
                        `${element}:${action}`,
                    ].slice(-50), // Keep last 50 interactions
                    navigationFlow: [
                        ...prev.userBehavior.navigationFlow,
                        element,
                    ].slice(-20), // Keep last 20 navigation steps
                },
            }));
        },
        [trackEvent]
    );

    const trackPerformance = useCallback(
        (
            metric: string,
            value: number,
            properties: Record<string, any> = {}
        ) => {
            trackEvent({
                userId: '',
                labId: '',
                type: 'performance',
                category: 'performance',
                action: metric,
                value,
                properties,
            });

            updatePerformanceMetrics({ [metric]: value });
        },
        [trackEvent]
    );

    const updatePerformanceMetrics = useCallback(
        (updates: Partial<PerformanceMetrics>) => {
            setState((prev) => ({
                ...prev,
                performanceMetrics: {
                    ...prev.performanceMetrics,
                    ...updates,
                },
            }));
        },
        []
    );

    const trackError = useCallback(
        (error: Error, context: Record<string, any> = {}) => {
            trackEvent({
                userId: '',
                labId: '',
                type: 'error',
                category: 'error',
                action: 'exception',
                label: error.name,
                properties: {
                    message: error.message,
                    stack: error.stack,
                    context,
                    userAgent:
                        typeof window !== 'undefined'
                            ? window.navigator.userAgent
                            : '',
                },
            });

            // Update error rate
            setState((prev) => ({
                ...prev,
                performanceMetrics: {
                    ...prev.performanceMetrics,
                    errorRate: prev.performanceMetrics.errorRate + 1,
                },
            }));
        },
        [trackEvent]
    );

    const trackAchievement = useCallback(
        (achievementId: string, properties: Record<string, any> = {}) => {
            trackEvent({
                userId: '',
                labId: '',
                type: 'achievement',
                category: 'achievement',
                action: 'unlock',
                label: achievementId,
                properties,
            });
        },
        [trackEvent]
    );

    const trackLearningProgress = useCallback(
        (concept: string, mastered: boolean, timeSpent: number) => {
            trackEvent({
                userId: '',
                labId: '',
                type: 'custom',
                category: 'learning',
                action: mastered ? 'concept_mastered' : 'concept_attempted',
                label: concept,
                value: timeSpent,
                properties: {
                    mastered,
                    timeSpent,
                },
            });

            // Update learning analytics
            setState((prev) => {
                const updatedLearning = { ...prev.learningAnalytics };

                if (
                    mastered &&
                    !updatedLearning.conceptsLearned.includes(concept)
                ) {
                    updatedLearning.conceptsLearned.push(concept);
                    updatedLearning.strongAreas.push(concept);
                } else if (
                    !mastered &&
                    !updatedLearning.strugglingAreas.includes(concept)
                ) {
                    updatedLearning.strugglingAreas.push(concept);
                }

                // Calculate learning speed (concepts per minute)
                const totalTime = Object.values(
                    prev.userBehavior.timeSpentBySection
                ).reduce((sum, time) => sum + time, 0);
                updatedLearning.learningSpeed =
                    updatedLearning.conceptsLearned.length /
                    (totalTime / 60000);

                // Determine if adaptation is needed
                updatedLearning.adaptationNeeded =
                    updatedLearning.strugglingAreas.length >
                    updatedLearning.strongAreas.length;

                return {
                    ...prev,
                    learningAnalytics: updatedLearning,
                };
            });
        },
        [trackEvent]
    );

    const trackPageView = useCallback(
        (page: string, properties: Record<string, any> = {}) => {
            trackEvent({
                userId: '',
                labId: '',
                type: 'page_view',
                category: 'navigation',
                action: 'page_view',
                label: page,
                properties: {
                    page,
                    referrer:
                        typeof document !== 'undefined'
                            ? document.referrer
                            : '',
                    ...properties,
                },
            });
        },
        [trackEvent]
    );

    const updateUserBehavior = useCallback(
        (behavior: Partial<UserBehavior>) => {
            setState((prev) => ({
                ...prev,
                userBehavior: {
                    ...prev.userBehavior,
                    ...behavior,
                },
            }));
        },
        []
    );

    const updateMetricsFromEvent = useCallback((event: AnalyticsEvent) => {
        setState((prev) => {
            const updates: Partial<AnalyticsState> = {};

            if (event.type === 'interaction') {
                updates.performanceMetrics = {
                    ...prev.performanceMetrics,
                    engagementTime:
                        prev.performanceMetrics.engagementTime +
                        (event.duration || 0),
                };
            }

            return {
                ...prev,
                ...updates,
            };
        });
    }, []);

    const transmitEvents = useCallback(async () => {
        if (state.pendingEvents.length === 0) return;

        try {
            // In a real implementation, this would send to an analytics service
            console.log('Transmitting analytics events:', state.pendingEvents);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 100));

            setState((prev) => ({
                ...prev,
                pendingEvents: [],
                lastTransmission: new Date(),
            }));
        } catch (error) {
            console.error('Failed to transmit analytics events:', error);
        }
    }, [state.pendingEvents]);

    const generateInsights = useCallback((): string[] => {
        const insights: string[] = [];
        const { performanceMetrics, userBehavior, learningAnalytics } = state;

        // Performance insights
        if (performanceMetrics.errorRate > 5) {
            insights.push(
                'Alta tasa de errores detectada. Considera revisar la usabilidad.'
            );
        }

        if (performanceMetrics.timeToInteractive > 3000) {
            insights.push(
                'Tiempo de carga lento. Optimiza el rendimiento para mejor experiencia.'
            );
        }

        // Behavior insights
        if (userBehavior.helpUsage > 10) {
            insights.push(
                'Usuario necesita mucha ayuda. Considera mejorar las instrucciones.'
            );
        }

        if (userBehavior.retryAttempts > 5) {
            insights.push(
                'Muchos intentos de repetición. El contenido puede ser demasiado difícil.'
            );
        }

        // Learning insights
        if (
            learningAnalytics.strugglingAreas.length >
            learningAnalytics.strongAreas.length
        ) {
            insights.push(
                'Usuario tiene dificultades. Considera adaptar el contenido o proporcionar más apoyo.'
            );
        }

        if (learningAnalytics.learningSpeed < 0.5) {
            insights.push(
                'Ritmo de aprendizaje lento. Considera personalizar la experiencia.'
            );
        }

        if (learningAnalytics.retentionRate < 70) {
            insights.push(
                'Baja retención de conceptos. Considera añadir más práctica y refuerzo.'
            );
        }

        return insights;
    }, [state.performanceMetrics, state.userBehavior, state.learningAnalytics]);

    const exportAnalytics = useCallback(() => {
        return {
            sessionId: state.sessionId,
            sessionDuration: Date.now() - state.sessionStartTime.getTime(),
            events: state.events,
            performanceMetrics: state.performanceMetrics,
            userBehavior: state.userBehavior,
            learningAnalytics: state.learningAnalytics,
            insights: generateInsights(),
            exportedAt: new Date(),
        };
    }, [state, generateInsights]);

    const clearAnalytics = useCallback(() => {
        setState(INITIAL_STATE);
    }, []);

    const getEngagementScore = useCallback((): number => {
        const { engagementTime } = state.performanceMetrics;
        const sessionDuration = Date.now() - state.sessionStartTime.getTime();
        const engagementRatio = engagementTime / sessionDuration;

        return Math.min(100, engagementRatio * 100);
    }, [state.performanceMetrics.engagementTime, state.sessionStartTime]);

    const getPredictedPerformance = useCallback((): number => {
        const { learningSpeed, retentionRate, conceptsLearned } =
            state.learningAnalytics;
        const { helpUsage, retryAttempts } = state.userBehavior;

        // Simple predictive model
        const speedFactor = Math.min(learningSpeed * 20, 30);
        const retentionFactor = retentionRate * 0.3;
        const conceptsFactor = Math.min(conceptsLearned.length * 5, 25);
        const difficultyPenalty = (helpUsage + retryAttempts) * -1;

        return Math.max(
            0,
            Math.min(
                100,
                speedFactor +
                    retentionFactor +
                    conceptsFactor +
                    difficultyPenalty
            )
        );
    }, [state.learningAnalytics, state.userBehavior]);

    const getPersonalizedRecommendations = useCallback((): string[] => {
        const recommendations: string[] = [];
        const { learningAnalytics, userBehavior } = state;

        if (learningAnalytics.adaptationNeeded) {
            recommendations.push(
                'Considera ajustar la dificultad del contenido'
            );
        }

        if (userBehavior.helpUsage > 8) {
            recommendations.push(
                'Proporciona más ejemplos y explicaciones detalladas'
            );
        }

        if (learningAnalytics.learningSpeed > 1.0) {
            recommendations.push(
                'El usuario aprende rápido, considera contenido más avanzado'
            );
        }

        if (learningAnalytics.strugglingAreas.length > 3) {
            recommendations.push(
                'Enfócate en reforzar conceptos fundamentales'
            );
        }

        return recommendations;
    }, [state.learningAnalytics, state.userBehavior]);

    return {
        ...state,
        startSession,
        endSession,
        trackEvent,
        trackInteraction,
        trackPerformance,
        trackError,
        trackAchievement,
        trackLearningProgress,
        trackPageView,
        updateUserBehavior,
        generateInsights,
        exportAnalytics,
        clearAnalytics,
        getEngagementScore,
        getPredictedPerformance,
        getPersonalizedRecommendations,
    };
};

export default useAnalytics;
