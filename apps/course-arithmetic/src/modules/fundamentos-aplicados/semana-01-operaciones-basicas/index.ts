// apps/course-arithmetic/src/modules/fundamentos-aplicados/semana-01-operaciones-basicas/index.ts

// ================= COMPONENTES PRINCIPALES =================
export { default as SistemasRelacionalesLab } from './components/SistemasRelacionalesLab';

// ================= CONFIGURACIÓN =================
export {
    LAB_CONFIG,
    ACHIEVEMENTS_CONFIG,
    validateConfig,
    ALL_FAMILIES,
    AVAILABLE_BLOCKS,
} from './config/lab-config';

// ================= DATOS =================
export {
    COMPLEX_FAMILIES,
    getFamiliesByComplexity,
    getRandomFamily,
    getFamiliesForPhase,
} from './data/familyDatasets';

export {
    ALGORITHM_TEMPLATES,
    BLOCK_CATEGORIES,
    getBlocksByCategory,
    getBlocksByType,
    getBlockById,
    validateBlock,
} from './data/algorithmBlocks';

// ================= HOOKS =================
export { useAnalytics } from './hooks/useAnalytics';
export { useProgressTracking } from './hooks/useProgressTracking';
export { useRelationshipSolver } from './hooks/useRelationshipSolver';
export { useAlgorithmBuilder } from './hooks/useAlgorithmBuilder';
export { useSystemOptimizer } from './hooks/useSystemOptimizer';

// ================= TIPOS - RELATIONSHIPS =================
export type {
    // Tipos base
    Person,
    Relationship,
    Family,
    FamilyDataset,
    FamilyMember,

    // Patrones y análisis
    Pattern,
    DiscoveredPattern,
    Hypothesis,
    Discovery,

    // Estados y eventos
    PhaseState,
    PhaseObjective,
    PhaseResults,
    InteractionEvent,

    // Artefactos y logros
    CreatedArtifact,
    StudentReflection,
    Achievement,
    LabState,

    // Algoritmos de relationships
    AlgorithmBlock as RelationshipAlgorithmBlock,
    BlockInput,
    BlockOutput,
    BlockParameter,
    BlockConnection,
    ConstructedAlgorithm as RelationshipConstructedAlgorithm,
    AlgorithmTemplate,

    // Sistemas de relationships
    SystemDefinition,
    SystemEntity as RelationshipSystemEntity,
    SystemRelationship,
    SystemObjective,
    SystemConstraint,

    // Props de componentes
    FamilyScene3DProps,
    RelationshipNetworkVisualizerProps,
} from './types/relationships';

// ================= TIPOS - PHASES =================
export type {
    // Props de fases
    Phase1DiscoveryProps,
    Phase2ConstructionProps,
    Phase3ApplicationProps,
    Phase4InnovationProps,

    // Configuraciones de fases
    Phase1Config,
    Phase2Config,
    Phase3Config,
    Phase4Config,

    // Props de componentes UI
    AchievementCelebrationProps,
    PhaseTransitionProps,
    ProgressIndicatorProps,
} from './types/phases';

// ================= TIPOS - ALGORITHMS =================
export type {
    AlgorithmStep,
    Algorithm,
    AlgorithmExecutionResult,
} from './types/algorithms';

// ================= TIPOS - SYSTEMS =================
export type {
    SystemEntity,
    SystemMetric,
    SystemConnection,
    SystemOptimization,
    SystemAnalysis,
    SystemSimulation,
    SystemOptimizerState,
    UseSystemOptimizerReturn,
    OptimizationProblem,
    OptimizationResult,
    OptimizationVariable,
    OptimizationObjective,
    OptimizationConstraint,
    OptimizationConfig,
    OptimizationMethod,
    ExecutionEnvironment,
    VariableResult,
    ConstraintResult,
    ResultMetadata,
    Benchmark,
    BenchmarkResult,
    ComparisonMetric,
    RobustnessAnalysis,
    Tradeoff,
} from './types/systems';

// ================= CONFIGURACIÓN POR DEFECTO =================
export const defaultLabConfig = LAB_CONFIG;
export const defaultFamilies = ALL_FAMILIES.slice(0, 5);
export const defaultBlocks = AVAILABLE_BLOCKS.slice(0, 10);

// ================= FUNCIONES DE UTILIDAD =================

/**
 * Valida que la configuración del laboratorio esté completa
 */
