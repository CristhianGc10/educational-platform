// apps/course-arithmetic/src/modules/finanzas-comercio/semana-06-porcentajes-avanzados/page.tsx
'use client';

import {
    BookOpen,
    Calculator,
    CheckCircle,
    Clock,
    DollarSign,
    Target,
    TrendingUp,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

import ContextualProblemSolver from './components/ContextualProblemSolver';
import type { Exercise } from './types/exercises';
import PercentageCalculator3D from './components/PercentageCalculator3D';
import ProgressTracker from './components/ProgressTracker';
import StepByStepViewer from './components/StepByStepViewer';
import exercisesData from './exercises/problems.json';
import { motion } from 'framer-motion';
import { usePercentageSolver } from './hooks/usePercentageSolver';
import { useProgressTracking } from './hooks/useProgressTracking';
import { useStepByStep } from './hooks/useStepByStep';

// Importar componentes existentes





// Importar hooks existentes




// Importar tipos existentes


// Importar datos de ejercicios


// Convertir datos de JSON a tipos correctos
const typedExercisesData = {
    ...exercisesData,
    exercises: exercisesData.exercises.map((exercise) => ({
        ...exercise,
        type: exercise.type as 'discount' | 'increase' | 'tax' | 'commission',
        difficulty: exercise.difficulty as 'básico' | 'medio' | 'avanzado',
    })) as Exercise[],
};

// Componente de navegación de ejercicios
function ExerciseNavigation({
    exercises,
    currentIndex,
    onSelect,
    completedExercises,
}: {
    exercises: Exercise[];
    currentIndex: number;
    onSelect: (index: number) => void;
    completedExercises: Set<number>;
}) {
    return (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-600" />
                Ejercicios de la Semana
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {exercises.map((exercise, index) => (
                    <button
                        key={exercise.id}
                        onClick={() => onSelect(index)}
                        className={`
              p-3 rounded-lg border-2 transition-all duration-200 text-left
              ${
                  currentIndex === index
                      ? 'border-blue-500 bg-blue-50'
                      : completedExercises.has(index)
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">
                                Ejercicio {index + 1}
                            </span>
                            {completedExercises.has(index) && (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                        </div>

                        <div className="text-xs text-gray-600 mb-1">
                            {exercise.type === 'discount'
                                ? 'Descuento'
                                : exercise.type === 'increase'
                                  ? 'Aumento'
                                  : exercise.type === 'tax'
                                    ? 'Impuesto'
                                    : 'Comisión'}
                        </div>

                        <div
                            className={`
              text-xs px-2 py-1 rounded-full inline-block
              ${
                  exercise.difficulty === 'básico'
                      ? 'bg-green-100 text-green-800'
                      : exercise.difficulty === 'medio'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
              }
            `}
                        >
                            {exercise.difficulty}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

// Componente de progreso de la semana
function WeekProgress({
    completedExercises,
    totalExercises,
    timeSpent,
}: {
    completedExercises: number;
    totalExercises: number;
    timeSpent: number;
}) {
    const progressPercentage = (completedExercises / totalExercises) * 100;

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">
                Tu Progreso esta Semana
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                        {completedExercises}
                    </div>
                    <div className="text-sm text-gray-600">
                        Ejercicios Completados
                    </div>
                </div>

                <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                        {progressPercentage.toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-600">Progreso Total</div>
                </div>

                <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                        {timeSpent}min
                    </div>
                    <div className="text-sm text-gray-600">
                        Tiempo de Estudio
                    </div>
                </div>
            </div>

            {/* Barra de progreso */}
            <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
}

// Componente principal de la página
export default function Semana06PorcentajesPage() {
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [completedExercises, setCompletedExercises] = useState<Set<number>>(
        new Set()
    );
    const [timeSpent, setTimeSpent] = useState(0);
    const [startTime] = useState(Date.now());
    const [showStepByStep, setShowStepByStep] = useState(false);

    // Usar hooks existentes
    const {
        currentProblem,
        solve,
        reset,
        isLoading: solverLoading,
    } = usePercentageSolver();

    const {
        saveProgress,
        getProgress,
        isLoading: progressLoading,
    } = useProgressTracking();

    const { steps, currentStep, nextStep, resetSteps } = useStepByStep();

    // Obtener ejercicio actual
    const currentExercise = typedExercisesData.exercises[currentExerciseIndex];

    // Actualizar tiempo cada minuto
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeSpent(Math.floor((Date.now() - startTime) / 60000));
        }, 60000);

        return () => clearInterval(interval);
    }, [startTime]);

    // Cargar progreso existente al montar el componente
    useEffect(() => {
        const loadProgress = async () => {
            try {
                const progressData = await getProgress({
                    courseId: 'course-arithmetic',
                    moduleId: 'finanzas-comercio',
                    weekId: 'semana-06-porcentajes-avanzados',
                });

                if (progressData?.progress) {
                    const completed = new Set<number>();
                    progressData.progress
                        .filter((p: any) => p.status === 'completed')
                        .forEach((p: any) => {
                            const index =
                                typedExercisesData.exercises.findIndex(
                                    (ex) => ex.id === p.exerciseId
                                );
                            if (index !== -1) {
                                completed.add(index);
                            }
                        });
                    setCompletedExercises(completed);
                }
            } catch (error) {
                console.error('Error loading progress:', error);
            }
        };

        loadProgress();
    }, [getProgress]);

    const handleExerciseComplete = async (
        answer: number,
        isCorrect: boolean
    ) => {
        try {
            // Marcar ejercicio como completado si es correcto
            if (isCorrect) {
                setCompletedExercises(
                    (prev) =>
                        new Set([...Array.from(prev), currentExerciseIndex])
                );
            }

            // Guardar progreso en la base de datos
            await saveProgress({
                courseId: 'course-arithmetic',
                moduleId: 'finanzas-comercio',
                weekId: 'semana-06-porcentajes-avanzados',
                exerciseId: currentExercise.id,
                exerciseType: currentExercise.type,
                userAnswer: answer,
                correctAnswer: currentExercise.correctAnswer,
                isCorrect,
                score: isCorrect ? 100 : 0,
                timeSpent: Date.now() - startTime,
                hintsUsed: 0, // TODO: implementar conteo de hints
                attempts: 1, // TODO: implementar conteo de intentos
            });

            // Avanzar al siguiente ejercicio si es correcto
            if (
                isCorrect &&
                currentExerciseIndex < typedExercisesData.exercises.length - 1
            ) {
                setTimeout(() => {
                    setCurrentExerciseIndex((prev) => prev + 1);
                    resetSteps();
                }, 2000);
            }
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    };

    const handleShowHint = () => {
        // Mostrar sistema de pasos
        setShowStepByStep(true);
        nextStep();
    };

    const handleSelectExercise = (index: number) => {
        setCurrentExerciseIndex(index);
        setShowStepByStep(false);
        resetSteps();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header de la semana */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <DollarSign className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {typedExercisesData.title}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {typedExercisesData.description}
                            </p>
                        </div>
                    </div>

                    {/* Objetivos de aprendizaje */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <BookOpen className="h-5 w-5 mr-2 text-green-600" />
                            Objetivos de Aprendizaje
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {typedExercisesData.learningObjectives.map(
                                (objective: string, index: number) => (
                                    <div
                                        key={index}
                                        className="flex items-start space-x-2"
                                    >
                                        <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                                        <span className="text-sm text-gray-700">
                                            {objective}
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* Progreso de la semana usando componente existente */}
                <ProgressTracker
                    completedExercises={completedExercises.size}
                    totalExercises={typedExercisesData.exercises.length}
                    timeSpent={timeSpent}
                />

                {/* Navegación de ejercicios */}
                <ExerciseNavigation
                    exercises={typedExercisesData.exercises}
                    currentIndex={currentExerciseIndex}
                    onSelect={handleSelectExercise}
                    completedExercises={completedExercises}
                />

                {/* Ejercicio actual */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Ejercicio {currentExerciseIndex + 1} de{' '}
                                {typedExercisesData.exercises.length}
                            </h2>

                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span className="flex items-center space-x-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{timeSpent} min</span>
                                </span>

                                <span
                                    className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${
                      currentExercise.difficulty === 'básico'
                          ? 'bg-green-100 text-green-800'
                          : currentExercise.difficulty === 'medio'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                  }
                `}
                                >
                                    {currentExercise.difficulty}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Layout Grid para diferentes componentes */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Calculadora 3D */}
                        <div>
                            <PercentageCalculator3D
                                problem={currentExercise}
                                onAnswer={handleExerciseComplete}
                                onShowHint={handleShowHint}
                            />
                        </div>

                        {/* Solucionador contextual */}
                        <div>
                            <ContextualProblemSolver
                                problem={currentExercise}
                                onSolve={handleExerciseComplete}
                                showHints={showStepByStep}
                            />
                        </div>
                    </div>

                    {/* Visualizador paso a paso */}
                    {showStepByStep && (
                        <div className="mt-8">
                            <StepByStepViewer
                                problem={currentExercise}
                                currentStep={currentStep}
                                onNextStep={nextStep}
                                onReset={resetSteps}
                            />
                        </div>
                    )}
                </div>

                {/* Completado */}
                {completedExercises.size ===
                    typedExercisesData.exercises.length && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-8 text-center"
                    >
                        <div className="text-6xl mb-4">🎉</div>
                        <h3 className="text-2xl font-bold text-green-900 mb-2">
                            ¡Felicitaciones!
                        </h3>
                        <p className="text-green-800 mb-4">
                            Has completado todos los ejercicios de Porcentajes
                            Avanzados
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                                Continuar a la Siguiente Semana
                            </button>
                            <button className="bg-white text-green-600 border border-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors">
                                Revisar Progreso
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
