// apps/course-arithmetic/src/modules/finanzas-comercio/semana-06-porcentajes-avanzados/components/StepByStepViewer.tsx
'use client';

import { ChevronLeft, ChevronRight, Play, RotateCcw } from 'lucide-react';

import React from 'react';
import { motion } from 'framer-motion';

interface StepByStepViewerProps {
    problem: {
        id: string;
        type: 'discount' | 'increase' | 'tax' | 'commission';
        originalValue: number;
        percentage: number;
        correctAnswer: number;
    };
    currentStep: number;
    onNextStep: () => void;
    onReset: () => void;
}

export default function StepByStepViewer({
    problem,
    currentStep,
    onNextStep,
    onReset,
}: StepByStepViewerProps) {
    // Generar pasos según el tipo de problema
    const generateSteps = () => {
        const { originalValue, percentage, type } = problem;
        const percentageDecimal = percentage / 100;
        const percentageAmount = originalValue * percentageDecimal;

        const baseSteps = [
            {
                title: 'Identificar los valores',
                description: `Valor original: $${originalValue}, Porcentaje: ${percentage}%`,
                formula: 'Datos del problema',
            },
            {
                title: 'Convertir porcentaje a decimal',
                description: `${percentage}% ÷ 100 = ${percentageDecimal}`,
                formula: 'Porcentaje ÷ 100',
            },
            {
                title: 'Calcular el monto del porcentaje',
                description: `$${originalValue} × ${percentageDecimal} = $${percentageAmount.toFixed(2)}`,
                formula: 'Valor × Porcentaje decimal',
            },
        ];

        let finalStep;
        switch (type) {
            case 'discount':
                finalStep = {
                    title: 'Aplicar el descuento',
                    description: `$${originalValue} - $${percentageAmount.toFixed(2)} = $${(originalValue - percentageAmount).toFixed(2)}`,
                    formula: 'Valor original - Descuento',
                };
                break;
            case 'increase':
            case 'tax':
                finalStep = {
                    title: 'Aplicar el aumento',
                    description: `$${originalValue} + $${percentageAmount.toFixed(2)} = $${(originalValue + percentageAmount).toFixed(2)}`,
                    formula: 'Valor original + Aumento',
                };
                break;
            case 'commission':
                finalStep = {
                    title: 'Resultado: La comisión',
                    description: `Comisión = $${percentageAmount.toFixed(2)}`,
                    formula: 'Comisión = Monto del porcentaje',
                };
                break;
            default:
                finalStep = baseSteps[2];
        }

        return [...baseSteps, finalStep];
    };

    const steps = generateSteps();
    const maxSteps = steps.length;

    return (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Solución Paso a Paso
                </h3>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={onReset}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                        title="Reiniciar"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </button>

                    <button
                        onClick={onNextStep}
                        disabled={currentStep >= maxSteps - 1}
                        className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Play className="h-4 w-4" />
                        <span>
                            {currentStep >= maxSteps - 1
                                ? 'Completado'
                                : 'Siguiente'}
                        </span>
                    </button>
                </div>
            </div>

            {/* Progreso */}
            <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>
                        Paso {Math.min(currentStep + 1, maxSteps)} de {maxSteps}
                    </span>
                    <span>
                        {Math.round(((currentStep + 1) / maxSteps) * 100)}%
                        completado
                    </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                        className="bg-blue-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                            width: `${((currentStep + 1) / maxSteps) * 100}%`,
                        }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Pasos */}
            <div className="space-y-4">
                {steps.slice(0, currentStep + 1).map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`border rounded-lg p-4 ${
                            index === currentStep
                                ? 'border-blue-300 bg-blue-50'
                                : 'border-gray-200 bg-gray-50'
                        }`}
                    >
                        <div className="flex items-start space-x-3">
                            <div
                                className={`
                flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${
                    index === currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-green-600 text-white'
                }
              `}
                            >
                                {index + 1}
                            </div>

                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900 mb-1">
                                    {step.title}
                                </h4>
                                <p className="text-gray-700 text-sm mb-2">
                                    {step.description}
                                </p>
                                <div className="bg-white rounded px-3 py-2 border border-gray-200">
                                    <code className="text-sm text-gray-800">
                                        {step.formula}
                                    </code>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Navegación */}
            <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
                <button
                    onClick={() => {
                        /* implementar paso anterior */
                    }}
                    disabled={currentStep === 0}
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Anterior</span>
                </button>

                <div className="text-sm text-gray-500">
                    {currentStep >= maxSteps - 1
                        ? '¡Solución completa!'
                        : 'Continúa para ver el siguiente paso'}
                </div>

                <button
                    onClick={onNextStep}
                    disabled={currentStep >= maxSteps - 1}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span>Siguiente</span>
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
