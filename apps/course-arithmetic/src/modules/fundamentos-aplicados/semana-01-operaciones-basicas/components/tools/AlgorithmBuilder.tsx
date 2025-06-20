// ============================================================================
// CONSTRUCTOR DE ALGORITMOS - CORREGIDO
// ============================================================================

import {
    AlgorithmBlock,
    AlgorithmBlockType,
    BlockCategory,
    BlockConnection,
    ConstructedAlgorithm,
    ValidationResult,
} from '../types/algorithms';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useAlgorithmBuilder } from '../hooks/useAlgorithmBuilder';

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
 * Componente de bloque individual
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
    readOnly?: boolean;
}

const BlockComponent: React.FC<BlockComponentProps> = ({
    block,
    isSelected,
    onSelect,
    onPositionChange,
    onDelete,
    readOnly = false,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const blockRef = useRef<HTMLDivElement>(null);

    // Colores por categoría
    const getCategoryColor = (category: BlockCategory): string => {
        switch (category) {
            case BlockCategory.INPUT_OUTPUT:
                return 'from-blue-400 to-blue-600';
            case BlockCategory.ANALYSIS:
                return 'from-green-400 to-green-600';
            case BlockCategory.PROCESSING:
                return 'from-purple-400 to-purple-600';
            case BlockCategory.MATH_OPERATIONS:
                return 'from-orange-400 to-orange-600';
            case BlockCategory.CONTROL_FLOW:
                return 'from-red-400 to-red-600';
            case BlockCategory.UTILITIES:
                return 'from-gray-400 to-gray-600';
            default:
                return 'from-gray-400 to-gray-600';
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (readOnly) return;

        setIsDragging(true);
        setDragStart({
            x: e.clientX - block.position.x,
            y: e.clientY - block.position.y,
        });
        onSelect(block);
    };

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (isDragging && !readOnly) {
                const newPosition = {
                    x: e.clientX - dragStart.x,
                    y: e.clientY - dragStart.y,
                };
                onPositionChange(block.id, newPosition);
            }
        },
        [isDragging, dragStart, block.id, onPositionChange, readOnly]
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    return (
        <motion.div
            ref={blockRef}
            className={`
        absolute cursor-pointer select-none
        ${isDragging ? 'z-50' : 'z-10'}
      `}
            style={{
                left: block.position.x,
                top: block.position.y,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileDrag={{ scale: 1.1 }}
        >
            <div
                className={`
          relative bg-gradient-to-br ${getCategoryColor(block.category)}
          rounded-lg shadow-lg border-2 transition-all duration-200 min-w-48 max-w-64
          ${
              isSelected
                  ? 'border-yellow-400 shadow-xl'
                  : 'border-white border-opacity-50 hover:border-opacity-100'
          }
          ${isDragging ? 'shadow-2xl' : ''}
        `}
                onMouseDown={handleMouseDown}
            >
                {/* Header del bloque */}
                <div className="p-3 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                            <span className="text-lg">{block.icon}</span>
                            <h4 className="font-medium text-sm">
                                {block.name}
                            </h4>
                        </div>

                        {/* Botón de eliminar */}
                        {!readOnly && (
                            <button
                                className="text-white opacity-60 hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(block.id);
                                }}
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>

                    <p className="text-xs opacity-90 line-clamp-2">
                        {block.description}
                    </p>
                </div>

                {/* Puertos de entrada */}
                {block.inputs.length > 0 && (
                    <div className="px-3 pb-2">
                        {block.inputs.map((input, index) => (
                            <div
                                key={input.id}
                                className="flex items-center space-x-2 mb-1"
                            >
                                <div className="w-2 h-2 bg-white rounded-full opacity-60" />
                                <span className="text-xs text-white opacity-80">
                                    {input.name}
                                </span>
                                {input.required && (
                                    <span className="text-xs text-yellow-200">
                                        *
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Puertos de salida */}
                {block.outputs.length > 0 && (
                    <div className="px-3 pb-3">
                        {block.outputs.map((output, index) => (
                            <div
                                key={output.id}
                                className="flex items-center justify-end space-x-2 mb-1"
                            >
                                <span className="text-xs text-white opacity-80">
                                    {output.name}
                                </span>
                                <div className="w-2 h-2 bg-white rounded-full opacity-60" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Indicador de selección */}
                {isSelected && (
                    <div className="absolute -inset-1 bg-yellow-400 rounded-lg opacity-30 animate-pulse" />
                )}

                {/* Indicador de categoría */}
                <div className="absolute top-1 right-1">
                    <div className="w-3 h-3 bg-white bg-opacity-30 rounded-full" />
                </div>
            </div>
        </motion.div>
    );
};

/**
 * Componente principal del constructor
 */
const AlgorithmBuilder: React.FC<AlgorithmBuilderProps> = ({
    availableBlocks,
    onAlgorithmChange,
    onExecute,
    onSave,
    initialAlgorithm,
    readOnly = false,
    className = '',
}) => {
    const [selectedCategory, setSelectedCategory] = useState<
        BlockCategory | 'all'
    >('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showValidation, setShowValidation] = useState(false);

    const canvasRef = useRef<HTMLDivElement>(null);

    // Hook del constructor de algoritmos
    const {
        state,
        addBlock,
        removeBlock,
        updateBlockPosition,
        validateAlgorithm,
        executeAlgorithm,
        selectBlock,
        selectedBlock,
        undo,
        redo,
        canUndo,
        canRedo,
    } = useAlgorithmBuilder(availableBlocks, {
        maxBlocks: 20,
        allowCustomBlocks: false,
        enableValidation: true,
        autoSave: false,
        saveInterval: 5000,
    });

    // Notificar cambios del algoritmo
    useEffect(() => {
        onAlgorithmChange(state.currentAlgorithm);
    }, [state.currentAlgorithm, onAlgorithmChange]);

    // Filtrar bloques disponibles
    const filteredBlocks = availableBlocks.filter((block) => {
        const matchesCategory =
            selectedCategory === 'all' || block.category === selectedCategory;
        const matchesSearch =
            searchTerm === '' ||
            block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            block.description.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    /**
     * Manejar drop de bloque en el canvas
     */
    const handleCanvasDrop = (e: React.DragEvent) => {
        e.preventDefault();

        const blockData = e.dataTransfer.getData('application/json');
        if (blockData && canvasRef.current) {
            const block = JSON.parse(blockData) as AlgorithmBlock;
            const rect = canvasRef.current.getBoundingClientRect();
            const position = {
                x: e.clientX - rect.left - 100, // Centrar el bloque
                y: e.clientY - rect.top - 50,
            };

            addBlock(block.type, position);
        }
    };

    /**
     * Ejecutar algoritmo
     */
    const handleExecute = async () => {
        if (state.isExecuting) return;

        try {
            const result = await executeAlgorithm({ test: 'data' });
            console.log('Execution result:', result);
        } catch (error) {
            console.error('Execution failed:', error);
        }
    };

    /**
     * Validar algoritmo
     */
    const handleValidate = () => {
        const validation = validateAlgorithm();
        setShowValidation(true);
        console.log('Validation result:', validation);
    };

    /**
     * Guardar algoritmo
     */
    const handleSave = () => {
        onSave(state.currentAlgorithm);
    };

    return (
        <div className={`flex h-full bg-gray-50 ${className}`}>
            {/* Panel de bloques disponibles */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                {/* Header del panel */}
                <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Bloques Disponibles
                    </h3>

                    {/* Búsqueda */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Buscar bloques..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Filtro por categoría */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Categoría:
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(
                                    e.target.value as BlockCategory | 'all'
                                )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Todas las categorías</option>
                            {Object.values(BlockCategory).map((category) => (
                                <option key={category} value={category}>
                                    {category.replace('_', ' ').toLowerCase()}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Lista de bloques */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {filteredBlocks.map((block) => (
                        <motion.div
                            key={block.id}
                            className="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-grab hover:bg-gray-100 transition-colors"
                            draggable={!readOnly}
                            onDragStart={(e) => {
                                e.dataTransfer.setData(
                                    'application/json',
                                    JSON.stringify(block)
                                );
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-start space-x-3">
                                <span className="text-2xl">{block.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-gray-900 text-sm">
                                        {block.name}
                                    </h4>
                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                        {block.description}
                                    </p>
                                    <div className="mt-2 flex items-center space-x-2">
                                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                            {block.category
                                                .replace('_', ' ')
                                                .toLowerCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Canvas principal */}
            <div className="flex-1 flex flex-col">
                {/* Barra de herramientas */}
                <div className="bg-white border-b border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Constructor de Algoritmos
                            </h2>

                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <span>
                                    Bloques:{' '}
                                    {state.currentAlgorithm.blocks.length}
                                </span>
                                <span>•</span>
                                <span>
                                    Conexiones:{' '}
                                    {state.currentAlgorithm.connections.length}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            {/* Controles de deshacer/rehacer */}
                            <button
                                onClick={undo}
                                disabled={!canUndo || readOnly}
                                className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                    />
                                </svg>
                            </button>

                            <button
                                onClick={redo}
                                disabled={!canRedo || readOnly}
                                className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6-6m6 6l-6 6"
                                    />
                                </svg>
                            </button>

                            {/* Divider */}
                            <div className="w-px h-6 bg-gray-300" />

                            {/* Botón de validar */}
                            <button
                                onClick={handleValidate}
                                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            >
                                Validar
                            </button>

                            {/* Botón de ejecutar */}
                            <button
                                onClick={handleExecute}
                                disabled={
                                    state.isExecuting ||
                                    !state.validationState.isValid
                                }
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {state.isExecuting
                                    ? 'Ejecutando...'
                                    : 'Ejecutar'}
                            </button>

                            {/* Botón de guardar */}
                            {!readOnly && (
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Guardar
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Canvas de construcción */}
                <div
                    ref={canvasRef}
                    className="flex-1 relative bg-gray-100 overflow-hidden"
                    onDrop={handleCanvasDrop}
                    onDragOver={(e) => e.preventDefault()}
                >
                    {/* Grid de fondo */}
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `
                linear-gradient(#000 1px, transparent 1px),
                linear-gradient(90deg, #000 1px, transparent 1px)
              `,
                            backgroundSize: '20px 20px',
                        }}
                    />

                    {/* Bloques del algoritmo */}
                    <AnimatePresence>
                        {state.currentAlgorithm.blocks.map((block) => (
                            <BlockComponent
                                key={block.id}
                                block={block}
                                isSelected={selectedBlock?.id === block.id}
                                onSelect={selectBlock}
                                onPositionChange={updateBlockPosition}
                                onDelete={removeBlock}
                                readOnly={readOnly}
                            />
                        ))}
                    </AnimatePresence>

                    {/* Instrucciones cuando está vacío */}
                    {state.currentAlgorithm.blocks.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center text-gray-500">
                                <svg
                                    className="w-16 h-16 mx-auto mb-4 opacity-50"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                                    />
                                </svg>
                                <p className="text-lg mb-2">
                                    Construye tu algoritmo
                                </p>
                                <p className="text-sm">
                                    Arrastra bloques desde el panel lateral
                                    hacia aquí
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Panel de validación */}
                <AnimatePresence>
                    {showValidation && (
                        <motion.div
                            className="bg-white border-t border-gray-200 p-4"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Validación del Algoritmo
                                </h3>
                                <button
                                    onClick={() => setShowValidation(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-3">
                                {/* Estado general */}
                                <div
                                    className={`p-3 rounded-md ${
                                        state.validationState.isValid
                                            ? 'bg-green-50 text-green-800'
                                            : 'bg-red-50 text-red-800'
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <span className="mr-2">
                                            {state.validationState.isValid
                                                ? '✅'
                                                : '❌'}
                                        </span>
                                        <span className="font-medium">
                                            {state.validationState.isValid
                                                ? 'Algoritmo válido'
                                                : 'Algoritmo contiene errores'}
                                        </span>
                                        <span className="ml-auto">
                                            Puntuación:{' '}
                                            {state.validationState.score}/100
                                        </span>
                                    </div>
                                </div>

                                {/* Errores */}
                                {state.validationState.errors.length > 0 && (
                                    <div>
                                        <h4 className="font-medium text-red-800 mb-2">
                                            Errores:
                                        </h4>
                                        <ul className="space-y-1">
                                            {state.validationState.errors.map(
                                                (error, index) => (
                                                    <li
                                                        key={index}
                                                        className="text-sm text-red-600"
                                                    >
                                                        • {error.message}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}

                                {/* Advertencias */}
                                {state.validationState.warnings.length > 0 && (
                                    <div>
                                        <h4 className="font-medium text-yellow-800 mb-2">
                                            Advertencias:
                                        </h4>
                                        <ul className="space-y-1">
                                            {state.validationState.warnings.map(
                                                (warning, index) => (
                                                    <li
                                                        key={index}
                                                        className="text-sm text-yellow-600"
                                                    >
                                                        • {warning.message}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}

                                {/* Sugerencias */}
                                {state.validationState.suggestions.length >
                                    0 && (
                                    <div>
                                        <h4 className="font-medium text-blue-800 mb-2">
                                            Sugerencias:
                                        </h4>
                                        <ul className="space-y-1">
                                            {state.validationState.suggestions.map(
                                                (suggestion, index) => (
                                                    <li
                                                        key={index}
                                                        className="text-sm text-blue-600"
                                                    >
                                                        • {suggestion}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AlgorithmBuilder;
