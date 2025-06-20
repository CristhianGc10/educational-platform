// ============================================================================
// TIPOS DE ALGORITMOS - ARCHIVO COMPLETO
// ============================================================================

import {
    AlgorithmBlock,
    AlgorithmBlockType,
    BlockCategory,
    BlockConnection,
    ConstructedAlgorithm,
    DataType,
    ValidationResult,
} from './relationships';

// ============================================================================
// TIPOS BÁSICOS DE ALGORITMOS
// ============================================================================

export interface Algorithm {
    id: string;
    name: string;
    description: string;
    category: AlgorithmCategory;
    complexity: AlgorithmComplexity;
    steps: AlgorithmStep[];
    inputs: AlgorithmInput[];
    outputs: AlgorithmOutput[];
    preconditions: string[];
    postconditions: string[];
    invariants: string[];
    metadata: AlgorithmMetadata;
    implementation?: AlgorithmImplementation;
    analysis?: AlgorithmAnalysis;
    testing?: AlgorithmTesting;
    documentation?: AlgorithmDocumentation;
}

export interface AlgorithmStep {
    id: string;
    order: number;
    name: string;
    description: string;
    type: StepType;
    operation: string;
    parameters: StepParameter[];
    conditions?: StepCondition[];
    loops?: LoopConfiguration;
    branches?: BranchConfiguration[];
    subSteps?: AlgorithmStep[];
    timeComplexity: string;
    spaceComplexity: string;
    critical: boolean;
    parallelizable: boolean;
    dependencies: string[];
}

export interface AlgorithmInput {
    name: string;
    type: DataType;
    description: string;
    required: boolean;
    defaultValue?: any;
    constraints: InputConstraint[];
    examples: any[];
    validation: ValidationRule[];
}

export interface AlgorithmOutput {
    name: string;
    type: DataType;
    description: string;
    guaranteed: boolean;
    constraints: OutputConstraint[];
    examples: any[];
    format?: OutputFormat;
}

export interface AlgorithmMetadata {
    author: string;
    version: string;
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
    license: string;
    references: Reference[];
    relatedAlgorithms: string[];
    applications: string[];
    limitations: string[];
    assumptions: string[];
    performance: PerformanceCharacteristics;
}

// ============================================================================
// TIPOS DE CATEGORIZACIÓN Y COMPLEJIDAD
// ============================================================================

export type AlgorithmCategory =
    | 'sorting'
    | 'searching'
    | 'graph'
    | 'dynamic_programming'
    | 'greedy'
    | 'divide_and_conquer'
    | 'backtracking'
    | 'mathematical'
    | 'string_processing'
    | 'geometric'
    | 'optimization'
    | 'machine_learning'
    | 'data_analysis'
    | 'pattern_recognition'
    | 'simulation'
    | 'heuristic'
    | 'approximation'
    | 'randomized'
    | 'parallel'
    | 'distributed'
    | 'custom';

export interface AlgorithmComplexity {
    time: ComplexityAnalysis;
    space: ComplexityAnalysis;
    communication?: ComplexityAnalysis; // para algoritmos distribuidos
    overall:
        | 'constant'
        | 'logarithmic'
        | 'linear'
        | 'linearithmic'
        | 'quadratic'
        | 'cubic'
        | 'exponential'
        | 'factorial';
    bestCase: string;
    averageCase: string;
    worstCase: string;
    amortized?: string;
    practical: PracticalComplexity;
}

export interface ComplexityAnalysis {
    notation: string; // e.g., "O(n log n)"
    variables: ComplexityVariable[];
    explanation: string;
    constants?: number[];
    lowerBounds?: string[];
    upperBounds?: string[];
    tightBounds?: string[];
}

export interface ComplexityVariable {
    symbol: string;
    description: string;
    typical: number;
    range: [number, number];
    growth: 'constant' | 'slow' | 'medium' | 'fast' | 'exponential';
}

export interface PracticalComplexity {
    smallInput: string; // n < 100
    mediumInput: string; // 100 <= n < 10000
    largeInput: string; // n >= 10000
    memoryUsage: string;
    cacheFriendly: boolean;
    parallelizable: boolean;
    scalability: 'poor' | 'fair' | 'good' | 'excellent';
}

// ============================================================================
// TIPOS DE PASOS Y OPERACIONES
// ============================================================================

export type StepType =
    | 'input'
    | 'output'
    | 'assignment'
    | 'comparison'
    | 'arithmetic'
    | 'logical'
    | 'conditional'
    | 'loop'
    | 'function_call'
    | 'data_structure_operation'
    | 'sorting'
    | 'searching'
    | 'filtering'
    | 'mapping'
    | 'reduction'
    | 'aggregation'
    | 'transformation'
    | 'validation'
    | 'optimization'
    | 'termination'
    | 'custom';

