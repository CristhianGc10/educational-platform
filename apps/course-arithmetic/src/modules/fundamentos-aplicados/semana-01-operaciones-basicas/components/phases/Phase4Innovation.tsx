// ================= components/phases/Phase4Innovation.tsx =================
'use client';

import type { Phase4InnovationProps } from '../../types/phases';
import React from 'react';

const Phase4Innovation: React.FC<Phase4InnovationProps> = ({
    phaseConfig,
    phaseState,
    onComplete,
    onProgress,
    onObjectiveComplete,
    onPhaseComplete,
    onInteraction,
    config,
}) => {
    return (
        <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Fase 4: Innovación y Mejora
            </h2>
            <p className="text-lg text-gray-600 mb-8">
                Esta fase estará disponible próximamente
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
                <div className="text-4xl mb-4">💡</div>
                <p className="text-yellow-800">
                    Las herramientas de innovación se implementarán en la
                    siguiente iteración
                </p>
            </div>
            <button
                onClick={() =>
                    onPhaseComplete({
                        phaseId: 'phase4',
                        objectives: config.objectives,
                        discoveries: [],
                        patterns: [],
                        hypotheses: [],
                        timeSpent: 0,
                        interactions: 0,
                        masteryLevel: 4,
                        feedback: '¡Laboratorio completado exitosamente!',
                    })
                }
                className="mt-8 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
                Completar Laboratorio (Demo)
            </button>
        </div>
    );
};

export default Phase4Innovation;
