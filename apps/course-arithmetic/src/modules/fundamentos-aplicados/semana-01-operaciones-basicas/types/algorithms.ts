// types/algorithms.ts

export interface AlgorithmBlock {
    id: string;
    type: 'input' | 'operation' | 'condition' | 'output' | 'loop' | 'function';
    title: string;
    description: string;
    category: string;
    parameters: AlgorithmParameter[];
    position: { x: number; y: number };
    connections: BlockConnection[];
    code: string;
    color: string;
    icon: string;
}

export interface AlgorithmParameter {
    id: string;
    name: string;
    type: 'number' | 'string' | 'boolean' | 'array' | 'object';
    value: any;
    required: boolean;
    validation?: ParameterValidation;
}

export interface ParameterValidation {
    min?: number;
    max?: number;
    pattern?: string;
    customValidation?: (value: any) => boolean;
}

export interface BlockConnection {
    id: string;
    from: string;
    to: string;
    fromPort: string;
    toPort: string;
    type: 'data' | 'control';
}

export interface AlgorithmFlow {
    id: string;
    name: string;
    description: string;
    blocks: AlgorithmBlock[];
    connections: BlockConnection[];
    variables: AlgorithmVariable[];
    metadata: AlgorithmMetadata;
}

export interface AlgorithmVariable {
    id: string;
    name: string;
    type: string;
    value: any;
    scope: 'global' | 'local';
    description: string;
}

export interface AlgorithmMetadata {
    created: Date;
    lastModified: Date;
    version: string;
    author: string;
    complexity: 'beginner' | 'intermediate' | 'advanced';
    tags: string[];
    estimatedTime: number;
}

export interface AlgorithmExecution {
    id: string;
    algorithmId: string;
    status: 'idle' | 'running' | 'completed' | 'error';
    progress: number;
    currentBlock: string;
    results: AlgorithmResult[];
    errors: AlgorithmError[];
    executionTime: number;
    timestamp: Date;
}

export interface AlgorithmResult {
    blockId: string;
    output: any;
    type: string;
    timestamp: Date;
}

export interface AlgorithmError {
    blockId: string;
    message: string;
    type: 'syntax' | 'runtime' | 'logic' | 'validation';
    severity: 'warning' | 'error';
    suggestions: string[];
}

export interface BlockCategory {
    id: string;
    name: string;
    description: string;
    color: string;
    icon: string;
    blocks: string[];
}

export interface AlgorithmTemplate {
    id: string;
    name: string;
    description: string;
    difficulty: number;
    category: string;
    flow: AlgorithmFlow;
    objectives: string[];
    hints: string[];
    solution: AlgorithmFlow;
}

export interface AlgorithmBuilderState {
    currentFlow: AlgorithmFlow | null;
    selectedBlocks: string[];
    draggedBlock: AlgorithmBlock | null;
    connectionMode: boolean;
    tempConnection: Partial<BlockConnection> | null;
    zoom: number;
    viewPort: { x: number; y: number };
    executionState: AlgorithmExecution | null;
    availableBlocks: AlgorithmBlock[];
    categories: BlockCategory[];
}

export interface AlgorithmBuilderActions {
    createNewFlow: (name: string) => void;
    loadFlow: (flow: AlgorithmFlow) => void;
    saveFlow: () => void;
    addBlock: (block: AlgorithmBlock) => void;
    removeBlock: (blockId: string) => void;
    updateBlock: (blockId: string, updates: Partial<AlgorithmBlock>) => void;
    connectBlocks: (connection: BlockConnection) => void;
    disconnectBlocks: (connectionId: string) => void;
    selectBlocks: (blockIds: string[]) => void;
    moveBlocks: (blockIds: string[], delta: { x: number; y: number }) => void;
    executeAlgorithm: () => Promise<AlgorithmExecution>;
    stopExecution: () => void;
    validateFlow: () => AlgorithmError[];
    setZoom: (zoom: number) => void;
    panViewport: (delta: { x: number; y: number }) => void;
    resetViewport: () => void;
}

export interface UseAlgorithmBuilderReturn
    extends AlgorithmBuilderState,
        AlgorithmBuilderActions {}

export interface AlgorithmChallenge {
    id: string;
    title: string;
    description: string;
    difficulty: number;
    category: string;
    requirements: string[];
    constraints: string[];
    testCases: AlgorithmTestCase[];
    hints: AlgorithmHint[];
    solution: AlgorithmFlow;
    timeLimit: number;
    maxBlocks?: number;
}

export interface AlgorithmTestCase {
    id: string;
    inputs: Record<string, any>;
    expectedOutputs: Record<string, any>;
    description: string;
    weight: number;
}

export interface AlgorithmHint {
    id: string;
    trigger: 'time' | 'error' | 'request' | 'stuck';
    delay: number;
    message: string;
    type: 'tip' | 'warning' | 'suggestion';
    blockId?: string;
}

export interface AlgorithmProgressData {
    challengeId: string;
    userId: string;
    startTime: Date;
    endTime?: Date;
    attempts: number;
    hintsUsed: number;
    blocksUsed: number;
    testsPassed: number;
    totalTests: number;
    finalScore: number;
    efficiency: number;
    creativity: number;
}

// Visual programming types
export interface CodeBlock {
    id: string;
    type: string;
    properties: Record<string, any>;
    children: CodeBlock[];
    parent?: string;
    position?: { x: number; y: number };
}

export interface ProgrammingEnvironment {
    blocks: CodeBlock[];
    variables: Record<string, any>;
    functions: Record<string, any>;
    canvas: {
        width: number;
        height: number;
        background: string;
    };
    settings: {
        autoSave: boolean;
        showGrid: boolean;
        snapToGrid: boolean;
        gridSize: number;
    };
}

export interface BlockDefinition {
    type: string;
    category: string;
    title: string;
    description: string;
    inputs: PortDefinition[];
    outputs: PortDefinition[];
    properties: PropertyDefinition[];
    color: string;
    icon: string;
    code: string;
}

export interface PortDefinition {
    id: string;
    name: string;
    type: string;
    required: boolean;
    defaultValue?: any;
}

export interface PropertyDefinition {
    id: string;
    name: string;
    type: 'string' | 'number' | 'boolean' | 'select' | 'color';
    defaultValue: any;
    options?: any[];
    validation?: any;
}
