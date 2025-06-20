// apps/course-arithmetic/src/modules/finanzas-comercio/semana-06-porcentajes-avanzados/hooks/useProgressTracking.ts

import type {
    ExerciseProgress,
    ProgressTrackingState,
} from '../types/exercises';
import { useCallback, useState } from 'react';

interface ProgressData {
    courseId: string;
    moduleId: string;
    weekId: string;
    exerciseId: string;
    exerciseType?: string;
    userAnswer: number | string;
    correctAnswer: number | string;
    isCorrect: boolean;
    score?: number;
    timeSpent?: number;
    hintsUsed?: number;
    attempts?: number;
}

export function useProgressTracking() {
    const [state, setState] = useState<ProgressTrackingState>({
        isLoading: false,
        error: null,
        sessionStartTime: new Date(),
        totalTimeSpent: 0,
        exercisesCompleted: 0,
        totalExercises: 0,
        currentStreak: 0,
        bestStreak: 0,
        averageScore: 0,
    });

    const saveProgress = useCallback(async (data: ProgressData) => {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        try {
            // En desarrollo, usar la API de main-platform
            const apiUrl =
                process.env.NODE_ENV === 'development'
                    ? 'http://localhost:3000/api/progress'
                    : '/api/progress';

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            // Actualizar estado local
            setState((prev) => ({
                ...prev,
                isLoading: false,
                exercisesCompleted: data.isCorrect
                    ? prev.exercisesCompleted + 1
                    : prev.exercisesCompleted,
                currentStreak: data.isCorrect ? prev.currentStreak + 1 : 0,
                bestStreak: data.isCorrect
                    ? Math.max(prev.bestStreak, prev.currentStreak + 1)
                    : prev.bestStreak,
                totalTimeSpent: prev.totalTimeSpent + (data.timeSpent || 0),
            }));

            return result;
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : 'Error desconocido';
            setState((prev) => ({
                ...prev,
                isLoading: false,
                error: errorMessage,
            }));
            throw error;
        }
    }, []);

    const getProgress = useCallback(
        async (filters?: {
            courseId?: string;
            moduleId?: string;
            weekId?: string;
        }) => {
            setState((prev) => ({ ...prev, isLoading: true, error: null }));

            try {
                const params = new URLSearchParams();
                if (filters?.courseId)
                    params.append('courseId', filters.courseId);
                if (filters?.moduleId)
                    params.append('moduleId', filters.moduleId);
                if (filters?.weekId) params.append('weekId', filters.weekId);

                const apiUrl =
                    process.env.NODE_ENV === 'development'
                        ? 'http://localhost:3000/api/progress'
                        : '/api/progress';

                const response = await fetch(`${apiUrl}?${params.toString()}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();

                // Actualizar estado con estadísticas
                if (result.stats) {
                    setState((prev) => ({
                        ...prev,
                        isLoading: false,
                        exercisesCompleted: result.stats.completedExercises,
                        totalExercises: result.stats.totalExercises,
                        averageScore: result.stats.averageScore,
                        totalTimeSpent: Math.floor(
                            result.stats.totalTimeSpent / 60
                        ), // convertir a minutos
                    }));
                } else {
                    setState((prev) => ({ ...prev, isLoading: false }));
                }

                return result;
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : 'Error desconocido';
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: errorMessage,
                }));
                throw error;
            }
        },
        []
    );

    const resetSession = useCallback(() => {
        setState((prev) => ({
            ...prev,
            sessionStartTime: new Date(),
            currentStreak: 0,
            error: null,
        }));
    }, []);

    return {
        ...state,
        saveProgress,
        getProgress,
        resetSession,
    };
}
