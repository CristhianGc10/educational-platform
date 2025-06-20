// types/systems.ts

export interface SystemEntity {
    id: string;
    name: string;
    type: 'department' | 'process' | 'resource' | 'person' | 'system';
    properties: Record<string, any>;
    metrics: SystemMetric[];
    connections: string[];
    position: { x: number; y: number; z?: number };
    status: 'active' | 'inactive' | 'error' | 'optimizing';
}

export interface SystemMetric {
    id: string;
    name: string;
    value: number;
    unit: string;
    target?: number;
    benchmark?: number;
    trend: 'up' | 'down' | 'stable';
    importance: 'low' | 'medium' | 'high' | 'critical';
    category: 'efficiency' | 'cost' | 'quality' | 'time' | 'satisfaction';
}

export interface SystemConnection {
    id: string;
    from: string;
    to: string;
    type: 'data_flow' | 'dependency' | 'communication' | 'resource_sharing';
    strength: number;
    bandwidth?: number;
    latency?: number;
    cost?: number;
    status: 'healthy' | 'warning' | 'critical';
}

export interface SystemOptimization {
    id: string;
    title: string;
    description: string;
    type:
        | 'process_improvement'
        | 'resource_allocation'
        | 'workflow_redesign'
        | 'automation';
    targetEntities: string[];
    expectedBenefits: OptimizationBenefit[];
    implementation: OptimizationStep[];
    constraints: OptimizationConstraint[];
    priority: number;
    effort: number;
    risk: number;
    timeline: number; // days
}

export interface OptimizationBenefit {
    id: string;
    type:
        | 'cost_reduction'
        | 'time_saving'
        | 'quality_improvement'
        | 'efficiency_gain';
    description: string;
    quantification: {
        value: number;
        unit: string;
        confidence: number;
    };
    category: string;
}

export interface OptimizationStep {
    id: string;
    title: string;
    description: string;
    duration: number; // hours
    dependencies: string[];
    resources: string[];
    riskLevel: 'low' | 'medium' | 'high';
    status: 'pending' | 'in_progress' | 'completed' | 'blocked';
}

export interface OptimizationConstraint {
    id: string;
    type: 'budget' | 'time' | 'resources' | 'regulations' | 'stakeholder';
    description: string;
    value: number;
    unit: string;
    flexibility: number; // 0-1
}

export interface SystemAnalysis {
    id: string;
    systemId: string;
    analysisType: 'bottleneck' | 'efficiency' | 'cost' | 'risk' | 'opportunity';
    findings: AnalysisFinding[];
    recommendations: AnalysisRecommendation[];
    score: number;
    timestamp: Date;
    analyst: string;
}

export interface AnalysisFinding {
    id: string;
    type: 'issue' | 'opportunity' | 'strength' | 'weakness';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    evidence: string[];
    affectedEntities: string[];
    impact: {
        financial: number;
        operational: number;
        strategic: number;
    };
}

export interface AnalysisRecommendation {
    id: string;
    title: string;
    description: string;
    priority: number;
    effort: number;
    expectedOutcome: string;
    timeframe: string;
    resources: string[];
    dependencies: string[];
}

export interface SystemOptimizationMethod {
    id: string;
    name: string;
    description: string;
    category: 'mathematical' | 'heuristic' | 'ai_based' | 'simulation';
    applicability: string[];
    complexity: 'low' | 'medium' | 'high';
    reliability: number;
    computationTime: number;
    parameters: OptimizationParameter[];
}

export interface OptimizationParameter {
    id: string;
    name: string;
    type: 'number' | 'boolean' | 'string' | 'array';
    description: string;
    defaultValue: any;
    min?: number;
    max?: number;
    step?: number;
    options?: any[];
}

export interface SystemSimulation {
    id: string;
    name: string;
    description: string;
    system: SystemEntity[];
    connections: SystemConnection[];
    scenario: SimulationScenario;
    results: SimulationResult[];
    duration: number; // simulation time in hours
    status: 'setup' | 'running' | 'completed' | 'error';
    progress: number;
}

