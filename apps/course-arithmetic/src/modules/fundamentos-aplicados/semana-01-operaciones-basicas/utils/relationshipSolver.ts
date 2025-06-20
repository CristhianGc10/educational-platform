// ============================================================================
// UTILIDAD PARA RESOLVER SISTEMAS RELACIONALES
// ============================================================================

import {
    DiscoveredPattern,
    FamilyDataset,
    FamilyMember,
    PatternType,
    Relationship,
    RelationshipType,
} from '../types/relationships';

/**
 * Resultado de análisis matemático
 */
interface MathematicalAnalysis {
    averageAge: number;
    totalAge: number;
    ageRange: { min: number; max: number };
    ageDistribution: Record<string, number>;
    generationGaps: number[];
    commonAgePatterns: string[];
}

/**
 * Resultado de análisis de relaciones
 */
interface RelationshipAnalysis {
    relationshipTypes: Record<RelationshipType, number>;
    familyStructure: string;
    generationLevels: number;
    siblingGroups: FamilyMember[][];
    parentChildPairs: Array<{ parent: FamilyMember; child: FamilyMember }>;
}

/**
 * Pregunta matemática y su solución
 */
interface MathQuestion {
    question: string;
    answer: number | string;
    steps: string[];
    method: string;
    confidence: number;
}

/**
 * Clase principal para resolver sistemas relacionales
 */
class RelationshipSolver {
    private family: FamilyDataset;

    constructor(family: FamilyDataset) {
        this.family = family;
    }

    /**
     * Análisis matemático completo de la familia
     */
    analyzeMathematics(): MathematicalAnalysis {
        const ages = this.family.members.map((member) => member.age);

        const averageAge =
            ages.reduce((sum, age) => sum + age, 0) / ages.length;
        const totalAge = ages.reduce((sum, age) => sum + age, 0);
        const minAge = Math.min(...ages);
        const maxAge = Math.max(...ages);

        // Distribución por décadas
        const ageDistribution: Record<string, number> = {};
        ages.forEach((age) => {
            const decade = `${Math.floor(age / 10) * 10}s`;
            ageDistribution[decade] = (ageDistribution[decade] || 0) + 1;
        });

        // Calcular brechas generacionales
        const generationGaps = this.calculateGenerationGaps();

        // Identificar patrones comunes
        const commonAgePatterns = this.identifyAgePatterns(ages);

        return {
            averageAge: Math.round(averageAge * 100) / 100,
            totalAge,
            ageRange: { min: minAge, max: maxAge },
            ageDistribution,
            generationGaps,
            commonAgePatterns,
        };
    }

    /**
     * Análisis de la estructura de relaciones
     */
    analyzeRelationships(): RelationshipAnalysis {
        const relationshipTypes: Record<RelationshipType, number> =
            {} as Record<RelationshipType, number>;

        // Contar tipos de relaciones
        this.family.relationships.forEach((rel) => {
            relationshipTypes[rel.type] =
                (relationshipTypes[rel.type] || 0) + 1;
        });

        // Determinar estructura familiar
        const familyStructure = this.determineFamilyStructure();

        // Calcular niveles generacionales
        const generationLevels = this.calculateGenerationLevels();

        // Identificar grupos de hermanos
        const siblingGroups = this.identifySiblingGroups();

        // Identificar pares padre-hijo
        const parentChildPairs = this.identifyParentChildPairs();

        return {
            relationshipTypes,
            familyStructure,
            generationLevels,
            siblingGroups,
            parentChildPairs,
        };
    }