export interface StepParameter {
    name: string;
    type: DataType;
    value: any;
    description: string;
    mutable: boolean;
    scope: 'local' | 'global' | 'parameter';
}

export interface StepCondition {
    type: 'precondition' | 'postcondition' | 'guard' | 'invariant';
    expression: string;
    description: string;
    critical: boolean;
    checkable: boolean;
}

export interface LoopConfiguration {
    type: 'for' | 'while' | 'do_while' | 'foreach' | 'repeat';
    initialization?: string;
    condition: string;
    increment?: string;
    invariant?: string[];
    variant?: string;
    maxIterations?: number;
    parallelizable: boolean;
    unrollable: boolean;
}

export interface BranchConfiguration {
    condition: string;
    probability?: number;
    steps: string[]; // step IDs
    description: string;
    optimization?: BranchOptimization;
}

export interface BranchOptimization {
    predictable: boolean;
    branchPenalty: boolean;
    optimization: 'none' | 'branch_prediction' | 'loop_unrolling' | 'tail_call';
    alternatives: string[];
}

// ============================================================================
// TIPOS DE IMPLEMENTACIÓN
// ============================================================================

export interface AlgorithmImplementation {
    languages: LanguageImplementation[];
    pseudocode: string;
    flowchart?: FlowchartNode[];
    stateTransitions?: StateTransition[];
    dataStructures: DataStructureUsage[];
    optimizations: OptimizationTechnique[];
    variants: AlgorithmVariant[];
}

export interface LanguageImplementation {
    language: ProgrammingLanguage;
    code: string;
    dependencies: string[];
    compilation: CompilationInfo;
    runtime: RuntimeInfo;
    testing: TestingInfo;
    documentation: string;
    examples: CodeExample[];
}

export type ProgrammingLanguage =
    | 'javascript'
    | 'typescript'
    | 'python'
    | 'java'
    | 'c'
    | 'cpp'
    | 'csharp'
    | 'rust'
    | 'go'
    | 'swift'
    | 'kotlin'
    | 'scala'
    | 'haskell'
    | 'ocaml'
    | 'erlang'
    | 'clojure'
    | 'r'
    | 'matlab'
    | 'julia'
    | 'pseudocode';

export interface CompilationInfo {
    compiler: string;
    version: string;
    flags: string[];
    optimizationLevel: string;
    warnings: string[];
    errors: string[];
}

export interface RuntimeInfo {
    environment: string;
    version: string;
    requirements: string[];
    configuration: Record<string, any>;
    performance: RuntimePerformance;
}

export interface RuntimePerformance {
    memoryUsage: RuntimeMemoryUsage;
    cpuUsage: RuntimeCPUUsage;
    ioOperations: RuntimeIOOperations;
    networkUsage?: RuntimeNetworkUsage;
    benchmarks: Benchmark[];
}

export interface TestingInfo {
    framework: string;
    coverage: number; // 0-100
    testCases: TestCase[];
    benchmarks: PerformanceBenchmark[];
    stress: StressTest[];
    validation: ValidationTest[];
}

// Interfaces auxiliares para RuntimePerformance
export interface RuntimeMemoryUsage {
    heap: number;
    stack: number;
    total: number;
    peak: number;
    allocations: number;
    deallocations: number;
}

export interface RuntimeCPUUsage {
    user: number;
    system: number;
    total: number;
    cores: number;
    utilization: number;
}

export interface RuntimeIOOperations {
    reads: number;
    writes: number;
    bytesRead: number;
    bytesWritten: number;
    operations: number;
}

export interface RuntimeNetworkUsage {
    requests: number;
    responses: number;
    bytesReceived: number;
    bytesSent: number;
    connections: number;
    latency: number;
}

export interface CodeExample {
    name: string;
    description: string;
    input: any;
    expectedOutput: any;
    explanation: string;
    complexity: string;
    runnable: boolean;
}

// ============================================================================
// TIPOS DE ANÁLISIS
// ============================================================================

export interface AlgorithmAnalysis {
    correctness: CorrectnessAnalysis;
    complexity: ComplexityAnalysis;
    optimality: OptimalityAnalysis;
    stability: StabilityAnalysis;
    robustness: RobustnessAnalysis;
    scalability: ScalabilityAnalysis;
    comparison: ComparisonAnalysis;
}

export interface CorrectnessAnalysis {
    verified: boolean;
    method:
        | 'formal_proof'
        | 'testing'
        | 'code_review'
        | 'mathematical_analysis';
    proofs: Proof[];
    counterexamples: Counterexample[];
    assumptions: string[];
    limitations: string[];
    confidence: number; // 0-1
}

