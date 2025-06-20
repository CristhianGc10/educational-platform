// apps/course-arithmetic/src/modules/finanzas-comercio/semana-06-porcentajes-avanzados/hooks/usePercentageSolver.ts

import type {
    CalculationStep,
    PercentageProblem,
    PercentageSolverState,
} from '../types/percentages';
import { useCallback, useState } from 'react';

export function usePercentageSolver() {
    const [state, setState] = useState<PercentageSolverState>({
        currentProblem: null,
        userAnswer: '',
        isLoading: false,
        isCorrect: null,
        attempts: 0,
        hintsUsed: 0,
        timeStarted: null,
        timeSpent: 0,
        showSolution: false,
        calculationSteps: [],
    });

    const setProblem = useCallback((problem: PercentageProblem) => {
        setState((prev) => ({
            ...prev,
            currentProblem: problem,
            userAnswer: '',
            isCorrect: null,
            attempts: 0,
            hintsUsed: 0,
            timeStarted: new Date(),
            timeSpent: 0,
            showSolution: false,
            calculationSteps: generateCalculationSteps(problem),
        }));
    }, []);

    const solve = useCallback(
        (userAnswer: string) => {
            if (!state.currentProblem)
                return {
                    isCorrect: false,
                    feedback: 'No hay problema cargado',
                };

            setState((prev) => ({ ...prev, isLoading: true }));

            const answer = parseFloat(userAnswer);
            const correctAnswer = state.currentProblem.correctAnswer;
            const tolerance = 0.01;
            const isCorrect = Math.abs(answer - correctAnswer) <= tolerance;

            const timeSpent = state.timeStarted
                ? Math.floor((Date.now() - state.timeStarted.getTime()) / 1000)
                : 0;

            setState((prev) => ({
                ...prev,
                userAnswer,
                isCorrect,
                attempts: prev.attempts + 1,
                timeSpent,
                isLoading: false,
                showSolution: isCorrect,
            }));

            return {
                isCorrect,
                userAnswer: answer,
                correctAnswer,
                feedback: isCorrect
                    ? '¡Excelente! Respuesta correcta.'
                    : `Intenta de nuevo. La respuesta correcta es ${correctAnswer.toFixed(2)}`,
            };
        },
        [state.currentProblem, state.timeStarted]
    );

    const reset = useCallback(() => {
        setState((prev) => ({
            ...prev,
            userAnswer: '',
            isCorrect: null,
            attempts: 0,
            hintsUsed: 0,
            timeStarted: new Date(),
            timeSpent: 0,
            showSolution: false,
        }));
    }, []);

    const useHint = useCallback(() => {
        setState((prev) => ({
            ...prev,
            hintsUsed: prev.hintsUsed + 1,
        }));
    }, []);

    return {
        ...state,
        setProblem,
        solve,
        reset,
        useHint,
    };
}

function generateCalculationSteps(
    problem: PercentageProblem
): CalculationStep[] {
    const { originalValue, percentage, type } = problem;
    const percentageDecimal = percentage / 100;
    const percentageAmount = originalValue * percentageDecimal;

    const steps: CalculationStep[] = [
        {
            step: 1,
            description: 'Identificar los valores dados',
            formula: 'Valor original y porcentaje',
            calculation: `Valor: $${originalValue}, Porcentaje: ${percentage}%`,
            result: originalValue,
            explanation:
                'Siempre empezamos identificando los valores que tenemos.',
        },
        {
            step: 2,
            description: 'Convertir porcentaje a decimal',
            formula: 'Porcentaje ÷ 100',
            calculation: `${percentage}% ÷ 100 = ${percentageDecimal}`,
            result: percentageDecimal,
            explanation:
                'Para calcular, necesitamos el porcentaje como decimal.',
        },
        {
            step: 3,
            description: 'Calcular el monto del porcentaje',
            formula: 'Valor original × Porcentaje decimal',
            calculation: `$${originalValue} × ${percentageDecimal} = $${percentageAmount.toFixed(2)}`,
            result: percentageAmount,
            explanation: 'Este es el monto que representa el porcentaje.',
        },
    ];

    // Paso final según el tipo de operación
    let finalStep: CalculationStep;
    switch (type) {
        case 'discount':
            finalStep = {
                step: 4,
                description: 'Restar el descuento del valor original',
                formula: 'Valor original - Descuento',
                calculation: `$${originalValue} - $${percentageAmount.toFixed(2)} = $${(originalValue - percentageAmount).toFixed(2)}`,
                result: originalValue - percentageAmount,
                explanation:
                    'En un descuento, restamos el monto del precio original.',
            };
            break;
        case 'increase':
        case 'tax':
            finalStep = {
                step: 4,
                description: 'Sumar el aumento al valor original',
                formula: 'Valor original + Aumento',
                calculation: `$${originalValue} + $${percentageAmount.toFixed(2)} = $${(originalValue + percentageAmount).toFixed(2)}`,
                result: originalValue + percentageAmount,
                explanation:
                    'En un aumento o impuesto, sumamos el monto al precio original.',
            };
            break;
        case 'commission':
            finalStep = {
                step: 4,
                description: 'La comisión es el monto calculado',
                formula: 'Comisión = Monto del porcentaje',
                calculation: `Comisión = $${percentageAmount.toFixed(2)}`,
                result: percentageAmount,
                explanation:
                    'En una comisión, el resultado es directamente el monto del porcentaje.',
            };
            break;
        default:
            finalStep = steps[2]; // Fallback
    }

    steps.push(finalStep);
    return steps;
}
