// ============================================================================
// TIPOS DE FASES - ARCHIVO COMPLETO
// ============================================================================

import {
    Achievement,
    ConstructedAlgorithm,
    CreatedArtifact,
    DiscoveredPattern,
    FamilyDataset,
    Hypothesis,
    OptimizationResult,
    PhaseObjective,
    PhaseResults,
    PhaseState,
    StudentReflection,
    SystemDefinition,
    SystemImprovement,
    ValidationResult,
} from './relationships';

// ============================================================================
// CONFIGURACIONES DE FASES
// ============================================================================

export interface PhaseConfig {
    id: string;
    name: string;
    description: string;
    objectives: PhaseObjective[];
    estimatedDuration: number; // minutos
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    prerequisites: string[];
    resources: PhaseResource[];
    assessmentCriteria: AssessmentCriterion[];
    hints: PhaseHint[];
    supportMaterials: SupportMaterial[];
}

export interface Phase1Config extends PhaseConfig {
    familiesRequired: number;
    patternsRequired: number;
    explorationDepth: 'surface' | 'moderate' | 'deep';
    guidanceLevel: 'high' | 'medium' | 'low';
    visualizationTypes: string[];
}

export interface Phase2Config extends PhaseConfig {
    algorithmsRequired: number;
    complexityRequirement: 'basic' | 'intermediate' | 'advanced';
    testingRequired: boolean;
    collaborationEnabled: boolean;
    templateAccess: 'none' | 'basic' | 'advanced';
}

export interface Phase3Config extends PhaseConfig {
    systemsRequired: number;
    optimizationRequired: boolean;
    realWorldContext: boolean;
    stakeholderPerspectives: string[];
    impactAssessment: boolean;
}

export interface Phase4Config extends PhaseConfig {
    innovationLevel: 'incremental' | 'breakthrough' | 'disruptive';
    presentationRequired: boolean;
    peerReviewEnabled: boolean;
    portfolioRequired: boolean;
    reflexionDepth: 'basic' | 'comprehensive' | 'expert';
}

export interface PhaseResource {
    id: string;
    name: string;
    type: 'document' | 'video' | 'interactive' | 'dataset' | 'tool';
    url?: string;
    content?: string;
    required: boolean;
    estimatedTime: number; // minutos
    difficulty: string;
    prerequisites?: string[];
}

export interface AssessmentCriterion {
    id: string;
    name: string;
    description: string;
    weight: number; // 0-1
    rubric: RubricLevel[];
    autoAssessable: boolean;
    peerAssessable: boolean;
}

export interface RubricLevel {
    level: number; // 1-4
    name: string; // e.g., "Novice", "Developing", "Proficient", "Advanced"
    description: string;
    points: number;
    criteria: string[];
}

export interface PhaseHint {
    id: string;
    trigger: HintTrigger;
    content: string;
    type: 'tip' | 'warning' | 'suggestion' | 'encouragement';
    priority: 'low' | 'medium' | 'high';
    showAfter?: number; // segundos
    showOnlyOnce?: boolean;
    conditions?: HintCondition[];
}

export interface HintTrigger {
    event: string;
    conditions: Record<string, any>;
    delay?: number; // segundos
}

export interface HintCondition {
    type:
        | 'time_spent'
        | 'attempts_failed'
        | 'progress_stalled'
        | 'error_occurred';
    threshold: number;
    comparison: '>' | '<' | '=' | '>=' | '<=';
}

export interface SupportMaterial {
    id: string;
    title: string;
    type: 'glossary' | 'example' | 'tutorial' | 'reference' | 'faq';
    content: string;
    tags: string[];
    searchable: boolean;
    relatedConcepts: string[];
}

// ============================================================================
// PROPS DE COMPONENTES DE FASES
// ============================================================================

