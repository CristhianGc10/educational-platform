// ============================================================================
// TIPOS DE SISTEMAS Y OPTIMIZACIÓN - ARCHIVO COMPLETO
// ============================================================================

// ============================================================================
// TIPOS BÁSICOS DE SISTEMAS
// ============================================================================

export interface SystemDefinition {
    id: string;
    name: string;
    description?: string;
    type:
        | 'family'
        | 'organizational'
        | 'technical'
        | 'economic'
        | 'social'
        | 'hybrid';
    entities: SystemEntity[];
    relationships: SystemRelationship[];
    objectives: SystemObjective[];
    constraints: SystemConstraint[];
    boundaries: SystemBoundary[];
    environment: SystemEnvironment;
    metadata: SystemMetadata;
    version: string;
    status: 'draft' | 'active' | 'archived' | 'deprecated';
}

export interface SystemEntity {
    id: string;
    name: string;
    type: string;
    description?: string;
    properties: Record<string, any>;
    position?: Coordinate;
    dimensions?: Dimensions;
    capacity?: ResourceCapacity;
    constraints: string[];
    relationships: string[]; // relationship IDs
    state: EntityState;
    behavior?: EntityBehavior;
    lifecycle: EntityLifecycle;
}

export interface SystemRelationship {
    id: string;
    name: string;
    sourceId: string;
    targetId: string;
    type: RelationshipType;
    strength: number; // 0-1
    isDirectional: boolean;
    properties: Record<string, any>;
    constraints: RelationshipConstraint[];
    dynamics: RelationshipDynamics;
    cost?: number;
    capacity?: number;
    latency?: number;
    reliability?: number;
}

export interface SystemObjective {
    id: string;
    name: string;
    description: string;
    type: 'minimize' | 'maximize' | 'achieve' | 'maintain' | 'optimize';
    priority: number; // 1-10
    weight: number; // 0-1
    relatedEntities: string[];
    relatedRelationships: string[];
    formula?: string;
    targetValue?: number;
    currentValue?: number;
    measurable: boolean;
    timeframe?: string;
    dependencies: string[];
    conflictsWith?: string[];
}

export interface SystemConstraint {
    id: string;
    name: string;
    description: string;
    formula: string;
    type: 'hard' | 'soft';
    severity: 'low' | 'medium' | 'high' | 'critical';
    entities: string[];
    relationships?: string[];
    weight?: number; // para soft constraints
    penalty?: number; // costo de violación
    negotiable: boolean;
    alternatives?: string[];
    source: 'business' | 'technical' | 'legal' | 'physical' | 'resource';
}

export interface SystemBoundary {
    id: string;
    name: string;
    type: 'physical' | 'logical' | 'temporal' | 'authority' | 'resource';
    description: string;
    entitiesIncluded: string[];
    entitiesExcluded: string[];
    permeability: number; // 0-1, qué tan permeable es el límite
    controlMechanisms: string[];
    monitoringPoints: string[];
}

export interface SystemEnvironment {
    name: string;
    description: string;
    externalFactors: ExternalFactor[];
    stakeholders: Stakeholder[];
    regulations: Regulation[];
    marketConditions?: MarketConditions;
    technologicalContext?: TechnologicalContext;
    socialContext?: SocialContext;
    economicContext?: EconomicContext;
}

export interface SystemMetadata {
    createdAt: Date;
    updatedAt: Date;
    version: string;
    author: string;
    tags: string[];
    category: string;
    complexity: 'simple' | 'moderate' | 'complex' | 'very_complex';
    maturity:
        | 'concept'
        | 'design'
        | 'implementation'
        | 'operation'
        | 'retirement';
    confidentiality: 'public' | 'internal' | 'confidential' | 'restricted';
    changeHistory: ChangeRecord[];
}

// ============================================================================
// TIPOS AUXILIARES DEL SISTEMA
// ============================================================================

export interface Coordinate {
    x: number;
    y: number;
    z?: number;
}

export interface Dimensions {
    width: number;
    height: number;
    depth?: number;
    unit: string;
}

export interface ResourceCapacity {
    type: string;
    maximum: number;
    current: number;
    unit: string;
    renewable: boolean;
    replenishmentRate?: number;
}

export interface EntityState {
    status: 'active' | 'inactive' | 'maintenance' | 'error' | 'deprecated';
    health: number; // 0-1
    utilization: number; // 0-1
    lastUpdated: Date;
    alerts: Alert[];
    metrics: Record<string, number>;
}

