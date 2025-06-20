// ================= components/phases/Phase2Construction.tsx =================
'use client';

import type { Phase2ConstructionProps } from '../../types/phases';
import React from 'react';

const Phase2Construction: React.FC<Phase2ConstructionProps> = ({
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
                Fase 2: Construcción de Algoritmos
            </h2>
            <p className="text-lg text-gray-600 mb-8">
                Esta fase estará disponible próximamente
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
                <div className="text-4xl mb-4">🚧</div>
                <p className="text-yellow-800">
                    El constructor de algoritmos visuales se implementará en la
                    siguiente iteración
                </p>
            </div>
            <button
                onClick={() =>
                    onPhaseComplete({
                        phaseId: 'phase2',
                        objectives: config.objectives,
                        discoveries: [],
                        patterns: [],
                        hypotheses: [],
                        timeSpent: 0,
                        interactions: 0,
                        masteryLevel: 2,
                        feedback: 'Fase en desarrollo',
                    })
                }
                className="mt-8 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
                Continuar (Demo)
            </button>
        </div>
    );
};

export default Phase2Construction;
