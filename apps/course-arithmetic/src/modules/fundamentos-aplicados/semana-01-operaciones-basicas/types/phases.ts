// types/phases.ts

import { AlgorithmChallenge, AlgorithmFlow } from './algorithms';
import {
    DiscoveredPattern,
    Family,
    HypothesisResult,
    StudentHypothesis,
} from './relationships';
import { SystemAnalysis, SystemOptimization } from './systems';

export interface PhaseConfig {
    id: string;
    title: string;
    description: string;
    objectives: string[];
    duration: number; // minutes
    order: number;
    prerequisites: string[];
    unlockCriteria: PhaseUnlockCriteria;
    resources: PhaseResource[];
}

export interface PhaseUnlockCriteria {
    minimumScore: number;
    requiredTasks: string[];
    timeSpent: number;
    conceptsLearned: string[];
}

export interface PhaseResource {
    id: string;
    type: 'video' | 'document' | 'interactive' | 'simulation' | 'reference';
    title: string;
    url: string;
    duration?: number;
    optional: boolean;
}

export interface PhaseProgress {
    phaseId: string;
    status: 'locked' | 'available' | 'in_progress' | 'completed';
    startTime?: Date;
    endTime?: Date;
    score: number;
    maxScore: number;
    completedTasks: string[];
    achievements: PhaseAchievement[];
    timeSpent: number;
    attempts: number;
}

export interface PhaseAchievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
    unlockedAt: Date;
    points: number;
}

export interface PhaseResults {
    phaseId: string;
    userId: string;
    score: number;
    timeSpent: number;
    conceptsMastered: string[];
    difficultiesEncountered: string[];
    strategiesUsed: string[];
    feedback: string;
    recommendations: string[];
    nextSteps: string[];
}

// Phase 1: Discovery Phase
export interface Phase1State {
    currentFamilyIndex: number;
    familiesExplored: string[];
    selectedMembers: string[];
    discoveredPatterns: DiscoveredPattern[];
    hypotheses: StudentHypothesis[];
    testedHypotheses: HypothesisResult[];
    viewMode: '2d' | '3d';
    showPatterns: boolean;
    interactionLog: Phase1Interaction[];
}

export interface Phase1Interaction {
    id: string;
    type:
        | 'family_select'
        | 'member_select'
        | 'pattern_discover'
        | 'hypothesis_create'
        | 'hypothesis_test'
        | 'view_change';
    timestamp: Date;
    data: any;
    familyId: string;
}

export interface Phase1Results extends PhaseResults {
    familiesExplored: number;
    patternsDiscovered: number;
    hypothesesTested: number;
    accuracyRate: number;
    explorationDepth: number;
    creativityScore: number;
}

// Phase 2: Algorithm Construction Phase
export interface Phase2State {
    currentChallenge: string;
    availableChallenges: AlgorithmChallenge[];
    completedChallenges: string[];
    currentAlgorithm: AlgorithmFlow | null;
    testResults: Phase2TestResult[];
    hintsUsed: number;
    codeQuality: Phase2CodeQuality;
}

export interface Phase2TestResult {
    challengeId: string;
    algorithmId: string;
    passed: boolean;
    score: number;
    executionTime: number;
    efficiency: number;
    correctness: number;
    elegance: number;
    feedback: string[];
}

export interface Phase2CodeQuality {
    complexity: number;
    readability: number;
    reusability: number;
    efficiency: number;
    documentation: number;
    bestPractices: number;
}

export interface Phase2Results extends PhaseResults {
    challengesCompleted: number;
    averageAttempts: number;
    codeQualityScore: number;
    algorithmicThinking: number;
    problemSolvingSpeed: number;
    creativity: number;
}

// Phase 3: Application Phase
export interface Phase3State {
    currentScenario: string;
    availableScenarios: BusinessScenario[];
    systemOptimizations: SystemOptimization[];
    analysisResults: SystemAnalysis[];
    implementationPlan: ImplementationPlan;
    stakeholderFeedback: StakeholderFeedback[];
}

export interface BusinessScenario {
    id: string;
    title: string;
    description: string;
    industry: string;
    complexity: 'basic' | 'intermediate' | 'advanced';
    objectives: string[];
    constraints: string[];
    stakeholders: Stakeholder[];
    initialData: any;
}

export interface Stakeholder {
    id: string;
    name: string;
    role: string;
    influence: number;
    interest: number;
    concerns: string[];
    success_criteria: string[];
}