export interface EntityBehavior {
    patterns: BehaviorPattern[];
    rules: BusinessRule[];
    reactions: Reaction[];
    adaptations: Adaptation[];
}

export interface EntityLifecycle {
    stage:
        | 'planning'
        | 'design'
        | 'development'
        | 'deployment'
        | 'operation'
        | 'maintenance'
        | 'retirement';
    startDate: Date;
    plannedEndDate?: Date;
    actualEndDate?: Date;
    milestones: Milestone[];
    dependencies: string[];
}

export type RelationshipType =
    | 'dependency'
    | 'communication'
    | 'control'
    | 'data_flow'
    | 'resource_sharing'
    | 'inheritance'
    | 'aggregation'
    | 'composition'
    | 'association'
    | 'collaboration';

export interface RelationshipConstraint {
    type: 'capacity' | 'timing' | 'quality' | 'security' | 'cost';
    value: number;
    unit: string;
    description: string;
    enforceable: boolean;
}

export interface RelationshipDynamics {
    stability: number; // 0-1
    volatility: number; // 0-1
    growth: number; // -1 to 1
    cyclical: boolean;
    seasonality?: SeasonalPattern[];
    trends: Trend[];
}

// ============================================================================
// TIPOS DE OPTIMIZACIÓN
// ============================================================================

export interface OptimizationProblem {
    id: string;
    name: string;
    description: string;
    system: SystemDefinition;
    variables: OptimizationVariable[];
    objectives: OptimizationObjective[];
    constraints: OptimizationConstraint[];
    config: OptimizationConfig;
    status: 'draft' | 'ready' | 'running' | 'completed' | 'failed';
    results?: OptimizationResult[];
    metadata: ProblemMetadata;
}

export interface OptimizationVariable {
    name: string;
    description?: string;
    type: 'continuous' | 'integer' | 'binary' | 'categorical';
    lowerBound?: number;
    upperBound?: number;
    initialValue?: number;
    step?: number;
    categories?: string[]; // para variables categóricas
    relatedEntities: string[];
    cost?: number; // costo de cambiar la variable
    constraints: VariableConstraint[];
    sensitivity?: number; // qué tan sensible es el objetivo a esta variable
}

export interface OptimizationObjective {
    id: string;
    name: string;
    expression: string;
    type: 'minimize' | 'maximize';
    weight: number; // para objetivos múltiples
    priority: number;
    description?: string;
    unit?: string;
    targetValue?: number;
    tolerance?: number;
    relatedVariables: string[];
    components?: ObjectiveComponent[];
}

export interface OptimizationConstraint {
    id: string;
    name: string;
    expression: string;
    operator: '<=' | '>=' | '=' | '<' | '>';
    rightHandSide: number;
    type: 'hard' | 'soft';
    priority?: number;
    penalty?: number; // para soft constraints
    description?: string;
    unit?: string;
    relatedVariables: string[];
    relatedEntities?: string[];
    negotiable: boolean;
}

export interface OptimizationConfig {
    method: SystemOptimizationMethod;
    maxIterations: number;
    tolerance: number;
    timeLimit: number; // segundos
    parallel: boolean;
    randomSeed?: number;

    // Configuraciones específicas por método
    geneticConfig?: GeneticAlgorithmConfig;
    simulatedAnnealingConfig?: SimulatedAnnealingConfig;
    particleSwarmConfig?: ParticleSwarmConfig;
    gradientConfig?: GradientDescentConfig;

    // Configuraciones de convergencia
    convergenceCriteria: ConvergenceCriteria;

    // Configuraciones de logging y monitoreo
    logging: LoggingConfig;
    monitoring: MonitoringConfig;
}

export type SystemOptimizationMethod =
    | 'simplex'
    | 'genetic_algorithm'
    | 'simulated_annealing'
    | 'particle_swarm'
    | 'ant_colony'
    | 'gradient_descent'
    | 'newton_method'
    | 'quasi_newton'
    | 'trust_region'
    | 'branch_and_bound'
    | 'cutting_plane'
    | 'hybrid'
    | 'multi_objective'
    | 'robust_optimization'
    | 'stochastic_programming';

export interface OptimizationResult {
    id: string;
    problemId: string;
    success: boolean;
    status: string;
    message?: string;

    // Resultados principales
    objectiveValue: number;
    objectiveValues?: number[]; // para multi-objetivo
    variables: Record<string, number>;

    // Información de convergencia
    iterations: number;
    executionTime: number;
    convergenceHistory: ConvergencePoint[];
    finalGradient?: number[];
    finalHessian?: number[][];