export interface Phase1DiscoveryProps {
    families: FamilyDataset[];
    onFamilySelect: (family: FamilyDataset) => void;
    onPatternDiscovered: (pattern: DiscoveredPattern) => void;
    onHypothesisCreated: (hypothesis: Hypothesis) => void;
    selectedFamilies: FamilyDataset[];
    discoveredPatterns: DiscoveredPattern[];
    createdHypotheses: Hypothesis[];
    config: Phase1Config;
    state: PhaseState;
    onStateUpdate: (update: Partial<PhaseState>) => void;
    hints: PhaseHint[];
    showHints: boolean;
    interactive: boolean;
    viewMode: '2d' | '3d' | 'graph';
    onViewModeChange: (mode: '2d' | '3d' | 'graph') => void;
}

export interface Phase2ConstructionProps {
    availableBlocks: any[];
    onAlgorithmCreated: (algorithm: ConstructedAlgorithm) => void;
    onAlgorithmTested: (algorithm: ConstructedAlgorithm, results: any) => void;
    constructedAlgorithms: ConstructedAlgorithm[];
    patterns: DiscoveredPattern[];
    hypotheses: Hypothesis[];
    config: Phase2Config;
    state: PhaseState;
    onStateUpdate: (update: Partial<PhaseState>) => void;
    templates: any[];
    enableCollaboration: boolean;
    showValidation: boolean;
    autoSave: boolean;
}

export interface Phase3ApplicationProps {
    algorithms: ConstructedAlgorithm[];
    realWorldScenarios: Scenario[];
    onSystemCreated: (system: SystemDefinition) => void;
    onOptimizationCompleted: (result: OptimizationResult) => void;
    onImprovementProposed: (improvement: SystemImprovement) => void;
    createdSystems: SystemDefinition[];
    optimizationResults: OptimizationResult[];
    proposedImprovements: SystemImprovement[];
    config: Phase3Config;
    state: PhaseState;
    onStateUpdate: (update: Partial<PhaseState>) => void;
    stakeholders: Stakeholder[];
    constraints: SystemConstraint[];
    enableRealTimeOptimization: boolean;
}

export interface Phase4InnovationProps {
    artifacts: CreatedArtifact[];
    onInnovationCreated: (innovation: Innovation) => void;
    onPresentationGiven: (presentation: Presentation) => void;
    onPortfolioCompleted: (portfolio: Portfolio) => void;
    onReflectionCompleted: (reflection: StudentReflection) => void;
    innovations: Innovation[];
    presentations: Presentation[];
    portfolio?: Portfolio;
    reflections: StudentReflection[];
    config: Phase4Config;
    state: PhaseState;
    onStateUpdate: (update: Partial<PhaseState>) => void;
    peerReviewEnabled: boolean;
    mentorFeedback: MentorFeedback[];
    showCaseEnabled: boolean;
}

// ============================================================================
// TIPOS ESPECÍFICOS DE FASE 3 Y 4
// ============================================================================

export interface Scenario {
    id: string;
    name: string;
    description: string;
    domain: string; // e.g., "healthcare", "education", "business"
    complexity: 'simple' | 'moderate' | 'complex';
    stakeholders: string[];
    constraints: string[];
    successMetrics: string[];
    backgroundInfo: string;
    datasets?: FamilyDataset[];
    timeframe: string;
    budget?: number;
    regulations?: string[];
}

export interface Stakeholder {
    id: string;
    name: string;
    role: string;
    interests: string[];
    influence: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    requirements: string[];
    concerns: string[];
    successCriteria: string[];
}

export interface SystemConstraint {
    id: string;
    name: string;
    description: string;
    type: 'technical' | 'business' | 'legal' | 'ethical' | 'resource';
    severity: 'soft' | 'hard';
    negotiable: boolean;
    cost?: number;
    alternatives?: string[];
}

