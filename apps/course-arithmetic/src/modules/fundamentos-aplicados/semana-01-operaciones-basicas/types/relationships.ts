// ============================================================================
// TIPOS DE RELACIONES Y FAMILIAS - ARCHIVO COMPLETO
// ============================================================================

// ============================================================================
// TIPOS BÁSICOS DE FAMILIA
// ============================================================================

export interface FamilyMember {
    id: string;
    name: string;
    age?: number;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    birthDate?: Date;
    occupation?: string;
    location?: string;
    bio?: string;
    avatar?: string;
    traits?: string[];
    relationships?: string[]; // IDs de relaciones
}

export interface Relationship {
    id: string;
    person1Id: string;
    person2Id: string;
    type: RelationshipType;
    strength?: number; // 0-1
    description?: string;
    since?: Date;
    status?: 'active' | 'inactive' | 'complicated';
    isDirectional?: boolean;
}

export type RelationshipType =
    | 'parent'
    | 'child'
    | 'sibling'
    | 'spouse'
    | 'grandparent'
    | 'grandchild'
    | 'cousin'
    | 'uncle'
    | 'aunt'
    | 'nephew'
    | 'niece'
    | 'friend'
    | 'colleague'
    | 'mentor'
    | 'student';

export interface FamilyDataset {
    id: string;
    name: string;
    description?: string;
    members: FamilyMember[];
    relationships: Relationship[];
    metadata?: {
        createdAt: Date;
        lastUpdated: Date;
        version: string;
        tags?: string[];
        complexity?: 'simple' | 'medium' | 'complex';
        educationalLevel?: string;
    };
    culturalContext?: {
        region: string;
        traditions?: string[];
        languages?: string[];
    };
}

// ============================================================================
// TIPOS DE PATRONES Y DESCUBRIMIENTOS
// ============================================================================

export type PatternType =
    | 'age_distribution'
    | 'generation_gap'
    | 'relationship_density'
    | 'family_size'
    | 'geographic_spread'
    | 'occupation_clustering'
    | 'naming_patterns'
    | 'arithmetic_progression'
    | 'geometric_progression'
    | 'mathematical_sequence'
    | 'correlation'
    | 'cyclical'
    | 'hierarchical'
    | 'network_effect';

export interface DiscoveredPattern {
    id: string;
    type: PatternType;
    description: string;
    confidence: number; // 0-1
    examples: string[];
    supportingEvidence?: string[];
    mathematicalExpression?: string;
    familyIds: string[];
    discoveredAt: Date;
    complexity: 'simple' | 'medium' | 'complex';
    category: 'demographic' | 'structural' | 'behavioral' | 'mathematical';
}

export interface Pattern {
    id: string;
    type: PatternType;
    description: string;
    formula?: string;
    examples: any[];
    confidence: number;
    applicableContexts: string[];
}

export interface Hypothesis {
    id: string;
    statement: string;
    basedOnPatterns: string[]; // Pattern IDs
    testMethod: string;
    predictions: string[];
    confidence: number;
    status: 'pending' | 'testing' | 'confirmed' | 'refuted';
    createdAt: Date;
    testResults?: TestResult[];
}

export interface TestResult {
    id: string;
    hypothesisId: string;
    testDate: Date;
    methodology: string;
    sampleSize: number;
    results: {
        supported: boolean;
        confidence: number;
        evidence: string[];
        counterEvidence?: string[];
    };
    statisticalSignificance?: number;
}

export interface Discovery {
    id: string;
    title: string;
    description: string;
    type: 'pattern' | 'hypothesis' | 'insight' | 'anomaly';
    significance: 'low' | 'medium' | 'high' | 'breakthrough';
    relatedPatterns: string[];
    relatedHypotheses: string[];
    impact: string;
    discoveredAt: Date;
    verificationStatus: 'unverified' | 'verified' | 'disputed';
}

// ============================================================================
// TIPOS DE ALGORITMOS
// ============================================================================