export interface Proof {
    type:
        | 'inductive'
        | 'deductive'
        | 'constructive'
        | 'contradiction'
        | 'exhaustive';
    statement: string;
    steps: ProofStep[];
    verified: boolean;
    reviewer?: string;
    tools?: string[];
}

export interface ProofStep {
    statement: string;
    justification: string;
    references: string[];
    subSteps?: ProofStep[];
}

export interface Counterexample {
    input: any;
    expectedOutput: any;
    actualOutput: any;
    explanation: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    fixed: boolean;
}

export interface OptimalityAnalysis {
    optimal: boolean;
    criterion:
        | 'time'
        | 'space'
        | 'communication'
        | 'energy'
        | 'multi_objective';
    lowerBounds: LowerBound[];
    approximationRatio?: number;
    alternatives: AlgorithmAlternative[];
    tradeoffs: Tradeoff[];
}

export interface LowerBound {
    criterion: string;
    bound: string;
    proof: string;
    achievable: boolean;
    conditions: string[];
}

export interface AlgorithmAlternative {
    name: string;
    description: string;
    advantages: string[];
    disadvantages: string[];
    whenToUse: string[];
    complexity: AlgorithmComplexity;
    implementation?: string;
}

export interface Tradeoff {
    aspect1: string;
    aspect2: string;
    description: string;
    quantification?: number;
    recommendations: string[];
}

export interface StabilityAnalysis {
    numericalStability: boolean;
    inputSensitivity: SensitivityMeasure[];
    errorPropagation: ErrorPropagation;
    robustness: RobustnessMetric[];
    degenerateCases: DegenerateCase[];
}

export interface SensitivityMeasure {
    parameter: string;
    sensitivity: number;
    explanation: string;
    mitigation: string[];
}

export interface ErrorPropagation {
    inputError: number;
    outputError: number;
    amplification: number;
    sources: string[];
    mitigation: string[];
}

export interface RobustnessMetric {
    metric: string;
    value: number;
    interpretation: string;
    benchmark?: number;
}

export interface DegenerateCase {
    description: string;
    input: any;
    behavior: string;
    handling: string;
    severity: 'low' | 'medium' | 'high';
}

export interface RobustnessAnalysis {
    inputValidation: boolean;
    errorHandling: ErrorHandling;
    edgeCases: EdgeCase[];
    faultTolerance: FaultTolerance;
    recovery: RecoveryMechanism[];
}

export interface ErrorHandling {
    strategy:
        | 'fail_fast'
        | 'graceful_degradation'
        | 'retry'
        | 'fallback'
        | 'ignore';
    errorTypes: ErrorType[];
    propagation: 'stop' | 'continue' | 'report' | 'log';
    recovery: boolean;
}

export interface ErrorType {
    type: string;
    frequency: 'rare' | 'occasional' | 'common' | 'frequent';
    severity: 'low' | 'medium' | 'high' | 'critical';
    handling: string;
    prevention: string[];
}

export interface EdgeCase {
    description: string;
    input: any;
    expectedBehavior: string;
    actualBehavior: string;
    tested: boolean;
    handled: boolean;
}

export interface FaultTolerance {
    level: 'none' | 'basic' | 'intermediate' | 'advanced';
    mechanisms: string[];
    recovery: boolean;
    degradation: boolean;
    isolation: boolean;
}

export interface RecoveryMechanism {
    trigger: string;
    action: string;
    success: boolean;
    cost: string;
    automatic: boolean;
}

export interface ScalabilityAnalysis {
    horizontal: HorizontalScalability;
    vertical: VerticalScalability;
    limitations: ScalabilityLimitation[];
    bottlenecks: Bottleneck[];
    recommendations: ScalabilityRecommendation[];
}

export interface HorizontalScalability {
    parallelizable: boolean;
    partitionable: boolean;
    communicationOverhead: number;
    synchronization: SynchronizationRequirement[];
    efficiency: number; // 0-1
}

export interface VerticalScalability {
    memoryBound: boolean;
    cpuBound: boolean;
    ioBound: boolean;
    scalingFactor: number;
    efficiency: number; // 0-1
}

export interface ScalabilityLimitation {
    type: 'memory' | 'cpu' | 'network' | 'storage' | 'algorithmic';
    description: string;
    threshold: number;
    mitigation: string[];
}

export interface Bottleneck {
    location: string;
    type: 'cpu' | 'memory' | 'io' | 'network' | 'synchronization';
    severity: number; // 0-1
    impact: string;
    solutions: string[];
}

export interface ScalabilityRecommendation {
    scenario: string;
    recommendation: string;
    benefit: string;
    cost: string;
    complexity: string;
}

export interface ComparisonAnalysis {
    competitors: AlgorithmComparison[];
    benchmarks: BenchmarkResult[];
    recommendations: ComparisonRecommendation[];
    selection: SelectionCriteria[];
}