export interface Innovation {
    id: string;
    title: string;
    description: string;
    type: 'process' | 'product' | 'service' | 'model' | 'framework';
    novelty: 'incremental' | 'substantial' | 'breakthrough';
    impact: {
        technical: number; // 1-5
        social: number; // 1-5
        economic: number; // 1-5
        environmental: number; // 1-5
    };
    feasibility: {
        technical: number; // 1-5
        economic: number; // 1-5
        timeline: number; // 1-5
        resources: number; // 1-5
    };
    basedOnArtifacts: string[];
    implementation: ImplementationPlan;
    evaluation: InnovationEvaluation;
    createdAt: Date;
    lastUpdated: Date;
}

export interface ImplementationPlan {
    phases: ImplementationPhase[];
    timeline: string;
    resources: ResourceRequirement[];
    risks: Risk[];
    successMetrics: string[];
    milestones: Milestone[];
}

export interface ImplementationPhase {
    name: string;
    description: string;
    duration: string;
    activities: string[];
    deliverables: string[];
    dependencies: string[];
    resources: string[];
}

export interface ResourceRequirement {
    type: 'human' | 'financial' | 'technical' | 'material';
    description: string;
    quantity: number;
    unit: string;
    cost?: number;
    availability: 'available' | 'limited' | 'unavailable';
}

export interface Risk {
    id: string;
    description: string;
    probability: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    category:
        | 'technical'
        | 'market'
        | 'financial'
        | 'regulatory'
        | 'operational';
    mitigation: string[];
    contingency: string[];
}

export interface Milestone {
    name: string;
    description: string;
    deadline: Date;
    criteria: string[];
    dependencies: string[];
    responsible: string;
}

export interface InnovationEvaluation {
    criteria: EvaluationCriterion[];
    scores: Record<string, number>;
    feedback: string[];
    recommendations: string[];
    strengths: string[];
    weaknesses: string[];
    overallScore: number;
    evaluatedBy: string;
    evaluatedAt: Date;
}

export interface EvaluationCriterion {
    name: string;
    weight: number;
    scale: string; // e.g., "1-5", "1-10"
    description: string;
}

export interface Presentation {
    id: string;
    title: string;
    type: 'pitch' | 'demo' | 'academic' | 'showcase';
    duration: number; // minutos
    audience: string[];
    slides?: PresentationSlide[];
    script?: string;
    materials: PresentationMaterial[];
    delivery: DeliveryMetrics;
    feedback: PresentationFeedback[];
    createdAt: Date;
    presentedAt?: Date;
}

export interface PresentationSlide {
    id: string;
    title: string;
    content: string;
    type: 'title' | 'content' | 'image' | 'chart' | 'demo' | 'conclusion';
    notes?: string;
    duration?: number; // segundos
}

export interface PresentationMaterial {
    type: 'demo' | 'prototype' | 'video' | 'handout' | 'dataset';
    name: string;
    description: string;
    content: any;
    required: boolean;
}

export interface DeliveryMetrics {
    clarity: number; // 1-5
    engagement: number; // 1-5
    confidence: number; // 1-5
    timing: number; // 1-5
    visualAids: number; // 1-5
    qAndA: number; // 1-5
    overallRating: number; // 1-5
}

export interface PresentationFeedback {
    evaluator: string;
    role: 'peer' | 'instructor' | 'expert' | 'stakeholder';
    ratings: Record<string, number>;
    comments: string[];
    suggestions: string[];
    strengths: string[];
    improvements: string[];
    overallScore: number;
    providedAt: Date;
}

export interface Portfolio {
    id: string;
    title: string;
    description: string;
    artifacts: PortfolioArtifact[];
    reflections: PortfolioReflection[];
    achievements: Achievement[];
    skillsDemonstrated: SkillEvidence[];
    presentation: PortfolioPresentation;
    metadata: PortfolioMetadata;
    evaluation?: PortfolioEvaluation;
}

export interface PortfolioArtifact {
    artifactId: string;
    category: string;
    description: string;
    learningObjectives: string[];
    skillsDemonstrated: string[];
    reflection: string;
    quality: 'developing' | 'proficient' | 'advanced';
    feedback?: string[];
}

export interface PortfolioReflection {
    theme: string;
    questions: string[];
    responses: string[];
    insights: string[];
    connections: string[];
    futureGoals: string[];
    evidence: string[];
}