    // Análisis de sensibilidad
    sensitivity?: SensitivityAnalysis;

    // Validación de restricciones
    constraintViolations: ConstraintViolation[];
    feasible: boolean;

    // Calidad de la solución
    optimality: OptimalityAssessment;

    // Metadatos
    metadata: ResultMetadata;
}

export interface OptimizationReport {
    problem: OptimizationProblem;
    results: OptimizationResult[];
    comparison: ResultComparison;
    recommendations: Recommendation[];
    improvements: SystemImprovement[];
    risksIdentified: Risk[];
    implementationPlan: ImplementationPlan;
    costBenefitAnalysis: CostBenefitAnalysis;
    generatedAt: Date;
}

// ============================================================================
// TIPOS DE CONFIGURACIÓN DE ALGORITMOS
// ============================================================================

export interface GeneticAlgorithmConfig {
    populationSize: number;
    crossoverRate: number;
    mutationRate: number;
    elitismRate: number;
    selectionMethod: 'roulette' | 'tournament' | 'rank' | 'random';
    crossoverMethod: 'single_point' | 'two_point' | 'uniform' | 'arithmetic';
    mutationMethod: 'gaussian' | 'uniform' | 'polynomial' | 'bit_flip';
    tournamentSize?: number;
    diversityMaintenance: boolean;
    adaptiveParameters: boolean;
}

export interface SimulatedAnnealingConfig {
    initialTemperature: number;
    finalTemperature: number;
    coolingRate: number;
    coolingSchedule: 'linear' | 'exponential' | 'logarithmic' | 'adaptive';
    neighbourhoodSize: number;
    acceptanceProbability: 'metropolis' | 'boltzmann' | 'cauchy';
    equilibriumSteps: number;
    reheatingEnabled: boolean;
}

export interface ParticleSwarmConfig {
    swarmSize: number;
    inertiaWeight: number;
    cognitiveComponent: number;
    socialComponent: number;
    velocityLimits: [number, number];
    topology: 'global' | 'local' | 'ring' | 'star';
    constrictionFactor?: number;
    adaptiveParameters: boolean;
}

export interface GradientDescentConfig {
    learningRate: number;
    momentum: number;
    adaptiveLearningRate: boolean;
    gradientClipping: boolean;
    clippingThreshold?: number;
    method:
        | 'standard'
        | 'momentum'
        | 'nesterov'
        | 'adagrad'
        | 'adam'
        | 'rmsprop';
    batchSize?: number;
}

// ============================================================================
// TIPOS DE ANÁLISIS Y EVALUACIÓN
// ============================================================================

export interface SensitivityAnalysis {
    localSensitivity: LocalSensitivityData[];
    globalSensitivity: GlobalSensitivityData[];
    elasticity: ElasticityMeasure[];
    robustness: RobustnessAnalysis;
    worstCaseAnalysis?: WorstCaseScenario[];
}

export interface LocalSensitivityData {
    variableName: string;
    sensitivityCoefficient: number;
    partialDerivative: number;
    standardError?: number;
    confidenceInterval?: [number, number];
}

export interface GlobalSensitivityData {
    variableName: string;
    firstOrderIndex: number;
    totalEffectIndex: number;
    interactionEffects: InteractionEffect[];
    variance: number;
}

export interface ElasticityMeasure {
    variableName: string;
    elasticity: number;
    interpretation: string;
    significance: 'low' | 'medium' | 'high';
}

export interface RobustnessAnalysis {
    stabilityMargin: number;
    criticalVariables: string[];
    scenarioAnalysis: ScenarioResult[];
    monteCarloResults?: MonteCarloAnalysis;
}

export interface ConstraintViolation {
    constraintId: string;
    constraintName: string;
    violationAmount: number;
    violationPercentage: number;
    severity: 'minor' | 'moderate' | 'major' | 'critical';
    suggestion?: string;
}

export interface OptimalityAssessment {
    localOptimality: boolean;
    globalOptimality: 'likely' | 'possible' | 'unlikely' | 'unknown';
    optimalityGap?: number;
    karushKuhnTucker: KKTConditions;
    dualityGap?: number;
    certificateOfOptimality?: string;
}

export interface KKTConditions {
    stationarity: boolean;
    primalFeasibility: boolean;
    dualFeasibility: boolean;
    complementarySlackness: boolean;
    overallSatisfaction: boolean;
}

// ============================================================================
// TIPOS DE MEJORA Y ANÁLISIS DEL SISTEMA
// ============================================================================