export interface AlgorithmComparison {
    algorithm: string;
    advantages: string[];
    disadvantages: string[];
    useCase: string[];
    metrics: ComparisonMetric[];
}

export interface ComparisonMetric {
    name: string;
    thisAlgorithm: number;
    competitor: number;
    unit: string;
    interpretation: string;
}

export interface BenchmarkResult {
    name: string;
    dataset: string;
    thisAlgorithm: PerformanceResult;
    competitors: Record<string, PerformanceResult>;
    environment: BenchmarkEnvironment;
    date: Date;
}

export interface PerformanceResult {
    executionTime: number;
    memoryUsage: number;
    accuracy?: number;
    throughput?: number;
    latency?: number;
    quality?: number;
}

export interface BenchmarkEnvironment {
    hardware: HardwareSpec;
    software: SoftwareSpec;
    configuration: Record<string, any>;
    conditions: string[];
}

export interface HardwareSpec {
    cpu: string;
    memory: string;
    storage: string;
    network?: string;
    gpu?: string;
}

export interface SoftwareSpec {
    os: string;
    runtime: string;
    libraries: Record<string, string>;
    configuration: Record<string, any>;
}

export interface ComparisonRecommendation {
    scenario: string;
    recommendedAlgorithm: string;
    rationale: string;
    conditions: string[];
    alternatives: string[];
}

export interface SelectionCriteria {
    criterion: string;
    weight: number; // 0-1
    description: string;
    evaluation: CriterionEvaluation[];
}

export interface CriterionEvaluation {
    algorithm: string;
    score: number; // 0-100
    justification: string;
}

// ============================================================================
// TIPOS DE TESTING
// ============================================================================

export interface AlgorithmTesting {
    unitTests: UnitTest[];
    integrationTests: IntegrationTest[];
    performanceTests: PerformanceTest[];
    stressTests: StressTest[];
    securityTests: SecurityTest[];
    validationTests: ValidationTest[];
    coverage: TestCoverage;
    quality: TestQuality;
}

export interface UnitTest {
    id: string;
    name: string;
    description: string;
    input: any;
    expectedOutput: any;
    actualOutput?: any;
    passed?: boolean;
    executionTime?: number;
    category: 'normal' | 'edge' | 'error' | 'boundary';
    priority: 'low' | 'medium' | 'high' | 'critical';
    automated: boolean;
}

export interface IntegrationTest {
    id: string;
    name: string;
    description: string;
    components: string[];
    scenario: string;
    input: any;
    expectedOutput: any;
    passed?: boolean;
    dependencies: string[];
    setup: string[];
    teardown: string[];
}

export interface PerformanceTest {
    id: string;
    name: string;
    description: string;
    metric: 'time' | 'memory' | 'throughput' | 'latency' | 'cpu' | 'custom';
    input: any;
    expectedPerformance: PerformanceExpectation;
    actualPerformance?: PerformanceResult;
    passed?: boolean;
    environment: TestEnvironment;
}

export interface PerformanceExpectation {
    threshold: number;
    comparison: '<' | '<=' | '>' | '>=' | '=' | '!=';
    unit: string;
    tolerance?: number;
    conditions: string[];
}

export interface TestEnvironment {
    hardware: string;
    software: string;
    load: string;
    network?: string;
    configuration: Record<string, any>;
}

export interface StressTest {
    id: string;
    name: string;
    description: string;
    stressType: 'volume' | 'rate' | 'endurance' | 'resource' | 'concurrency';
    parameters: StressParameter[];
    expectedBehavior: string;
    actualBehavior?: string;
    breakingPoint?: any;
    recovery?: boolean;
}

export interface StressParameter {
    name: string;
    type:
        | 'input_size'
        | 'request_rate'
        | 'duration'
        | 'resource_limit'
        | 'concurrency_level';
    value: any;
    scaling: 'linear' | 'exponential' | 'step' | 'random';
}

export interface SecurityTest {
    id: string;
    name: string;
    description: string;
    vulnerability: string;
    attack: string;
    protection: string;
    passed?: boolean;
    severity: 'low' | 'medium' | 'high' | 'critical';
    mitigation: string[];
}

export interface ValidationTest {
    id: string;
    name: string;
    description: string;
    property: string;
    method: 'formal' | 'empirical' | 'statistical' | 'simulation';
    verified: boolean;
    confidence: number; // 0-1
    evidence: string[];
    counterexamples: string[];
}

export interface TestCoverage {
    statement: number; // 0-100
    branch: number;
    function: number;
    line: number;
    condition: number;
    path?: number;
    mutation?: number;
    requirements?: number;
}

export interface TestQuality {
    effectiveness: number; // 0-100
    efficiency: number;
    maintainability: number;
    reliability: number;
    completeness: number;
    automation: number;
    metrics: QualityMetric[];
}

