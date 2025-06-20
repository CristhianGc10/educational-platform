// hooks/useAlgorithmBuilder.ts

import {
    AlgorithmBlock,
    AlgorithmBuilderState,
    AlgorithmError,
    AlgorithmExecution,
    AlgorithmFlow,
    AlgorithmVariable,
    BlockCategory,
    BlockConnection,
    UseAlgorithmBuilderReturn,
} from '../types/algorithms';
import { useCallback, useEffect, useRef, useState } from 'react';

import { AVAILABLE_BLOCKS } from '../config/lab-config';

const DEFAULT_FLOW: AlgorithmFlow = {
    id: 'new-flow',
    name: 'Nuevo Algoritmo',
    description: 'Descripción del algoritmo',
    blocks: [],
    connections: [],
    variables: [],
    metadata: {
        created: new Date(),
        lastModified: new Date(),
        version: '1.0.0',
        author: 'Usuario',
        complexity: 'beginner',
        tags: [],
        estimatedTime: 0,
    },
};

const INITIAL_STATE: AlgorithmBuilderState = {
    currentFlow: null,
    selectedBlocks: [],
    draggedBlock: null,
    connectionMode: false,
    tempConnection: null,
    zoom: 1.0,
    viewPort: { x: 0, y: 0 },
    executionState: null,
    availableBlocks: [],
    categories: AVAILABLE_BLOCKS,
};