export interface SkillEvidence {
    skill: string;
    level: 'novice' | 'developing' | 'proficient' | 'advanced' | 'expert';
    evidence: string[];
    artifacts: string[];
    assessments: string[];
    feedback: string[];
    growthTrajectory: string;
}

export interface PortfolioPresentation {
    format: 'digital' | 'physical' | 'hybrid';
    structure: string[];
    navigation: NavigationElement[];
    design: DesignElements;
    accessibility: AccessibilityFeatures;
}

export interface NavigationElement {
    label: string;
    target: string;
    description: string;
    required: boolean;
}

export interface DesignElements {
    theme: string;
    colorScheme: string[];
    typography: string;
    layout: 'grid' | 'linear' | 'carousel' | 'custom';
    interactivity: 'static' | 'interactive' | 'immersive';
}

export interface AccessibilityFeatures {
    altText: boolean;
    keyboardNavigation: boolean;
    screenReaderSupport: boolean;
    highContrast: boolean;
    fontSize: 'normal' | 'large' | 'extra-large';
}

export interface PortfolioMetadata {
    createdAt: Date;
    lastUpdated: Date;
    version: string;
    audience: string[];
    purpose: string;
    context: string;
    privacy: 'public' | 'restricted' | 'private';
}

export interface PortfolioEvaluation {
    criteria: PortfolioEvaluationCriterion[];
    scores: Record<string, number>;
    feedback: ComprehensiveFeedback;
    recommendations: string[];
    nextSteps: string[];
    overallRating: string;
    evaluatedBy: string;
    evaluatedAt: Date;
}

export interface PortfolioEvaluationCriterion {
    name: string;
    description: string;
    weight: number;
    rubric: RubricLevel[];
    evidence: string[];
    score: number;
    feedback: string;
}

export interface ComprehensiveFeedback {
    strengths: string[];
    improvements: string[];
    missing: string[];
    exceptional: string[];
    growth: string[];
    recommendations: string[];
}

export interface MentorFeedback {
    mentorId: string;
    mentorName: string;
    timestamp: Date;
    type: 'formative' | 'summative' | 'coaching';
    content: string;
    suggestions: string[];
    encouragement: string[];
    challenges: string[];
    resources: string[];
    followUp?: FollowUpAction[];
}

export interface FollowUpAction {
    action: string;
    deadline?: Date;
    priority: 'low' | 'medium' | 'high';
    resources?: string[];
    completed?: boolean;
    completedAt?: Date;
}

// ============================================================================
// COMPONENTES DE UI Y TRANSICIONES
// ============================================================================

export interface PhaseTransition {
    from: number;
    to: number;
    type: 'automatic' | 'manual' | 'conditional';
    conditions?: TransitionCondition[];
    animation: TransitionAnimation;
    duration: number; // milisegundos
    blockers?: TransitionBlocker[];
}

export interface TransitionCondition {
    type:
        | 'objectives_completed'
        | 'time_spent'
        | 'quality_threshold'
        | 'custom';
    threshold: number;
    required: boolean;
}

export interface TransitionAnimation {
    type: 'fade' | 'slide' | 'zoom' | 'rotate' | 'custom';
    direction?: 'left' | 'right' | 'up' | 'down';
    easing: string;
    stagger?: number;
}

export interface TransitionBlocker {
    reason: string;
    requirement: string;
    canOverride: boolean;
    overrideReason?: string;
}

export interface PhaseTransitionProps {
    currentPhase: number;
    nextPhase: number;
    transition: PhaseTransition;
    onTransitionComplete: () => void;
    onTransitionCancel: () => void;
    achievements: Achievement[];
    summary: PhaseResults;
    showAchievements?: boolean;
    showSummary?: boolean;
    interactive?: boolean;
}

export interface AchievementCelebrationProps {
    achievements: Achievement[];
    onComplete: () => void;
    onSkip: () => void;
    showAnimation: boolean;
    showDetails: boolean;
    autoProgress?: boolean;
    duration?: number; // milisegundos
}

