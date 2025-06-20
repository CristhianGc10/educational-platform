// ============================================================================
// CONSTRUCTOR DE ALGORITMOS - IMPLEMENTACIÓN COMPLETA CORREGIDA
// ============================================================================

import {
    AlertCircle,
    CheckCircle,
    Copy,
    Download,
    Edit,
    Eye,
    EyeOff,
    Info,
    Play,
    Plus,
    RotateCcw,
    Save,
    Settings,
    Trash2,
    Upload,
    ZoomIn,
    ZoomOut,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

/**
 * Tipos de bloques de algoritmo
 */
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

/**
 * Categorías de bloques
 */
export enum BlockCategory {
    DATA_INPUT = 'data_input',
    MATHEMATICAL = 'mathematical',
    LOGICAL = 'logical',
    CONTROL_FLOW = 'control_flow',
    OUTPUT = 'output',
    UTILITIES = 'utilities',
}

/**
 * Definición de un bloque de algoritmo
 */
export interface AlgorithmBlock {
    id: string;
    type: AlgorithmBlockType;
    name: string;
    description: string;
    category: BlockCategory;
    color?: string;
    icon?: string;
    position?: { x: number; y: number };
    size?: { width: number; height: number };
    inputs?: AlgorithmInput[];
    outputs?: AlgorithmOutput[];
    properties?: Record<string, any>;
    isValid?: boolean;
    validationErrors?: string[];
}

/**
 * Entrada de un bloque
 */
export interface AlgorithmInput {
    id: string;
    name: string;
    type: 'number' | 'string' | 'boolean' | 'array' | 'object' | 'any';
    required?: boolean;
    defaultValue?: any;
    description?: string;
}

/**
 * Salida de un bloque
 */
export interface AlgorithmOutput {
    id: string;
    name: string;
    type: 'number' | 'string' | 'boolean' | 'array' | 'object' | 'any';
    description?: string;
}

/**
 * Conexión entre bloques
 */
export interface BlockConnection {
    id: string;
    sourceId: string;
    sourceOutput: string;
    targetId: string;
    targetInput: string;
    isValid?: boolean;
}

/**
 * Algoritmo construido
 */
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
}

/**
 * Resultado de validación
 */
export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
    suggestions: string[];
    score: number; // 0-100
}

/**
 * Error de validación
 */
export interface ValidationError {
    id?: string;
    type?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    blockId?: string;
    connectionId?: string;
    field?: string;
}

/**
 * Advertencia de validación
 */
export interface ValidationWarning {
    message: string;
    blockId?: string;
    type?: string;
}

// ============================================================================
// PROPS DE COMPONENTES
// ============================================================================

/**
 * Props para el constructor de algoritmos
 */
interface AlgorithmBuilderProps {
    availableBlocks: AlgorithmBlock[];
    onAlgorithmChange: (algorithm: ConstructedAlgorithm) => void;
    onExecute: (algorithm: ConstructedAlgorithm) => Promise<any>;
    onSave: (algorithm: ConstructedAlgorithm) => void;
    initialAlgorithm?: ConstructedAlgorithm;
    readOnly?: boolean;
    className?: string;
    showGrid?: boolean;
    enableZoom?: boolean;
    enableValidation?: boolean;
    maxBlocks?: number;
}

/**
 * Estado de drag and drop
 */
interface DragState {
    isDragging: boolean;
    draggedBlock: AlgorithmBlock | null;
    dragOffset: { x: number; y: number };
}

/**
 * Props para el componente de bloque individual
 */
interface BlockComponentProps {
    block: AlgorithmBlock;
    isSelected: boolean;
    onSelect: (block: AlgorithmBlock) => void;
    onPositionChange: (
        blockId: string,
        position: { x: number; y: number }
    ) => void;
    onDelete: (blockId: string) => void;
    onEdit?: (block: AlgorithmBlock) => void;
    readOnly?: boolean;
    scale?: number;
}

/**
 * Props para el panel de propiedades
 */
interface PropertyPanelProps {
    block: AlgorithmBlock | null;
    onBlockUpdate: (block: AlgorithmBlock) => void;
    onClose: () => void;
}

// ============================================================================
// COMPONENTE DE BLOQUE INDIVIDUAL
// ============================================================================