    /**
     * Resolver pregunta específica sobre la familia
     */
    solveQuestion(question: string): MathQuestion {
        const questionLower = question.toLowerCase();

        // Edad promedio de padres
        if (
            questionLower.includes('edad promedio') &&
            questionLower.includes('padres')
        ) {
            return this.solveParentAverageAge();
        }

        // Edad total de la familia
        if (
            questionLower.includes('edad total') ||
            questionLower.includes('suma')
        ) {
            return this.solveTotalAge();
        }

        // Diferencia de edad entre hermanos
        if (
            questionLower.includes('diferencia') &&
            questionLower.includes('hermanos')
        ) {
            return this.solveSiblingAgeDifference();
        }

        // Edad promedio por generación
        if (
            questionLower.includes('promedio') &&
            questionLower.includes('generación')
        ) {
            return this.solveGenerationAverage();
        }

        // Persona mayor y menor
        if (
            questionLower.includes('mayor') ||
            questionLower.includes('menor')
        ) {
            return this.solveOldestYoungest();
        }

        // Pregunta no reconocida
        return {
            question,
            answer: 'Pregunta no reconocida',
            steps: ['Analizar pregunta', 'No se encontró método de resolución'],
            method: 'unknown',
            confidence: 0,
        };
    }

    /**
     * Descubrir patrones automáticamente
     */
    discoverPatterns(): DiscoveredPattern[] {
        const patterns: DiscoveredPattern[] = [];

        // Patrón de progresión aritmética en edades
        const arithmeticPattern = this.findArithmeticAgePattern();
        if (arithmeticPattern) patterns.push(arithmeticPattern);

        // Patrón de estructura familiar
        const structurePattern = this.findFamilyStructurePattern();
        if (structurePattern) patterns.push(structurePattern);

        // Patrón de distribución generacional
        const generationalPattern = this.findGenerationalPattern();
        if (generationalPattern) patterns.push(generationalPattern);

        return patterns;
    }

    // ===== MÉTODOS PRIVADOS =====

    private calculateGenerationGaps(): number[] {
        const parentChildPairs = this.identifyParentChildPairs();

        return parentChildPairs.map((pair) => pair.parent.age - pair.child.age);
    }

    private identifyAgePatterns(ages: number[]): string[] {
        const patterns: string[] = [];
        const sortedAges = [...ages].sort((a, b) => a - b);

        // Verificar progresión aritmética
        if (this.isArithmeticProgression(sortedAges)) {
            const difference = sortedAges[1] - sortedAges[0];
            patterns.push(
                `Progresión aritmética con diferencia de ${difference} años`
            );
        }

        // Verificar múltiplos
        const gcd = this.findGCD(sortedAges);
        if (gcd > 1) {
            patterns.push(`Todas las edades son múltiplos de ${gcd}`);
        }

        // Verificar números especiales
        const isPrime = sortedAges.every((age) => this.isPrime(age));
        if (isPrime) {
            patterns.push('Todas las edades son números primos');
        }

        return patterns;
    }

    private determineFamilyStructure(): string {
        const hasGrandparents = this.family.relationships.some(
            (rel) => rel.type === RelationshipType.GRANDPARENT
        );
        const hasParents = this.family.relationships.some(
            (rel) => rel.type === RelationshipType.PARENT
        );
        const hasSiblings = this.family.relationships.some(
            (rel) => rel.type === RelationshipType.SIBLING
        );

        if (hasGrandparents) return 'Familia multigeneracional';
        if (hasParents && hasSiblings) return 'Familia nuclear completa';
        if (hasParents) return 'Familia nuclear';
        return 'Estructura familiar simple';
    }

    private calculateGenerationLevels(): number {
        const generations = new Set<number>();

        // Asignar niveles basados en relaciones
        this.family.members.forEach((member) => {
            const level = this.calculateMemberGenerationLevel(member);
            generations.add(level);
        });

        return generations.size;
    }

    private calculateMemberGenerationLevel(member: FamilyMember): number {
        // Algoritmo simplificado para calcular nivel generacional
        const isGrandparent = this.family.relationships.some(
            (rel) =>
                rel.fromPersonId === member.id &&
                rel.type === RelationshipType.GRANDPARENT
        );
        const isParent = this.family.relationships.some(
            (rel) =>
                rel.fromPersonId === member.id &&
                rel.type === RelationshipType.PARENT
        );
        const isChild = this.family.relationships.some(
            (rel) =>
                rel.toPersonId === member.id &&
                rel.type === RelationshipType.PARENT
        );

        if (isGrandparent) return 0; // Nivel más alto
        if (isParent && !isChild) return 1;
        if (isParent && isChild) return 1; // Generación media
        if (isChild) return 2; // Nivel más bajo

        return 1; // Nivel por defecto
    }