export interface AlgorithmBlock {
    id: string;
    type: AlgorithmBlockType;
    name: string;
    description: string;
    category: BlockCategory;
    inputs: BlockInput[];
    outputs: BlockOutput[];
    parameters: BlockParameter[];
    position?: { x: number; y: number };
    color?: string;
    icon?: string;
    isValid?: boolean;
    validationErrors?: string[];
    properties?: Record<string, any>;
    size?: { width: number; height: number };
}

export enum AlgorithmBlockType {
    INPUT = 'input',
    PROCESS = 'process',
    DECISION = 'decision',
    OUTPUT = 'output',
    LOOP = 'loop',
    FUNCTION = 'function',
    VARIABLE = 'variable',
    CONSTANT = 'constant',
    CONDITION = 'condition',
    OPERATION = 'operation',
}

export enum BlockCategory {
    DATA_INPUT = 'data_input',
    MATHEMATICAL = 'mathematical',
    LOGICAL = 'logical',
    CONTROL_FLOW = 'control_flow',
    OUTPUT = 'output',
    UTILITIES = 'utilities',
}

export interface BlockInput {
    id: string;
    name: string;
    type: DataType;
    required: boolean;
    defaultValue?: any;
    description?: string;
    validation?: ValidationRule[];
}

export interface BlockOutput {
    id: string;
    name: string;
    type: DataType;
    description?: string;
}

export interface BlockParameter {
    id: string;
    name: string;
    type: 'string' | 'number' | 'boolean' | 'select' | 'range';
    defaultValue: any;
    options?: any[];
    min?: number;
    max?: number;
    step?: number;
    description?: string;
}

export interface BlockConnection {
    id: string;
    sourceBlockId: string;
    sourceOutputId: string;
    targetBlockId: string;
    targetInputId: string;
    isValid?: boolean;
}

export interface ConstructedAlgorithm {
    id: string;
    name: string;
    description?: string;
    blocks: AlgorithmBlock[];
    connections: BlockConnection[];
    metadata: {
        createdAt: Date;
        updatedAt: Date;
        version: string;
        author?: string;
        tags?: string[];
    };
    isValid?: boolean;
    executionHistory?: AlgorithmExecution[];
}

export interface AlgorithmTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    blocks: AlgorithmBlock[];
    connections: BlockConnection[];
    learningObjectives: string[];
    estimatedTime: number; // minutos
}

export interface AlgorithmExecution {
    id: string;
    algorithmId: string;
    startTime: Date;
    endTime?: Date;
    status: 'running' | 'completed' | 'error' | 'cancelled';
    inputs: Record<string, any>;
    outputs?: Record<string, any>;
    errorMessage?: string;
    executionSteps: ExecutionStep[];
    performance: {
        duration: number;
        memoryUsage: number;
        cpuUsage: number;
    };
}

export interface ExecutionStep {
    blockId: string;
    timestamp: Date;
    inputs: Record<string, any>;
    outputs: Record<string, any>;
    duration: number;
    status: 'success' | 'error';
    errorMessage?: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
    suggestions: string[];
    score: number; // 0-100
}

export interface ValidationError {
    id?: string;
    type?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    blockId?: string;
    connectionId?: string;
    field?: string;
}

export interface ValidationWarning {
    message: string;
    blockId?: string;
    type?: string;
}

export interface ValidationRule {
    type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
    value?: any;
    message: string;
    validator?: (value: any) => boolean;
}

export type DataType =
    | 'number'
    | 'string'
    | 'boolean'
    | 'array'
    | 'object'
    | 'family_dataset'
    | 'pattern'
    | 'hypothesis'
    | 'any';

// ============================================================================
// TIPOS DE FASES Y ESTADOS
// ============================================================================

export interface PhaseState {
    currentPhase: number;
    isActive: boolean;
    startTime?: Date;
    endTime?: Date;
    progress: number; // 0-100
    objectives: PhaseObjective[];
    completedObjectives: string[];
    artifacts: CreatedArtifact[];
    timeSpent: number; // segundos
    interactions: PhaseInteraction[];
    achievements: Achievement[];
    reflections: StudentReflection[];
}

