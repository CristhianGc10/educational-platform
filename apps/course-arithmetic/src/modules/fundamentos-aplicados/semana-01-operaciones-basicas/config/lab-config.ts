// ============================================================================
// CONFIGURACIÓN DEL LABORATORIO - ARCHIVO COMPLETO
// ============================================================================

import { Achievement } from '../types/relationships';
import { PhaseConfig } from '../types/phases';

// ============================================================================
// CONFIGURACIÓN PRINCIPAL DEL LABORATORIO
// ============================================================================

export const LAB_CONFIG = {
    // Información básica
    id: 'fundamentos-aplicados-lab',
    name: 'Laboratorio de Fundamentos Aplicados',
    version: '1.0.0',

    // Duración estimada
    estimatedDuration: 120, // minutos

    // Número de fases
    totalPhases: 4,

    // Configuración de dificultad
    difficulty: {
        beginner: {
            familiesRequired: 2,
            patternsRequired: 1,
            hypothesesRequired: 1,
            accuracyThreshold: 70,
            timeLimit: 40,
            hintsAvailable: 5,
        },
        intermediate: {
            familiesRequired: 4,
            patternsRequired: 2,
            hypothesesRequired: 2,
            accuracyThreshold: 80,
            timeLimit: 30,
            hintsAvailable: 3,
        },
        advanced: {
            familiesRequired: 6,
            patternsRequired: 3,
            hypothesesRequired: 3,
            accuracyThreshold: 90,
            timeLimit: 20,
            hintsAvailable: 1,
        },
    },

    // Pesos para el sistema de puntuación
    scoringWeights: {
        exploration: 0.25,
        discovery: 0.3,
        hypothesis: 0.25,
        efficiency: 0.2,
    },

    // Configuración de progreso
    progress: {
        autoSave: true,
        saveInterval: 30000, // 30 segundos
        enableBackup: true,
        maxAttempts: 3,
    },

    // Configuración de validación
    validation: {
        enableRealTime: true,
        strictMode: false,
        showWarnings: true,
        showSuggestions: true,
    },

    // Límites del sistema
    limits: {
        maxFamilies: 10,
        maxPatterns: 20,
        maxHypotheses: 15,
        maxAlgorithms: 8,
        maxTimePerPhase: 45, // minutos
    },
} as const;

// ============================================================================
// CONFIGURACIÓN DE LOGROS
// ============================================================================

export const ACHIEVEMENTS_CONFIG: Achievement[] = [
    {
        id: 'first-pattern',
        title: 'Primer Descubrimiento',
        description: 'Descubre tu primer patrón matemático',
        icon: 'Search',
        rarity: 'common',
        points: 100,
        criteria: { patternsDiscovered: 1 },
        category: 'discovery',
    },
    {
        id: 'pattern-master',
        title: 'Maestro de Patrones',
        description: 'Descubre 5 patrones diferentes',
        icon: 'Target',
        rarity: 'uncommon',
        points: 250,
        criteria: { patternsDiscovered: 5 },
        category: 'discovery',
    },
    {
        id: 'hypothesis-expert',
        title: 'Experto en Hipótesis',
        description: 'Crea y prueba 3 hipótesis exitosamente',
        icon: 'Lightbulb',
        rarity: 'rare',
        points: 500,
        criteria: { hypothesesTested: 3, successRate: 80 },
        category: 'creation',
    },
    {
        id: 'speed-explorer',
        title: 'Explorador Veloz',
        description: 'Completa la fase 1 en menos de 15 minutos',
        icon: 'Zap',
        rarity: 'uncommon',
        points: 300,
        criteria: { phase1Time: 900 }, // 15 minutos en segundos
        category: 'mastery',
    },
    {
        id: 'family-expert',
        title: 'Experto Familiar',
        description: 'Analiza todas las familias disponibles',
        icon: 'Users',
        rarity: 'rare',
        points: 400,
        criteria: { familiesExplored: 'all' },
        category: 'mastery',
    },
    {
        id: 'innovator',
        title: 'Innovador',
        description: 'Descubre un patrón completamente original',
        icon: 'Star',
        rarity: 'legendary',
        points: 1000,
        criteria: { originalPattern: true },
        category: 'innovation',
    },
    {
        id: 'algorithm-builder',
        title: 'Constructor de Algoritmos',
        description: 'Construye tu primer algoritmo funcional',
        icon: 'Code',
        rarity: 'common',
        points: 150,
        criteria: { algorithmsBuilt: 1 },
        category: 'creation',
    },
    {
        id: 'system-optimizer',
        title: 'Optimizador de Sistemas',
        description: 'Optimiza un sistema con 90% de eficiencia',
        icon: 'Settings',
        rarity: 'rare',
        points: 600,
        criteria: { optimizationEfficiency: 90 },
        category: 'mastery',
    },
    {
        id: 'perfectionist',
        title: 'Perfeccionista',
        description: 'Completa todas las fases con puntuación perfecta',
        icon: 'Award',
        rarity: 'legendary',
        points: 2000,
        criteria: { perfectScore: true },
        category: 'mastery',
    },
    {
        id: 'collaborator',
        title: 'Colaborador',
        description: 'Comparte y recibe feedback de tus creaciones',
        icon: 'Share',
        rarity: 'uncommon',
        points: 200,
        criteria: { collaborations: 1 },
        category: 'collaboration',
    },
];