    private identifySiblingGroups(): FamilyMember[][] {
        const groups: FamilyMember[][] = [];
        const processed = new Set<string>();

        this.family.members.forEach((member) => {
            if (processed.has(member.id)) return;

            const siblings = [member];
            processed.add(member.id);

            this.family.relationships
                .filter(
                    (rel) =>
                        rel.type === RelationshipType.SIBLING &&
                        (rel.fromPersonId === member.id ||
                            rel.toPersonId === member.id)
                )
                .forEach((rel) => {
                    const siblingId =
                        rel.fromPersonId === member.id
                            ? rel.toPersonId
                            : rel.fromPersonId;
                    const sibling = this.family.members.find(
                        (m) => m.id === siblingId
                    );

                    if (sibling && !processed.has(sibling.id)) {
                        siblings.push(sibling);
                        processed.add(sibling.id);
                    }
                });

            if (siblings.length > 1) {
                groups.push(siblings);
            }
        });

        return groups;
    }

    private identifyParentChildPairs(): Array<{
        parent: FamilyMember;
        child: FamilyMember;
    }> {
        const pairs: Array<{ parent: FamilyMember; child: FamilyMember }> = [];

        this.family.relationships
            .filter((rel) => rel.type === RelationshipType.PARENT)
            .forEach((rel) => {
                const parent = this.family.members.find(
                    (m) => m.id === rel.fromPersonId
                );
                const child = this.family.members.find(
                    (m) => m.id === rel.toPersonId
                );

                if (parent && child) {
                    pairs.push({ parent, child });
                }
            });

        return pairs;
    }

    private solveParentAverageAge(): MathQuestion {
        const parents = this.getParents();

        if (parents.length === 0) {
            return {
                question: '¿Cuál es la edad promedio de los padres?',
                answer: 'No hay padres en la familia',
                steps: [
                    'Buscar personas con relación de "parent"',
                    'No se encontraron padres',
                ],
                method: 'relationship_analysis',
                confidence: 0,
            };
        }

        const totalAge = parents.reduce((sum, parent) => sum + parent.age, 0);
        const averageAge = totalAge / parents.length;

        return {
            question: '¿Cuál es la edad promedio de los padres?',
            answer: Math.round(averageAge * 100) / 100,
            steps: [
                `Identificar padres: ${parents.map((p) => `${p.name} (${p.age} años)`).join(', ')}`,
                `Sumar edades: ${parents.map((p) => p.age).join(' + ')} = ${totalAge}`,
                `Calcular promedio: ${totalAge} ÷ ${parents.length} = ${averageAge.toFixed(2)}`,
            ],
            method: 'arithmetic_average',
            confidence: 1.0,
        };
    }

    private solveTotalAge(): MathQuestion {
        const totalAge = this.family.members.reduce(
            (sum, member) => sum + member.age,
            0
        );

        return {
            question: '¿Cuál es la edad total de la familia?',
            answer: totalAge,
            steps: [
                `Listar edades: ${this.family.members.map((m) => `${m.name}: ${m.age}`).join(', ')}`,
                `Sumar: ${this.family.members.map((m) => m.age).join(' + ')} = ${totalAge}`,
            ],
            method: 'arithmetic_sum',
            confidence: 1.0,
        };
    }

