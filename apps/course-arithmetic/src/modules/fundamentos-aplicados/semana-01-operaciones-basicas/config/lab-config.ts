// config/lab-config.ts

import { PhaseConfig, PhaseUnlockCriteria } from '../types/phases';

import { BlockCategory } from '../types/algorithms';

export const LAB_CONFIG = {
    id: 'sistemas-relacionales-lab',
    title: 'Laboratorio de Sistemas Relacionales',
    description:
        'Exploración interactiva de patrones matemáticos en sistemas familiares',
    version: '1.0.0',
    totalDuration: 120, // minutes
    difficultyLevel: 'intermediate',
    prerequisites: [
        'Operaciones básicas',
        'Comprensión de relaciones',
        'Pensamiento lógico',
    ],
    learningObjectives: [
        'Identificar patrones en datos relacionales',
        'Formular y probar hipótesis matemáticas',
        'Construir algoritmos para resolver problemas',
        'Aplicar conceptos a escenarios empresariales',
        'Innovar soluciones originales',
    ],
    assessment: {
        type: 'formative',
        criteria: [
            'Comprensión conceptual',
            'Aplicación práctica',
            'Pensamiento crítico',
            'Creatividad',
            'Colaboración',
        ],
        passingScore: 70,
    },
};

export const PHASE_CONFIGS: PhaseConfig[] = [
    {
        id: 'phase-1-discovery',
        title: 'Fase 1: Descubrimiento de Patrones',
        description: 'Explora familias y descubre patrones matemáticos ocultos',
        objectives: [
            'Explorar al menos 6 familias diferentes',
            'Descubrir 3 patrones matemáticos únicos',
            'Formular y probar 2 hipótesis',
            'Alcanzar 85% de precisión en predicciones',
        ],
        duration: 25,
        order: 1,
        prerequisites: [],
        unlockCriteria: {
            minimumScore: 0,
            requiredTasks: [],
            timeSpent: 0,
            conceptsLearned: [],
        },
        resources: [
            {
                id: 'intro-video',
                type: 'video',
                title: 'Introducción a Sistemas Relacionales',
                url: '/resources/intro-sistemas-relacionales.mp4',
                duration: 3,
                optional: false,
            },
            {
                id: 'pattern-guide',
                type: 'document',
                title: 'Guía de Identificación de Patrones',
                url: '/resources/pattern-identification-guide.pdf',
                optional: true,
            },
        ],
    },
    {
        id: 'phase-2-construction',
        title: 'Fase 2: Construcción de Algoritmos',
        description:
            'Construye algoritmos para automatizar el descubrimiento de patrones',
        objectives: [
            'Completar 4 desafíos algorítmicos',
            'Crear algoritmo con eficiencia >80%',
            'Usar máximo 15 bloques de código',
            'Documentar solución claramente',
        ],
        duration: 35,
        order: 2,
        prerequisites: ['phase-1-discovery'],
        unlockCriteria: {
            minimumScore: 75,
            requiredTasks: [
                'explore-families',
                'discover-patterns',
                'test-hypotheses',
            ],
            timeSpent: 15,
            conceptsLearned: ['pattern-recognition', 'hypothesis-testing'],
        },
        resources: [
            {
                id: 'algorithm-basics',
                type: 'interactive',
                title: 'Fundamentos de Algoritmos',
                url: '/resources/algorithm-basics-interactive',
                duration: 10,
                optional: false,
            },
        ],
    },
    {
        id: 'phase-3-application',
        title: 'Fase 3: Aplicación Empresarial',
        description: 'Aplica conceptos a escenarios empresariales reales',
        objectives: [
            'Resolver 2 casos empresariales',
            'Optimizar sistema con >25% mejora',
            'Satisfacer a 3+ stakeholders',
            'Crear plan de implementación viable',
        ],
        duration: 40,
        order: 3,
        prerequisites: ['phase-2-construction'],
        unlockCriteria: {
            minimumScore: 80,
            requiredTasks: ['complete-algorithms', 'validate-solutions'],
            timeSpent: 25,
            conceptsLearned: ['algorithmic-thinking', 'optimization'],
        },
        resources: [
            {
                id: 'business-cases',
                type: 'document',
                title: 'Casos de Estudio Empresariales',
                url: '/resources/business-cases.pdf',
                optional: false,
            },
        ],
    },
    {
        id: 'phase-4-innovation',
        title: 'Fase 4: Innovación y Creatividad',
        description:
            'Desarrolla soluciones innovadoras y presenta ideas originales',
        objectives: [
            'Desarrollar proyecto innovador',
            'Obtener rating >4.0 de pares',
            'Demostrar originalidad >75%',
            'Presentar solución efectivamente',
        ],
        duration: 20,
        order: 4,
        prerequisites: ['phase-3-application'],
        unlockCriteria: {
            minimumScore: 85,
            requiredTasks: ['solve-business-cases', 'optimize-systems'],
            timeSpent: 45,
            conceptsLearned: ['systems-thinking', 'business-application'],
        },
        resources: [
            {
                id: 'innovation-methods',
                type: 'reference',
                title: 'Métodos de Innovación',
                url: '/resources/innovation-methods-reference',
                optional: true,
            },
        ],
    },
];