export interface PhaseObjective {
    id: string;
    title: string;
    description: string;
    type: 'discovery' | 'creation' | 'analysis' | 'application' | 'reflection';
    priority: 'low' | 'medium' | 'high';
    estimatedTime: number; // minutos
    isCompleted: boolean;
    completedAt?: Date;
    progress: number; // 0-100
    requiredArtifacts?: string[];
    successCriteria: string[];
}

export interface PhaseResults {
    phaseNumber: number;
    totalTime: number;
    objectivesCompleted: number;
    totalObjectives: number;
    artifactsCreated: CreatedArtifact[];
    discoveredPatterns: DiscoveredPattern[];
    testedHypotheses: Hypothesis[];
    achievements: Achievement[];
    finalScore: number;
    feedback: string[];
    recommendations: string[];
    nextSteps: string[];
}

export interface CreatedArtifact {
    id: string;
    type:
        | 'algorithm'
        | 'pattern'
        | 'hypothesis'
        | 'visualization'
        | 'report'
        | 'reflection';
    name: string;
    description: string;
    content: any;
    createdAt: Date;
    phaseNumber: number;
    quality: 'basic' | 'good' | 'excellent' | 'outstanding';
    tags: string[];
    relatedObjectives: string[];
}

export interface StudentReflection {
    id: string;
    phaseNumber: number;
    timestamp: Date;
    prompts: string[];
    responses: string[];
    insights: string[];
    challenges: string[];
    learnings: string[];
    futureGoals: string[];
    metacognition: {
        confidence: number; // 1-5
        understanding: number; // 1-5
        engagement: number; // 1-5
        difficulty: number; // 1-5
    };
}

export interface PhaseInteraction {
    id: string;
    timestamp: Date;
    type:
        | 'click'
        | 'drag'
        | 'input'
        | 'selection'
        | 'creation'
        | 'deletion'
        | 'navigation';
    target: string;
    details: Record<string, any>;
    duration?: number;
    context: string;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
    points: number;
    unlockedAt?: Date;
    criteria: Record<string, any>;
    category:
        | 'discovery'
        | 'creation'
        | 'mastery'
        | 'collaboration'
        | 'innovation';
}

export interface PhaseAchievement extends Achievement {
    phaseNumber: number;
    isHidden?: boolean;
    prerequisiteAchievements?: string[];
}

// ============================================================================
// TIPOS DE ESTADO DEL LABORATORIO
// ============================================================================

export interface LabState {
    id: string;
    studentId?: string;
    sessionId: string;
    startTime: Date;
    lastActiveTime: Date;
    currentPhase: number;
    phases: PhaseState[];
    globalProgress: number; // 0-100
    totalTimeSpent: number; // segundos

    // Datos del laboratorio
    selectedFamilies: FamilyDataset[];
    discoveredPatterns: DiscoveredPattern[];
    createdHypotheses: Hypothesis[];
    constructedAlgorithms: ConstructedAlgorithm[];
    completedTests: TestResult[];

    // Progreso y logros
    achievements: Achievement[];
    totalScore: number;
    skillLevels: SkillLevel[];
    masteryIndicators: MasteryIndicator[];

    // Configuración
    settings: LabSettings;
    preferences: UserPreferences;

    // Estadísticas
    statistics: LabStatistics;
}

export interface SkillLevel {
    skill: string;
    level: number; // 1-5
    experience: number;
    nextLevelRequirement: number;
    recentGains: number[];
    lastUpdated: Date;
}

export interface MasteryIndicator {
    concept: string;
    level: 'novice' | 'developing' | 'proficient' | 'advanced' | 'expert';
    evidence: string[];
    demonstratedAt: Date[];
    needsImprovement: string[];
    strengths: string[];
}

export interface LabSettings {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    showHints: boolean;
    autoSave: boolean;
    soundEnabled: boolean;
    animationsEnabled: boolean;
    language: string;
    theme: 'light' | 'dark' | 'auto';
    accessibility: AccessibilitySettings;
}