    private solveSiblingAgeDifference(): MathQuestion {
        const siblingGroups = this.identifySiblingGroups();

        if (siblingGroups.length === 0) {
            return {
                question: '¿Cuál es la diferencia de edad entre hermanos?',
                answer: 'No hay hermanos en la familia',
                steps: [
                    'Buscar relaciones de tipo "sibling"',
                    'No se encontraron hermanos',
                ],
                method: 'relationship_analysis',
                confidence: 0,
            };
        }

        const differences = siblingGroups.map((group) => {
            const ages = group
                .map((sibling) => sibling.age)
                .sort((a, b) => a - b);
            const maxAge = Math.max(...ages);
            const minAge = Math.min(...ages);

            return {
                names: group.map((s) => s.name).join(' y '),
                difference: maxAge - minAge,
                ages: ages,
            };
        });

        const steps = [
            'Identificar grupos de hermanos',
            ...differences.map(
                (d) =>
                    `${d.names}: diferencia = ${Math.max(...d.ages)} - ${Math.min(...d.ages)} = ${d.difference} años`
            ),
        ];

        return {
            question: '¿Cuál es la diferencia de edad entre hermanos?',
            answer: differences
                .map((d) => `${d.names}: ${d.difference} años`)
                .join('; '),
            steps,
            method: 'age_difference',
            confidence: 0.9,
        };
    }

    private solveGenerationAverage(): MathQuestion {
        const generations = this.groupByGeneration();
        const averages = Object.entries(generations).map(([gen, members]) => {
            const avgAge =
                members.reduce((sum, m) => sum + m.age, 0) / members.length;
            return {
                generation: gen,
                average: Math.round(avgAge * 100) / 100,
                count: members.length,
            };
        });

        return {
            question: '¿Cuál es la edad promedio por generación?',
            answer: averages
                .map((a) => `${a.generation}: ${a.average} años`)
                .join('; '),
            steps: [
                'Agrupar por generaciones',
                ...averages.map(
                    (a) =>
                        `${a.generation} (${a.count} personas): promedio = ${a.average} años`
                ),
            ],
            method: 'generational_analysis',
            confidence: 0.85,
        };
    }

    private solveOldestYoungest(): MathQuestion {
        const ages = this.family.members.map((m) => ({
            name: m.name,
            age: m.age,
        }));
        const oldest = ages.reduce((max, current) =>
            current.age > max.age ? current : max
        );
        const youngest = ages.reduce((min, current) =>
            current.age < min.age ? current : min
        );

        return {
            question: '¿Quién es el mayor y el menor de la familia?',
            answer: `Mayor: ${oldest.name} (${oldest.age} años), Menor: ${youngest.name} (${youngest.age} años)`,
            steps: [
                `Comparar todas las edades: ${ages.map((a) => `${a.name}: ${a.age}`).join(', ')}`,
                `Mayor: ${oldest.name} con ${oldest.age} años`,
                `Menor: ${youngest.name} con ${youngest.age} años`,
            ],
            method: 'comparison',
            confidence: 1.0,
        };
    }

    private getParents(): FamilyMember[] {
        const parentIds = new Set(
            this.family.relationships
                .filter((rel) => rel.type === RelationshipType.PARENT)
                .map((rel) => rel.fromPersonId)
        );

        return this.family.members.filter((member) => parentIds.has(member.id));
    }

    private groupByGeneration(): Record<string, FamilyMember[]> {
        const generations: Record<string, FamilyMember[]> = {};

        this.family.members.forEach((member) => {
            const level = this.calculateMemberGenerationLevel(member);
            const genName =
                level === 0 ? 'Abuelos' : level === 1 ? 'Padres' : 'Hijos';

            if (!generations[genName]) {
                generations[genName] = [];
            }
            generations[genName].push(member);
        });

        return generations;
    }

    private findArithmeticAgePattern(): DiscoveredPattern | null {
        const ages = this.family.members
            .map((m) => m.age)
            .sort((a, b) => a - b);

        if (this.isArithmeticProgression(ages)) {
            const difference = ages[1] - ages[0];

            return {
                id: `arithmetic_${Date.now()}`,
                type: PatternType.MATHEMATICAL_SEQUENCE,
                description: `Las edades forman una progresión aritmética con diferencia de ${difference} años`,
                confidence: 0.9,
                supportingEvidence: [
                    `Edades ordenadas: ${ages.join(', ')}`,
                    `Diferencia constante: ${difference}`,
                    'Patrón matemático verificado',
                ],
                discoveryMethod: 'calculation',
                timestamp: new Date(),
                familyId: this.family.id,
            };
        }

        return null;
    }

