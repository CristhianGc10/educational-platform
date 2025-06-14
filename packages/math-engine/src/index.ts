// 🧮 Mathematical Engine
export const version = '1.0.0';

// Interface para validación matemática
export interface ValidationResult {
    correct: boolean;
    method?: 'algebraic' | 'numeric';
    errorType?: string;
    suggestion?: string;
}

// Clase base del motor matemático
export class MathEngine {
    private tolerance = 1e-6;

    validate(studentAnswer: string, correctAnswer: string): ValidationResult {
        // Implementación básica - será expandida
        const student = parseFloat(studentAnswer);
        const correct = parseFloat(correctAnswer);

        if (isNaN(student) || isNaN(correct)) {
            return {
                correct: false,
                errorType: 'parsing_error',
                suggestion: 'Verifica que tu respuesta sea un número válido',
            };
        }

        const isCorrect = Math.abs(student - correct) < this.tolerance;

        return {
            correct: isCorrect,
            method: 'numeric',
        };
    }
}

// Funciones utilitarias
export const parseExpression = (expression: string): number => {
    // Implementación básica
    return parseFloat(expression);
};

export const formatStep = (step: string): string => {
    return step.trim();
};