// ============================================================================
// CONFIGURACIÓN DE CATEGORÍAS DE BLOQUES
// ============================================================================

export const BLOCK_CATEGORIES = [
    {
        id: 'data-input',
        name: 'Entrada de Datos',
        description: 'Bloques para recibir y cargar datos',
        color: '#3B82F6',
        icon: 'Database',
        blocks: [
            'family-loader',
            'data-input',
            'file-reader',
            'user-input',
            'random-generator',
        ],
    },
    {
        id: 'analysis',
        name: 'Análisis',
        description: 'Herramientas para analizar patrones y relaciones',
        color: '#10B981',
        icon: 'BarChart',
        blocks: [
            'pattern-detector',
            'relationship-analyzer',
            'statistics-calculator',
            'correlation-finder',
            'trend-analyzer',
        ],
    },
    {
        id: 'mathematical',
        name: 'Matemático',
        description: 'Operaciones y funciones matemáticas',
        color: '#F59E0B',
        icon: 'Calculator',
        blocks: [
            'arithmetic-operation',
            'statistical-function',
            'geometric-calculation',
            'algebraic-solver',
            'equation-builder',
        ],
    },
    {
        id: 'control-flow',
        name: 'Control de Flujo',
        description: 'Estructuras de control para algoritmos',
        color: '#8B5CF6',
        icon: 'GitBranch',
        blocks: [
            'if-condition',
            'for-loop',
            'while-loop',
            'switch-case',
            'function-call',
        ],
    },
    {
        id: 'pattern-detection',
        name: 'Detección de Patrones',
        description: 'Algoritmos especializados para encontrar patrones',
        color: '#EF4444',
        icon: 'Search',
        blocks: [
            'linear-pattern',
            'sequence-detector',
            'correlation',
            'trend-analysis',
            'clustering',
        ],
    },
    {
        id: 'visualization',
        name: 'Visualización',
        description: 'Herramientas para crear gráficos y visualizaciones',
        color: '#06B6D4',
        icon: 'BarChart3',
        blocks: [
            'line-chart',
            'bar-chart',
            'scatter-plot',
            'histogram',
            'network-graph',
        ],
    },
];

// ============================================================================
// CONFIGURACIÓN DE DIFICULTAD POR FASE
// ============================================================================

export const DIFFICULTY_SETTINGS = {
    beginner: {
        familiesRequired: 4,
        patternsRequired: 2,
        hypothesesRequired: 1,
        accuracyThreshold: 75,
        timeLimit: 35,
        hintsAvailable: 5,
    },
    intermediate: {
        familiesRequired: 6,
        patternsRequired: 3,
        hypothesesRequired: 2,
        accuracyThreshold: 85,
        timeLimit: 25,
        hintsAvailable: 3,
    },
    advanced: {
        familiesRequired: 8,
        patternsRequired: 4,
        hypothesesRequired: 3,
        accuracyThreshold: 90,
        timeLimit: 20,
        hintsAvailable: 1,
    },
};

// ============================================================================
// CONFIGURACIÓN DE PESOS PARA PUNTUACIÓN
// ============================================================================

export const SCORING_WEIGHTS = {
    exploration: 0.25, // Completeness of family exploration
    discovery: 0.3, // Quality and quantity of patterns found
    hypothesis: 0.25, // Accuracy of hypothesis testing
    efficiency: 0.2, // Time efficiency and resource usage
};

// ============================================================================
// DEFINICIONES DE LOGROS
// ============================================================================

export const ACHIEVEMENT_DEFINITIONS = [
    {
        id: 'pattern-seeker',
        title: 'Buscador de Patrones',
        description: 'Descubrir tu primer patrón matemático',
        icon: 'Eye',
        rarity: 'common',
        points: 100,
        criteria: { patternsDiscovered: 1 },
    },
    {
        id: 'hypothesis-master',
        title: 'Maestro de Hipótesis',
        description: 'Probar una hipótesis con 100% de precisión',
        icon: 'Target',
        rarity: 'uncommon',
        points: 250,
        criteria: { hypothesisAccuracy: 100 },
    },
    {
        id: 'explorer',
        title: 'Explorador Incansable',
        description: 'Explorar todas las familias disponibles',
        icon: 'Compass',
        rarity: 'rare',
        points: 500,
        criteria: { familiesExplored: 'all' },
    },
    {
        id: 'speed-demon',
        title: 'Demonio de la Velocidad',
        description: 'Completar una fase en tiempo récord',
        icon: 'Zap',
        rarity: 'uncommon',
        points: 300,
        criteria: { speedRecord: true },
    },
    {
        id: 'perfectionist',
        title: 'Perfeccionista',
        description: 'Obtener puntuación perfecta en todas las fases',
        icon: 'Star',
        rarity: 'legendary',
        points: 1000,
        criteria: { perfectScore: true },
    },
];

