// hooks/useRelationshipSolver.ts

import {
    DiscoveredPattern,
    ExplorationState,
    Family,
    FamilyMember,
    HypothesisResult,
    InteractionEvent,
    PatternAnalysis,
    PatternType,
    RelationshipSolverState,
    StudentHypothesis,
    UseRelationshipSolverReturn,
} from '../types/relationships';
import { useCallback, useEffect, useState } from 'react';

import { ALL_FAMILIES } from '../data/familyDatasets';

const INITIAL_STATE: RelationshipSolverState = {
    families: ALL_FAMILIES,
    currentFamilyIndex: 0,
    selectedMembers: [],
    discoveredPatterns: [],
    hypotheses: [],
    explorationState: {
        currentFamily: ALL_FAMILIES[0]?.id || '',
        selectedMembers: [],
        discoveredPatterns: [],
        hypotheses: [],
        completedTests: [],
        explorationTime: 0,
        interactions: [],
    },
    analysisResults: [],
};

export const useRelationshipSolver = (): UseRelationshipSolverReturn => {
    const [state, setState] = useState<RelationshipSolverState>(INITIAL_STATE);

    // Auto-save exploration state
    useEffect(() => {
        const timer = setInterval(() => {
            setState((prev) => ({
                ...prev,
                explorationState: {
                    ...prev.explorationState,
                    explorationTime: prev.explorationState.explorationTime + 1,
                },
            }));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const selectFamily = useCallback(
        (index: number) => {
            if (index < 0 || index >= state.families.length) return;

            const family = state.families[index];
            setState((prev) => ({
                ...prev,
                currentFamilyIndex: index,
                selectedMembers: [],
                explorationState: {
                    ...prev.explorationState,
                    currentFamily: family.id,
                    selectedMembers: [],
                },
            }));

            // Track interaction
            trackInteraction('family_select', {
                familyId: family.id,
                familyName: family.name,
            });
        },
        [state.families]
    );

    const selectMember = useCallback(
        (memberId: string) => {
            setState((prev) => {
                const isSelected = prev.selectedMembers.includes(memberId);
                const newSelection = isSelected
                    ? prev.selectedMembers.filter((id) => id !== memberId)
                    : [...prev.selectedMembers, memberId];

                return {
                    ...prev,
                    selectedMembers: newSelection,
                    explorationState: {
                        ...prev.explorationState,
                        selectedMembers: newSelection,
                    },
                };
            });

            // Track interaction
            trackInteraction('member_select', { memberId });

            // Auto-detect patterns when 2+ members are selected
            if (state.selectedMembers.length >= 1) {
                setTimeout(() => autoDetectPatterns(), 500);
            }
        },
        [state.selectedMembers]
    );

    const trackInteraction = useCallback(
        (type: string, data: Record<string, any>) => {
            const interaction: InteractionEvent = {
                id: `interaction-${Date.now()}`,
                type: type as any,
                timestamp: new Date(),
                data,
                familyId: state.explorationState.currentFamily,
            };

            setState((prev) => ({
                ...prev,
                explorationState: {
                    ...prev.explorationState,
                    interactions: [
                        ...prev.explorationState.interactions,
                        interaction,
                    ],
                },
            }));
        },
        [state.explorationState.currentFamily]
    );

    const createHypothesis = useCallback(
        (hypothesis: Omit<StudentHypothesis, 'id' | 'timestamp'>) => {
            const newHypothesis: StudentHypothesis = {
                ...hypothesis,
                id: `hypothesis-${Date.now()}`,
                timestamp: new Date(),
            };

            setState((prev) => ({
                ...prev,
                hypotheses: [...prev.hypotheses, newHypothesis],
                explorationState: {
                    ...prev.explorationState,
                    hypotheses: [
                        ...prev.explorationState.hypotheses,
                        newHypothesis,
                    ],
                },
            }));

            trackInteraction('hypothesis_create', {
                hypothesisId: newHypothesis.id,
                description: newHypothesis.description,
            });
        },
        []
    );

    const testHypothesis = useCallback(
        async (hypothesisId: string): Promise<HypothesisResult> => {
            const hypothesis = state.hypotheses.find(
                (h) => h.id === hypothesisId
            );
            if (!hypothesis) {
                throw new Error('Hipótesis no encontrada');
            }

            // Simulate testing process
            await new Promise((resolve) => setTimeout(resolve, 1500));

            const currentFamily = state.families[state.currentFamilyIndex];
            const testResult = performHypothesisTest(hypothesis, currentFamily);

            setState((prev) => ({
                ...prev,
                explorationState: {
                    ...prev.explorationState,
                    completedTests: [
                        ...prev.explorationState.completedTests,
                        testResult,
                    ],
                },
            }));

            trackInteraction('hypothesis_test', {
                hypothesisId,
                passed: testResult.passed,
                accuracy: testResult.accuracy,
            });

            return testResult;
        },
        [state.hypotheses, state.families, state.currentFamilyIndex]
    );

    const performHypothesisTest = (
        hypothesis: StudentHypothesis,
        family: Family
    ): HypothesisResult => {
        const members = family.members;
        let passed = false;
        let accuracy = 0;
        const evidence: string[] = [];
        const suggestions: string[] = [];
        const discoveredPatterns: DiscoveredPattern[] = [];

        // Test specific hypothesis patterns
        if (hypothesis.description.toLowerCase().includes('edad')) {
            const ageTest = testAgePatterns(members, hypothesis);
            passed = ageTest.passed;
            accuracy = ageTest.accuracy;
            evidence.push(...ageTest.evidence);

            if (ageTest.pattern) {
                discoveredPatterns.push(ageTest.pattern);
            }
        }

        if (
            hypothesis.description.toLowerCase().includes('suma') ||
            hypothesis.description.toLowerCase().includes('total')
        ) {
            const sumTest = testSumPatterns(members, hypothesis);
            passed = passed || sumTest.passed;
            accuracy = Math.max(accuracy, sumTest.accuracy);
            evidence.push(...sumTest.evidence);

            if (sumTest.pattern) {
                discoveredPatterns.push(sumTest.pattern);
            }
        }

        if (
            hypothesis.description.toLowerCase().includes('generación') ||
            hypothesis.description.toLowerCase().includes('nivel')
        ) {
            const generationTest = testGenerationPatterns(members, hypothesis);
            passed = passed || generationTest.passed;
            accuracy = Math.max(accuracy, generationTest.accuracy);
            evidence.push(...generationTest.evidence);

            if (generationTest.pattern) {
                discoveredPatterns.push(generationTest.pattern);
            }
        }

        // Generate suggestions based on results
        if (!passed) {
            suggestions.push(
                'Intenta analizar diferentes aspectos de la familia'
            );
            suggestions.push(
                'Considera revisar las edades y relaciones más detalladamente'
            );
        } else {
            suggestions.push(
                '¡Excelente! Intenta probar este patrón en otras familias'
            );
            suggestions.push(
                'Busca patrones similares o variaciones en diferentes contextos'
            );
        }

        return {
            hypothesisId: hypothesis.id,
            passed,
            accuracy,
            evidence,
            suggestions,
            discoveredPatterns,
        };
    };

    const testAgePatterns = (
        members: FamilyMember[],
        hypothesis: StudentHypothesis
    ): {
        passed: boolean;
        accuracy: number;
        evidence: string[];
        pattern?: DiscoveredPattern;
    } => {
        const ages = members.map((m) => m.age).sort((a, b) => a - b);
        const evidence: string[] = [];

        // Test age differences
        const differences = [];
        for (let i = 1; i < ages.length; i++) {
            differences.push(ages[i] - ages[i - 1]);
        }

        const avgDifference =
            differences.reduce((sum, diff) => sum + diff, 0) /
            differences.length;
        evidence.push(
            `Diferencia promedio de edad: ${avgDifference.toFixed(1)} años`
        );

        // Check for consistent differences (arithmetic progression)
        const isArithmetic = differences.every(
            (diff) => Math.abs(diff - differences[0]) <= 2
        );

        if (isArithmetic) {
            evidence.push(
                `Las edades forman una progresión aritmética con diferencia ${differences[0]}`
            );

            return {
                passed: true,
                accuracy: 85,
                evidence,
                pattern: {
                    id: `pattern-age-${Date.now()}`,
                    type: 'age_difference',
                    description: `Progresión aritmética en edades con diferencia de ${differences[0]} años`,
                    confidence: 0.85,
                    examples: [`Edades: ${ages.join(', ')}`],
                    applicability: 0.7,
                },
            };
        }

        return {
            passed: false,
            accuracy: 30,
            evidence,
        };
    };

    const testSumPatterns = (
        members: FamilyMember[],
        hypothesis: StudentHypothesis
    ): {
        passed: boolean;
        accuracy: number;
        evidence: string[];
        pattern?: DiscoveredPattern;
    } => {
        const evidence: string[] = [];
        const totalAge = members.reduce((sum, member) => sum + member.age, 0);
        const averageAge = totalAge / members.length;

        evidence.push(`Edad total de la familia: ${totalAge} años`);
        evidence.push(`Edad promedio: ${averageAge.toFixed(1)} años`);

        // Test specific sum relationships
        const parents = members.filter((m) => m.generation === 1);
        const children = members.filter((m) => m.generation === 2);

        if (parents.length > 0 && children.length > 0) {
            const parentSum = parents.reduce((sum, p) => sum + p.age, 0);
            const childSum = children.reduce((sum, c) => sum + c.age, 0);
            const ratio = parentSum / childSum;

            evidence.push(
                `Suma edad padres: ${parentSum}, Suma edad hijos: ${childSum}`
            );
            evidence.push(`Ratio padres/hijos: ${ratio.toFixed(2)}`);

            if (ratio >= 1.5 && ratio <= 4.0) {
                return {
                    passed: true,
                    accuracy: 75,
                    evidence,
                    pattern: {
                        id: `pattern-sum-${Date.now()}`,
                        type: 'linear_sum',
                        description: `Los padres suman ${parentSum} años vs ${childSum} años de los hijos`,
                        confidence: 0.75,
                        examples: [`Ratio típico: ${ratio.toFixed(2)}`],
                        applicability: 0.8,
                    },
                };
            }
        }

        return {
            passed: false,
            accuracy: 25,
            evidence,
        };
    };

    const testGenerationPatterns = (
        members: FamilyMember[],
        hypothesis: StudentHypothesis
    ): {
        passed: boolean;
        accuracy: number;
        evidence: string[];
        pattern?: DiscoveredPattern;
    } => {
        const evidence: string[] = [];
        const generations = new Map<number, FamilyMember[]>();

        members.forEach((member) => {
            if (!generations.has(member.generation)) {
                generations.set(member.generation, []);
            }
            generations.get(member.generation)!.push(member);
        });

        evidence.push(`Número de generaciones: ${generations.size}`);

        generations.forEach((members, gen) => {
            const avgAge =
                members.reduce((sum, m) => sum + m.age, 0) / members.length;
            evidence.push(
                `Generación ${gen}: ${members.length} miembros, edad promedio ${avgAge.toFixed(1)}`
            );
        });

        // Check generation age gaps
        const genArray = Array.from(generations.entries()).sort(
            (a, b) => a[0] - b[0]
        );
        if (genArray.length >= 2) {
            const ageGaps = [];

            for (let i = 1; i < genArray.length; i++) {
                const olderGen = genArray[i - 1][1];
                const youngerGen = genArray[i][1];
                const olderAvg =
                    olderGen.reduce((sum, m) => sum + m.age, 0) /
                    olderGen.length;
                const youngerAvg =
                    youngerGen.reduce((sum, m) => sum + m.age, 0) /
                    youngerGen.length;
                ageGaps.push(olderAvg - youngerAvg);
            }

            const avgGap =
                ageGaps.reduce((sum, gap) => sum + gap, 0) / ageGaps.length;
            evidence.push(
                `Brecha generacional promedio: ${avgGap.toFixed(1)} años`
            );

            if (avgGap >= 20 && avgGap <= 35) {
                return {
                    passed: true,
                    accuracy: 80,
                    evidence,
                    pattern: {
                        id: `pattern-generation-${Date.now()}`,
                        type: 'generation_pattern',
                        description: `Brecha generacional típica de ${avgGap.toFixed(1)} años`,
                        confidence: 0.8,
                        examples: [
                            `${generations.size} generaciones identificadas`,
                        ],
                        applicability: 0.9,
                    },
                };
            }
        }

        return {
            passed: false,
            accuracy: 35,
            evidence,
        };
    };

    const autoDetectPatterns = useCallback(() => {
        const currentFamily = state.families[state.currentFamilyIndex];
        const selectedFamilyMembers = currentFamily.members.filter((m) =>
            state.selectedMembers.includes(m.id)
        );

        if (selectedFamilyMembers.length < 2) return;

        const detectedPatterns = analyzeSelectedMembers(selectedFamilyMembers);

        detectedPatterns.forEach((pattern) => {
            if (
                !state.discoveredPatterns.some((p) => p.type === pattern.type)
            ) {
                discoverPattern(pattern);
            }
        });
    }, [
        state.families,
        state.currentFamilyIndex,
        state.selectedMembers,
        state.discoveredPatterns,
    ]);

    const analyzeSelectedMembers = (
        members: FamilyMember[]
    ): DiscoveredPattern[] => {
        const patterns: DiscoveredPattern[] = [];

        // Analyze age relationships
        const ages = members.map((m) => m.age).sort((a, b) => a - b);
        if (ages.length >= 2) {
            const differences = ages.slice(1).map((age, i) => age - ages[i]);
            const avgDiff =
                differences.reduce((sum, diff) => sum + diff, 0) /
                differences.length;

            if (Math.abs(avgDiff - Math.round(avgDiff)) < 0.5) {
                patterns.push({
                    id: `auto-pattern-${Date.now()}`,
                    type: 'age_difference',
                    description: `Diferencia de edad constante de ${Math.round(avgDiff)} años`,
                    confidence: 0.7,
                    examples: [`Edades seleccionadas: ${ages.join(', ')}`],
                    applicability: 0.6,
                });
            }
        }

        // Analyze generation patterns
        const generations = new Set(members.map((m) => m.generation));
        if (generations.size > 1) {
            patterns.push({
                id: `auto-pattern-gen-${Date.now()}`,
                type: 'generation_pattern',
                description: `Múltiples generaciones seleccionadas (${generations.size} niveles)`,
                confidence: 0.8,
                examples: [
                    `Generaciones: ${Array.from(generations).sort().join(', ')}`,
                ],
                applicability: 0.7,
            });
        }

        // Analyze gender distribution
        const genders = members.reduce(
            (acc, m) => {
                acc[m.gender] = (acc[m.gender] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>
        );

        if (Object.keys(genders).length > 1) {
            const total = members.length;
            const distribution = Object.entries(genders)
                .map(
                    ([gender, count]) =>
                        `${gender}: ${((count / total) * 100).toFixed(0)}%`
                )
                .join(', ');

            patterns.push({
                id: `auto-pattern-gender-${Date.now()}`,
                type: 'gender_distribution',
                description: `Distribución de género: ${distribution}`,
                confidence: 0.6,
                examples: [`Total seleccionados: ${total}`],
                applicability: 0.5,
            });
        }

        return patterns;
    };

    const discoverPattern = useCallback(
        (pattern: Omit<DiscoveredPattern, 'id'>) => {
            const newPattern: DiscoveredPattern = {
                ...pattern,
                id: pattern.id || `pattern-${Date.now()}`,
            };

            setState((prev) => ({
                ...prev,
                discoveredPatterns: [...prev.discoveredPatterns, newPattern],
                explorationState: {
                    ...prev.explorationState,
                    discoveredPatterns: [
                        ...prev.explorationState.discoveredPatterns,
                        newPattern,
                    ],
                },
            }));

            trackInteraction('pattern_discovery', {
                patternId: newPattern.id,
                type: newPattern.type,
                confidence: newPattern.confidence,
            });
        },
        []
    );

    const resetExploration = useCallback(() => {
        setState((prev) => ({
            ...prev,
            selectedMembers: [],
            discoveredPatterns: [],
            hypotheses: [],
            explorationState: {
                ...INITIAL_STATE.explorationState,
                currentFamily: prev.explorationState.currentFamily,
            },
        }));
    }, []);

    const calculateRelationshipStrength = useCallback(
        (memberA: string, memberB: string): number => {
            const currentFamily = state.families[state.currentFamilyIndex];
            const relationship = currentFamily.relationships.find(
                (rel) =>
                    (rel.from === memberA && rel.to === memberB) ||
                    (rel.from === memberB && rel.to === memberA)
            );

            return relationship ? relationship.strength : 0;
        },
        [state.families, state.currentFamilyIndex]
    );

    const generateInsights = useCallback((): string[] => {
        const insights: string[] = [];
        const { discoveredPatterns, explorationState } = state;

        if (discoveredPatterns.length === 0) {
            insights.push(
                'Comienza seleccionando miembros de la familia para descubrir patrones'
            );
        } else {
            insights.push(
                `Has descubierto ${discoveredPatterns.length} patrones únicos`
            );
        }

        if (explorationState.hypotheses.length > 0) {
            const testedHypotheses = explorationState.completedTests.length;
            const successRate =
                testedHypotheses > 0
                    ? (
                          (explorationState.completedTests.filter(
                              (t) => t.passed
                          ).length /
                              testedHypotheses) *
                          100
                      ).toFixed(0)
                    : '0';
            insights.push(`Tasa de éxito en hipótesis: ${successRate}%`);
        }

        const explorationTime = Math.floor(
            explorationState.explorationTime / 60
        );
        if (explorationTime > 0) {
            insights.push(`Tiempo de exploración: ${explorationTime} minutos`);
        }

        if (explorationState.interactions.length > 10) {
            insights.push(
                'Has mostrado una exploración muy activa del sistema'
            );
        }

        return insights;
    }, [state.discoveredPatterns, state.explorationState]);

    return {
        ...state,
        selectFamily,
        selectMember,
        createHypothesis,
        testHypothesis,
        discoverPattern,
        resetExploration,
        calculateRelationshipStrength,
        generateInsights,
    };
};

export default useRelationshipSolver;