export interface SystemImprovement {
    id: string;
    name: string;
    description: string;
    type:
        | 'efficiency'
        | 'cost'
        | 'quality'
        | 'sustainability'
        | 'scalability'
        | 'reliability'
        | 'security';
    category: 'process' | 'structure' | 'technology' | 'policy' | 'resource';

    // Análisis de impacto
    currentState: StateMetrics;
    proposedState: StateMetrics;
    improvement: ImprovementMetrics;

    // Implementación
    implementationPlan: ImplementationStep[];
    timeline: string;
    cost: CostBreakdown;
    resources: ResourceRequirement[];

    // Evaluación
    riskAssessment: RiskAssessment;
    benefitAnalysis: BenefitAnalysis;
    feasibilityScore: number; // 0-1
    priorityScore: number; // 0-1

    // Seguimiento
    kpis: KeyPerformanceIndicator[];
    monitoring: MonitoringPlan;

    // Metadatos
    proposedBy: string;
    proposedAt: Date;
    status: 'proposed' | 'approved' | 'in_progress' | 'completed' | 'rejected';
    approvedBy?: string;
    approvedAt?: Date;
}

export interface StateMetrics {
    efficiency: number;
    cost: number;
    quality: number;
    reliability: number;
    sustainability: number;
    scalability: number;
    customMetrics: Record<string, number>;
}

export interface ImprovementMetrics {
    efficiencyGain: number; // porcentaje
    costSavings: number; // absoluto o porcentaje
    qualityImprovement: number;
    timeReduction: number;
    errorReduction: number;
    customImprovements: Record<string, number>;
}

export interface ImplementationStep {
    id: string;
    name: string;
    description: string;
    phase: number;
    duration: number; // días
    dependencies: string[];
    resources: string[];
    deliverables: string[];
    risks: string[];
    successCriteria: string[];
    responsible: string;
    status:
        | 'not_started'
        | 'in_progress'
        | 'completed'
        | 'blocked'
        | 'cancelled';
}

export interface CostBreakdown {
    categories: CostCategory[];
    totalCost: number;
    currency: string;
    timeframe: string;
    confidence: number; // 0-1
    contingency: number; // porcentaje
}

export interface CostCategory {
    name: string;
    amount: number;
    description: string;
    type: 'one_time' | 'recurring' | 'variable';
    period?: string; // para costos recurrentes
}

export interface ResourceRequirement {
    type: 'human' | 'financial' | 'technical' | 'material' | 'time';
    name: string;
    quantity: number;
    unit: string;
    cost?: number;
    availability: 'available' | 'limited' | 'unavailable';
    critical: boolean;
    alternatives?: string[];
}

export interface RiskAssessment {
    risks: Risk[];
    overallRiskLevel: 'low' | 'medium' | 'high' | 'very_high';
    mitigation: MitigationStrategy[];
    contingencyPlans: ContingencyPlan[];
    monitoring: RiskMonitoring;
}

export interface Risk {
    id: string;
    name: string;
    description: string;
    category:
        | 'technical'
        | 'financial'
        | 'operational'
        | 'market'
        | 'regulatory'
        | 'strategic';
    probability: number; // 0-1
    impact: number; // 0-1
    exposure: number; // probability * impact
    timeframe: string;
    triggers: string[];
    indicators: string[];
    owner: string;
    status:
        | 'identified'
        | 'assessed'
        | 'mitigated'
        | 'accepted'
        | 'transferred'
        | 'avoided';
}

export interface MitigationStrategy {
    riskId: string;
    strategy: 'avoid' | 'reduce' | 'transfer' | 'accept';
    actions: string[];
    cost: number;
    effectiveness: number; // 0-1
    timeline: string;
    responsible: string;
}

export interface ContingencyPlan {
    triggeredBy: string[];
    actions: string[];
    resources: string[];
    timeline: string;
    cost: number;
    responsible: string;
}

export interface RiskMonitoring {
    indicators: RiskIndicator[];
    frequency: string;
    responsible: string;
    escalationProcedure: string[];
}

export interface RiskIndicator {
    name: string;
    description: string;
    threshold: number;
    currentValue?: number;
    trend: 'improving' | 'stable' | 'deteriorating';
    lastUpdated?: Date;
}

export interface BenefitAnalysis {
    quantitativeBenefits: QuantitativeBenefit[];
    qualitativeBenefits: QualitativeBenefit[];
    netPresentValue: number;
    returnOnInvestment: number;
    paybackPeriod: number; // meses
    internalRateOfReturn?: number;
    breakEvenPoint: number; // tiempo en meses
}

