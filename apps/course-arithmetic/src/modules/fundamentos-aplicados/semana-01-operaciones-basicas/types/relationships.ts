// types/relationships.ts

import { Vector3 } from 'three';

export interface FamilyMember {
    id: string;
    name: string;
    age: number;
    gender: 'male' | 'female';
    generation: number;
    position: [number, number, number];
    relationships: string[];
    attributes?: Record<string, any>;
}

export interface FamilyRelationship {
    id: string;
    type:
        | 'parent'
        | 'child'
        | 'sibling'
        | 'spouse'
        | 'grandparent'
        | 'grandchild';
    from: string;
    to: string;
    strength: number;
    verified: boolean;
}

export interface Family {
    id: string;
    name: string;
    description: string;
    members: FamilyMember[];
    relationships: FamilyRelationship[];
    complexity: 'basic' | 'intermediate' | 'advanced';
    suggestedPatterns: string[];
}

export interface FamilyDataset {
    families: Family[];
    totalMembers: number;
    averageComplexity: number;
    availablePatterns: PatternType[];
}

export interface StudentHypothesis {
    id: string;
    description: string;
    confidence: number;
    variables: string[];
    expectedOutcome: string;
    testable: boolean;
    timestamp: Date;
}

export interface HypothesisResult {
    hypothesisId: string;
    passed: boolean;
    accuracy: number;
    evidence: string[];
    suggestions: string[];
    discoveredPatterns: DiscoveredPattern[];
}

export interface DiscoveredPattern {
    id: string;
    type: PatternType;
    description: string;
    confidence: number;
    examples: string[];
    applicability: number;
}

export type PatternType =
    | 'linear_sum'
    | 'age_difference'
    | 'generation_pattern'
    | 'sibling_groups'
    | 'parent_child_ratio'
    | 'gender_distribution'
    | 'marriage_patterns'
    | 'extended_family';

export interface ExplorationState {
    currentFamily: string;
    selectedMembers: string[];
    discoveredPatterns: DiscoveredPattern[];
    hypotheses: StudentHypothesis[];
    completedTests: HypothesisResult[];
    explorationTime: number;
    interactions: InteractionEvent[];
}

export interface InteractionEvent {
    id: string;
    type:
        | 'member_select'
        | 'pattern_discovery'
        | 'hypothesis_creation'
        | 'test_execution'
        | 'view_change';
    timestamp: Date;
    data: Record<string, any>;
    familyId: string;
}

export interface NetworkPosition {
    x: number;
    y: number;
    z?: number;
}

export interface RelationshipConnection {
    id: string;
    from: string;
    to: string;
    type: string;
    strength: number;
    color: string;
    animated: boolean;
}

export interface NetworkVisualizationProps {
    family: Family;
    selectedMembers: string[];
    onMemberSelect: (memberId: string) => void;
    onRelationshipHover: (relationshipId: string) => void;
    discoveredPatterns: DiscoveredPattern[];
    showPatterns: boolean;
    view3D: boolean;
}

export interface Scene3DProps {
    family: Family;
    selectedMembers: string[];
    onMemberSelect: (memberId: string) => void;
    cameraPosition: Vector3;
    showRelationships: boolean;
    animateTransitions: boolean;
}

// Utility types for mathematical operations
export interface MathematicalRelationship {
    variables: string[];
    equation: string;
    constraints: string[];
    domain: [number, number];
    range: [number, number];
}

export interface PatternAnalysis {
    pattern: DiscoveredPattern;
    statistical_significance: number;
    correlation_coefficient: number;
    sample_size: number;
    outliers: string[];
}

// Solver hook types
export interface RelationshipSolverState {
    families: Family[];
    currentFamilyIndex: number;
    selectedMembers: string[];
    discoveredPatterns: DiscoveredPattern[];
    hypotheses: StudentHypothesis[];
    explorationState: ExplorationState;
    analysisResults: PatternAnalysis[];
}

export interface RelationshipSolverActions {
    selectFamily: (index: number) => void;
    selectMember: (memberId: string) => void;
    createHypothesis: (
        hypothesis: Omit<StudentHypothesis, 'id' | 'timestamp'>
    ) => void;
    testHypothesis: (hypothesisId: string) => Promise<HypothesisResult>;
    discoverPattern: (pattern: Omit<DiscoveredPattern, 'id'>) => void;
    resetExploration: () => void;
    calculateRelationshipStrength: (memberA: string, memberB: string) => number;
    generateInsights: () => string[];
}

export interface UseRelationshipSolverReturn
    extends RelationshipSolverState,
        RelationshipSolverActions {}
