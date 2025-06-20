// ============================================================================
// OPTIMIZADOR DE SISTEMAS - CORREGIDO
// ============================================================================

import { AnimatePresence, motion } from 'framer-motion';
import {
    ImprovementType,
    OptimizationMethod,
    OptimizationResult,
    SystemDefinition,
    SystemEntity,
    SystemImprovement,
} from '../types/systems';
import React, { useCallback, useEffect, useState } from 'react';

import { useSystemOptimizer } from '../hooks/useSystemOptimizer';

/**
 * Props para el optimizador de sistemas
 */
interface SystemOptimizerProps {
    system: SystemDefinition;
    onSystemUpdate: (system: SystemDefinition) => void;
    onOptimizationComplete: (result: OptimizationResult) => void;
    onImprovementSuggest: (improvements: SystemImprovement[]) => void;
    readOnly?: boolean;
    className?: string;
}

/**
 * Vista activa del optimizador
 */
type ActiveView = 'overview' | 'optimization' | 'improvements' | 'analysis';

/**
 * Componente de entidad del sistema
 */
interface EntityCardProps {
    entity: SystemEntity;
    isSelected: boolean;
    onSelect: (entityId: string) => void;
    onEdit?: (entity: SystemEntity) => void;
}

const EntityCard: React.FC<EntityCardProps> = ({
    entity,
    isSelected,
    onSelect,
    onEdit,
}) => {
    const getEntityColor = (type: string): string => {
        switch (type) {
            case 'person':
                return 'from-blue-400 to-blue-600';
            case 'department':
                return 'from-green-400 to-green-600';
            case 'process':
                return 'from-purple-400 to-purple-600';
            case 'resource':
                return 'from-orange-400 to-orange-600';
            default:
                return 'from-gray-400 to-gray-600';
        }
    };

    return (
        <motion.div
            className={`
        p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
        ${
            isSelected
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
        }
      `}
            onClick={() => onSelect(entity.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <div
                        className={`
            w-3 h-3 rounded-full bg-gradient-to-r ${getEntityColor(entity.type)}
          `}
                    />
                    <h4 className="font-medium text-gray-900">{entity.name}</h4>
                </div>

                {onEdit && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(entity);
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                        </svg>
                    </button>
                )}
            </div>

            <div className="space-y-2">
                <div className="text-sm text-gray-600">
                    <span className="font-medium">Tipo:</span> {entity.type}
                </div>
                <div className="text-sm text-gray-600">
                    <span className="font-medium">Estado:</span>
                    <span
                        className={`ml-1 px-2 py-1 rounded-full text-xs ${
                            entity.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : entity.status === 'inactive'
                                  ? 'bg-gray-100 text-gray-700'
                                  : entity.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : entity.status === 'error'
                                      ? 'bg-red-100 text-red-700'
                                      : 'bg-blue-100 text-blue-700'
                        }`}
                    >
                        {entity.status}
                    </span>
                </div>
                <div className="text-sm text-gray-600">
                    <span className="font-medium">Propiedades:</span>{' '}
                    {entity.properties.length}
                </div>
            </div>
        </motion.div>
    );
};

/**
 * Componente de mejora sugerida
 */
interface ImprovementCardProps {
    improvement: SystemImprovement;
    onApply: (improvementId: string) => void;
    onDismiss?: (improvementId: string) => void;
}

const ImprovementCard: React.FC<ImprovementCardProps> = ({
    improvement,
    onApply,
    onDismiss,
}) => {
    const getImprovementIcon = (type: ImprovementType): string => {
        switch (type) {
            case ImprovementType.PROCESS_OPTIMIZATION:
                return '⚡';
            case ImprovementType.RESOURCE_REALLOCATION:
                return '🔄';
            case ImprovementType.STRUCTURE_CHANGE:
                return '🏗️';
            case ImprovementType.AUTOMATION:
                return '🤖';
            case ImprovementType.TRAINING:
                return '📚';
            case ImprovementType.TECHNOLOGY_UPGRADE:
                return '💻';
            case ImprovementType.POLICY_CHANGE:
                return '📋';
            default:
                return '💡';
        }
    };

    const getPriorityColor = (priority: number): string => {
        if (priority >= 4) return 'text-red-600 bg-red-100';
        if (priority >= 3) return 'text-orange-600 bg-orange-100';
        if (priority >= 2) return 'text-yellow-600 bg-yellow-100';
        return 'text-green-600 bg-green-100';
    };

    return (
        <motion.div
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                        {getImprovementIcon(improvement.type)}
                    </span>
                    <div>
                        <h4 className="font-semibold text-gray-900">
                            {improvement.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                            {improvement.description}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(improvement.priority)}`}
                    >
                        Prioridad {improvement.priority}
                    </span>
                    {onDismiss && (
                        <button
                            onClick={() => onDismiss(improvement.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Métricas de impacto */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                        +${improvement.impact.benefit.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Beneficio</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-red-600">
                        -${improvement.impact.cost.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Costo</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                        {improvement.impact.roi}%
                    </div>
                    <div className="text-xs text-gray-500">ROI</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">
                        {improvement.impact.timeToImplement}d
                    </div>
                    <div className="text-xs text-gray-500">Tiempo</div>
                </div>
            </div>

            {/* Beneficios esperados */}
            <div className="mb-4">
                <h5 className="font-medium text-gray-900 mb-2">
                    Beneficios esperados:
                </h5>
                <ul className="text-sm text-gray-600 space-y-1">
                    {improvement.expectedBenefits
                        .slice(0, 3)
                        .map((benefit, index) => (
                            <li
                                key={index}
                                className="flex items-center space-x-2"
                            >
                                <span className="text-green-500">•</span>
                                <span>{benefit}</span>
                            </li>
                        ))}
                </ul>
            </div>

            {/* Acciones */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>Esfuerzo:</span>
                    <span
                        className={`px-2 py-1 rounded text-xs ${
                            improvement.effort === 'low'
                                ? 'bg-green-100 text-green-700'
                                : improvement.effort === 'medium'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                        }`}
                    >
                        {improvement.effort}
                    </span>
                    <span>Riesgo:</span>
                    <span
                        className={`px-2 py-1 rounded text-xs ${
                            improvement.impact.riskLevel === 'low'
                                ? 'bg-green-100 text-green-700'
                                : improvement.impact.riskLevel === 'medium'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                        }`}
                    >
                        {improvement.impact.riskLevel}
                    </span>
                </div>

                <button
                    onClick={() => onApply(improvement.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Aplicar
                </button>
            </div>
        </motion.div>
    );
};

/**
 * Componente principal del optimizador
 */
const SystemOptimizer: React.FC<SystemOptimizerProps> = ({
    system,
    onSystemUpdate,
    onOptimizationComplete,
    onImprovementSuggest,
    readOnly = false,
    className = '',
}) => {
    const [activeView, setActiveView] = useState<ActiveView>('overview');
    const [selectedMethod, setSelectedMethod] = useState<OptimizationMethod>(
        OptimizationMethod.LINEAR_PROGRAMMING
    );

    // Hook del optimizador
    const {
        state,
        loadSystem,
        createOptimizationProblem,
        optimize,
        applyImprovement,
        selectEntities,
        analyzeSelectedEntities,
        canOptimize,
        hasResults,
        improvementCount,
        selectedEntityCount,
        stats,
    } = useSystemOptimizer();

    // Cargar sistema al inicializar
    useEffect(() => {
        if (system) {
            loadSystem(system);
        }
    }, [system, loadSystem]);

    // Notificar mejoras sugeridas
    useEffect(() => {
        if (state.suggestedImprovements.length > 0) {
            onImprovementSuggest(state.suggestedImprovements);
        }
    }, [state.suggestedImprovements, onImprovementSuggest]);

    /**
     * Ejecutar optimización
     */
    const handleOptimize = async () => {
        try {
            // Crear problema de optimización básico
            const objectives = [
                {
                    id: 'efficiency',
                    name: 'Maximizar Eficiencia',
                    type: 'maximize' as const,
                    expression: 'efficiency_score',
                    weight: 1,
                    priority: 1,
                    description: 'Maximizar la eficiencia general del sistema',
                },
            ];

            const constraints = [
                {
                    id: 'budget_constraint',
                    name: 'Restricción de Presupuesto',
                    expression: 'cost <= budget',
                    type: 'inequality' as const,
                    description: 'No exceder el presupuesto disponible',
                    isActive: true,
                },
            ];

            createOptimizationProblem(objectives, constraints);

            const result = await optimize({
                method: selectedMethod,
                maxIterations: 100,
                tolerance: 0.01,
                timeLimit: 60,
            });

            onOptimizationComplete(result);
        } catch (error) {
            console.error('Optimization failed:', error);
        }
    };

    /**
     * Aplicar mejora
     */
    const handleApplyImprovement = (improvementId: string) => {
        applyImprovement(improvementId);

        if (state.currentSystem) {
            onSystemUpdate(state.currentSystem);
        }
    };

    /**
     * Seleccionar entidad
     */
    const handleEntitySelect = (entityId: string) => {
        const currentSelected = state.selectedEntities;
        const newSelected = currentSelected.includes(entityId)
            ? currentSelected.filter((id) => id !== entityId)
            : [...currentSelected, entityId];

        selectEntities(newSelected);
    };

    /**
     * Renderizar vista activa
     */
    const renderActiveView = () => {
        switch (activeView) {
            case 'overview':
                return renderOverview();
            case 'optimization':
                return renderOptimization();
            case 'improvements':
                return renderImprovements();
            case 'analysis':
                return renderAnalysis();
            default:
                return renderOverview();
        }
    };

    /**
     * Renderizar vista general
     */
    const renderOverview = () => (
        <div className="space-y-6">
            {/* Estadísticas del sistema */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-blue-600">
                        {system.entities.length}
                    </div>
                    <div className="text-sm text-gray-600">Entidades</div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-green-600">
                        {system.relationships.length}
                    </div>
                    <div className="text-sm text-gray-600">Relaciones</div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-purple-600">
                        {system.objectives.length}
                    </div>
                    <div className="text-sm text-gray-600">Objetivos</div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-orange-600">
                        {improvementCount}
                    </div>
                    <div className="text-sm text-gray-600">
                        Mejoras Sugeridas
                    </div>
                </div>
            </div>

            {/* Información del sistema */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Información del Sistema
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                            Detalles
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="font-medium">Nombre:</span>{' '}
                                {system.name}
                            </div>
                            <div>
                                <span className="font-medium">Tipo:</span>{' '}
                                {system.type}
                            </div>
                            <div>
                                <span className="font-medium">
                                    Descripción:
                                </span>{' '}
                                {system.description}
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                            Metadatos
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="font-medium">Industria:</span>{' '}
                                {system.metadata.industry}
                            </div>
                            <div>
                                <span className="font-medium">Tamaño:</span>{' '}
                                {system.metadata.size}
                            </div>
                            <div>
                                <span className="font-medium">
                                    Complejidad:
                                </span>{' '}
                                {system.metadata.complexity}/5
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Entidades del sistema */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Entidades del Sistema ({selectedEntityCount} seleccionadas)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {system.entities.map((entity) => (
                        <EntityCard
                            key={entity.id}
                            entity={entity}
                            isSelected={state.selectedEntities.includes(
                                entity.id
                            )}
                            onSelect={handleEntitySelect}
                        />
                    ))}
                </div>
            </div>
        </div>
    );

    /**
     * Renderizar vista de optimización
     */
    const renderOptimization = () => (
        <div className="space-y-6">
            {/* Configuración de optimización */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Configuración de Optimización
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Método de Optimización
                        </label>
                        <select
                            value={selectedMethod}
                            onChange={(e) =>
                                setSelectedMethod(
                                    e.target.value as OptimizationMethod
                                )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {Object.values(OptimizationMethod).map((method) => (
                                <option key={method} value={method}>
                                    {method
                                        .replace('_', ' ')
                                        .toLowerCase()
                                        .replace(/\b\w/g, (l) =>
                                            l.toUpperCase()
                                        )}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={handleOptimize}
                            disabled={!canOptimize || state.isOptimizing}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {state.isOptimizing
                                ? 'Optimizando...'
                                : 'Ejecutar Optimización'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Resultados de optimización */}
            {hasResults && state.lastResult && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Resultados de Optimización
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {state.lastResult.optimalValue.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">
                                Valor Óptimo
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {state.lastResult.iterations}
                            </div>
                            <div className="text-sm text-gray-600">
                                Iteraciones
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                                {state.lastResult.executionTime.toFixed(1)}s
                            </div>
                            <div className="text-sm text-gray-600">Tiempo</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                                Variables Optimizadas
                            </h4>
                            <div className="space-y-2">
                                {state.lastResult.variables
                                    .slice(0, 5)
                                    .map((variable, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center"
                                        >
                                            <span className="text-sm text-gray-600">
                                                {variable.name}
                                            </span>
                                            <span className="font-medium">
                                                {variable.optimalValue.toFixed(
                                                    2
                                                )}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {state.lastResult.metadata.recommendations && (
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">
                                    Recomendaciones
                                </h4>
                                <ul className="space-y-1">
                                    {state.lastResult.metadata.recommendations.map(
                                        (rec, index) => (
                                            <li
                                                key={index}
                                                className="text-sm text-gray-600 flex items-center space-x-2"
                                            >
                                                <span className="text-blue-500">
                                                    •
                                                </span>
                                                <span>{rec}</span>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    /**
     * Renderizar vista de mejoras
     */
    const renderImprovements = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                    Mejoras Sugeridas ({improvementCount})
                </h3>
                <div className="text-sm text-gray-600">
                    Ordenadas por prioridad
                </div>
            </div>

            {state.suggestedImprovements.length > 0 ? (
                <div className="space-y-4">
                    {state.suggestedImprovements
                        .sort((a, b) => b.priority - a.priority)
                        .map((improvement) => (
                            <ImprovementCard
                                key={improvement.id}
                                improvement={improvement}
                                onApply={handleApplyImprovement}
                            />
                        ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <svg
                        className="w-16 h-16 mx-auto text-gray-400 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                    </svg>
                    <p className="text-gray-500">
                        No hay mejoras sugeridas disponibles
                    </p>
                </div>
            )}
        </div>
    );

    /**
     * Renderizar vista de análisis
     */
    const renderAnalysis = () => {
        const analysis = analyzeSelectedEntities();

        return (
            <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Análisis de Entidades Seleccionadas
                    </h3>

                    {analysis ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">
                                    Resumen
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="font-medium">
                                            Total:
                                        </span>{' '}
                                        {analysis.totalEntities}
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            Relaciones:
                                        </span>{' '}
                                        {analysis.relationships}
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            Promedio de propiedades:
                                        </span>{' '}
                                        {analysis.averageProperties.toFixed(1)}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">
                                    Tipos de Entidades
                                </h4>
                                <div className="space-y-2 text-sm">
                                    {Object.entries(analysis.entityTypes).map(
                                        ([type, count]) => (
                                            <div key={type}>
                                                <span className="font-medium">
                                                    {type}:
                                                </span>{' '}
                                                {count}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">
                                    Sugerencias
                                </h4>
                                <ul className="space-y-1 text-sm">
                                    {analysis.suggestions.map(
                                        (suggestion, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center space-x-2"
                                            >
                                                <span className="text-blue-500">
                                                    •
                                                </span>
                                                <span>{suggestion}</span>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">
                                Selecciona al menos una entidad para ver el
                                análisis
                            </p>
                        </div>
                    )}
                </div>

                {/* Estadísticas de optimización */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Estadísticas de Optimización
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {stats.totalOptimizations}
                            </div>
                            <div className="text-sm text-gray-600">
                                Optimizaciones Ejecutadas
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {stats.averageImprovement.toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-600">
                                Mejora Promedio
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                                {stats.bestResult?.optimalValue.toFixed(2) ||
                                    'N/A'}
                            </div>
                            <div className="text-sm text-gray-600">
                                Mejor Resultado
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={`flex flex-col h-full bg-gray-50 ${className}`}>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Optimizador de Sistemas
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Sistema: {system.name} • {system.entities.length}{' '}
                            entidades
                        </p>
                    </div>

                    {/* Navegación de vistas */}
                    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                        {[
                            { id: 'overview', label: 'General', icon: '📊' },
                            {
                                id: 'optimization',
                                label: 'Optimización',
                                icon: '⚡',
                            },
                            {
                                id: 'improvements',
                                label: 'Mejoras',
                                icon: '💡',
                            },
                            { id: 'analysis', label: 'Análisis', icon: '🔍' },
                        ].map((view) => (
                            <button
                                key={view.id}
                                onClick={() =>
                                    setActiveView(view.id as ActiveView)
                                }
                                className={`
                  px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${
                      activeView === view.id
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                  }
                `}
                            >
                                <span className="mr-1">{view.icon}</span>
                                {view.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeView}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {renderActiveView()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SystemOptimizer;