// ============================================================================
// CONFIGURACIÓN DE ALGORITMOS DISPONIBLES
// ============================================================================

export const AVAILABLE_ALGORITHMS = [
    {
        id: 'pattern-finder',
        name: 'Buscador de Patrones',
        description: 'Encuentra patrones en datos relacionales',
        category: 'analysis',
        complexity: 'medium',
        inputs: ['family_data'],
        outputs: ['patterns'],
    },
    {
        id: 'relationship-mapper',
        name: 'Mapeador de Relaciones',
        description: 'Crea mapas visuales de relaciones familiares',
        category: 'visualization',
        complexity: 'easy',
        inputs: ['family_data'],
        outputs: ['relationship_map'],
    },
    {
        id: 'hypothesis-tester',
        name: 'Probador de Hipótesis',
        description: 'Valida hipótesis usando datos empíricos',
        category: 'analysis',
        complexity: 'hard',
        inputs: ['hypothesis', 'family_data'],
        outputs: ['test_results'],
    },
];

// ============================================================================
// FUNCIONES DE VALIDACIÓN
// ============================================================================

/**
 * Valida la configuración del laboratorio
 */
export function validateConfig(): boolean {
    try {
        // Validar estructura básica
        if (!LAB_CONFIG.id || !LAB_CONFIG.name) {
            throw new Error('Configuración básica incompleta');
        }

        // Validar fases
        if (LAB_CONFIG.totalPhases < 1 || LAB_CONFIG.totalPhases > 10) {
            throw new Error('Número de fases inválido');
        }

        // Validar dificultades
        const difficulties = Object.keys(LAB_CONFIG.difficulty);
        if (difficulties.length === 0) {
            throw new Error('No se encontraron configuraciones de dificultad');
        }

        // Validar pesos de puntuación
        const totalWeight = Object.values(LAB_CONFIG.scoringWeights).reduce(
            (sum, weight) => sum + weight,
            0
        );

        if (Math.abs(totalWeight - 1.0) > 0.01) {
            throw new Error('Los pesos de puntuación deben sumar 1.0');
        }

        // Validar logros
        if (ACHIEVEMENTS_CONFIG.length === 0) {
            throw new Error('No se encontraron definiciones de logros');
        }

        console.log('✅ Configuración del laboratorio validada correctamente');
        return true;
    } catch (error) {
        console.error('❌ Error en la validación de configuración:', error);
        return false;
    }
}

/**
 * Obtiene la configuración para un nivel de dificultad específico
 */
export function getDifficultyConfig(
    level: 'beginner' | 'intermediate' | 'advanced'
) {
    return LAB_CONFIG.difficulty[level];
}

/**
 * Obtiene los logros disponibles para una categoría
 */
export function getAchievementsByCategory(category: string): Achievement[] {
    return ACHIEVEMENTS_CONFIG.filter(
        (achievement) => achievement.category === category
    );
}

/**
 * Verifica si se cumple el criterio para un logro
 */
export function checkAchievementCriteria(
    achievement: Achievement,
    userStats: Record<string, any>
): boolean {
    const criteria = achievement.criteria;

    for (const [key, value] of Object.entries(criteria)) {
        const userValue = userStats[key];

        if (typeof value === 'number') {
            if (userValue < value) return false;
        } else if (typeof value === 'boolean') {
            if (userValue !== value) return false;
        } else if (value === 'all') {
            // Lógica especial para "all"
            if (!userStats.hasExploredAll) return false;
        }
    }

    return true;
}

/**
 * Calcula la puntuación total basada en los pesos configurados
 */
export function calculateTotalScore(scores: Record<string, number>): number {
    let total = 0;

    for (const [category, weight] of Object.entries(
        LAB_CONFIG.scoringWeights
    )) {
        const score = scores[category] || 0;
        total += score * weight;
    }

    return Math.round(total);
}

// ============================================================================
// CONFIGURACIÓN DE EXPORTACIÓN
// ============================================================================

export default LAB_CONFIG;

// Exportaciones individuales para compatibilidad
export { LAB_CONFIG as labConfig };
export { ACHIEVEMENTS_CONFIG as achievementsConfig };
export { DIFFICULTY_SETTINGS as difficultySettings };
export { SCORING_WEIGHTS as scoringWeights };
export { ACHIEVEMENT_DEFINITIONS as achievementDefinitions };
export { BLOCK_CATEGORIES as blockCategories };
export { AVAILABLE_ALGORITHMS as availableAlgorithms };