    private findFamilyStructurePattern(): DiscoveredPattern | null {
        const structure = this.determineFamilyStructure();

        return {
            id: `structure_${Date.now()}`,
            type: PatternType.FAMILY_STRUCTURE,
            description: `Estructura familiar identificada: ${structure}`,
            confidence: 0.95,
            supportingEvidence: [
                `Número de miembros: ${this.family.members.length}`,
                `Tipos de relaciones: ${new Set(this.family.relationships.map((r) => r.type)).size}`,
                `Clasificación: ${structure}`,
            ],
            discoveryMethod: 'observation',
            timestamp: new Date(),
            familyId: this.family.id,
        };
    }

    private findGenerationalPattern(): DiscoveredPattern | null {
        const levels = this.calculateGenerationLevels();
        const gaps = this.calculateGenerationGaps();

        if (gaps.length > 1) {
            const avgGap =
                gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
            const isConsistent = gaps.every(
                (gap) => Math.abs(gap - avgGap) <= 5
            );

            if (isConsistent) {
                return {
                    id: `generation_${Date.now()}`,
                    type: PatternType.GENERATION_PATTERN,
                    description: `Brecha generacional consistente de aproximadamente ${Math.round(avgGap)} años`,
                    confidence: 0.8,
                    supportingEvidence: [
                        `${levels} niveles generacionales`,
                        `Brechas: ${gaps.join(', ')} años`,
                        `Promedio: ${avgGap.toFixed(1)} años`,
                    ],
                    discoveryMethod: 'calculation',
                    timestamp: new Date(),
                    familyId: this.family.id,
                };
            }
        }

        return null;
    }

    // Utilidades matemáticas
    private isArithmeticProgression(numbers: number[]): boolean {
        if (numbers.length < 2) return false;

        const difference = numbers[1] - numbers[0];
        for (let i = 2; i < numbers.length; i++) {
            if (numbers[i] - numbers[i - 1] !== difference) {
                return false;
            }
        }
        return true;
    }

    private findGCD(numbers: number[]): number {
        const gcd = (a: number, b: number): number =>
            b === 0 ? a : gcd(b, a % b);
        return numbers.reduce(gcd);
    }

    private isPrime(n: number): boolean {
        if (n < 2) return false;
        for (let i = 2; i <= Math.sqrt(n); i++) {
            if (n % i === 0) return false;
        }
        return true;
    }
}

/**
 * Función de conveniencia para crear un solucionador
 */
export function createRelationshipSolver(
    family: FamilyDataset
): RelationshipSolver {
    return new RelationshipSolver(family);
}

/**
 * Función para resolver múltiples preguntas
 */
export function solveMultipleQuestions(
    family: FamilyDataset,
    questions: string[]
): MathQuestion[] {
    const solver = new RelationshipSolver(family);
    return questions.map((question) => solver.solveQuestion(question));
}

/**
 * Función para análisis rápido
 */
export function quickAnalysis(family: FamilyDataset) {
    const solver = new RelationshipSolver(family);

    return {
        mathematics: solver.analyzeMathematics(),
        relationships: solver.analyzeRelationships(),
        patterns: solver.discoverPatterns(),
        commonQuestions: {
            totalAge: solver.solveQuestion(
                '¿Cuál es la edad total de la familia?'
            ),
            averageAge: solver.solveQuestion(
                '¿Cuál es la edad promedio de la familia?'
            ),
            oldestYoungest: solver.solveQuestion(
                '¿Quién es el mayor y el menor?'
            ),
        },
    };
}

export default RelationshipSolver;