export interface QuantitativeBenefit {
    name: string;
    value: number;
    unit: string;
    timeframe: string;
    confidence: number; // 0-1
    recurring: boolean;
    category:
        | 'cost_savings'
        | 'revenue_increase'
        | 'efficiency_gain'
        | 'risk_reduction';
}

export interface QualitativeBenefit {
    name: string;
    description: string;
    impact: 'low' | 'medium' | 'high';
    measurable: boolean;
    indicators?: string[];
    stakeholders: string[];
}

export interface KeyPerformanceIndicator {
    name: string;
    description: string;
    formula: string;
    unit: string;
    target: number;
    current?: number;
    baseline: number;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
    responsible: string;
    trend: 'improving' | 'stable' | 'deteriorating' | 'unknown';
    benchmarks?: Benchmark[];
}

export interface Benchmark {
    name: string;
    value: number;
    source: string;
    date: Date;
    context: string;
}

// ============================================================================
// TIPOS AUXILIARES Y DE SOPORTE
// ============================================================================

export interface ExternalFactor {
    name: string;
    type:
        | 'economic'
        | 'political'
        | 'social'
        | 'technological'
        | 'environmental'
        | 'legal';
    description: string;
    impact: 'positive' | 'negative' | 'neutral';
    probability: number; // 0-1
    controllable: boolean;
    monitoring: boolean;
    trends: Trend[];
}

export interface Stakeholder {
    id: string;
    name: string;
    type: 'internal' | 'external';
    role: string;
    interests: string[];
    influence: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    requirements: string[];
    concerns: string[];
    communicationPreference: string;
    engagementLevel: 'active' | 'passive' | 'resistant';
}

export interface Regulation {
    id: string;
    name: string;
    authority: string;
    type: 'law' | 'regulation' | 'standard' | 'guideline' | 'policy';
    description: string;
    applicability: string[];
    compliance: 'compliant' | 'partial' | 'non_compliant' | 'not_applicable';
    requirements: string[];
    penalties: string[];
    effectiveDate: Date;
    reviewDate?: Date;
}

export interface MarketConditions {
    competitiveness: 'low' | 'medium' | 'high' | 'very_high';
    growth: number; // porcentaje anual
    volatility: number; // 0-1
    maturity: 'emerging' | 'growth' | 'mature' | 'declining';
    trends: MarketTrend[];
    opportunities: string[];
    threats: string[];
}

export interface TechnologicalContext {
    maturity:
        | 'bleeding_edge'
        | 'cutting_edge'
        | 'mainstream'
        | 'legacy'
        | 'obsolete';
    adoptionRate: number; // 0-1
    standardization: 'none' | 'emerging' | 'established' | 'mature';
    dependencies: string[];
    alternatives: string[];
    roadmap: TechnologyRoadmap[];
}

export interface SocialContext {
    acceptability: 'high' | 'medium' | 'low' | 'very_low';
    awareness: number; // 0-1
    demographics: DemographicFactor[];
    culturalFactors: string[];
    behavioralPatterns: string[];
    socialTrends: SocialTrend[];
}

export interface EconomicContext {
    gdpGrowth: number;
    inflation: number;
    unemployment: number;
    interestRates: number;
    exchangeRates?: Record<string, number>;
    marketIndices: MarketIndex[];
    economicIndicators: EconomicIndicator[];
}

export interface ChangeRecord {
    version: string;
    date: Date;
    author: string;
    description: string;
    type: 'major' | 'minor' | 'patch' | 'hotfix';
    affectedComponents: string[];
    impact: 'low' | 'medium' | 'high';
    approvedBy?: string;
}

export interface Alert {
    id: string;
    type: 'info' | 'warning' | 'error' | 'critical';
    message: string;
    timestamp: Date;
    acknowledged: boolean;
    acknowledgedBy?: string;
    acknowledgedAt?: Date;
    resolved: boolean;
    resolvedAt?: Date;
    escalated: boolean;
}

export interface BehaviorPattern {
    name: string;
    description: string;
    frequency: string;
    conditions: string[];
    actions: string[];
    predictability: number; // 0-1
}

export interface BusinessRule {
    id: string;
    name: string;
    description: string;
    condition: string;
    action: string;
    priority: number;
    active: boolean;
    exceptions: string[];
}

export interface Reaction {
    trigger: string;
    condition: string;
    response: string;
    delay?: number;
    probability?: number;
}