export interface QualityMetric {
    name: string;
    value: number;
    target: number;
    unit: string;
    interpretation: string;
}

// ============================================================================
// TIPOS DE DOCUMENTACIÓN
// ============================================================================

export interface AlgorithmDocumentation {
    overview: DocumentationSection;
    specification: DocumentationSection;
    implementation: DocumentationSection;
    examples: DocumentationSection;
    api: APIDocumentation;
    tutorial: Tutorial;
    faq: FAQ[];
    changelog: ChangelogEntry[];
    bibliography: Reference[];
}

export interface DocumentationSection {
    title: string;
    content: string;
    subsections: DocumentationSubsection[];
    diagrams: Diagram[];
    codeSnippets: CodeSnippet[];
    cross: string[];
}

export interface DocumentationSubsection {
    title: string;
    content: string;
    level: number;
    examples: string[];
    references: string[];
}

export interface Diagram {
    type:
        | 'flowchart'
        | 'uml'
        | 'graph'
        | 'tree'
        | 'network'
        | 'timeline'
        | 'custom';
    title: string;
    description: string;
    source: string;
    format: 'svg' | 'png' | 'pdf' | 'mermaid' | 'dot' | 'plantuml';
    interactive: boolean;
}

export interface CodeSnippet {
    language: ProgrammingLanguage;
    code: string;
    description: string;
    runnable: boolean;
    highlighted: boolean;
    examples: any[];
}

export interface APIDocumentation {
    functions: FunctionDocumentation[];
    classes: ClassDocumentation[];
    interfaces: InterfaceDocumentation[];
    types: TypeDocumentation[];
    constants: ConstantDocumentation[];
    examples: APIExample[];
}

export interface FunctionDocumentation {
    name: string;
    description: string;
    parameters: ParameterDocumentation[];
    returns: ReturnDocumentation;
    throws: ExceptionDocumentation[];
    examples: string[];
    complexity: string;
    notes: string[];
    seeAlso: string[];
}

export interface ParameterDocumentation {
    name: string;
    type: string;
    description: string;
    required: boolean;
    defaultValue?: any;
    constraints: string[];
    examples: any[];
}

export interface ReturnDocumentation {
    type: string;
    description: string;
    constraints: string[];
    examples: any[];
}

export interface ExceptionDocumentation {
    type: string;
    description: string;
    when: string;
    handling: string;
}

export interface ClassDocumentation {
    name: string;
    description: string;
    inheritance: string[];
    interfaces: string[];
    properties: PropertyDocumentation[];
    methods: MethodDocumentation[];
    examples: string[];
    notes: string[];
}

export interface PropertyDocumentation {
    name: string;
    type: string;
    description: string;
    access: 'public' | 'private' | 'protected';
    mutable: boolean;
    defaultValue?: any;
}

export interface MethodDocumentation extends FunctionDocumentation {
    access: 'public' | 'private' | 'protected';
    static: boolean;
    abstract: boolean;
    overrides?: string;
}

export interface InterfaceDocumentation {
    name: string;
    description: string;
    extends: string[];
    properties: PropertyDocumentation[];
    methods: MethodDocumentation[];
    examples: string[];
}

export interface TypeDocumentation {
    name: string;
    description: string;
    definition: string;
    examples: any[];
    usage: string[];
}

export interface ConstantDocumentation {
    name: string;
    type: string;
    value: any;
    description: string;
    usage: string[];
}

export interface APIExample {
    title: string;
    description: string;
    code: string;
    language: ProgrammingLanguage;
    input?: any;
    output?: any;
    explanation: string;
}

export interface Tutorial {
    title: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    duration: number; // minutos
    prerequisites: string[];
    objectives: string[];
    sections: TutorialSection[];
    exercises: Exercise[];
    resources: TutorialResource[];
}

export interface TutorialSection {
    title: string;
    content: string;
    duration: number;
    objectives: string[];
    examples: string[];
    exercises: string[];
}

export interface Exercise {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    input: any;
    expectedOutput: any;
    hints: string[];
    solution?: ExerciseSolution;
    verification: VerificationMethod;
}

export interface ExerciseSolution {
    code: string;
    explanation: string;
    alternatives: AlternativeSolution[];
    complexity: string;
    notes: string[];
}

export interface AlternativeSolution {
    approach: string;
    code: string;
    advantages: string[];
    disadvantages: string[];
    when: string;
}

export interface VerificationMethod {
    type: 'automatic' | 'manual' | 'peer' | 'instructor';
    criteria: string[];
    tests: string[];
    feedback: boolean;
}

export interface TutorialResource {
    type: 'reading' | 'video' | 'interactive' | 'practice' | 'reference';
    title: string;
    url: string;
    description: string;
    duration?: number;
    required: boolean;
}

export interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
    tags: string[];
    popularity: number;
    lastUpdated: Date;
}

export interface ChangelogEntry {
    version: string;
    date: Date;
    type: 'major' | 'minor' | 'patch' | 'hotfix';
    changes: Change[];
    author: string;
    breaking: boolean;
    migration?: MigrationGuide;
}

export interface Change {
    type: 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security';
    description: string;
    impact: 'low' | 'medium' | 'high';
    component?: string;
}

export interface MigrationGuide {
    description: string;
    steps: MigrationStep[];
    automated: boolean;
    tools: string[];
    estimated: number; // minutos
}

export interface MigrationStep {
    action: string;
    description: string;
    code?: string;
    validation: string;
    rollback?: string;
}

export interface Reference {
    type:
        | 'book'
        | 'paper'
        | 'article'
        | 'website'
        | 'video'
        | 'course'
        | 'presentation';
    title: string;
    authors: string[];
    year?: number;
    publisher?: string;
    url?: string;
    isbn?: string;
    doi?: string;
    pages?: string;
    relevance: 'high' | 'medium' | 'low';
    summary?: string;
}

// ============================================================================
// TIPOS DE EJECUCIÓN Y RESULTADO
// ============================================================================

export interface AlgorithmExecution {
    id: string;
    algorithmId: string;
    input: any;
    output?: any;
    status: ExecutionStatus;
    startTime: Date;
    endTime?: Date;
    duration?: number;
    steps: ExecutionStep[];
    performance: ExecutionPerformance;
    errors: ExecutionError[];
    warnings: ExecutionWarning[];
    metadata: ExecutionMetadata;
}

export type ExecutionStatus =
    | 'pending'
    | 'running'
    | 'completed'
    | 'failed'
    | 'cancelled'
    | 'timeout'
    | 'out_of_memory'
    | 'invalid_input';

export interface ExecutionStep {
    stepId: string;
    startTime: Date;
    endTime?: Date;
    duration?: number;
    input: any;
    output?: any;
    status: ExecutionStatus;
    operations: Operation[];
    memory: MemorySnapshot;
    cpu: CPUUsage;
    custom: Record<string, any>;
}

export interface Operation {
    type: string;
    description: string;
    cost: number;
    count: number;
    cumulative: number;
}

export interface MemorySnapshot {
    used: number;
    allocated: number;
    peak: number;
    objects: number;
    garbageCollections?: number;
}

export interface CPUUsage {
    user: number;
    system: number;
    idle: number;
    wait: number;
    percentage: number;
}

export interface ExecutionPerformance {
    time: TimeMetrics;
    memory: MemoryMetrics;
    cpu: CPUMetrics;
    io: IOMetrics;
    network?: NetworkMetrics;
    custom: Record<string, number>;
}

export interface TimeMetrics {
    total: number;
    cpu: number;
    wait: number;
    blocked: number;
    gc?: number;
}

export interface MemoryMetrics {
    peak: number;
    average: number;
    allocations: number;
    deallocations: number;
    leaks: number;
    fragmentation: number;
}

export interface CPUMetrics {
    instructions: number;
    cycles: number;
    cacheHits: number;
    cacheMisses: number;
    branchMispredictions: number;
    utilization: number;
}

export interface IOMetrics {
    reads: number;
    writes: number;
    bytesRead: number;
    bytesWritten: number;
    seeks: number;
    flushes: number;
}

export interface NetworkMetrics {
    requests: number;
    responses: number;
    bytesReceived: number;
    bytesSent: number;
    connections: number;
    latency: number;
}

export interface ExecutionError {
    type: string;
    message: string;
    stepId?: string;
    timestamp: Date;
    severity: 'low' | 'medium' | 'high' | 'critical';
    recoverable: boolean;
    stack?: string;
    context: Record<string, any>;
}

export interface ExecutionWarning {
    type: string;
    message: string;
    stepId?: string;
    timestamp: Date;
    impact: 'none' | 'low' | 'medium' | 'high';
    suggestion?: string;
}

export interface ExecutionMetadata {
    environment: ExecutionEnvironment;
    configuration: ExecutionConfiguration;
    profiling: ProfilingData;
    debugging: DebuggingInfo;
    optimization: OptimizationInfo;
}

export interface ExecutionEnvironment {
    platform: string;
    runtime: string;
    version: string;
    architecture: string;
    cores: number;
    memory: number;
    storage: string;
    network?: string;
}

export interface ExecutionConfiguration {
    optimization: 'none' | 'basic' | 'aggressive';
    debugging: boolean;
    profiling: boolean;
    logging: 'minimal' | 'normal' | 'verbose' | 'debug';
    parallel: boolean;
    maxMemory?: number;
    timeout?: number;
    custom: Record<string, any>;
}