export interface ProgressIndicatorProps {
    phases: PhaseState[];
    currentPhase: number;
    interactive: boolean;
    showLabels: boolean;
    showProgress: boolean;
    onPhaseClick?: (phase: number) => void;
    layout: 'horizontal' | 'vertical' | 'circular';
    size: 'small' | 'medium' | 'large';
    theme: 'default' | 'minimal' | 'detailed';
}

// ============================================================================
// UTILIDADES Y HELPERS
// ============================================================================

export interface PhaseManager {
    getCurrentPhase: () => PhaseState;
    transitionToPhase: (phase: number) => Promise<boolean>;
    canTransition: (to: number) => boolean;
    getTransitionRequirements: (to: number) => string[];
    completeObjective: (objectiveId: string) => void;
    calculateProgress: () => number;
    getTimeRemaining: () => number;
    saveProgress: () => Promise<void>;
    loadProgress: () => Promise<void>;
}

export interface PhaseValidator {
    validateTransition: (from: number, to: number) => ValidationResult;
    validateObjectiveCompletion: (
        objective: PhaseObjective,
        artifacts: CreatedArtifact[]
    ) => boolean;
    validatePhaseRequirements: (phase: number, state: PhaseState) => string[];
    getCompletionPercentage: (phase: PhaseState) => number;
}

export interface PhaseAnalytics {
    trackPhaseStart: (phase: number) => void;
    trackPhaseComplete: (phase: number, duration: number) => void;
    trackObjectiveComplete: (objectiveId: string, phase: number) => void;
    trackAchievementUnlock: (achievementId: string) => void;
    getPhaseStatistics: (phase: number) => PhaseStatistics;
    getOverallStatistics: () => OverallStatistics;
    exportData: () => AnalyticsData;
}

export interface PhaseStatistics {
    averageTime: number;
    completionRate: number;
    commonChallenges: string[];
    successPatterns: string[];
    dropoffPoints: string[];
    satisfactionScore: number;
}

export interface OverallStatistics {
    totalStudents: number;
    averageCompletionTime: number;
    overallCompletionRate: number;
    phaseStatistics: Record<number, PhaseStatistics>;
    mostPopularArtifacts: string[];
    commonLearningPaths: string[];
}

export interface AnalyticsData {
    timestamp: Date;
    sessionId: string;
    studentId?: string;
    phases: PhaseAnalyticsData[];
    achievements: AchievementAnalytics[];
    interactions: InteractionAnalytics[];
    performance: PerformanceAnalytics;
}

export interface PhaseAnalyticsData {
    phaseNumber: number;
    startTime: Date;
    endTime?: Date;
    timeSpent: number;
    objectivesCompleted: number;
    totalObjectives: number;
    artifactsCreated: number;
    hintsUsed: number;
    errorsEncountered: number;
    qualityScore: number;
}

export interface AchievementAnalytics {
    achievementId: string;
    unlockedAt: Date;
    phase: number;
    timeToUnlock: number;
    difficulty: string;
    category: string;
}

export interface InteractionAnalytics {
    type: string;
    timestamp: Date;
    phase: number;
    target: string;
    duration?: number;
    successful: boolean;
    context: Record<string, any>;
}

export interface PerformanceAnalytics {
    overallScore: number;
    timeEfficiency: number;
    qualityIndex: number;
    creativityScore: number;
    collaborationScore: number;
    problemSolvingScore: number;
    communicationScore: number;
    reflectionDepth: number;
}

// ============================================================================
// EXPORTACIONES PRINCIPALES
// ============================================================================

export type PhaseComponentProps =
    | Phase1DiscoveryProps
    | Phase2ConstructionProps
    | Phase3ApplicationProps
    | Phase4InnovationProps;

export type PhaseConfigType =
    | Phase1Config
    | Phase2Config
    | Phase3Config
    | Phase4Config;
