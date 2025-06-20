// apps/course-arithmetic/src/modules/finanzas-comercio/semana-06-porcentajes-avanzados/types/exercises.ts

export interface Exercise {
    id: string;
    type: 'discount' | 'increase' | 'tax' | 'commission';
    difficulty: 'básico' | 'medio' | 'avanzado';
    points: number;
    context: string;
    originalValue: number;
    percentage: number;
    question: string;
    correctAnswer: number;
    tolerance: number;
    formula: string;
    explanation: string;
    realWorldConnection: string;
    hints: string[];
    commonErrors: CommonError[];
}

export interface CommonError {
    error: string;
    explanation: string;
}

export interface PercentageProblem {
    id: string;
    type: 'discount' | 'increase' | 'tax' | 'commission';
    context: string;
    originalValue: number;
    percentage: number;
    question: string;
    correctAnswer: number;
    hints: string[];
}

export interface ExerciseAttempt {
    id: string;
    exerciseId: string;
    userId: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
    hintsUsed: number;
    attemptedAt: Date;
}

export interface ExerciseProgress {
    id: string;
    userId: string;
    courseId: string;
    moduleId: string;
    weekId: string;
    exerciseId: string;
    exerciseType: string;
    status: 'not_started' | 'in_progress' | 'completed';
    score: number;
    timeSpent: number;
    attempts: number;
    hintsUsed: number;
    lastAttemptAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface ExerciseValidationResult {
    isCorrect: boolean;
    userAnswer: number;
    correctAnswer: number;
    tolerance: number;
    feedback: string;
    hints?: string[];
    commonErrors?: string[];
}

export interface HintSystem {
    exerciseId: string;
    hints: HintLevel[];
}

export interface HintLevel {
    level: number;
    trigger:
        | 'first_mistake'
        | 'repeated_mistakes'
        | 'time_based'
        | 'student_request';
    content: string;
    type:
        | 'gentle_nudge'
        | 'conceptual_bridge'
        | 'step_guidance'
        | 'worked_example';
}

export interface ExerciseMetrics {
    totalAttempts: number;
    correctAttempts: number;
    averageTime: number;
    averageHintsUsed: number;
    completionRate: number;
    difficultyRating: number;
}

export interface ProgressTrackingState {
    isLoading: boolean;
    error: string | null;
    sessionStartTime: Date;
    totalTimeSpent: number;
    exercisesCompleted: number;
    totalExercises: number;
    currentStreak: number;
    bestStreak: number;
    averageScore: number;
}