export interface SimulationScenario {
    id: string;
    name: string;
    description: string;
    variables: SimulationVariable[];
    events: SimulationEvent[];
    objectives: string[];
}

export interface SimulationVariable {
    id: string;
    name: string;
    type: 'constant' | 'random' | 'function' | 'external';
    value: any;
    distribution?: 'normal' | 'uniform' | 'exponential' | 'poisson';
    parameters?: Record<string, number>;
}

export interface SimulationEvent {
    id: string;
    name: string;
    trigger: 'time' | 'condition' | 'external';
    timing: number;
    condition?: string;
    effects: SimulationEffect[];
}

export interface SimulationEffect {
    id: string;
    entityId: string;
    property: string;
    operation: 'set' | 'add' | 'multiply' | 'function';
    value: any;
    duration?: number;
}

export interface SimulationResult {
    id: string;
    timestamp: number;
    entityStates: Record<string, any>;
    metrics: Record<string, number>;
    events: string[];
}

export interface SystemOptimizerState {
    currentSystem: SystemEntity[] | null;
    connections: SystemConnection[];
    selectedEntities: string[];
    analysisResults: SystemAnalysis[];
    optimizations: SystemOptimization[];
    simulations: SystemSimulation[];
    activeOptimization: string | null;
    optimizationMethods: SystemOptimizationMethod[];
    viewMode: '2d' | '3d' | 'graph' | 'hierarchy';
    filters: {
        entityTypes: string[];
        metricCategories: string[];
        analysisTypes: string[];
    };
}

export interface SystemOptimizerActions {
    loadSystem: (
        entities: SystemEntity[],
        connections: SystemConnection[]
    ) => void;
    selectEntity: (entityId: string) => void;
    analyzeSystem: (analysisType: string) => Promise<SystemAnalysis>;
    createOptimization: (optimization: Omit<SystemOptimization, 'id'>) => void;
    applyOptimization: (optimizationId: string) => Promise<boolean>;
    runSimulation: (scenario: SimulationScenario) => Promise<SystemSimulation>;
    updateEntityMetrics: (entityId: string, metrics: SystemMetric[]) => void;
    addConnection: (connection: Omit<SystemConnection, 'id'>) => void;
    removeConnection: (connectionId: string) => void;
    setViewMode: (mode: '2d' | '3d' | 'graph' | 'hierarchy') => void;
    filterEntities: (filters: any) => void;
    exportResults: () => any;
    importConfiguration: (config: any) => void;
}

export interface UseSystemOptimizerReturn
    extends SystemOptimizerState,
        SystemOptimizerActions {}

export interface SystemTemplate {
    id: string;
    name: string;
    description: string;
    category:
        | 'manufacturing'
        | 'logistics'
        | 'services'
        | 'healthcare'
        | 'education';
    entities: SystemEntity[];
    connections: SystemConnection[];
    defaultOptimizations: SystemOptimization[];
    objectives: string[];
    kpis: string[];
}

export interface OptimizationReport {
    id: string;
    systemId: string;
    optimizationId: string;
    generatedAt: Date;
    executiveSummary: string;
    findings: AnalysisFinding[];
    recommendations: AnalysisRecommendation[];
    implementation: {
        timeline: OptimizationStep[];
        resources: string[];
        budget: number;
        risks: string[];
    };
    expectedOutcomes: {
        shortTerm: string[];
        mediumTerm: string[];
        longTerm: string[];
    };
    metrics: {
        before: Record<string, number>;
        projected: Record<string, number>;
        improvement: Record<string, number>;
    };
}

export interface SystemBenchmark {
    id: string;
    name: string;
    category: string;
    metrics: Record<string, number>;
    percentile: number;
    source: string;
    lastUpdated: Date;
    applicability: string[];
}
