// apps/course-arithmetic/src/modules/finanzas-comercio/semana-06-porcentajes-avanzados/components/ContextualProblemSolver.tsx
'use client';

import { Calculator, CheckCircle, Lightbulb, XCircle } from 'lucide-react';
import React, { useState } from 'react';

import { motion } from 'framer-motion';

interface ContextualProblemSolverProps {
    problem: {
        id: string;
        type: 'discount' | 'increase' | 'tax' | 'commission';
        context: string;
        originalValue: number;
        percentage: number;
        question: string;
        correctAnswer: number;
        hints: string[];
    };
    onSolve: (answer: number, isCorrect: boolean) => void;
    showHints: boolean;
}

export default function ContextualProblemSolver({
    problem,
    onSolve,
    showHints,
}: ContextualProblemSolverProps) {
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState<string | undefined>(undefined);
    const [isCorrect, setIsCorrect] = useState<boolean | undefined>(undefined);
    const [currentHintIndex, setCurrentHintIndex] = useState(0);

    const handleSubmit = () => {
        const answer = parseFloat(userAnswer);
        const tolerance = 0.01;
        const correct = Math.abs(answer - problem.correctAnswer) <= tolerance;

        setIsCorrect(correct);
        setFeedback(
            correct
                ? '¡Excelente! Has resuelto el problema correctamente.'
                : `Incorrecto. La respuesta correcta es $${problem.correctAnswer.toFixed(2)}`
        );

        onSolve(answer, correct);
    };

    const showNextHint = () => {
        if (currentHintIndex < problem.hints.length - 1) {
            setCurrentHintIndex((prev) => prev + 1);
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
                <Calculator className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                    Solucionador Contextual
                </h3>
            </div>

            {/* Contexto del problema */}
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-blue-900 mb-2">Situación:</h4>
                <p className="text-blue-800 text-sm">{problem.context}</p>
            </div>

            {/* Pregunta */}
            <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Pregunta:</h4>
                <p className="text-gray-700">{problem.question}</p>
            </div>

            {/* Input de respuesta */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tu respuesta:
                </label>
                <div className="flex items-center space-x-2">
                    <span className="text-gray-500">$</span>
                    <input
                        type="number"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="0.00"
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isCorrect}
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={!userAnswer || isCorrect}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Verificar
                    </button>
                </div>
            </div>

            {/* Feedback */}
            {feedback && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-lg mb-4 flex items-center space-x-2 ${
                        isCorrect
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-red-50 border border-red-200'
                    }`}
                >
                    {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <p
                        className={`text-sm ${isCorrect ? 'text-green-800' : 'text-red-800'}`}
                    >
                        {feedback}
                    </p>
                </motion.div>
            )}

            {/* Hints */}
            {showHints && problem.hints.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900 flex items-center">
                            <Lightbulb className="h-4 w-4 mr-2 text-yellow-600" />
                            Pistas
                        </h4>
                        {currentHintIndex < problem.hints.length - 1 && (
                            <button
                                onClick={showNextHint}
                                className="text-sm text-blue-600 hover:text-blue-700"
                            >
                                Más pistas
                            </button>
                        )}
                    </div>

                    <div className="space-y-2">
                        {problem.hints
                            .slice(0, currentHintIndex + 1)
                            .map((hint, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.2 }}
                                    className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                                >
                                    <p className="text-sm text-yellow-800">
                                        <span className="font-medium">
                                            Pista {index + 1}:
                                        </span>{' '}
                                        {hint}
                                    </p>
                                </motion.div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}