export interface ProfilingData {
    callGraph: CallGraphNode[];
    hotspots: Hotspot[];
    bottlenecks: ExecutionBottleneck[];
    recommendations: ProfilingRecommendation[];
}

export interface CallGraphNode {
    function: string;
    calls: number;
    timeInclusive: number;
    timeExclusive: number;
    children: CallGraphNode[];
    percentage: number;
}

export interface Hotspot {
    location: string;
    type: 'cpu' | 'memory' | 'io' | 'network';
    impact: number;
    suggestions: string[];
}

export interface ExecutionBottleneck {
    location: string;
    type: 'sequential' | 'synchronization' | 'resource' | 'algorithmic';
    severity: number;
    impact: string;
    solutions: string[];
}

export interface ProfilingRecommendation {
    type: 'optimization' | 'refactoring' | 'caching' | 'parallelization';
    description: string;
    benefit: string;
    effort: 'low' | 'medium' | 'high';
    risk: 'low' | 'medium' | 'high';
}

export interface DebuggingInfo {
    breakpoints: Breakpoint[];
    watchpoints: Watchpoint[];
    callStack: StackFrame[];
    variables: VariableState[];
    assertions: AssertionResult[];
}

export interface Breakpoint {
    id: string;
    location: string;
    condition?: string;
    hitCount: number;
    enabled: boolean;
}

export interface Watchpoint {
    id: string;
    expression: string;
    oldValue?: any;
    newValue?: any;
    changed: boolean;
}

export interface StackFrame {
    function: string;
    location: string;
    variables: Record<string, any>;
    depth: number;
}

export interface VariableState {
    name: string;
    type: string;
    value: any;
    scope: string;
    mutable: boolean;
    references: number;
}

export interface AssertionResult {
    assertion: string;
    result: boolean;
    message?: string;
    location: string;
    timestamp: Date;
}

export interface OptimizationInfo {
    applied: OptimizationTechnique[];
    attempted: OptimizationAttempt[];
    suggestions: OptimizationSuggestion[];
    impact: OptimizationImpact;
}

export interface OptimizationTechnique {
    name: string;
    type:
        | 'algorithmic'
        | 'data_structure'
        | 'compiler'
        | 'runtime'
        | 'hardware';
    description: string;
    applied: boolean;
    benefit: string;
    cost: string;
}

export interface OptimizationAttempt {
    technique: string;
    successful: boolean;
    reason?: string;
    impact?: number;
    sideEffects?: string[];
}

export interface OptimizationSuggestion {
    technique: string;
    description: string;
    estimatedBenefit: number;
    effort: 'low' | 'medium' | 'high';
    risk: 'low' | 'medium' | 'high';
    automatic: boolean;
}

export interface OptimizationImpact {
    speedup: number;
    memoryReduction: number;
    energySavings?: number;
    qualityChange?: number;
    tradeoffs: OptimizationTradeoff[];
}

export interface OptimizationTradeoff {
    improved: string;
    degraded: string;
    ratio: number;
    acceptable: boolean;
    reasoning: string;
}

// ============================================================================
// TIPOS AUXILIARES Y DE SOPORTE
// ============================================================================

export interface AlgorithmVariant {
    name: string;
    description: string;
    differences: string[];
    advantages: string[];
    disadvantages: string[];
    useCase: string[];
    complexity: AlgorithmComplexity;
    implementation?: string;
}

export interface DataStructureUsage {
    name: string;
    purpose: string;
    operations: string[];
    complexity: Record<string, string>;
    alternatives: string[];
    justification: string;
}

export interface SynchronizationRequirement {
    type:
        | 'mutex'
        | 'semaphore'
        | 'barrier'
        | 'condition'
        | 'atomic'
        | 'lock_free';
    purpose: string;
    granularity: 'fine' | 'coarse';
    contention: 'low' | 'medium' | 'high';
    overhead: number;
}

export interface FlowchartNode {
    id: string;
    type:
        | 'start'
        | 'end'
        | 'process'
        | 'decision'
        | 'input'
        | 'output'
        | 'connector';
    label: string;
    position: { x: number; y: number };
    connections: string[];
    properties?: Record<string, any>;
}

export interface StateTransition {
    from: string;
    to: string;
    condition: string;
    action?: string;
    probability?: number;
}

export interface InputConstraint {
    type: 'range' | 'pattern' | 'length' | 'format' | 'custom';
    value: any;
    message: string;
    enforced: boolean;
}

export interface OutputConstraint {
    type:
        | 'range'
        | 'format'
        | 'precision'
        | 'ordering'
        | 'uniqueness'
        | 'custom';
    value: any;
    description: string;
    guaranteed: boolean;
}