export interface ImplementationPlan {
    id: string;
    scenarioId: string;
    phases: ImplementationPhase[];
    timeline: number;
    budget: number;
    risks: Risk[];
    success_metrics: string[];
}

export interface ImplementationPhase {
    id: string;
    title: string;
    description: string;
    duration: number;
    dependencies: string[];
    deliverables: string[];
    resources: string[];
}

export interface Risk {
    id: string;
    description: string;
    probability: number;
    impact: number;
    mitigation: string;
    owner: string;
}

export interface StakeholderFeedback {
    stakeholderId: string;
    feedback: string;
    satisfaction: number;
    concerns: string[];
    suggestions: string[];
    timestamp: Date;
}

export interface Phase3Results extends PhaseResults {
    scenariosCompleted: number;
    optimizationAccuracy: number;
    stakeholderSatisfaction: number;
    implementationFeasibility: number;
    businessImpact: number;
    systemsThinking: number;
}

// Phase 4: Innovation Phase
export interface Phase4State {
    currentProject: string;
    projectIdeas: ProjectIdea[];
    selectedIdea: ProjectIdea | null;
    developmentStage:
        | 'ideation'
        | 'planning'
        | 'development'
        | 'testing'
        | 'presentation';
    collaborators: Collaborator[];
    peerReviews: PeerReview[];
    innovations: Innovation[];
}

export interface ProjectIdea {
    id: string;
    title: string;
    description: string;
    category: string;
    novelty: number;
    feasibility: number;
    impact: number;
    complexity: number;
    resources_needed: string[];
    target_audience: string;
}

export interface Collaborator {
    id: string;
    userId: string;
    role: 'leader' | 'contributor' | 'advisor';
    expertise: string[];
    contribution: string;
    active: boolean;
}

export interface PeerReview {
    id: string;
    reviewerId: string;
    projectId: string;
    criteria: ReviewCriteria;
    comments: string;
    suggestions: string[];
    rating: number;
    timestamp: Date;
}

export interface ReviewCriteria {
    innovation: number;
    feasibility: number;
    presentation: number;
    mathematical_rigor: number;
    practical_application: number;
    creativity: number;
}

export interface Innovation {
    id: string;
    title: string;
    description: string;
    type: 'algorithm' | 'method' | 'application' | 'tool' | 'framework';
    originalProblem: string;
    solution: string;
    validation: string;
    impact: string;
    documentation: string;
}

export interface Phase4Results extends PhaseResults {
    projectsCompleted: number;
    innovationScore: number;
    collaborationEffectiveness: number;
    presentationQuality: number;
    peerRating: number;
    originalityIndex: number;
}

// Overall Lab State
export interface LabState {
    userId: string;
    labId: string;
    currentPhase: number;
    phases: PhaseProgress[];
    overallProgress: number;
    startTime: Date;
    lastActivity: Date;
    achievements: PhaseAchievement[];
    learningPath: string[];
    preferences: UserPreferences;
    analytics: LabAnalytics;
}

export interface UserPreferences {
    visualStyle: '2d' | '3d' | 'mixed';
    difficultyPreference: 'adaptive' | 'challenging' | 'comfortable';
    feedbackType: 'immediate' | 'delayed' | 'on_request';
    collaborationMode: boolean;
    notificationsEnabled: boolean;
    language: string;
}

export interface LabAnalytics {
    totalTimeSpent: number;
    sessionsCount: number;
    averageSessionDuration: number;
    conceptsMastered: string[];
    strugglingAreas: string[];
    learningVelocity: number;
    engagementScore: number;
    retentionRate: number;
    transferabilityScore: number;
}

// State Management Types
export interface PhaseState {
    phase1: Phase1State;
    phase2: Phase2State;
    phase3: Phase3State;
    phase4: Phase4State;
}

export interface PhaseTransition {
    from: number;
    to: number;
    requirements: string[];
    animation: 'fade' | 'slide' | 'zoom' | 'flip';
    duration: number;
    celebration: boolean;
}

export interface PhaseValidation {
    phaseId: string;
    criteria: ValidationCriteria[];
    passed: boolean;
    score: number;
    feedback: string[];
    nextRecommendations: string[];
}

export interface ValidationCriteria {
    id: string;
    description: string;
    weight: number;
    passed: boolean;
    score: number;
    evidence: string[];
}