const BlockComponent: React.FC<BlockComponentProps> = ({
    block,
    isSelected,
    onSelect,
    onPositionChange,
    onDelete,
    onEdit,
    readOnly = false,
    scale = 1,
}) => {
    const [position, setPosition] = useState(
        block.position || { x: 100, y: 100 }
    );
    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const blockRef = useRef<HTMLDivElement>(null);

    // Calcular color basado en tipo de bloque
    const getBlockColor = (type: AlgorithmBlockType): string => {
        const colors = {
            [AlgorithmBlockType.INPUT]: '#3B82F6', // Azul
            [AlgorithmBlockType.PROCESS]: '#10B981', // Verde
            [AlgorithmBlockType.DECISION]: '#F59E0B', // Amarillo
            [AlgorithmBlockType.OUTPUT]: '#EF4444', // Rojo
            [AlgorithmBlockType.LOOP]: '#8B5CF6', // Púrpura
            [AlgorithmBlockType.FUNCTION]: '#06B6D4', // Cian
            [AlgorithmBlockType.VARIABLE]: '#6B7280', // Gris
            [AlgorithmBlockType.CONSTANT]: '#374151', // Gris oscuro
            [AlgorithmBlockType.CONDITION]: '#F97316', // Naranja
            [AlgorithmBlockType.OPERATION]: '#84CC16', // Lima
        };
        return block.color || colors[type] || '#6B7280';
    };

    // Obtener icono del bloque
    const getBlockIcon = (type: AlgorithmBlockType): string => {
        const icons = {
            [AlgorithmBlockType.INPUT]: '📥',
            [AlgorithmBlockType.PROCESS]: '⚙️',
            [AlgorithmBlockType.DECISION]: '❓',
            [AlgorithmBlockType.OUTPUT]: '📤',
            [AlgorithmBlockType.LOOP]: '🔄',
            [AlgorithmBlockType.FUNCTION]: '🔧',
            [AlgorithmBlockType.VARIABLE]: '📦',
            [AlgorithmBlockType.CONSTANT]: '🔒',
            [AlgorithmBlockType.CONDITION]: '🔍',
            [AlgorithmBlockType.OPERATION]: '➕',
        };
        return block.icon || icons[type] || '📋';
    };

    // Manejar inicio de arrastre
    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (readOnly) return;
            e.preventDefault();
            setIsDragging(true);
            onSelect(block);
        },
        [readOnly, onSelect, block]
    );

    // Manejar eliminación
    const handleDelete = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (!readOnly) {
                onDelete(block.id);
            }
        },
        [readOnly, onDelete, block.id]
    );

    // Manejar edición
    const handleEdit = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (!readOnly && onEdit) {
                onEdit(block);
            }
        },
        [readOnly, onEdit, block]
    );

    // Actualizar posición cuando cambie la prop
    useEffect(() => {
        if (block.position) {
            setPosition(block.position);
        }
    }, [block.position]);

    const blockColor = getBlockColor(block.type);
    const blockIcon = getBlockIcon(block.type);

    return (
        <motion.div
            ref={blockRef}
            className={`
                absolute bg-white border-2 rounded-lg shadow-lg cursor-pointer
                min-w-[140px] max-w-[220px] select-none
                ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}
                ${isDragging ? 'z-50' : 'z-10'}
                ${isHovered ? 'shadow-xl' : 'shadow-lg'}
                ${!block.isValid ? 'border-red-500 bg-red-50' : ''}
                transition-all duration-200 ease-in-out
            `}
            style={{
                left: position.x,
                top: position.y,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                borderLeftWidth: '4px',
                borderLeftColor: blockColor,
            }}
            drag={!readOnly}
            dragMomentum={false}
            onMouseDown={handleMouseDown}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(_, info) => {
                const newPosition = {
                    x: Math.max(0, position.x + info.offset.x),
                    y: Math.max(0, position.y + info.offset.y),
                };
                setPosition(newPosition);
                onPositionChange(block.id, newPosition);
                setIsDragging(false);
            }}
            whileHover={!readOnly ? { scale: scale * 1.02 } : {}}
            whileDrag={{ scale: scale * 1.05, zIndex: 50 }}
            animate={{
                scale: scale,
                opacity: isDragging ? 0.8 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            {/* Header del bloque */}
            <div
                className="flex items-center justify-between p-3 border-b border-gray-200"
                style={{ backgroundColor: `${blockColor}15` }}
            >
                <div className="flex items-center space-x-2 flex-1">
                    <span
                        className="text-lg"
                        role="img"
                        aria-label={block.type}
                    >
                        {blockIcon}
                    </span>
                    <span className="font-semibold text-sm text-gray-900 truncate">
                        {block.name}
                    </span>
                </div>

                {/* Botones de acción */}
                {!readOnly && (
                    <div className="flex items-center space-x-1 ml-2">
                        {onEdit && (
                            <button
                                onClick={handleEdit}
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                title="Editar bloque"
                            >
                                <Edit className="h-3 w-3" />
                            </button>
                        )}
                        <button
                            onClick={handleDelete}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Eliminar bloque"
                        >
                            <Trash2 className="h-3 w-3" />
                        </button>
                    </div>
                )}
            </div>

            {/* Contenido del bloque */}
            <div className="p-3">
                <div className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {block.description}
                </div>

                {/* Propiedades básicas */}
                {block.properties &&
                    Object.keys(block.properties).length > 0 && (
                        <div className="text-xs bg-gray-50 rounded p-2 mb-2">
                            {Object.entries(block.properties)
                                .slice(0, 2)
                                .map(([key, value]) => (
                                    <div
                                        key={key}
                                        className="flex justify-between"
                                    >
                                        <span className="font-medium">
                                            {key}:
                                        </span>
                                        <span className="truncate ml-1">
                                            {String(value)}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    )}

                {/* Errores de validación */}
                {block.validationErrors &&
                    block.validationErrors.length > 0 && (
                        <div className="text-xs text-red-600 bg-red-50 rounded p-2">
                            <div className="font-medium mb-1">⚠️ Errores:</div>
                            {block.validationErrors
                                .slice(0, 2)
                                .map((error, index) => (
                                    <div key={index} className="truncate">
                                        • {error}
                                    </div>
                                ))}
                        </div>
                    )}
            </div>

            {/* Conectores de entrada */}
            {block.inputs &&
                block.inputs.map((input, index) => (
                    <div
                        key={`input-${input.id}`}
                        className="absolute w-3 h-3 bg-blue-500 rounded-full border-2 border-white -left-1.5 shadow-sm"
                        style={{ top: 40 + index * 20 }}
                        title={`Input: ${input.name} (${input.type})`}
                    />
                ))}

            {/* Conectores de salida */}
            {block.outputs &&
                block.outputs.map((output, index) => (
                    <div
                        key={`output-${output.id}`}
                        className="absolute w-3 h-3 bg-green-500 rounded-full border-2 border-white -right-1.5 shadow-sm"
                        style={{ top: 40 + index * 20 }}
                        title={`Output: ${output.name} (${output.type})`}
                    />
                ))}

            {/* Indicador de estado */}
            <div className="absolute -top-1 -right-1">
                {block.isValid === false ? (
                    <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-white text-xs">!</span>
                    </div>
                ) : block.isValid === true ? (
                    <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                    </div>
                ) : null}
            </div>
        </motion.div>
    );
};

// ============================================================================
// PANEL DE PROPIEDADES
// ============================================================================

const PropertyPanel: React.FC<PropertyPanelProps> = ({
    block,
    onBlockUpdate,
    onClose,
}) => {
    const [editedBlock, setEditedBlock] = useState<AlgorithmBlock | null>(
        block
    );

    useEffect(() => {
        setEditedBlock(block);
    }, [block]);

    if (!editedBlock) return null;

    const handlePropertyChange = (key: string, value: any) => {
        const updatedBlock = {
            ...editedBlock,
            properties: {
                ...editedBlock.properties,
                [key]: value,
            },
        };
        setEditedBlock(updatedBlock);
    };

    const handleSave = () => {
        if (editedBlock) {
            onBlockUpdate(editedBlock);
        }
    };

    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="absolute right-0 top-0 bottom-0 w-80 bg-white border-l border-gray-200 shadow-lg z-40 overflow-y-auto"
        >
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Propiedades del Bloque
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                </div>

                {/* Información básica */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre
                        </label>
                        <input
                            type="text"
                            value={editedBlock.name}
                            onChange={(e) =>
                                setEditedBlock({
                                    ...editedBlock,
                                    name: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción
                        </label>
                        <textarea
                            value={editedBlock.description}
                            onChange={(e) =>
                                setEditedBlock({
                                    ...editedBlock,
                                    description: e.target.value,
                                })
                            }
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo
                        </label>
                        <select
                            value={editedBlock.type}
                            onChange={(e) =>
                                setEditedBlock({
                                    ...editedBlock,
                                    type: e.target.value as AlgorithmBlockType,
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {Object.values(AlgorithmBlockType).map((type) => (
                                <option key={type} value={type}>
                                    {type.charAt(0).toUpperCase() +
                                        type.slice(1).replace('_', ' ')}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Propiedades personalizadas */}
                    {editedBlock.properties && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Propiedades Personalizadas
                            </label>
                            <div className="space-y-2">
                                {Object.entries(editedBlock.properties).map(
                                    ([key, value]) => (
                                        <div
                                            key={key}
                                            className="flex items-center space-x-2"
                                        >
                                            <input
                                                type="text"
                                                value={key}
                                                readOnly
                                                className="flex-1 px-2 py-1 text-sm bg-gray-50 border border-gray-300 rounded"
                                            />
                                            <input
                                                type="text"
                                                value={String(value)}
                                                onChange={(e) =>
                                                    handlePropertyChange(
                                                        key,
                                                        e.target.value
                                                    )
                                                }
                                                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {/* Entradas */}
                    {editedBlock.inputs && editedBlock.inputs.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Entradas
                            </label>
                            <div className="space-y-2">
                                {editedBlock.inputs.map((input) => (
                                    <div
                                        key={input.id}
                                        className="p-2 bg-gray-50 rounded"
                                    >
                                        <div className="font-medium text-sm">
                                            {input.name}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            Tipo: {input.type} |{' '}
                                            {input.required
                                                ? 'Requerido'
                                                : 'Opcional'}
                                        </div>
                                        {input.description && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                {input.description}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Salidas */}
                    {editedBlock.outputs && editedBlock.outputs.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Salidas
                            </label>
                            <div className="space-y-2">
                                {editedBlock.outputs.map((output) => (
                                    <div
                                        key={output.id}
                                        className="p-2 bg-gray-50 rounded"
                                    >
                                        <div className="font-medium text-sm">
                                            {output.name}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            Tipo: {output.type}
                                        </div>
                                        {output.description && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                {output.description}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Botones de acción */}
                    <div className="flex space-x-2 pt-4">
                        <button
                            onClick={handleSave}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Guardar Cambios
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ============================================================================
// COMPONENTE PRINCIPAL - ALGORITHM BUILDER
// ============================================================================

export const AlgorithmBuilder: React.FC<AlgorithmBuilderProps> = ({
    availableBlocks,
    onAlgorithmChange,
    onExecute,
    onSave,
    initialAlgorithm,
    readOnly = false,
    className = '',
    showGrid = true,
    enableZoom = true,
    enableValidation = true,
    maxBlocks = 50,
}) => {
    // Estados principales
    const canvasRef = useRef<HTMLDivElement>(null);
    const [algorithm, setAlgorithm] = useState<ConstructedAlgorithm>(
        initialAlgorithm || {
            id: `algorithm_${Date.now()}`,
            name: 'Nuevo Algoritmo',
            description: '',
            blocks: [],
            connections: [],
            metadata: {
                createdAt: new Date(),
                updatedAt: new Date(),
                version: '1.0.0',
            },
        }
    );

    // Estados de UI
    const [selectedBlock, setSelectedBlock] = useState<AlgorithmBlock | null>(
        null
    );
    const [editingBlock, setEditingBlock] = useState<AlgorithmBlock | null>(
        null
    );
    const [validationState, setValidationState] = useState<ValidationResult>({
        isValid: true,
        errors: [],
        warnings: [],
        suggestions: [],
        score: 100,
    });

    // Estados de control
    const [isExecuting, setIsExecuting] = useState(false);
    const [showValidation, setShowValidation] = useState(false);
    const [showPropertyPanel, setShowPropertyPanel] = useState(false);
    const [canvasScale, setCanvasScale] = useState(1);
    const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });

    // ========================================================================
    // FUNCIONES DE MANIPULACIÓN DEL ALGORITMO
    // ========================================================================

    // Agregar bloque al canvas
    const addBlock = useCallback(
        (blockType: AlgorithmBlockType) => {
            if (algorithm.blocks.length >= maxBlocks) {
                alert(`Máximo ${maxBlocks} bloques permitidos`);
                return;
            }

            const baseBlock = availableBlocks.find((b) => b.type === blockType);
            if (!baseBlock) return;

            const newBlock: AlgorithmBlock = {
                ...baseBlock,
                id: `${blockType}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                position: {
                    x: 100 + algorithm.blocks.length * 20,
                    y: 100 + algorithm.blocks.length * 20,
                },
                isValid: true,
            };

            const updatedAlgorithm = {
                ...algorithm,
                blocks: [...algorithm.blocks, newBlock],
                metadata: {
                    ...algorithm.metadata,
                    updatedAt: new Date(),
                },
            };

            setAlgorithm(updatedAlgorithm);
            onAlgorithmChange(updatedAlgorithm);
        },
        [algorithm, availableBlocks, onAlgorithmChange, maxBlocks]
    );

    // Eliminar bloque
    const deleteBlock = useCallback(
        (blockId: string) => {
            const updatedAlgorithm = {
                ...algorithm,
                blocks: algorithm.blocks.filter((b) => b.id !== blockId),
                connections: algorithm.connections.filter(
                    (c) => c.sourceId !== blockId && c.targetId !== blockId
                ),
                metadata: {
                    ...algorithm.metadata,
                    updatedAt: new Date(),
                },
            };

            setAlgorithm(updatedAlgorithm);
            onAlgorithmChange(updatedAlgorithm);

            if (selectedBlock?.id === blockId) {
                setSelectedBlock(null);
            }
            if (editingBlock?.id === blockId) {
                setEditingBlock(null);
                setShowPropertyPanel(false);
            }
        },
        [algorithm, onAlgorithmChange, selectedBlock, editingBlock]
    );

    // Actualizar posición de bloque
    const updateBlockPosition = useCallback(
        (blockId: string, position: { x: number; y: number }) => {
            const updatedAlgorithm = {
                ...algorithm,
                blocks: algorithm.blocks.map((block) =>
                    block.id === blockId ? { ...block, position } : block
                ),
                metadata: {
                    ...algorithm.metadata,
                    updatedAt: new Date(),
                },
            };

            setAlgorithm(updatedAlgorithm);
            onAlgorithmChange(updatedAlgorithm);
        },
        [algorithm, onAlgorithmChange]
    );

    // Actualizar bloque
    const updateBlock = useCallback(
        (updatedBlock: AlgorithmBlock) => {
            const updatedAlgorithm = {
                ...algorithm,
                blocks: algorithm.blocks.map((block) =>
                    block.id === updatedBlock.id ? updatedBlock : block
                ),
                metadata: {
                    ...algorithm.metadata,
                    updatedAt: new Date(),
                },
            };

            setAlgorithm(updatedAlgorithm);
            onAlgorithmChange(updatedAlgorithm);
            setEditingBlock(null);
            setShowPropertyPanel(false);
        },
        [algorithm, onAlgorithmChange]
    );

    // ========================================================================
    // FUNCIONES DE ACCIÓN
    // ========================================================================

    // Ejecutar algoritmo
    const executeAlgorithm = async () => {
        if (isExecuting || !validationState.isValid) return;

        setIsExecuting(true);
        try {
            const result = await onExecute(algorithm);
            console.log('🚀 Algoritmo ejecutado exitosamente:', result);
        } catch (error) {
            console.error('❌ Error ejecutando algoritmo:', error);
            alert('Error al ejecutar el algoritmo. Ver consola para detalles.');
        } finally {
            setIsExecuting(false);
        }
    };

    // Guardar algoritmo
    const saveAlgorithm = useCallback(() => {
        const updatedAlgorithm = {
            ...algorithm,
            metadata: {
                ...algorithm.metadata,
                updatedAt: new Date(),
            },
        };
        onSave(updatedAlgorithm);
        console.log('💾 Algoritmo guardado');
    }, [algorithm, onSave]);

    // Limpiar canvas
    const clearCanvas = useCallback(() => {
        if (confirm('¿Estás seguro de que quieres limpiar todo el canvas?')) {
            const clearedAlgorithm = {
                ...algorithm,
                blocks: [],
                connections: [],
                metadata: {
                    ...algorithm.metadata,
                    updatedAt: new Date(),
                },
            };
            setAlgorithm(clearedAlgorithm);
            onAlgorithmChange(clearedAlgorithm);
            setSelectedBlock(null);
            setEditingBlock(null);
            setShowPropertyPanel(false);
        }
    }, [algorithm, onAlgorithmChange]);

    // ========================================================================
    // FUNCIONES DE ZOOM Y NAVEGACIÓN
    // ========================================================================

    const zoomIn = useCallback(() => {
        setCanvasScale((prev) => Math.min(prev * 1.2, 3));
    }, []);

    const zoomOut = useCallback(() => {
        setCanvasScale((prev) => Math.max(prev / 1.2, 0.3));
    }, []);

    const resetZoom = useCallback(() => {
        setCanvasScale(1);
        setCanvasOffset({ x: 0, y: 0 });
    }, []);

    // ========================================================================
    // VALIDACIÓN
    // ========================================================================

    // Validar algoritmo
    useEffect(() => {
        if (!enableValidation) return;

        const errors: ValidationError[] = [];
        const warnings: ValidationWarning[] = [];
        const suggestions: string[] = [];

        // Validaciones básicas
        if (algorithm.blocks.length === 0) {
            errors.push({
                message: 'El algoritmo debe tener al menos un bloque',
                severity: 'medium',
            });
        }

        if (algorithm.blocks.length > 0 && algorithm.connections.length === 0) {
            warnings.push({
                message:
                    'Considera conectar los bloques para crear flujo lógico',
            });
        }

        if (algorithm.blocks.length > maxBlocks * 0.8) {
            warnings.push({
                message: `Algoritmo se acerca al límite de ${maxBlocks} bloques`,
            });
        }

        // Validar bloques individuales
        algorithm.blocks.forEach((block) => {
            if (!block.name || block.name.trim() === '') {
                errors.push({
                    message: `El bloque ${block.id} debe tener un nombre`,
                    blockId: block.id,
                    severity: 'medium',
                });
            }

            if (!block.description || block.description.trim() === '') {
                warnings.push({
                    message: `El bloque ${block.name} podría beneficiarse de una descripción`,
                    blockId: block.id,
                });
            }
        });

        // Validar conexiones
        algorithm.connections.forEach((connection) => {
            const sourceBlock = algorithm.blocks.find(
                (b) => b.id === connection.sourceId
            );
            const targetBlock = algorithm.blocks.find(
                (b) => b.id === connection.targetId
            );

            if (!sourceBlock || !targetBlock) {
                errors.push({
                    message: 'Conexión inválida entre bloques',
                    connectionId: connection.id,
                    severity: 'high',
                });
            }
        });

        // Sugerencias
        if (algorithm.blocks.length > 10) {
            suggestions.push(
                'Algoritmo complejo, considera dividirlo en sub-algoritmos'
            );
        }

        if (
            algorithm.blocks.filter((b) => b.type === AlgorithmBlockType.INPUT)
                .length === 0
        ) {
            suggestions.push('Agregar bloques de entrada para datos');
        }

        if (
            algorithm.blocks.filter((b) => b.type === AlgorithmBlockType.OUTPUT)
                .length === 0
        ) {
            suggestions.push('Agregar bloques de salida para resultados');
        }

        // Calcular puntuación
        const criticalErrors = errors.filter(
            (e) => e.severity === 'critical'
        ).length;
        const highErrors = errors.filter((e) => e.severity === 'high').length;
        const mediumErrors = errors.filter(
            (e) => e.severity === 'medium'
        ).length;
        const lowErrors = errors.filter((e) => e.severity === 'low').length;

        const score = Math.max(
            0,
            100 -
                criticalErrors * 40 -
                highErrors * 25 -
                mediumErrors * 15 -
                lowErrors * 5 -
                warnings.length * 2
        );

        // Actualizar estado de validación
        setValidationState({
            isValid: criticalErrors === 0 && highErrors === 0,
            errors,
            warnings,
            suggestions,
            score: Math.round(score),
        });

        // Actualizar validación de bloques individuales
        const updatedBlocks = algorithm.blocks.map((block) => ({
            ...block,
            isValid: !errors.some((e) => e.blockId === block.id),
            validationErrors: errors
                .filter((e) => e.blockId === block.id)
                .map((e) => e.message),
        }));

        if (
            JSON.stringify(updatedBlocks) !== JSON.stringify(algorithm.blocks)
        ) {
            setAlgorithm((prev) => ({
                ...prev,
                blocks: updatedBlocks,
            }));
        }
    }, [algorithm, enableValidation, maxBlocks]);

    // ========================================================================
    // HANDLERS DE EVENTOS
    // ========================================================================

    const handleBlockEdit = useCallback((block: AlgorithmBlock) => {
        setEditingBlock(block);
        setShowPropertyPanel(true);
    }, []);

    const handleCanvasClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            setSelectedBlock(null);
        }
    }, []);

    // ========================================================================
    // RENDER
    // ========================================================================

    return (
        <div
            className={`flex flex-col h-full bg-gray-50 relative ${className}`}
        >
            {/* Barra de herramientas superior */}
            <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                {algorithm.name}
                            </h2>
                            <div className="text-sm text-gray-500">
                                {algorithm.blocks.length} bloques •{' '}
                                {algorithm.connections.length} conexiones
                            </div>
                        </div>

                        {enableValidation && (
                            <div className="flex items-center space-x-2">
                                {validationState.isValid ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                )}
                                <span className="text-sm text-gray-600">
                                    Puntuación: {validationState.score}/100
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        {/* Controles de zoom */}
                        {enableZoom && (
                            <div className="flex items-center space-x-1 mr-4">
                                <button
                                    onClick={zoomOut}
                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                                    title="Alejar"
                                >
                                    <ZoomOut className="h-4 w-4" />
                                </button>
                                <span className="text-sm text-gray-600 min-w-[3rem] text-center">
                                    {Math.round(canvasScale * 100)}%
                                </span>
                                <button
                                    onClick={zoomIn}
                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                                    title="Acercar"
                                >
                                    <ZoomIn className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={resetZoom}
                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                                    title="Restablecer zoom"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                </button>
                            </div>
                        )}

                        {/* Botones de acción */}
                        {enableValidation && (
                            <button
                                onClick={() =>
                                    setShowValidation(!showValidation)
                                }
                                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                                    showValidation
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <Info className="h-4 w-4 mr-2 inline" />
                                Validación
                            </button>
                        )}

                        <button
                            onClick={executeAlgorithm}
                            disabled={
                                isExecuting ||
                                !validationState.isValid ||
                                readOnly
                            }
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center transition-colors"
                        >
                            <Play className="h-4 w-4 mr-2" />
                            {isExecuting ? 'Ejecutando...' : 'Ejecutar'}
                        </button>

                        {!readOnly && (
                            <>
                                <button
                                    onClick={saveAlgorithm}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center transition-colors"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    Guardar
                                </button>

                                <button
                                    onClick={clearCanvas}
                                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    title="Limpiar canvas"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 flex relative overflow-hidden">
                {/* Panel de bloques disponibles */}
                {!readOnly && (
                    <div className="w-72 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
                        <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-4">
                                Bloques Disponibles
                            </h3>
                            <div className="space-y-3">
                                {Object.values(BlockCategory).map(
                                    (category) => {
                                        const categoryBlocks =
                                            availableBlocks.filter(
                                                (block) =>
                                                    block.category === category
                                            );

                                        if (categoryBlocks.length === 0)
                                            return null;

                                        return (
                                            <div key={category}>
                                                <h4 className="text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                                                    {category.replace('_', ' ')}
                                                </h4>
                                                <div className="space-y-2">
                                                    {categoryBlocks.map(
                                                        (block) => (
                                                            <button
                                                                key={block.id}
                                                                onClick={() =>
                                                                    addBlock(
                                                                        block.type
                                                                    )
                                                                }
                                                                className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors group"
                                                            >
                                                                <div className="flex items-center space-x-3">
                                                                    <div
                                                                        className="w-4 h-4 rounded"
                                                                        style={{
                                                                            backgroundColor:
                                                                                block.color ||
                                                                                '#6B7280',
                                                                        }}
                                                                    />
                                                                    <div className="flex-1">
                                                                        <div className="font-medium text-sm text-gray-900 group-hover:text-gray-700">
                                                                            {
                                                                                block.name
                                                                            }
                                                                        </div>
                                                                        <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                                                                            {
                                                                                block.description
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <Plus className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                                                                </div>
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Canvas principal */}
                <div className="flex-1 relative bg-gray-50 overflow-hidden">
                    <div
                        ref={canvasRef}
                        className="absolute inset-0 cursor-move"
                        onClick={handleCanvasClick}
                        style={{
                            backgroundImage: showGrid
                                ? `radial-gradient(circle, #e5e7eb 1px, transparent 1px)`
                                : 'none',
                            backgroundSize: `${20 * canvasScale}px ${20 * canvasScale}px`,
                            backgroundPosition: `${canvasOffset.x}px ${canvasOffset.y}px`,
                            transform: `scale(${canvasScale}) translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
                            transformOrigin: 'top left',
                        }}
                    >
                        {/* Renderizar bloques */}
                        {algorithm.blocks.map((block) => (
                            <BlockComponent
                                key={block.id}
                                block={block}
                                isSelected={selectedBlock?.id === block.id}
                                onSelect={setSelectedBlock}
                                onPositionChange={updateBlockPosition}
                                onDelete={deleteBlock}
                                onEdit={handleBlockEdit}
                                readOnly={readOnly}
                                scale={1}
                            />
                        ))}

                        {/* Renderizar conexiones */}
                        <svg
                            className="absolute inset-0 pointer-events-none"
                            style={{ zIndex: 5 }}
                        >
                            <defs>
                                <marker
                                    id="arrowhead"
                                    markerWidth="10"
                                    markerHeight="7"
                                    refX="9"
                                    refY="3.5"
                                    orient="auto"
                                >
                                    <polygon
                                        points="0 0, 10 3.5, 0 7"
                                        fill="#3b82f6"
                                    />
                                </marker>
                            </defs>
                            {algorithm.connections.map((connection) => {
                                const sourceBlock = algorithm.blocks.find(
                                    (b) => b.id === connection.sourceId
                                );
                                const targetBlock = algorithm.blocks.find(
                                    (b) => b.id === connection.targetId
                                );

                                if (!sourceBlock || !targetBlock) return null;

                                const sourcePos = sourceBlock.position || {
                                    x: 0,
                                    y: 0,
                                };
                                const targetPos = targetBlock.position || {
                                    x: 0,
                                    y: 0,
                                };

                                return (
                                    <line
                                        key={connection.id}
                                        x1={sourcePos.x + 140}
                                        y1={sourcePos.y + 40}
                                        x2={targetPos.x}
                                        y2={targetPos.y + 40}
                                        stroke="#3b82f6"
                                        strokeWidth="2"
                                        markerEnd="url(#arrowhead)"
                                        className="transition-all duration-200"
                                    />
                                );
                            })}
                        </svg>

                        {/* Indicador de área vacía */}
                        {algorithm.blocks.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-center text-gray-400">
                                    <div className="text-4xl mb-4">🧩</div>
                                    <div className="text-lg font-medium">
                                        Canvas Vacío
                                    </div>
                                    <div className="text-sm">
                                        {readOnly
                                            ? 'No hay bloques para mostrar'
                                            : 'Arrastra bloques desde el panel lateral para comenzar'}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Panel de validación */}
                <AnimatePresence>
                    {showValidation && enableValidation && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 320, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="bg-white border-l border-gray-200 overflow-hidden flex-shrink-0"
                        >
                            <div className="p-4 h-full overflow-y-auto">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-900">
                                        Estado de Validación
                                    </h3>
                                    <button
                                        onClick={() => setShowValidation(false)}
                                        className="p-1 text-gray-400 hover:text-gray-600"
                                    >
                                        <EyeOff className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Estado general */}
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-2xl">
                                            {validationState.isValid
                                                ? '✅'
                                                : '❌'}
                                        </span>
                                        <span className="text-right">
                                            <div className="font-medium text-sm">
                                                {validationState.isValid
                                                    ? 'Algoritmo válido'
                                                    : 'Algoritmo contiene errores'}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                Puntuación:{' '}
                                                {validationState.score}/100
                                            </div>
                                        </span>
                                    </div>

                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-500 ${
                                                validationState.score >= 80
                                                    ? 'bg-green-500'
                                                    : validationState.score >=
                                                        60
                                                      ? 'bg-yellow-500'
                                                      : 'bg-red-500'
                                            }`}
                                            style={{
                                                width: `${validationState.score}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Errores */}
                                {validationState.errors.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="font-medium text-red-800 mb-2 flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-2" />
                                            Errores (
                                            {validationState.errors.length})
                                        </h4>
                                        <div className="space-y-2">
                                            {validationState.errors.map(
                                                (error, index) => (
                                                    <div
                                                        key={index}
                                                        className="p-2 bg-red-50 border border-red-200 rounded text-sm"
                                                    >
                                                        <div className="text-red-800 font-medium">
                                                            {error.severity && (
                                                                <span className="text-xs uppercase bg-red-200 px-1 rounded mr-2">
                                                                    {
                                                                        error.severity
                                                                    }
                                                                </span>
                                                            )}
                                                            {error.message}
                                                        </div>
                                                        {error.blockId && (
                                                            <div className="text-red-600 text-xs mt-1">
                                                                Bloque:{' '}
                                                                {error.blockId}
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Advertencias */}
                                {validationState.warnings.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-2" />
                                            Advertencias (
                                            {validationState.warnings.length})
                                        </h4>
                                        <div className="space-y-2">
                                            {validationState.warnings.map(
                                                (warning, index) => (
                                                    <div
                                                        key={index}
                                                        className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm"
                                                    >
                                                        <div className="text-yellow-800">
                                                            {warning.message}
                                                        </div>
                                                        {warning.blockId && (
                                                            <div className="text-yellow-600 text-xs mt-1">
                                                                Bloque:{' '}
                                                                {
                                                                    warning.blockId
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Sugerencias */}
                                {validationState.suggestions.length > 0 && (
                                    <div>
                                        <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                                            <Info className="h-4 w-4 mr-2" />
                                            Sugerencias (
                                            {validationState.suggestions.length}
                                            )
                                        </h4>
                                        <div className="space-y-2">
                                            {validationState.suggestions.map(
                                                (suggestion, index) => (
                                                    <div
                                                        key={index}
                                                        className="p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800"
                                                    >
                                                        {suggestion}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Estado limpio */}
                                {validationState.errors.length === 0 &&
                                    validationState.warnings.length === 0 &&
                                    validationState.suggestions.length ===
                                        0 && (
                                        <div className="text-center text-gray-500 py-8">
                                            <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                                            <div className="font-medium">
                                                Todo en orden
                                            </div>
                                            <div className="text-sm">
                                                Tu algoritmo está bien
                                                estructurado
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Panel de propiedades */}
                <AnimatePresence>
                    {showPropertyPanel && editingBlock && (
                        <PropertyPanel
                            block={editingBlock}
                            onBlockUpdate={updateBlock}
                            onClose={() => {
                                setShowPropertyPanel(false);
                                setEditingBlock(null);
                            }}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Información de estado en la esquina */}
            <div className="absolute bottom-4 left-4 text-xs text-gray-500 bg-white/80 backdrop-blur-sm px-2 py-1 rounded">
                {algorithm.blocks.length} bloques •{' '}
                {algorithm.connections.length} conexiones
                {enableZoom && ` • ${Math.round(canvasScale * 100)}% zoom`}
            </div>
        </div>
    );
};

export default AlgorithmBuilder;
