// apps/course-arithmetic/src/modules/finanzas-comercio/semana-06-porcentajes-avanzados/types/percentages.ts

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

export interface PercentageOperation {
    type: 'discount' | 'increase' | 'tax' | 'commission';
    originalValue: number;
    percentage: number;
    result: number;
    formula: string;
    steps: CalculationStep[];
}

export interface CalculationStep {
    step: number;
    description: string;
    formula: string;
    calculation: string;
    result: number;
    explanation: string;
}

export interface PercentageConfig {
    precision: number;
    tolerance: number;
    displayFormat: 'decimal' | 'fraction' | 'percentage';
    roundingMode: 'round' | 'ceil' | 'floor';
}

export interface PercentageValidation {
    isValid: boolean;
    calculatedResult: number;
    userResult: number;
    difference: number;
    withinTolerance: boolean;
    feedback: string;
}

export interface PercentageVisualization {
    type: '3d_bar' | '3d_cylinder' | '2d_chart' | 'animation';
    originalValue: VisualElement;
    percentageAmount: VisualElement;
    finalResult: VisualElement;
    interactiveElements: InteractiveElement[];
}

export interface VisualElement {
    id: string;
    type: 'bar' | 'cylinder' | 'sphere' | 'text';
    position: [number, number, number];
    scale: [number, number, number];
    color: string;
    value: number;
    label: string;
    animated: boolean;
}

export interface InteractiveElement {
    id: string;
    type: 'slider' | 'input' | 'button' | 'handle';
    property: 'percentage' | 'originalValue' | 'operation';
    minValue?: number;
    maxValue?: number;
    step?: number;
    onChange: (value: any) => void;
}

export interface PercentageSolverState {
    currentProblem: PercentageProblem | null;
    userAnswer: string;
    isLoading: boolean;
    isCorrect: boolean | null;
    attempts: number;
    hintsUsed: number;
    timeStarted: Date | null;
    timeSpent: number;
    showSolution: boolean;
    calculationSteps: CalculationStep[];
}

export interface StepByStepState {
    currentStep: number;
    totalSteps: number;
    steps: StepData[];
    isVisible: boolean;
    autoAdvance: boolean;
}

export interface StepData {
    id: string;
    title: string;
    description: string;
    formula?: string;
    calculation?: string;
    result?: number;
    visual?: VisualElement;
    interactive?: boolean;
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