export const AVAILABLE_BLOCKS: BlockCategory[] = [
    {
        id: 'input-output',
        name: 'Entrada y Salida',
        description: 'Bloques para recibir datos y mostrar resultados',
        color: '#3B82F6',
        icon: 'ArrowRightLeft',
        blocks: [
            'input-number',
            'input-text',
            'output-display',
            'output-chart',
        ],
    },
    {
        id: 'math-operations',
        name: 'Operaciones Matemáticas',
        description: 'Cálculos y operaciones numéricas',
        color: '#10B981',
        icon: 'Calculator',
        blocks: [
            'add',
            'subtract',
            'multiply',
            'divide',
            'power',
            'sqrt',
            'average',
            'sum',
        ],
    },
    {
        id: 'logic-control',
        name: 'Lógica y Control',
        description: 'Estructuras de control y lógica condicional',
        color: '#F59E0B',
        icon: 'GitBranch',
        blocks: [
            'if-then',
            'if-then-else',
            'for-loop',
            'while-loop',
            'compare',
            'and',
            'or',
            'not',
        ],
    },
    {
        id: 'data-processing',
        name: 'Procesamiento de Datos',
        description: 'Manipulación y análisis de conjuntos de datos',
        color: '#8B5CF6',
        icon: 'Database',
        blocks: [
            'filter',
            'sort',
            'group-by',
            'count',
            'find-max',
            'find-min',
            'unique',
            'join',
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

export const SCORING_WEIGHTS = {
    exploration: 0.25, // Completeness of family exploration
    discovery: 0.3, // Quality and quantity of patterns found
    hypothesis: 0.25, // Accuracy of hypothesis testing
    efficiency: 0.2, // Time efficiency and resource usage
};

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
        criteria: { familiesExplored: 20 },
    },
    {
        id: 'speed-demon',
        title: 'Demonio de la Velocidad',
        description: 'Completar la Fase 1 en menos de 15 minutos',
        icon: 'Zap',
        rarity: 'rare',
        points: 750,
        criteria: { phase1Time: 900 }, // seconds
    },
    {
        id: 'innovator',
        title: 'Innovador',
        description: 'Crear un patrón completamente original',
        icon: 'Lightbulb',
        rarity: 'legendary',
        points: 1000,
        criteria: { originalPattern: true },
    },
];

export const HINT_SYSTEM = {
    maxHints: 3,
    hintDelay: 30, // seconds of inactivity before showing hint
    hintTypes: {
        directional: 'Sugiere la dirección general a seguir',
        specific: 'Proporciona información específica sobre un elemento',
        strategic: 'Ofrece estrategias de alto nivel',
        encouragement: 'Proporciona motivación y ánimo',
    },
    adaptiveHints: true, // Hints adapt based on student performance
    hintPenalty: 0.1, // Score reduction per hint used
};

export const ANALYTICS_CONFIG = {
    trackingEnabled: true,
    anonymizeData: true,
    metricsToTrack: [
        'timeSpent',
        'clicksCount',
        'patternsDiscovered',
        'hypothesesTested',
        'familiesExplored',
        'errorsCount',
        'hintsUsed',
        'achievementsUnlocked',
    ],
    realTimeAnalytics: true,
    batchSize: 50,
    transmissionInterval: 30000, // 30 seconds
};

export const UI_CONFIG = {
    theme: {
        primary: '#3B82F6',
        secondary: '#10B981',
        accent: '#F59E0B',
        neutral: '#6B7280',
        error: '#EF4444',
        warning: '#F59E0B',
        success: '#10B981',
    },
    animations: {
        enabled: true,
        duration: 300,
        easing: 'ease-in-out',
    },
    accessibility: {
        highContrast: false,
        reducedMotion: false,
        screenReaderSupport: true,
        keyboardNavigation: true,
    },
    responsive: {
        breakpoints: {
            mobile: 768,
            tablet: 1024,
            desktop: 1280,
        },
    },
};

export default {
    LAB_CONFIG,
    PHASE_CONFIGS,
    AVAILABLE_BLOCKS,
    DIFFICULTY_SETTINGS,
    SCORING_WEIGHTS,
    ACHIEVEMENT_DEFINITIONS,
    HINT_SYSTEM,
    ANALYTICS_CONFIG,
    UI_CONFIG,
};
