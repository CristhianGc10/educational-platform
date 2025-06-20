// apps/course-arithmetic/src/modules/finanzas-comercio/semana-06-porcentajes-avanzados/hooks/useStepByStep.ts

import type { StepByStepState, StepData } from '../types/percentages';
import { useCallback, useState } from 'react';

export function useStepByStep() {
    const [state, setState] = useState<StepByStepState>({
        currentStep: 0,
        totalSteps: 0,
        steps: [],
        isVisible: false,
        autoAdvance: false,
    });

    const initializeSteps = useCallback((steps: StepData[]) => {
        setState({
            currentStep: 0,
            totalSteps: steps.length,
            steps,
            isVisible: false,
            autoAdvance: false,
        });
    }, []);

    const nextStep = useCallback(() => {
        setState((prev) => ({
            ...prev,
            currentStep: Math.min(prev.currentStep + 1, prev.totalSteps - 1),
            isVisible: true,
        }));
    }, []);

    const previousStep = useCallback(() => {
        setState((prev) => ({
            ...prev,
            currentStep: Math.max(prev.currentStep - 1, 0),
        }));
    }, []);

    const goToStep = useCallback((stepIndex: number) => {
        setState((prev) => ({
            ...prev,
            currentStep: Math.max(0, Math.min(stepIndex, prev.totalSteps - 1)),
            isVisible: true,
        }));
    }, []);

    const resetSteps = useCallback(() => {
        setState((prev) => ({
            ...prev,
            currentStep: 0,
            isVisible: false,
        }));
    }, []);

    const toggleVisibility = useCallback(() => {
        setState((prev) => ({
            ...prev,
            isVisible: !prev.isVisible,
        }));
    }, []);

    const setAutoAdvance = useCallback((enabled: boolean) => {
        setState((prev) => ({
            ...prev,
            autoAdvance: enabled,
        }));
    }, []);

    // Obtener el paso actual
    const getCurrentStep = useCallback(() => {
        return state.steps[state.currentStep] || null;
    }, [state.steps, state.currentStep]);

    // Verificar si es el último paso
    const isLastStep = useCallback(() => {
        return state.currentStep === state.totalSteps - 1;
    }, [state.currentStep, state.totalSteps]);

    // Verificar si es el primer paso
    const isFirstStep = useCallback(() => {
        return state.currentStep === 0;
    }, [state.currentStep]);

    // Obtener progreso como porcentaje
    const getProgress = useCallback(() => {
        if (state.totalSteps === 0) return 0;
        return Math.round(((state.currentStep + 1) / state.totalSteps) * 100);
    }, [state.currentStep, state.totalSteps]);

    return {
        ...state,
        initializeSteps,
        nextStep,
        previousStep,
        goToStep,
        resetSteps,
        toggleVisibility,
        setAutoAdvance,
        getCurrentStep,
        isLastStep,
        isFirstStep,
        getProgress,
    };
}