export interface Adaptation {
    stimulus: string;
    response: string;
    learningRate: number;
    memory: boolean;
    reversible: boolean;
}

export interface Milestone {
    id: string;
    name: string;
    description: string;
    date: Date;
    status: 'planned' | 'in_progress' | 'completed' | 'delayed' | 'cancelled';
    criteria: string[];
    dependencies: string[];
    deliverables: string[];
    responsible: string;
}

export interface SeasonalPattern {
    season: string;
    factor: number; // multiplicador estacional
    description: string;
    historical: boolean;
}

export interface Trend {
    name: string;
    direction: 'increasing' | 'decreasing' | 'stable' | 'cyclical';
    strength: 'weak' | 'moderate' | 'strong' | 'very_strong';
    confidence: number; // 0-1
    timeframe: string;
    data: TrendDataPoint[];
}

export interface TrendDataPoint {
    timestamp: Date;
    value: number;
    source?: string;
}

export interface MarketTrend extends Trend {
    market: string;
    impact: 'positive' | 'negative' | 'neutral';
    implication: string;
}

export interface SocialTrend extends Trend {
    demographic: string;
    region?: string;
    drivingFactors: string[];
}

export interface TechnologyRoadmap {
    milestone: string;
    date: Date;
    features: string[];
    obsoleted: string[];
    dependencies: string[];
}

export interface DemographicFactor {
    attribute: string;
    value: string | number;
    unit?: string;
    source: string;
    date: Date;
}

export interface MarketIndex {
    name: string;
    value: number;
    change: number;
    changePercent: number;
    timestamp: Date;
}

export interface EconomicIndicator {
    name: string;
    value: number;
    unit: string;
    period: string;
    source: string;
    lastUpdated: Date;
}

// ============================================================================
// TIPOS PARA ANÁLISIS AVANZADOS
// ============================================================================

export interface ConvergenceCriteria {
    objectiveTolerance: number;
    variableTolerance: number;
    gradientTolerance: number;
    maxConsecutiveNoImprovement: number;
    relativeImprovement: number;
    customCriteria?: CustomConvergenceCriterion[];
}

export interface CustomConvergenceCriterion {
    name: string;
    formula: string;
    tolerance: number;
    description: string;
}

export interface LoggingConfig {
    level: 'debug' | 'info' | 'warning' | 'error';
    logObjectiveValues: boolean;
    logVariableValues: boolean;
    logConstraintViolations: boolean;
    logGradients: boolean;
    frequency: number; // cada N iteraciones
    outputFormat: 'text' | 'json' | 'csv' | 'xml';
}

export interface MonitoringConfig {
    enableRealTimeMonitoring: boolean;
    metricsToTrack: string[];
    alertThresholds: Record<string, number>;
    notificationMethod: 'email' | 'sms' | 'webhook' | 'dashboard';
    reportingFrequency: string;
}

export interface ConvergencePoint {
    iteration: number;
    timestamp: Date;
    objectiveValue: number;
    bestObjectiveValue: number;
    improvementRate: number;
    variables: Record<string, number>;
    gradientNorm?: number;
    stepSize?: number;
    feasible: boolean;
    constraintViolations: number;
    computationTime: number;
}

export interface ProblemMetadata {
    createdAt: Date;
    updatedAt: Date;
    author: string;
    version: string;
    tags: string[];
    category: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    estimatedSolveTime: number; // minutos
    benchmarks?: BenchmarkResult[];
}

export interface BenchmarkResult {
    method: string;
    objectiveValue: number;
    solutionTime: number;
    date: Date;
    environment: string;
    notes?: string;
}

export interface ResultMetadata {
    solvedAt: Date;
    environment: ExecutionEnvironment;
    configuration: OptimizationConfig;
    reproducible: boolean;
    randomSeed?: number;
    version: string;
    checksums: Record<string, string>;
}

export interface ExecutionEnvironment {
    platform: string;
    operatingSystem: string;
    architecture: string;
    cpuCores: number;
    memory: number; // GB
    software: SoftwareInfo[];
}

export interface SoftwareInfo {
    name: string;
    version: string;
    configuration?: Record<string, any>;
}

export interface ResultComparison {
    methods: string[];
    metrics: ComparisonMetric[];
    recommendations: string[];
    bestMethod: string;
    tradeoffs: Tradeoff[];
}

export interface ComparisonMetric {
    name: string;
    values: Record<string, number>;
    unit: string;
    higherIsBetter: boolean;
    significance: string;
}