export function validateLabSetup(): boolean {
    try {
        return !!(
            LAB_CONFIG &&
            LAB_CONFIG.id &&
            LAB_CONFIG.phases &&
            ALL_FAMILIES &&
            ALL_FAMILIES.length > 0 &&
            AVAILABLE_BLOCKS &&
            AVAILABLE_BLOCKS.length > 0
        );
    } catch (error) {
        console.error('Error validating lab setup:', error);
        return false;
    }
}

/**
 * Obtiene la configuración para una familia específica
 */
export function getFamilyConfig(familyId: string): FamilyDataset | undefined {
    return ALL_FAMILIES.find((family) => family.id === familyId);
}

/**
 * Obtiene las familias recomendadas para un nivel de dificultad
 */
export function getRecommendedFamilies(
    difficulty: 1 | 2 | 3 | 4 | 5,
    limit: number = 5
): FamilyDataset[] {
    return getFamiliesByComplexity(difficulty).slice(0, limit);
}

/**
 * Crea una instancia básica del estado del laboratorio
 */
export function createInitialLabState(): LabState {
    return {
        currentPhase: 1,
        phaseStates: {},
        globalProgress: 0,
        achievements: [],
        artifacts: [],
        reflections: [],
    };
}

/**
 * Verifica si un objetivo está completado
 */
export function isObjectiveCompleted(
    objectiveId: string,
    phaseState: PhaseState
): boolean {
    return phaseState.completedObjectives.includes(objectiveId);
}

/**
 * Calcula el progreso de una fase específica
 */
export function calculatePhaseProgress(
    phaseState: PhaseState,
    totalObjectives: number
): number {
    if (totalObjectives === 0) return 0;
    return (phaseState.completedObjectives.length / totalObjectives) * 100;
}

/**
 * Genera un ID único para eventos
 */
export function generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ================= INFORMACIÓN DEL MÓDULO =================
export const moduleInfo = {
    id: 'fundamentos-aplicados-semana-01',
    title: 'Sistemas Relacionales y Operaciones Básicas',
    version: '1.0.0',
    description:
        'Laboratorio interactivo para explorar relaciones familiares y construir algoritmos',
    author: 'Equipo Educativo',
    lastUpdated: new Date('2024-01-15'),
    estimatedDuration: 90, // minutos
    difficulty: 'intermediate',
    prerequisites: ['arithmetic-basics', 'logical-thinking'],
    learningObjectives: [
        'Identificar patrones en estructuras relacionales',
        'Construir algoritmos básicos paso a paso',
        'Aplicar optimización a problemas reales',
        'Desarrollar pensamiento sistémico',
    ],
    skills: [
        'pattern-recognition',
        'algorithmic-thinking',
        'system-optimization',
    ],
    tags: [
        'relationships',
        'algorithms',
        'systems',
        'optimization',
        'family-structures',
    ],
};

// ================= CONSTANTES DE CONFIGURACIÓN =================
export const MODULE_CONSTANTS = {
    MAX_FAMILIES_PER_PHASE: 10,
    MIN_PATTERNS_FOR_COMPLETION: 2,
    MIN_HYPOTHESES_FOR_COMPLETION: 1,
    DEFAULT_TIME_LIMIT: 30, // minutos
    MAX_INTERACTIONS_TRACKED: 1000,
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutos
} as const;

// ================= EXPORTACIÓN POR DEFECTO =================
export default {
    SistemasRelacionalesLab,
    config: LAB_CONFIG,
    families: ALL_FAMILIES,
    blocks: AVAILABLE_BLOCKS,
    info: moduleInfo,
    utils: {
        validateLabSetup,
        getFamilyConfig,
        getRecommendedFamilies,
        createInitialLabState,
        isObjectiveCompleted,
        calculatePhaseProgress,
        generateEventId,
    },
};

// ================= VERIFICACIÓN DE INTEGRIDAD =================
if (typeof window !== 'undefined') {
    // Solo en el cliente, verificar que todo está configurado correctamente
    console.log(
        `📚 Módulo cargado: ${moduleInfo.title} v${moduleInfo.version}`
    );

    if (!validateLabSetup()) {
        console.warn(
            '⚠️ Advertencia: La configuración del laboratorio no está completa'
        );
    } else {
        console.log('✅ Laboratorio configurado correctamente');
        console.log(`📊 ${ALL_FAMILIES.length} familias disponibles`);
        console.log(
            `🧩 ${AVAILABLE_BLOCKS.length} bloques de algoritmos disponibles`
        );
        console.log(`🎯 ${LAB_CONFIG.achievements.length} logros configurados`);
    }
}
