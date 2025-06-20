// hooks/useSystemOptimizer.ts

import {
    AnalysisFinding,
    AnalysisRecommendation,
    OptimizationBenefit,
    SimulationScenario,
    SystemAnalysis,
    SystemConnection,
    SystemEntity,
    SystemOptimization,
    SystemOptimizationMethod,
    SystemOptimizerState,
    SystemSimulation,
    UseSystemOptimizerReturn,
} from '../types/systems';
import { useCallback, useEffect, useState } from 'react';

const INITIAL_STATE: SystemOptimizerState = {
    currentSystem: null,
    connections: [],
    selectedEntities: [],
    analysisResults: [],
    optimizations: [],
    simulations: [],
    activeOptimization: null,
    optimizationMethods: [],
    viewMode: '2d',
    filters: {
        entityTypes: [],
        metricCategories: [],
        analysisTypes: [],
    },
};

const DEFAULT_OPTIMIZATION_METHODS: SystemOptimizationMethod[] = [
    {
        id: 'linear-programming',
        name: 'Programación Lineal',
        description:
            'Optimización mediante programación lineal para recursos limitados',
        category: 'mathematical',
        applicability: ['resource_allocation', 'cost_optimization'],
        complexity: 'medium',
        reliability: 0.95,
        computationTime: 5,
        parameters: [
            {
                id: 'objective-function',
                name: 'Función Objetivo',
                type: 'string',
                description: 'Expresión matemática a optimizar',
                defaultValue: 'max(profit)',
            },
            {
                id: 'constraints',
                name: 'Restricciones',
                type: 'array',
                description: 'Lista de restricciones del sistema',
                defaultValue: [],
            },
        ],
    },
    {
        id: 'genetic-algorithm',
        name: 'Algoritmo Genético',
        description: 'Optimización evolutiva para problemas complejos',
        category: 'ai_based',
        applicability: ['process_optimization', 'layout_design'],
        complexity: 'high',
        reliability: 0.85,
        computationTime: 15,
        parameters: [
            {
                id: 'population-size',
                name: 'Tamaño de Población',
                type: 'number',
                description: 'Número de individuos en cada generación',
                defaultValue: 100,
                min: 10,
                max: 1000,
            },
            {
                id: 'mutation-rate',
                name: 'Tasa de Mutación',
                type: 'number',
                description: 'Probabilidad de mutación (0-1)',
                defaultValue: 0.1,
                min: 0,
                max: 1,
                step: 0.01,
            },
        ],
    },
    {
        id: 'simulation-optimization',
        name: 'Optimización por Simulación',
        description: 'Evaluación de escenarios mediante simulación Monte Carlo',
        category: 'simulation',
        applicability: ['risk_assessment', 'capacity_planning'],
        complexity: 'medium',
        reliability: 0.9,
        computationTime: 10,
        parameters: [
            {
                id: 'iterations',
                name: 'Iteraciones',
                type: 'number',
                description: 'Número de simulaciones a ejecutar',
                defaultValue: 1000,
                min: 100,
                max: 10000,
            },
        ],
    },
];