export const useAlgorithmBuilder = (): UseAlgorithmBuilderReturn => {
    const [state, setState] = useState<AlgorithmBuilderState>(INITIAL_STATE);
    const executionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize available blocks
    useEffect(() => {
        const blocks = generateAvailableBlocks();
        setState((prev) => ({ ...prev, availableBlocks: blocks }));
    }, []);

    const generateAvailableBlocks = (): AlgorithmBlock[] => {
        const blocks: AlgorithmBlock[] = [];

        // Input/Output blocks
        blocks.push({
            id: 'input-number',
            type: 'input',
            title: 'Número de Entrada',
            description: 'Recibe un número del usuario',
            category: 'input-output',
            parameters: [
                {
                    id: 'label',
                    name: 'Etiqueta',
                    type: 'string',
                    value: 'Ingrese número',
                    required: true,
                },
            ],
            position: { x: 0, y: 0 },
            connections: [],
            code: 'const input = prompt("{label}"); return parseFloat(input);',
            color: '#3B82F6',
            icon: 'ArrowRight',
        });

        blocks.push({
            id: 'output-display',
            type: 'output',
            title: 'Mostrar Resultado',
            description: 'Muestra el resultado al usuario',
            category: 'input-output',
            parameters: [
                {
                    id: 'format',
                    name: 'Formato',
                    type: 'string',
                    value: 'Resultado: {value}',
                    required: true,
                },
            ],
            position: { x: 0, y: 0 },
            connections: [],
            code: 'console.log("{format}".replace("{value}", input));',
            color: '#3B82F6',
            icon: 'ArrowLeft',
        });

        // Math operations
        blocks.push({
            id: 'add',
            type: 'operation',
            title: 'Sumar',
            description: 'Suma dos números',
            category: 'math-operations',
            parameters: [],
            position: { x: 0, y: 0 },
            connections: [],
            code: 'return input1 + input2;',
            color: '#10B981',
            icon: 'Plus',
        });

        blocks.push({
            id: 'multiply',
            type: 'operation',
            title: 'Multiplicar',
            description: 'Multiplica dos números',
            category: 'math-operations',
            parameters: [],
            position: { x: 0, y: 0 },
            connections: [],
            code: 'return input1 * input2;',
            color: '#10B981',
            icon: 'X',
        });

        // Logic and control
        blocks.push({
            id: 'if-then',
            type: 'condition',
            title: 'Si Entonces',
            description: 'Ejecuta código si la condición es verdadera',
            category: 'logic-control',
            parameters: [
                {
                    id: 'condition',
                    name: 'Condición',
                    type: 'string',
                    value: 'input > 0',
                    required: true,
                },
            ],
            position: { x: 0, y: 0 },
            connections: [],
            code: 'if ({condition}) { return true; } return false;',
            color: '#F59E0B',
            icon: 'GitBranch',
        });

        blocks.push({
            id: 'for-loop',
            type: 'loop',
            title: 'Bucle For',
            description: 'Repite código un número específico de veces',
            category: 'logic-control',
            parameters: [
                {
                    id: 'iterations',
                    name: 'Iteraciones',
                    type: 'number',
                    value: 10,
                    required: true,
                },
            ],
            position: { x: 0, y: 0 },
            connections: [],
            code: 'for (let i = 0; i < {iterations}; i++) { /* loop body */ }',
            color: '#F59E0B',
            icon: 'RotateCw',
        });

        return blocks;
    };

    const createNewFlow = useCallback((name: string) => {
        const newFlow: AlgorithmFlow = {
            ...DEFAULT_FLOW,
            id: `flow-${Date.now()}`,
            name,
            metadata: {
                ...DEFAULT_FLOW.metadata,
                created: new Date(),
                lastModified: new Date(),
            },
        };

        setState((prev) => ({
            ...prev,
            currentFlow: newFlow,
            selectedBlocks: [],
            executionState: null,
        }));
    }, []);

    const loadFlow = useCallback((flow: AlgorithmFlow) => {
        setState((prev) => ({
            ...prev,
            currentFlow: flow,
            selectedBlocks: [],
            executionState: null,
        }));
    }, []);

    const saveFlow = useCallback(() => {
        if (!state.currentFlow) return;

        const updatedFlow: AlgorithmFlow = {
            ...state.currentFlow,
            metadata: {
                ...state.currentFlow.metadata,
                lastModified: new Date(),
            },
        };

        setState((prev) => ({
            ...prev,
            currentFlow: updatedFlow,
        }));

        // Here you would typically save to a backend or local storage
        console.log('Flow saved:', updatedFlow);
    }, [state.currentFlow]);

    const addBlock = useCallback(
        (block: AlgorithmBlock) => {
            if (!state.currentFlow) return;

            const newBlock: AlgorithmBlock = {
                ...block,
                id: `block-${Date.now()}`,
                position: {
                    x: -state.viewPort.x + 100,
                    y: -state.viewPort.y + 100,
                },
            };

            const updatedFlow: AlgorithmFlow = {
                ...state.currentFlow,
                blocks: [...state.currentFlow.blocks, newBlock],
            };

            setState((prev) => ({
                ...prev,
                currentFlow: updatedFlow,
            }));
        },
        [state.currentFlow, state.viewPort]
    );

    const removeBlock = useCallback(
        (blockId: string) => {
            if (!state.currentFlow) return;

            const updatedFlow: AlgorithmFlow = {
                ...state.currentFlow,
                blocks: state.currentFlow.blocks.filter(
                    (block) => block.id !== blockId
                ),
                connections: state.currentFlow.connections.filter(
                    (conn) => conn.from !== blockId && conn.to !== blockId
                ),
            };

            setState((prev) => ({
                ...prev,
                currentFlow: updatedFlow,
                selectedBlocks: prev.selectedBlocks.filter(
                    (id) => id !== blockId
                ),
            }));
        },
        [state.currentFlow]
    );

    const updateBlock = useCallback(
        (blockId: string, updates: Partial<AlgorithmBlock>) => {
            if (!state.currentFlow) return;

            const updatedFlow: AlgorithmFlow = {
                ...state.currentFlow,
                blocks: state.currentFlow.blocks.map((block) =>
                    block.id === blockId ? { ...block, ...updates } : block
                ),
            };

            setState((prev) => ({
                ...prev,
                currentFlow: updatedFlow,
            }));
        },
        [state.currentFlow]
    );

    const connectBlocks = useCallback(
        (connection: BlockConnection) => {
            if (!state.currentFlow) return;

            const newConnection: BlockConnection = {
                ...connection,
                id: `conn-${Date.now()}`,
            };

            const updatedFlow: AlgorithmFlow = {
                ...state.currentFlow,
                connections: [...state.currentFlow.connections, newConnection],
            };

            setState((prev) => ({
                ...prev,
                currentFlow: updatedFlow,
                connectionMode: false,
                tempConnection: null,
            }));
        },
        [state.currentFlow]
    );

    const disconnectBlocks = useCallback(
        (connectionId: string) => {
            if (!state.currentFlow) return;

            const updatedFlow: AlgorithmFlow = {
                ...state.currentFlow,
                connections: state.currentFlow.connections.filter(
                    (conn) => conn.id !== connectionId
                ),
            };

            setState((prev) => ({
                ...prev,
                currentFlow: updatedFlow,
            }));
        },
        [state.currentFlow]
    );

    const selectBlocks = useCallback((blockIds: string[]) => {
        setState((prev) => ({
            ...prev,
            selectedBlocks: blockIds,
        }));
    }, []);

    const moveBlocks = useCallback(
        (blockIds: string[], delta: { x: number; y: number }) => {
            if (!state.currentFlow) return;

            const updatedFlow: AlgorithmFlow = {
                ...state.currentFlow,
                blocks: state.currentFlow.blocks.map((block) =>
                    blockIds.includes(block.id)
                        ? {
                              ...block,
                              position: {
                                  x: block.position.x + delta.x,
                                  y: block.position.y + delta.y,
                              },
                          }
                        : block
                ),
            };

            setState((prev) => ({
                ...prev,
                currentFlow: updatedFlow,
            }));
        },
        [state.currentFlow]
    );

    const validateFlow = useCallback((): AlgorithmError[] => {
        if (!state.currentFlow) return [];

        const errors: AlgorithmError[] = [];
        const { blocks, connections } = state.currentFlow;

        // Check for disconnected blocks
        blocks.forEach((block) => {
            const hasInputConnection = connections.some(
                (conn) => conn.to === block.id
            );
            const hasOutputConnection = connections.some(
                (conn) => conn.from === block.id
            );

            if (block.type !== 'input' && !hasInputConnection) {
                errors.push({
                    blockId: block.id,
                    message: 'Bloque sin conexión de entrada',
                    type: 'validation',
                    severity: 'warning',
                    suggestions: ['Conecta este bloque a una entrada'],
                });
            }

            if (block.type !== 'output' && !hasOutputConnection) {
                errors.push({
                    blockId: block.id,
                    message: 'Bloque sin conexión de salida',
                    type: 'validation',
                    severity: 'warning',
                    suggestions: ['Conecta este bloque a una salida'],
                });
            }
        });

        // Check for circular dependencies
        const visited = new Set<string>();
        const recursionStack = new Set<string>();

        const hasCycle = (blockId: string): boolean => {
            if (recursionStack.has(blockId)) return true;
            if (visited.has(blockId)) return false;

            visited.add(blockId);
            recursionStack.add(blockId);

            const outgoingConnections = connections.filter(
                (conn) => conn.from === blockId
            );
            for (const conn of outgoingConnections) {
                if (hasCycle(conn.to)) return true;
            }

            recursionStack.delete(blockId);
            return false;
        };

        blocks.forEach((block) => {
            if (!visited.has(block.id) && hasCycle(block.id)) {
                errors.push({
                    blockId: block.id,
                    message: 'Dependencia circular detectada',
                    type: 'logic',
                    severity: 'error',
                    suggestions: [
                        'Revisa las conexiones para eliminar el ciclo',
                    ],
                });
            }
        });

        return errors;
    }, [state.currentFlow]);

    const executeAlgorithm =
        useCallback(async (): Promise<AlgorithmExecution> => {
            if (!state.currentFlow) {
                throw new Error('No hay algoritmo para ejecutar');
            }

            const validationErrors = validateFlow();
            if (validationErrors.some((error) => error.severity === 'error')) {
                throw new Error(
                    'El algoritmo tiene errores que deben corregirse'
                );
            }

            const execution: AlgorithmExecution = {
                id: `exec-${Date.now()}`,
                algorithmId: state.currentFlow.id,
                status: 'running',
                progress: 0,
                currentBlock: '',
                results: [],
                errors: [],
                executionTime: 0,
                timestamp: new Date(),
            };

            setState((prev) => ({
                ...prev,
                executionState: execution,
            }));

            const startTime = Date.now();

            try {
                // Simulate execution
                await simulateExecution(execution);

                const finalExecution: AlgorithmExecution = {
                    ...execution,
                    status: 'completed',
                    progress: 100,
                    executionTime: Date.now() - startTime,
                };

                setState((prev) => ({
                    ...prev,
                    executionState: finalExecution,
                }));

                return finalExecution;
            } catch (error) {
                const errorExecution: AlgorithmExecution = {
                    ...execution,
                    status: 'error',
                    executionTime: Date.now() - startTime,
                    errors: [
                        {
                            blockId: execution.currentBlock,
                            message:
                                error instanceof Error
                                    ? error.message
                                    : 'Error desconocido',
                            type: 'runtime',
                            severity: 'error',
                            suggestions: ['Revisa la configuración del bloque'],
                        },
                    ],
                };

                setState((prev) => ({
                    ...prev,
                    executionState: errorExecution,
                }));

                throw error;
            }
        }, [state.currentFlow, validateFlow]);

    const simulateExecution = async (
        execution: AlgorithmExecution
    ): Promise<void> => {
        if (!state.currentFlow) return;

        const { blocks } = state.currentFlow;
        const totalBlocks = blocks.length;

        for (let i = 0; i < totalBlocks; i++) {
            const block = blocks[i];

            setState((prev) => ({
                ...prev,
                executionState: prev.executionState
                    ? {
                          ...prev.executionState,
                          currentBlock: block.id,
                          progress: ((i + 1) / totalBlocks) * 100,
                      }
                    : null,
            }));

            // Simulate block execution time
            await new Promise((resolve) => setTimeout(resolve, 500));

            execution.results.push({
                blockId: block.id,
                output: `Resultado del bloque ${block.title}`,
                type: block.type,
                timestamp: new Date(),
            });
        }
    };

    const stopExecution = useCallback(() => {
        if (executionTimeoutRef.current) {
            clearTimeout(executionTimeoutRef.current);
            executionTimeoutRef.current = null;
        }

        setState((prev) => ({
            ...prev,
            executionState: prev.executionState
                ? {
                      ...prev.executionState,
                      status: 'idle',
                  }
                : null,
        }));
    }, []);

    const setZoom = useCallback((zoom: number) => {
        setState((prev) => ({
            ...prev,
            zoom: Math.max(0.1, Math.min(3.0, zoom)),
        }));
    }, []);

    const panViewport = useCallback((delta: { x: number; y: number }) => {
        setState((prev) => ({
            ...prev,
            viewPort: {
                x: prev.viewPort.x + delta.x,
                y: prev.viewPort.y + delta.y,
            },
        }));
    }, []);

    const resetViewport = useCallback(() => {
        setState((prev) => ({
            ...prev,
            zoom: 1.0,
            viewPort: { x: 0, y: 0 },
        }));
    }, []);

    return {
        ...state,
        createNewFlow,
        loadFlow,
        saveFlow,
        addBlock,
        removeBlock,
        updateBlock,
        connectBlocks,
        disconnectBlocks,
        selectBlocks,
        moveBlocks,
        executeAlgorithm,
        stopExecution,
        validateFlow,
        setZoom,
        panViewport,
        resetViewport,
    };
};

export default useAlgorithmBuilder;