export interface Tradeoff {
    metric1: string;
    metric2: string;
    description: string;
    recommendation: string;
}

export interface Recommendation {
    type: 'implementation' | 'configuration' | 'alternative' | 'improvement';
    priority: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    rationale: string;
    effort: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    timeline: string;
    dependencies: string[];
    risks: string[];
}

export interface ImplementationPlan {
    phases: ImplementationPhase[];
    timeline: string;
    resources: ResourceRequirement[];
    risks: Risk[];
    successMetrics: string[];
    milestones: Milestone[];
    governance: GovernanceStructure;
}

export interface ImplementationPhase {
    name: string;
    description: string;
    duration: string;
    activities: Activity[];
    deliverables: Deliverable[];
    dependencies: string[];
    resources: string[];
    risks: string[];
    successCriteria: string[];
}

export interface Activity {
    name: string;
    description: string;
    duration: number; // días
    effort: number; // persona-días
    dependencies: string[];
    responsible: string;
    skills: string[];
    tools: string[];
}

export interface Deliverable {
    name: string;
    description: string;
    type: 'document' | 'software' | 'model' | 'process' | 'training';
    quality: QualityCriteria;
    acceptance: AcceptanceCriteria;
    delivery: Date;
}

export interface QualityCriteria {
    completeness: string;
    accuracy: string;
    usability: string;
    performance: string;
    maintainability: string;
}

export interface AcceptanceCriteria {
    functionalRequirements: string[];
    nonFunctionalRequirements: string[];
    testCases: string[];
    approver: string;
    signOffRequired: boolean;
}

export interface CostBenefitAnalysis {
    timeframe: string;
    costs: CostCategory[];
    benefits: BenefitCategory[];
    netBenefit: number;
    roi: number;
    paybackPeriod: number;
    npv: number;
    irr?: number;
    sensitivityAnalysis: SensitivityFactor[];
    assumptions: string[];
    risks: FinancialRisk[];
}

export interface BenefitCategory {
    name: string;
    type:
        | 'cost_savings'
        | 'revenue_increase'
        | 'efficiency'
        | 'quality'
        | 'risk_reduction';
    amount: number;
    currency: string;
    timeframe: string;
    probability: number;
    recurring: boolean;
    description: string;
}

export interface SensitivityFactor {
    parameter: string;
    baseValue: number;
    lowEstimate: number;
    highEstimate: number;
    impactOnNPV: number;
    impactOnROI: number;
}

export interface FinancialRisk {
    name: string;
    description: string;
    probability: number;
    financialImpact: number;
    mitigation: string[];
    contingency: number;
}

export interface GovernanceStructure {
    steeringCommittee: CommitteeMember[];
    projectManager: string;
    workingGroups: WorkingGroup[];
    decisionRights: DecisionRight[];
    escalationPath: string[];
    reportingStructure: ReportingRelationship[];
}

export interface CommitteeMember {
    name: string;
    role: string;
    organization: string;
    responsibilities: string[];
    authority: string[];
}

export interface WorkingGroup {
    name: string;
    purpose: string;
    members: string[];
    deliverables: string[];
    schedule: string;
}

export interface DecisionRight {
    decision: string;
    authority: string;
    criteria: string[];
    process: string;
    appealProcess?: string;
}

export interface ReportingRelationship {
    from: string;
    to: string;
    frequency: string;
    format: string;
    content: string[];
}

// ============================================================================
// TIPOS PARA MONITOREO Y ANÁLISIS CONTINUO
// ============================================================================

export interface MonitoringPlan {
    objectives: string[];
    metrics: MonitoringMetric[];
    frequency: string;
    responsible: string[];
    tools: string[];
    escalation: EscalationProcedure;
    reporting: ReportingPlan;
}

export interface MonitoringMetric {
    name: string;
    description: string;
    formula: string;
    unit: string;
    target: number;
    thresholds: ThresholdLevel[];
    dataSource: string;
    collectionMethod: string;
    frequency: string;
    responsible: string;
}

export interface ThresholdLevel {
    level: 'green' | 'yellow' | 'red';
    condition: string;
    action: string[];
    notification: string[];
}

export interface EscalationProcedure {
    levels: EscalationLevel[];
    criteria: string[];
    timeline: string[];
    responsibilities: string[];
}

export interface EscalationLevel {
    level: number;
    title: string;
    authority: string;
    timeframe: string;
    actions: string[];
    contacts: string[];
}

export interface ReportingPlan {
    audiences: ReportingAudience[];
    schedules: ReportingSchedule[];
    formats: ReportingFormat[];
    distribution: DistributionMethod[];
}