export const useSystemOptimizer = (): UseSystemOptimizerReturn => {
    const [state, setState] = useState<SystemOptimizerState>(INITIAL_STATE);

    useEffect(() => {
        setState((prev) => ({
            ...prev,
            optimizationMethods: DEFAULT_OPTIMIZATION_METHODS,
        }));
    }, []);

    const loadSystem = useCallback(
        (entities: SystemEntity[], connections: SystemConnection[]) => {
            setState((prev) => ({
                ...prev,
                currentSystem: entities,
                connections,
                selectedEntities: [],
                analysisResults: [],
                optimizations: [],
                simulations: [],
            }));
        },
        []
    );

    const selectEntity = useCallback((entityId: string) => {
        setState((prev) => ({
            ...prev,
            selectedEntities: prev.selectedEntities.includes(entityId)
                ? prev.selectedEntities.filter((id) => id !== entityId)
                : [...prev.selectedEntities, entityId],
        }));
    }, []);

    const analyzeSystem = useCallback(
        async (analysisType: string): Promise<SystemAnalysis> => {
            if (!state.currentSystem) {
                throw new Error('No hay sistema cargado para analizar');
            }

            const analysisId = `analysis-${Date.now()}`;

            // Simulate analysis process
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const findings = generateAnalysisFindings(
                state.currentSystem,
                analysisType
            );
            const recommendations = generateRecommendations(findings);

            const analysis: SystemAnalysis = {
                id: analysisId,
                systemId: 'current-system',
                analysisType: analysisType as any,
                findings,
                recommendations,
                score: calculateSystemScore(findings),
                timestamp: new Date(),
                analyst: 'Sistema Automático',
            };

            setState((prev) => ({
                ...prev,
                analysisResults: [...prev.analysisResults, analysis],
            }));

            return analysis;
        },
        [state.currentSystem]
    );

    const generateAnalysisFindings = (
        entities: SystemEntity[],
        analysisType: string
    ): AnalysisFinding[] => {
        const findings: AnalysisFinding[] = [];

        switch (analysisType) {
            case 'bottleneck':
                entities.forEach((entity) => {
                    const efficiencyMetric = entity.metrics.find(
                        (m) => m.category === 'efficiency'
                    );
                    if (efficiencyMetric && efficiencyMetric.value < 70) {
                        findings.push({
                            id: `finding-${entity.id}`,
                            type: 'issue',
                            severity:
                                efficiencyMetric.value < 50
                                    ? 'critical'
                                    : 'high',
                            description: `${entity.name} presenta baja eficiencia (${efficiencyMetric.value}%)`,
                            evidence: [
                                `Métrica de eficiencia: ${efficiencyMetric.value}%`,
                            ],
                            affectedEntities: [entity.id],
                            impact: {
                                financial:
                                    efficiencyMetric.value < 50 ? 10000 : 5000,
                                operational: 0.8,
                                strategic: 0.6,
                            },
                        });
                    }
                });
                break;

            case 'efficiency':
                const avgEfficiency =
                    entities.reduce((sum, entity) => {
                        const metric = entity.metrics.find(
                            (m) => m.category === 'efficiency'
                        );
                        return sum + (metric?.value || 0);
                    }, 0) / entities.length;

                if (avgEfficiency < 75) {
                    findings.push({
                        id: 'finding-efficiency-global',
                        type: 'opportunity',
                        severity: 'medium',
                        description: `Eficiencia promedio del sistema es ${avgEfficiency.toFixed(1)}%`,
                        evidence: ['Análisis de métricas de eficiencia'],
                        affectedEntities: entities.map((e) => e.id),
                        impact: {
                            financial: 15000,
                            operational: 0.7,
                            strategic: 0.8,
                        },
                    });
                }
                break;

            case 'cost':
                entities.forEach((entity) => {
                    const costMetric = entity.metrics.find(
                        (m) => m.category === 'cost'
                    );
                    if (
                        costMetric &&
                        costMetric.target &&
                        costMetric.value > costMetric.target * 1.2
                    ) {
                        findings.push({
                            id: `finding-cost-${entity.id}`,
                            type: 'issue',
                            severity: 'high',
                            description: `${entity.name} excede el costo objetivo en 20%`,
                            evidence: [
                                `Costo actual: ${costMetric.value}, Objetivo: ${costMetric.target}`,
                            ],
                            affectedEntities: [entity.id],
                            impact: {
                                financial: costMetric.value - costMetric.target,
                                operational: 0.5,
                                strategic: 0.4,
                            },
                        });
                    }
                });
                break;
        }

        return findings;
    };

    const generateRecommendations = (
        findings: AnalysisFinding[]
    ): AnalysisRecommendation[] => {
        const recommendations: AnalysisRecommendation[] = [];

        findings.forEach((finding) => {
            switch (finding.type) {
                case 'issue':
                    if (finding.description.includes('eficiencia')) {
                        recommendations.push({
                            id: `rec-${finding.id}`,
                            title: 'Optimizar Proceso',
                            description:
                                'Implementar mejoras en el proceso para aumentar la eficiencia',
                            priority: finding.severity === 'critical' ? 10 : 7,
                            effort: 5,
                            expectedOutcome: 'Aumento del 20-30% en eficiencia',
                            timeframe: '2-4 semanas',
                            resources: [
                                'Analista de procesos',
                                'Recursos tecnológicos',
                            ],
                            dependencies: ['Aprobación de gerencia'],
                        });
                    }
                    if (finding.description.includes('costo')) {
                        recommendations.push({
                            id: `rec-cost-${finding.id}`,
                            title: 'Reducir Costos Operativos',
                            description:
                                'Revisar y optimizar estructura de costos',
                            priority: 8,
                            effort: 6,
                            expectedOutcome: 'Reducción del 15-25% en costos',
                            timeframe: '4-8 semanas',
                            resources: [
                                'Controller financiero',
                                'Equipo de operaciones',
                            ],
                            dependencies: ['Análisis detallado de costos'],
                        });
                    }
                    break;

                case 'opportunity':
                    recommendations.push({
                        id: `rec-opp-${finding.id}`,
                        title: 'Aprovechar Oportunidad de Mejora',
                        description:
                            'Implementar iniciativas para capitalizar la oportunidad identificada',
                        priority: 6,
                        effort: 4,
                        expectedOutcome: 'Mejora general del sistema',
                        timeframe: '3-6 semanas',
                        resources: ['Equipo multidisciplinario'],
                        dependencies: ['Evaluación de factibilidad'],
                    });
                    break;
            }
        });

        return recommendations;
    };

    const calculateSystemScore = (findings: AnalysisFinding[]): number => {
        let score = 100;

        findings.forEach((finding) => {
            switch (finding.severity) {
                case 'critical':
                    score -= 25;
                    break;
                case 'high':
                    score -= 15;
                    break;
                case 'medium':
                    score -= 10;
                    break;
                case 'low':
                    score -= 5;
                    break;
            }
        });

        return Math.max(0, score);
    };

    const createOptimization = useCallback(
        (optimization: Omit<SystemOptimization, 'id'>) => {
            const newOptimization: SystemOptimization = {
                ...optimization,
                id: `opt-${Date.now()}`,
            };

            setState((prev) => ({
                ...prev,
                optimizations: [...prev.optimizations, newOptimization],
            }));
        },
        []
    );

    const applyOptimization = useCallback(
        async (optimizationId: string): Promise<boolean> => {
            const optimization = state.optimizations.find(
                (opt) => opt.id === optimizationId
            );
            if (!optimization || !state.currentSystem) {
                return false;
            }

            setState((prev) => ({
                ...prev,
                activeOptimization: optimizationId,
            }));

            // Simulate optimization application
            await new Promise((resolve) => setTimeout(resolve, 3000));

            // Apply changes to the system
            const optimizedSystem = state.currentSystem.map((entity) => {
                if (optimization.targetEntities.includes(entity.id)) {
                    return {
                        ...entity,
                        metrics: entity.metrics.map((metric) => {
                            // Simulate improvement based on optimization benefits
                            const benefit = optimization.expectedBenefits.find(
                                (b) =>
                                    b.type === 'efficiency_gain' &&
                                    metric.category === 'efficiency'
                            );

                            if (benefit) {
                                return {
                                    ...metric,
                                    value: Math.min(
                                        100,
                                        metric.value +
                                            benefit.quantification.value
                                    ),
                                };
                            }

                            return metric;
                        }),
                    };
                }
                return entity;
            });

            setState((prev) => ({
                ...prev,
                currentSystem: optimizedSystem,
                activeOptimization: null,
            }));

            return true;
        },
        [state.optimizations, state.currentSystem]
    );

    const runSimulation = useCallback(
        async (scenario: SimulationScenario): Promise<SystemSimulation> => {
            if (!state.currentSystem) {
                throw new Error('No hay sistema cargado para simular');
            }

            const simulation: SystemSimulation = {
                id: `sim-${Date.now()}`,
                name: scenario.name,
                description: scenario.description,
                system: state.currentSystem,
                connections: state.connections,
                scenario,
                results: [],
                duration: 24, // 24 hours simulation
                status: 'running',
                progress: 0,
            };

            setState((prev) => ({
                ...prev,
                simulations: [...prev.simulations, simulation],
            }));

            // Simulate execution
            for (let hour = 0; hour < 24; hour++) {
                await new Promise((resolve) => setTimeout(resolve, 100));

                const result = {
                    id: `result-${hour}`,
                    timestamp: hour,
                    entityStates: {},
                    metrics: {
                        efficiency: 75 + Math.random() * 20,
                        cost: 1000 + Math.random() * 200,
                        quality: 80 + Math.random() * 15,
                    },
                    events: [],
                };

                simulation.results.push(result);
                simulation.progress = ((hour + 1) / 24) * 100;

                setState((prev) => ({
                    ...prev,
                    simulations: prev.simulations.map((sim) =>
                        sim.id === simulation.id ? { ...simulation } : sim
                    ),
                }));
            }

            simulation.status = 'completed';
            return simulation;
        },
        [state.currentSystem, state.connections]
    );

    const updateEntityMetrics = useCallback(
        (entityId: string, metrics: any[]) => {
            if (!state.currentSystem) return;

            const updatedSystem = state.currentSystem.map((entity) =>
                entity.id === entityId ? { ...entity, metrics } : entity
            );

            setState((prev) => ({
                ...prev,
                currentSystem: updatedSystem,
            }));
        },
        [state.currentSystem]
    );

    const addConnection = useCallback(
        (connection: Omit<SystemConnection, 'id'>) => {
            const newConnection: SystemConnection = {
                ...connection,
                id: `conn-${Date.now()}`,
            };

            setState((prev) => ({
                ...prev,
                connections: [...prev.connections, newConnection],
            }));
        },
        []
    );

    const removeConnection = useCallback((connectionId: string) => {
        setState((prev) => ({
            ...prev,
            connections: prev.connections.filter(
                (conn) => conn.id !== connectionId
            ),
        }));
    }, []);

    const setViewMode = useCallback(
        (mode: '2d' | '3d' | 'graph' | 'hierarchy') => {
            setState((prev) => ({
                ...prev,
                viewMode: mode,
            }));
        },
        []
    );

    const filterEntities = useCallback((filters: any) => {
        setState((prev) => ({
            ...prev,
            filters,
        }));
    }, []);

    const exportResults = useCallback(() => {
        return {
            system: state.currentSystem,
            connections: state.connections,
            analysisResults: state.analysisResults,
            optimizations: state.optimizations,
            simulations: state.simulations,
        };
    }, [state]);

    const importConfiguration = useCallback((config: any) => {
        setState((prev) => ({
            ...prev,
            currentSystem: config.system || null,
            connections: config.connections || [],
            analysisResults: config.analysisResults || [],
            optimizations: config.optimizations || [],
            simulations: config.simulations || [],
        }));
    }, []);

    return {
        ...state,
        loadSystem,
        selectEntity,
        analyzeSystem,
        createOptimization,
        applyOptimization,
        runSimulation,
        updateEntityMetrics,
        addConnection,
        removeConnection,
        setViewMode,
        filterEntities,
        exportResults,
        importConfiguration,
    };
};

export default useSystemOptimizer;