export interface OutputFormat {
    type: 'primitive' | 'array' | 'object' | 'tree' | 'graph' | 'stream';
    structure: string;
    encoding?: string;
    compression?: string;
    serialization?: string;
}

export interface ValidationRule {
    type: 'required' | 'type' | 'range' | 'pattern' | 'custom';
    value?: any;
    message: string;
    severity: 'error' | 'warning' | 'info';
    validator?: (value: any) => boolean;
}

export interface PerformanceCharacteristics {
    throughput: number; // operaciones por segundo
    latency: number; // ms
    memoryEfficiency: number; // 0-1
    energyEfficiency: number; // 0-1
    scalability: number; // 0-1
    reliability: number; // 0-1
    maintainability: number; // 0-1
}

export interface TestCase {
    id: string;
    name: string;
    input: any;
    expectedOutput: any;
    category:
        | 'functional'
        | 'performance'
        | 'security'
        | 'usability'
        | 'compatibility';
    priority: 'low' | 'medium' | 'high' | 'critical';
    automated: boolean;
    passed?: boolean;
    executionTime?: number;
    notes?: string;
}

export interface PerformanceBenchmark {
    name: string;
    dataset: string;
    metrics: string[];
    baseline: Record<string, number>;
    results: Record<string, number>;
    regression: boolean;
    threshold: Record<string, number>;
}

export interface Benchmark {
    name: string;
    description: string;
    input: any;
    result: PerformanceResult;
    environment: BenchmarkEnvironment;
    date: Date;
    version: string;
}

// ============================================================================
// INTERFACES DE EJECUCIÓN Y RESULTADO PARA ALGORITMOS
// ============================================================================

export interface AlgorithmExecutionResult extends AlgorithmExecution {
    success: boolean;
    result?: any;
    quality: QualityAssessment;
    recommendations: ExecutionRecommendation[];
    nextSteps: string[];
}

export interface QualityAssessment {
    correctness: number; // 0-1
    efficiency: number; // 0-1
    robustness: number; // 0-1
    maintainability: number; // 0-1
    overall: number; // 0-1
    factors: QualityFactor[];
}

export interface QualityFactor {
    name: string;
    weight: number;
    score: number;
    description: string;
    improvement: string[];
}

export interface ExecutionRecommendation {
    type:
        | 'optimization'
        | 'debugging'
        | 'testing'
        | 'documentation'
        | 'refactoring';
    priority: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    benefit: string;
    effort: string;
    risk: string;
    implementation: string[];
}

// ============================================================================
// EXPORTACIONES Y CONSTANTES
// ============================================================================

export const ALGORITHM_CATEGORIES: Record<AlgorithmCategory, string> = {
    sorting: 'Ordenamiento',
    searching: 'Búsqueda',
    graph: 'Grafos',
    dynamic_programming: 'Programación Dinámica',
    greedy: 'Algoritmos Voraces',
    divide_and_conquer: 'Divide y Vencerás',
    backtracking: 'Backtracking',
    mathematical: 'Matemáticos',
    string_processing: 'Procesamiento de Cadenas',
    geometric: 'Geométricos',
    optimization: 'Optimización',
    machine_learning: 'Aprendizaje Automático',
    data_analysis: 'Análisis de Datos',
    pattern_recognition: 'Reconocimiento de Patrones',
    simulation: 'Simulación',
    heuristic: 'Heurísticos',
    approximation: 'Aproximación',
    randomized: 'Aleatorios',
    parallel: 'Paralelos',
    distributed: 'Distribuidos',
    custom: 'Personalizado',
};

export const STEP_TYPES: Record<StepType, string> = {
    input: 'Entrada',
    output: 'Salida',
    assignment: 'Asignación',
    comparison: 'Comparación',
    arithmetic: 'Aritmético',
    logical: 'Lógico',
    conditional: 'Condicional',
    loop: 'Bucle',
    function_call: 'Llamada a Función',
    data_structure_operation: 'Operación de Estructura de Datos',
    sorting: 'Ordenamiento',
    searching: 'Búsqueda',
    filtering: 'Filtrado',
    mapping: 'Mapeo',
    reduction: 'Reducción',
    aggregation: 'Agregación',
    transformation: 'Transformación',
    validation: 'Validación',
    optimization: 'Optimización',
    termination: 'Terminación',
    custom: 'Personalizado',
};

export const EXECUTION_STATUSES: Record<ExecutionStatus, string> = {
    pending: 'Pendiente',
    running: 'Ejecutando',
    completed: 'Completado',
    failed: 'Falló',
    cancelled: 'Cancelado',
    timeout: 'Tiempo Agotado',
    out_of_memory: 'Sin Memoria',
    invalid_input: 'Entrada Inválida',
};