export interface AccessibilitySettings {
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
    screenReaderMode: boolean;
    keyboardNavigation: boolean;
    colorBlindMode?: 'protanopia' | 'deuteranopia' | 'tritanopia';
}

export interface UserPreferences {
    favoritePatternTypes: PatternType[];
    preferredVisualizationTypes: string[];
    notificationSettings: NotificationSettings;
    privacySettings: PrivacySettings;
    exportFormats: string[];
}

export interface NotificationSettings {
    achievementUnlocked: boolean;
    phaseCompleted: boolean;
    hintAvailable: boolean;
    errorOccurred: boolean;
    sessionReminder: boolean;
    progressMilestone: boolean;
}

export interface PrivacySettings {
    shareProgress: boolean;
    shareAchievements: boolean;
    allowAnalytics: boolean;
    saveLocalData: boolean;
    shareWithInstructors: boolean;
}

export interface LabStatistics {
    totalSessions: number;
    totalTimeSpent: number; // segundos
    averageSessionDuration: number;
    patternsDiscovered: number;
    hypothesesCreated: number;
    algorithmsBuilt: number;
    successfulTests: number;
    failedTests: number;
    hintsUsed: number;
    errorsEncountered: number;
    achievementsUnlocked: number;
    favoriteActivity: string;
    strongestSkill: string;
    improvementAreas: string[];
    progressTrend: 'improving' | 'stable' | 'declining';
    lastSessionQuality: 'poor' | 'fair' | 'good' | 'excellent';
}

// ============================================================================
// TIPOS PARA COMPONENTES 3D Y VISUALIZACIÓN
// ============================================================================

export interface Scene3DProps {
    families: FamilyDataset[];
    selectedFamily?: FamilyDataset;
    onFamilySelect: (family: FamilyDataset) => void;
    patterns?: DiscoveredPattern[];
    showPatterns?: boolean;
    interactive?: boolean;
    animationSpeed?: number;
    cameraPosition?: [number, number, number];
    lightingIntensity?: number;
    showLabels?: boolean;
    colorScheme?: 'default' | 'warm' | 'cool' | 'monochrome';
}

export interface FamilyScene3DProps extends Scene3DProps {
    highlightedMembers?: string[];
    highlightedRelationships?: string[];
    onMemberClick?: (member: FamilyMember) => void;
    onRelationshipClick?: (relationship: Relationship) => void;
    showAgeProgression?: boolean;
    timelinePosition?: number;
}

export interface RelationshipNetworkVisualizerProps {
    family: FamilyDataset;
    layout: 'force' | 'hierarchical' | 'circular' | 'grid';
    nodeSize: 'uniform' | 'by_age' | 'by_connections';
    edgeThickness: 'uniform' | 'by_strength' | 'by_type';
    showLabels: boolean;
    interactive: boolean;
    onNodeSelect?: (member: FamilyMember) => void;
    onEdgeSelect?: (relationship: Relationship) => void;
    highlightPath?: string[]; // member IDs
    animateLayout?: boolean;
    colorByAttribute?: 'none' | 'generation' | 'gender' | 'age_group';
}

// ============================================================================
// TIPOS PARA SISTEMAS Y OPTIMIZACIÓN
// ============================================================================

export interface SystemDefinition {
    id: string;
    name: string;
    description?: string;
    entities: SystemEntity[];
    relationships: SystemRelationship[];
    objectives: SystemObjective[];
    constraints: SystemConstraint[];
    metadata: {
        createdAt: Date;
        updatedAt: Date;
        version: string;
        author?: string;
    };
}

export interface SystemEntity {
    id: string;
    name: string;
    type: string;
    description?: string;
    properties?: Record<string, any>;
    position?: { x: number; y: number };
    constraints?: string[];
}

export interface SystemRelationship {
    id: string;
    sourceId: string;
    targetId: string;
    type: string;
    strength?: number;
    isDirectional: boolean;
    properties?: Record<string, any>;
    description?: string;
}

