// tools/ProblemDesigner.tsx

import React, { useCallback, useState } from 'react';

interface Problem {
    id: string;
    title: string;
    description: string;
    difficulty: number;
    category: string;
    learningObjectives: string[];
    targetAudience: string;
    estimatedTime: number;
    createdAt: Date;
}

interface ProblemDesignerProps {
    onProblemCreate: (problem: Problem) => void;
    onProblemUpdate: (problem: Problem) => void;
    initialProblem?: Problem;
}

export function ProblemDesigner({
    onProblemCreate,
    onProblemUpdate,
    initialProblem,
}: ProblemDesignerProps) {
    const [currentProblem, setCurrentProblem] = useState<Partial<Problem>>(
        initialProblem || {
            title: '',
            description: '',
            difficulty: 3,
            category: 'age_relationships',
            learningObjectives: [],
            targetAudience: 'estudiantes_secundaria',
            estimatedTime: 15,
        }
    );

    const categories = [
        { id: 'age_relationships', name: 'Relaciones de Edad' },
        { id: 'family_patterns', name: 'Patrones Familiares' },
        { id: 'mathematical_sequences', name: 'Secuencias Matemáticas' },
        { id: 'business_scenarios', name: 'Escenarios Empresariales' },
    ];

    const audiences = [
        { id: 'estudiantes_primaria', name: 'Estudiantes de Primaria' },
        { id: 'estudiantes_secundaria', name: 'Estudiantes de Secundaria' },
        { id: 'universitarios', name: 'Universitarios' },
        { id: 'profesionales', name: 'Profesionales' },
    ];

    const handleInputChange = useCallback(
        (field: keyof Problem, value: any) => {
            setCurrentProblem((prev) => ({
                ...prev,
                [field]: value,
            }));
        },
        []
    );

    const addLearningObjective = useCallback((objective: string) => {
        if (objective.trim()) {
            setCurrentProblem((prev) => ({
                ...prev,
                learningObjectives: [
                    ...(prev.learningObjectives || []),
                    objective.trim(),
                ],
            }));
        }
    }, []);

    const removeLearningObjective = useCallback((index: number) => {
        setCurrentProblem((prev) => ({
            ...prev,
            learningObjectives:
                prev.learningObjectives?.filter((_, i) => i !== index) || [],
        }));
    }, []);

    const createProblem = useCallback(() => {
        if (!currentProblem.title || !currentProblem.description) {
            alert('Por favor completa el título y descripción');
            return;
        }

        const newProblem: Problem = {
            id: `problem_${Date.now()}`,
            title: currentProblem.title!,
            description: currentProblem.description!,
            difficulty: currentProblem.difficulty!,
            category: currentProblem.category!,
            learningObjectives: currentProblem.learningObjectives || [],
            targetAudience: currentProblem.targetAudience!,
            estimatedTime: currentProblem.estimatedTime!,
            createdAt: new Date(),
        };

        onProblemCreate(newProblem);

        // Limpiar formulario
        setCurrentProblem({
            title: '',
            description: '',
            difficulty: 3,
            category: 'age_relationships',
            learningObjectives: [],
            targetAudience: 'estudiantes_secundaria',
            estimatedTime: 15,
        });
    }, [currentProblem, onProblemCreate]);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Diseñador de Problemas
            </h2>

            <div className="space-y-6">
                {/* Título */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título del Problema
                    </label>
                    <input
                        type="text"
                        value={currentProblem.title || ''}
                        onChange={(e) =>
                            handleInputChange('title', e.target.value)
                        }
                        placeholder="Ej: El Misterio de las Edades de la Familia García"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción del Problema
                    </label>
                    <textarea
                        value={currentProblem.description || ''}
                        onChange={(e) =>
                            handleInputChange('description', e.target.value)
                        }
                        placeholder="Describe el problema de forma atractiva y clara..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Categoría y Dificultad */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Categoría
                        </label>
                        <select
                            value={currentProblem.category || ''}
                            onChange={(e) =>
                                handleInputChange('category', e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Dificultad (1-5)
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={currentProblem.difficulty || 3}
                            onChange={(e) =>
                                handleInputChange(
                                    'difficulty',
                                    parseInt(e.target.value)
                                )
                            }
                            className="w-full"
                        />
                        <div className="text-center text-sm text-gray-600 mt-1">
                            Nivel {currentProblem.difficulty}
                        </div>
                    </div>
                </div>

                {/* Audiencia y Tiempo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Audiencia Objetivo
                        </label>
                        <select
                            value={currentProblem.targetAudience || ''}
                            onChange={(e) =>
                                handleInputChange(
                                    'targetAudience',
                                    e.target.value
                                )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {audiences.map((audience) => (
                                <option key={audience.id} value={audience.id}>
                                    {audience.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tiempo Estimado (minutos)
                        </label>
                        <input
                            type="number"
                            min="5"
                            max="60"
                            value={currentProblem.estimatedTime || 15}
                            onChange={(e) =>
                                handleInputChange(
                                    'estimatedTime',
                                    parseInt(e.target.value)
                                )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Objetivos de Aprendizaje */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Objetivos de Aprendizaje
                    </label>

                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            placeholder="Agregar objetivo de aprendizaje..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    addLearningObjective(e.currentTarget.value);
                                    e.currentTarget.value = '';
                                }
                            }}
                        />
                        <button
                            onClick={() => {
                                const input = document.querySelector(
                                    'input[placeholder="Agregar objetivo de aprendizaje..."]'
                                ) as HTMLInputElement;
                                if (input) {
                                    addLearningObjective(input.value);
                                    input.value = '';
                                }
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Agregar
                        </button>
                    </div>

                    <div className="space-y-2">
                        {currentProblem.learningObjectives?.map(
                            (objective, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                                >
                                    <span className="text-gray-700">
                                        {objective}
                                    </span>
                                    <button
                                        onClick={() =>
                                            removeLearningObjective(index)
                                        }
                                        className="text-red-600 hover:text-red-800 font-bold"
                                    >
                                        ×
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* Vista Previa */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">
                        Vista Previa
                    </h3>
                    <div className="space-y-2 text-sm">
                        <div>
                            <strong>Título:</strong>{' '}
                            {currentProblem.title || 'Sin título'}
                        </div>
                        <div>
                            <strong>Categoría:</strong>{' '}
                            {
                                categories.find(
                                    (c) => c.id === currentProblem.category
                                )?.name
                            }
                        </div>
                        <div>
                            <strong>Dificultad:</strong>{' '}
                            {currentProblem.difficulty}/5
                        </div>
                        <div>
                            <strong>Audiencia:</strong>{' '}
                            {
                                audiences.find(
                                    (a) =>
                                        a.id === currentProblem.targetAudience
                                )?.name
                            }
                        </div>
                        <div>
                            <strong>Tiempo:</strong>{' '}
                            {currentProblem.estimatedTime} minutos
                        </div>
                        <div>
                            <strong>Objetivos:</strong>{' '}
                            {currentProblem.learningObjectives?.length || 0}
                        </div>
                    </div>
                </div>

                {/* Botón Crear */}
                <button
                    onClick={createProblem}
                    disabled={
                        !currentProblem.title || !currentProblem.description
                    }
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg transition-all transform hover:scale-105 disabled:transform-none"
                >
                    Crear Problema
                </button>
            </div>
        </div>
    );
}

export default ProblemDesigner;