export interface ReportingAudience {
    name: string;
    role: string;
    interests: string[];
    level: 'operational' | 'tactical' | 'strategic';
    frequency: string;
    format: string;
}

export interface ReportingSchedule {
    audience: string;
    frequency:
        | 'daily'
        | 'weekly'
        | 'monthly'
        | 'quarterly'
        | 'annually'
        | 'ad_hoc';
    deadline: string;
    responsible: string;
}

export interface ReportingFormat {
    name: string;
    description: string;
    template: string;
    sections: string[];
    metrics: string[];
    visualizations: string[];
}

export interface DistributionMethod {
    method: 'email' | 'portal' | 'meeting' | 'dashboard' | 'print';
    audience: string[];
    security: 'public' | 'internal' | 'confidential' | 'restricted';
    retention: string;
}

// ============================================================================
// TIPOS PARA ANÁLISIS ESPECÍFICOS
// ============================================================================

export interface ScenarioResult {
    scenarioName: string;
    description: string;
    assumptions: string[];
    results: OptimizationResult;
    probability: number;
    impact: 'low' | 'medium' | 'high' | 'critical';
    implications: string[];
    recommendations: string[];
}

export interface MonteCarloAnalysis {
    iterations: number;
    confidenceLevel: number;
    results: MonteCarloResult[];
    statistics: MonteCarloStatistics;
    distributions: VariableDistribution[];
}

export interface MonteCarloResult {
    iteration: number;
    objectiveValue: number;
    variables: Record<string, number>;
    feasible: boolean;
}

export interface MonteCarloStatistics {
    mean: number;
    median: number;
    standardDeviation: number;
    variance: number;
    skewness: number;
    kurtosis: number;
    percentiles: Record<string, number>;
    confidenceIntervals: ConfidenceInterval[];
}

export interface ConfidenceInterval {
    level: number; // e.g., 95 for 95%
    lowerBound: number;
    upperBound: number;
    width: number;
}

export interface VariableDistribution {
    variableName: string;
    distributionType:
        | 'normal'
        | 'uniform'
        | 'triangular'
        | 'beta'
        | 'gamma'
        | 'lognormal';
    parameters: Record<string, number>;
    description: string;
}

export interface WorstCaseScenario {
    name: string;
    description: string;
    variableValues: Record<string, number>;
    objectiveValue: number;
    probability: number;
    mitigationStrategies: string[];
}

export interface InteractionEffect {
    variables: string[];
    effect: number;
    significance: 'low' | 'medium' | 'high';
    interpretation: string;
}

export interface VariableConstraint {
    type: 'bounds' | 'integer' | 'binary' | 'categorical' | 'custom';
    parameters: Record<string, any>;
    description: string;
    enforceable: boolean;
}

export interface ObjectiveComponent {
    name: string;
    weight: number;
    expression: string;
    unit: string;
    description: string;
}

// ============================================================================
// EXPORTACIONES Y ALIASES
// ============================================================================

// Alias para compatibilidad
export type SystemMetrics = StateMetrics;
export type SystemComponent = SystemEntity;
export type OptimizationStrategy = SystemOptimizationMethod;
export type OptimizationMethod = SystemOptimizationMethod;
export type ConstraintResult = ConstraintViolation;
export type VariableResult = LocalSensitivityData;
export type SimulationVariable = OptimizationVariable;

// Exportaciones de enums y constantes
export const SYSTEM_TYPES = {
    FAMILY: 'family',
    ORGANIZATIONAL: 'organizational',
    TECHNICAL: 'technical',
    ECONOMIC: 'economic',
    SOCIAL: 'social',
    HYBRID: 'hybrid',
} as const;

export const OPTIMIZATION_METHODS = {
    SIMPLEX: 'simplex',
    GENETIC_ALGORITHM: 'genetic_algorithm',
    SIMULATED_ANNEALING: 'simulated_annealing',
    PARTICLE_SWARM: 'particle_swarm',
    GRADIENT_DESCENT: 'gradient_descent',
    HYBRID: 'hybrid',
} as const;

export const CONSTRAINT_TYPES = {
    HARD: 'hard',
    SOFT: 'soft',
} as const;

export const OBJECTIVE_TYPES = {
    MINIMIZE: 'minimize',
    MAXIMIZE: 'maximize',
    ACHIEVE: 'achieve',
    MAINTAIN: 'maintain',
    OPTIMIZE: 'optimize',
} as const;