export interface SystemObjective {
    id: string;
    description: string;
    type: 'minimize' | 'maximize' | 'achieve' | 'maintain';
    priority: number; // 0-10
    relatedEntities: string[];
    measurable: boolean;
    formula?: string;
}

export interface SystemConstraint {
    id: string;
    formula: string;
    type: 'hard' | 'soft';
    description?: string;
    entities: string[];
    weight?: number;
}

export interface OptimizationProblem {
    id: string;
    name: string;
    description?: string;
    variables: OptimizationVariable[];
    objectives: OptimizationObjective[];
    constraints: OptimizationConstraint[];
    config?: OptimizationConfig;
    system: SystemDefinition;
}

export interface OptimizationVariable {
    name: string;
    type: 'continuous' | 'integer' | 'binary';
    lowerBound?: number;
    upperBound?: number;
    initialValue?: number;
    description?: string;
}

export interface OptimizationObjective {
    expression: string;
    type: 'minimize' | 'maximize';
    weight?: number;
    description?: string;
}

export interface OptimizationConstraint {
    expression: string;
    operator: '<=' | '>=' | '=' | '<' | '>';
    rightHandSide: number;
    description?: string;
}

export interface OptimizationConfig {
    method: 'simplex' | 'genetic' | 'gradient' | 'hybrid';
    maxIterations?: number;
    tolerance?: number;
    timeLimit?: number; // segundos
    populationSize?: number; // para algoritmos genéticos
    crossoverRate?: number;
    mutationRate?: number;
}

export interface OptimizationResult {
    success: boolean;
    status: string;
    objectiveValue: number;
    variables: Record<string, number>;
    iterations: number;
    executionTime: number;
    convergenceHistory: number[];
    message?: string;
    metadata: {
        method: string;
        solvedAt: Date;
        systemId: string;
    };
}

export interface SystemImprovement {
    id: string;
    type: 'efficiency' | 'cost' | 'quality' | 'sustainability' | 'scalability';
    description: string;
    currentValue: number;
    proposedValue: number;
    improvement: number; // porcentaje
    implementationCost: number;
    riskLevel: 'low' | 'medium' | 'high';
    estimatedImpact: string;
    requiredChanges: string[];
    timeline: string;
}

// ============================================================================
// TIPOS PARA PERSONAS ESPECÍFICAS (compatibilidad)
// ============================================================================

export interface Person extends FamilyMember {
    // Alias para FamilyMember para compatibilidad con código existente
}

// ============================================================================
// EXPORTACIONES DE TIPOS ADICIONALES
// ============================================================================

export type EventType =
    | 'member_select'
    | 'pattern_discovery'
    | 'hypothesis_creation'
    | 'test_execution'
    | 'view_change'
    | 'family_select'
    | 'algorithm_execute'
    | 'system_optimize'
    | 'phase_transition';

export type ViewMode = '2d' | '3d' | 'graph' | 'timeline' | 'table';

export type ComplexityLevel = 'simple' | 'medium' | 'complex' | 'expert';

export type LearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'mixed';

export type AssessmentType = 'formative' | 'summative' | 'peer' | 'self';

// ============================================================================
// INTERFACES PARA HOOKS Y CONTEXTOS
// ============================================================================

export interface LabContextValue {
    state: LabState;
    dispatch: React.Dispatch<LabAction>;
    isLoading: boolean;
    error: Error | null;
    saveProgress: () => Promise<void>;
    loadProgress: (sessionId?: string) => Promise<void>;
    resetLab: () => void;
}

export type LabAction =
    | { type: 'SET_PHASE'; payload: number }
    | { type: 'UPDATE_PROGRESS'; payload: { phase: number; progress: number } }
    | { type: 'ADD_PATTERN'; payload: DiscoveredPattern }
    | { type: 'ADD_HYPOTHESIS'; payload: Hypothesis }
    | { type: 'ADD_ALGORITHM'; payload: ConstructedAlgorithm }
    | { type: 'UNLOCK_ACHIEVEMENT'; payload: Achievement }
    | { type: 'UPDATE_SETTINGS'; payload: Partial<LabSettings> }
    | { type: 'SAVE_REFLECTION'; payload: StudentReflection }
    | { type: 'COMPLETE_OBJECTIVE'; payload: string }
    | { type: 'ADD_INTERACTION'; payload: PhaseInteraction }
    | { type: 'SET_ERROR'; payload: Error | null }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'RESET_STATE' };

// ============================================================================
// UTILS Y HELPERS
// ============================================================================

export interface TimeTracker {
    start: () => void;
    stop: () => number;
    pause: () => void;
    resume: () => void;
    getElapsed: () => number;
    reset: () => void;
}

export interface ProgressCalculator {
    calculatePhaseProgress: (phase: PhaseState) => number;
    calculateOverallProgress: (phases: PhaseState[]) => number;
    estimateTimeRemaining: (
        currentProgress: number,
        timeSpent: number
    ) => number;
    getCompletionRate: (objectives: PhaseObjective[]) => number;
}

export interface QualityAssessor {
    assessPatternQuality: (pattern: DiscoveredPattern) => number;
    assessHypothesisQuality: (hypothesis: Hypothesis) => number;
    assessAlgorithmQuality: (algorithm: ConstructedAlgorithm) => number;
    assessOverallQuality: (artifacts: CreatedArtifact[]) => number;
}

// ============================================================================
// CONSTANTES Y ENUMS ADICIONALES
// ============================================================================

export const PATTERN_TYPES: Record<PatternType, string> = {
    age_distribution: 'Distribución de Edades',
    generation_gap: 'Brecha Generacional',
    relationship_density: 'Densidad de Relaciones',
    family_size: 'Tamaño Familiar',
    geographic_spread: 'Dispersión Geográfica',
    occupation_clustering: 'Agrupación Ocupacional',
    naming_patterns: 'Patrones de Nombres',
    arithmetic_progression: 'Progresión Aritmética',
    geometric_progression: 'Progresión Geométrica',
    mathematical_sequence: 'Secuencia Matemática',
    correlation: 'Correlación',
    cyclical: 'Cíclico',
    hierarchical: 'Jerárquico',
    network_effect: 'Efecto de Red',
};

export const RELATIONSHIP_TYPES: Record<RelationshipType, string> = {
    parent: 'Padre/Madre',
    child: 'Hijo/Hija',
    sibling: 'Hermano/Hermana',
    spouse: 'Cónyuge',
    grandparent: 'Abuelo/Abuela',
    grandchild: 'Nieto/Nieta',
    cousin: 'Primo/Prima',
    uncle: 'Tío',
    aunt: 'Tía',
    nephew: 'Sobrino',
    niece: 'Sobrina',
    friend: 'Amigo/Amiga',
    colleague: 'Colega',
    mentor: 'Mentor',
    student: 'Estudiante',
};

export const BLOCK_CATEGORIES: Record<BlockCategory, string> = {
    [BlockCategory.DATA_INPUT]: 'Entrada de Datos',
    [BlockCategory.MATHEMATICAL]: 'Matemático',
    [BlockCategory.LOGICAL]: 'Lógico',
    [BlockCategory.CONTROL_FLOW]: 'Control de Flujo',
    [BlockCategory.OUTPUT]: 'Salida',
    [BlockCategory.UTILITIES]: 'Utilidades',
};

export const ALGORITHM_BLOCK_TYPES: Record<AlgorithmBlockType, string> = {
    [AlgorithmBlockType.INPUT]: 'Entrada',
    [AlgorithmBlockType.PROCESS]: 'Proceso',
    [AlgorithmBlockType.DECISION]: 'Decisión',
    [AlgorithmBlockType.OUTPUT]: 'Salida',
    [AlgorithmBlockType.LOOP]: 'Bucle',
    [AlgorithmBlockType.FUNCTION]: 'Función',
    [AlgorithmBlockType.VARIABLE]: 'Variable',
    [AlgorithmBlockType.CONSTANT]: 'Constante',
    [AlgorithmBlockType.CONDITION]: 'Condición',
    [AlgorithmBlockType.OPERATION]: 'Operación',
};
