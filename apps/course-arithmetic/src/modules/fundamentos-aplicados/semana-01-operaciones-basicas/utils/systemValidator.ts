// ============================================================================
// VALIDADOR DE SISTEMAS RELACIONALES - IMPLEMENTACIÓN COMPLETA CORREGIDA
// ============================================================================

import {
    FamilyDataset,
    FamilyMember,
    Relationship,
} from '../types/relationships';
import {
    OptimizationConstraint,
    OptimizationProblem,
    OptimizationVariable,
    SystemConstraint,
    SystemDefinition,
    SystemEntity,
    SystemObjective,
    SystemRelationship,
} from '../types/systems';

// ============================================================================
// INTERFACES Y TIPOS
// ============================================================================

/**
 * Resultado de validación
 */
interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
    suggestions: string[];
    score: number; // 0-100
}

/**
 * Error de validación
 */
interface ValidationError {
    id: string;
    type: ValidationErrorType;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    field?: string;
    entityId?: string;
    relationshipId?: string;
    suggestion?: string;
}

/**
 * Advertencia de validación
 */
interface ValidationWarning extends Omit<ValidationError, 'id'> {
    id: string;
}

/**
 * Tipos de errores de validación
 */
enum ValidationErrorType {
    MISSING_REQUIRED_FIELD = 'missing_required_field',
    INVALID_DATA_TYPE = 'invalid_data_type',
    CONSTRAINT_VIOLATION = 'constraint_violation',
    CIRCULAR_DEPENDENCY = 'circular_dependency',
    ORPHANED_ENTITY = 'orphaned_entity',
    INVALID_RELATIONSHIP = 'invalid_relationship',
    INCONSISTENT_DATA = 'inconsistent_data',
    PERFORMANCE_ISSUE = 'performance_issue',
    LOGICAL_ERROR = 'logical_error',
}

/**
 * Configuración del validador
 */
interface ValidatorConfig {
    strictMode: boolean;
    enablePerformanceChecks: boolean;
    enableLogicalChecks: boolean;
    maxEntities: number;
    maxRelationships: number;
    enableSuggestions: boolean;
}

/**
 * Contexto de validación
 */
interface ValidationContext {
    systemType: string;
    validationLevel: 'basic' | 'standard' | 'strict';
    customRules: ValidationRule[];
}

/**
 * Regla de validación personalizada
 */
interface ValidationRule {
    id: string;
    name: string;
    description: string;
    validator: (system: SystemDefinition) => ValidationError[];
    enabled: boolean;
    priority: number;
}

/**
 * Estadísticas de validación
 */
interface ValidationStats {
    totalEntities: number;
    totalRelationships: number;
    totalConstraints: number;
    validationTime: number;
    criticalErrors: number;
    highErrors: number;
    mediumErrors: number;
    lowErrors: number;
    warnings: number;
}

// ============================================================================
// CLASE PRINCIPAL - SYSTEM VALIDATOR
// ============================================================================

/**
 * Validador de sistemas principal
 */
class SystemValidator {
    private config: ValidatorConfig;
    private customRules: ValidationRule[];
    private validationHistory: ValidationResult[] = [];

    constructor(config: Partial<ValidatorConfig> = {}) {
        this.config = {
            strictMode: false,
            enablePerformanceChecks: true,
            enableLogicalChecks: true,
            maxEntities: 1000,
            maxRelationships: 5000,
            enableSuggestions: true,
            ...config,
        };

        this.customRules = [];
    }

    // ========================================================================
    // MÉTODOS PRINCIPALES DE VALIDACIÓN
    // ========================================================================

    /**
     * Validar sistema completo
     */
    validateSystem(
        system: SystemDefinition,
        context?: ValidationContext
    ): ValidationResult {
        const startTime = Date.now();
        const errors: ValidationError[] = [];
        const warnings: ValidationWarning[] = [];

        try {
            // Validaciones estructurales básicas
            errors.push(...this.validateSystemStructure(system));

            // Validar entidades
            errors.push(...this.validateEntities(system.entities));

            // Validar relaciones
            errors.push(...this.validateRelationships(system.relationships));

            // Validar objetivos
            errors.push(...this.validateObjectives(system.objectives));

            // Validar restricciones
            errors.push(...this.validateConstraints(system.constraints));

            // Validaciones de integridad referencial
            errors.push(...this.validateReferentialIntegrity(system));

            // Validaciones lógicas
            if (this.config.enableLogicalChecks) {
                errors.push(...this.validateLogicalConsistency(system));
            }

            // Validaciones de rendimiento
            if (this.config.enablePerformanceChecks) {
                errors.push(...this.checkPerformanceIssues(system));
            }

            // Aplicar reglas personalizadas
            errors.push(...this.applyCustomRules(system));

            // Generar advertencias
            warnings.push(...this.generateWarnings(system, errors));

            // Calcular puntuación
            const score = this.calculateValidationScore(errors, warnings);

            // Generar sugerencias
            const suggestions = this.config.enableSuggestions
                ? this.generateSystemSuggestions(errors, system)
                : [];

            const result: ValidationResult = {
                isValid: this.isSystemValid(errors),
                errors,
                warnings,
                suggestions,
                score,
            };

            // Registrar en historial
            this.validationHistory.push({
                ...result,
                // Agregar metadata de tiempo
                score: score + (Date.now() - startTime) / 1000, // Incluir tiempo como factor
            });

            // Limpiar historial si es muy grande
            if (this.validationHistory.length > 100) {
                this.validationHistory = this.validationHistory.slice(-50);
            }

            return result;
        } catch (error) {
            console.error('Error durante la validación del sistema:', error);

            return {
                isValid: false,
                errors: [
                    {
                        id: `error_${Date.now()}`,
                        type: ValidationErrorType.LOGICAL_ERROR,
                        severity: 'critical',
                        message: `Error interno del validador: ${error instanceof Error ? error.message : 'Error desconocido'}`,
                        suggestion: 'Contactar soporte técnico',
                    },
                ],
                warnings: [],
                suggestions: [
                    'Revisar la estructura del sistema y intentar nuevamente',
                ],
                score: 0,
            };
        }
    }

    /**
     * Validar dataset de familias
     */
    validateFamilyDataset(family: FamilyDataset): ValidationResult {
        const errors: ValidationError[] = [];
        const warnings: ValidationWarning[] = [];

        // Validaciones básicas del dataset
        if (!family.id || family.id.trim() === '') {
            errors.push(
                this.createError(
                    ValidationErrorType.MISSING_REQUIRED_FIELD,
                    'critical',
                    'El dataset de familia debe tener un ID válido',
                    'id'
                )
            );
        }

        if (!family.name || family.name.trim() === '') {
            errors.push(
                this.createError(
                    ValidationErrorType.MISSING_REQUIRED_FIELD,
                    'high',
                    'El dataset de familia debe tener un nombre',
                    'name'
                )
            );
        }

        if (!family.members || family.members.length === 0) {
            errors.push(
                this.createError(
                    ValidationErrorType.MISSING_REQUIRED_FIELD,
                    'high',
                    'El dataset debe contener al menos un miembro',
                    'members'
                )
            );
        }

        // Validar miembros individuales
        if (family.members) {
            errors.push(...this.validateFamilyMembers(family.members));
        }

        // Validar relaciones familiares
        if (family.relationships) {
            errors.push(
                ...this.validateFamilyRelationships(
                    family.relationships,
                    family.members
                )
            );
        }

        // Validaciones específicas de familia
        errors.push(...this.validateFamilySpecificRules(family));

        // Validaciones de fechas
        errors.push(...this.validateFamilyDates(family));

        const score = this.calculateValidationScore(errors, warnings);

        return {
            isValid:
                errors.filter(
                    (e) => e.severity === 'critical' || e.severity === 'high'
                ).length === 0,
            errors,
            warnings,
            suggestions: this.generateFamilySuggestions(errors, family),
            score,
        };
    }

    /**
     * Validar problema de optimización
     */
    validateOptimizationProblem(
        problem: OptimizationProblem
    ): ValidationResult {
        const errors: ValidationError[] = [];
        const warnings: ValidationWarning[] = [];

        // Validar estructura básica
        if (!problem.id || problem.id.trim() === '') {
            errors.push(
                this.createError(
                    ValidationErrorType.MISSING_REQUIRED_FIELD,
                    'critical',
                    'El problema de optimización debe tener un ID válido',
                    'id'
                )
            );
        }

        if (!problem.name || problem.name.trim() === '') {
            errors.push(
                this.createError(
                    ValidationErrorType.MISSING_REQUIRED_FIELD,
                    'high',
                    'El problema debe tener un nombre descriptivo',
                    'name'
                )
            );
        }

        // Validar variables
        errors.push(...this.validateOptimizationVariables(problem.variables));

        // Validar objetivos
        errors.push(...this.validateOptimizationObjectives(problem.objectives));

        // Validar restricciones
        errors.push(
            ...this.validateOptimizationConstraints(problem.constraints)
        );

        // Validar configuración
        if (problem.config) {
            errors.push(...this.validateOptimizationConfig(problem.config));
        }

        // Validaciones de consistencia matemática
        errors.push(...this.validateMathematicalConsistency(problem));

        const score = this.calculateValidationScore(errors, warnings);

        return {
            isValid:
                errors.filter(
                    (e) => e.severity === 'critical' || e.severity === 'high'
                ).length === 0,
            errors,
            warnings,
            suggestions: this.generateOptimizationSuggestions(errors, problem),
            score,
        };
    }

    // ========================================================================
    // VALIDACIONES ESTRUCTURALES
    // ========================================================================

    /**
     * Validar estructura básica del sistema
     */
    private validateSystemStructure(
        system: SystemDefinition
    ): ValidationError[] {
        const errors: ValidationError[] = [];

        if (!system.id || system.id.trim() === '') {
            errors.push(
                this.createError(
                    ValidationErrorType.MISSING_REQUIRED_FIELD,
                    'critical',
                    'El sistema debe tener un ID único',
                    'id'
                )
            );
        }

        if (!system.name || system.name.trim() === '') {
            errors.push(
                this.createError(
                    ValidationErrorType.MISSING_REQUIRED_FIELD,
                    'high',
                    'El sistema debe tener un nombre descriptivo',
                    'name'
                )
            );
        }

        if (!system.entities) {
            errors.push(
                this.createError(
                    ValidationErrorType.MISSING_REQUIRED_FIELD,
                    'critical',
                    'El sistema debe definir entidades',
                    'entities'
                )
            );
        }

        if (!system.relationships) {
            errors.push(
                this.createError(
                    ValidationErrorType.MISSING_REQUIRED_FIELD,
                    'medium',
                    'El sistema debe definir relaciones',
                    'relationships'
                )
            );
        }

        // Verificar límites de configuración
        if (
            system.entities &&
            system.entities.length > this.config.maxEntities
        ) {
            errors.push(
                this.createError(
                    ValidationErrorType.PERFORMANCE_ISSUE,
                    'high',
                    `Número de entidades (${system.entities.length}) excede el límite configurado (${this.config.maxEntities})`,
                    'entities'
                )
            );
        }

        if (
            system.relationships &&
            system.relationships.length > this.config.maxRelationships
        ) {
            errors.push(
                this.createError(
                    ValidationErrorType.PERFORMANCE_ISSUE,
                    'high',
                    `Número de relaciones (${system.relationships.length}) excede el límite configurado (${this.config.maxRelationships})`,
                    'relationships'
                )
            );
        }

        return errors;
    }

    /**
     * Validar entidades del sistema
     */
    private validateEntities(entities: SystemEntity[]): ValidationError[] {
        const errors: ValidationError[] = [];
        const entityIds = new Set<string>();

        entities.forEach((entity, index) => {
            // Verificar ID único
            if (!entity.id || entity.id.trim() === '') {
                errors.push(
                    this.createError(
                        ValidationErrorType.MISSING_REQUIRED_FIELD,
                        'high',
                        `Entidad en posición ${index} debe tener un ID`,
                        'id',
                        undefined,
                        entity.id
                    )
                );
            } else if (entityIds.has(entity.id)) {
                errors.push(
                    this.createError(
                        ValidationErrorType.CONSTRAINT_VIOLATION,
                        'critical',
                        `ID de entidad duplicado: ${entity.id}`,
                        'id',
                        'Usar IDs únicos para cada entidad',
                        entity.id
                    )
                );
            } else {
                entityIds.add(entity.id);
            }

            // Verificar nombre
            if (!entity.name || entity.name.trim() === '') {
                errors.push(
                    this.createError(
                        ValidationErrorType.MISSING_REQUIRED_FIELD,
                        'medium',
                        `Entidad ${entity.id} debe tener un nombre`,
                        'name',
                        undefined,
                        entity.id
                    )
                );
            }

            // Verificar tipo
            if (!entity.type || entity.type.trim() === '') {
                errors.push(
                    this.createError(
                        ValidationErrorType.MISSING_REQUIRED_FIELD,
                        'medium',
                        `Entidad ${entity.id} debe tener un tipo definido`,
                        'type',
                        undefined,
                        entity.id
                    )
                );
            }

            // Validar propiedades
            if (entity.properties) {
                errors.push(...this.validateEntityProperties(entity));
            }
        });

        return errors;
    }

    /**
     * Validar relaciones del sistema
     */
    private validateRelationships(
        relationships: SystemRelationship[]
    ): ValidationError[] {
        const errors: ValidationError[] = [];
        const relationshipIds = new Set<string>();

        relationships.forEach((relationship, index) => {
            // Verificar ID único
            if (!relationship.id || relationship.id.trim() === '') {
                errors.push(
                    this.createError(
                        ValidationErrorType.MISSING_REQUIRED_FIELD,
                        'medium',
                        `Relación en posición ${index} debe tener un ID`,
                        'id',
                        undefined,
                        relationship.id
                    )
                );
            } else if (relationshipIds.has(relationship.id)) {
                errors.push(
                    this.createError(
                        ValidationErrorType.CONSTRAINT_VIOLATION,
                        'high',
                        `ID de relación duplicado: ${relationship.id}`,
                        'id',
                        undefined,
                        relationship.id
                    )
                );
            } else {
                relationshipIds.add(relationship.id);
            }

            // Verificar entidades origen y destino
            if (!relationship.sourceId || relationship.sourceId.trim() === '') {
                errors.push(
                    this.createError(
                        ValidationErrorType.MISSING_REQUIRED_FIELD,
                        'high',
                        `Relación ${relationship.id} debe tener una entidad origen`,
                        'sourceId',
                        undefined,
                        relationship.id
                    )
                );
            }

            if (!relationship.targetId || relationship.targetId.trim() === '') {
                errors.push(
                    this.createError(
                        ValidationErrorType.MISSING_REQUIRED_FIELD,
                        'high',
                        `Relación ${relationship.id} debe tener una entidad destino`,
                        'targetId',
                        undefined,
                        relationship.id
                    )
                );
            }

            // Verificar auto-referencia en relaciones direccionales
            if (
                relationship.sourceId === relationship.targetId &&
                relationship.isDirectional
            ) {
                errors.push(
                    this.createError(
                        ValidationErrorType.LOGICAL_ERROR,
                        'medium',
                        `Relación auto-referencial ${relationship.id} debería ser no direccional`,
                        'isDirectional',
                        'Considerar cambiar a relación bidireccional',
                        relationship.id
                    )
                );
            }

            // Verificar fuerza de relación
            if (
                relationship.strength !== undefined &&
                (relationship.strength < 0 || relationship.strength > 1)
            ) {
                errors.push(
                    this.createError(
                        ValidationErrorType.CONSTRAINT_VIOLATION,
                        'low',
                        `La fuerza de relación debe estar entre 0 y 1`,
                        'strength',
                        'Usar valores entre 0.0 y 1.0',
                        relationship.id
                    )
                );
            }

            // Verificar tipo de relación
            if (!relationship.type || relationship.type.trim() === '') {
                errors.push(
                    this.createError(
                        ValidationErrorType.MISSING_REQUIRED_FIELD,
                        'medium',
                        `Relación ${relationship.id} debe tener un tipo definido`,
                        'type',
                        undefined,
                        relationship.id
                    )
                );
            }
        });

        return errors;
    }

    /**
     * Validar objetivos del sistema
     */
    private validateObjectives(
        objectives: SystemObjective[]
    ): ValidationError[] {
        const errors: ValidationError[] = [];

        objectives.forEach((objective, index) => {
            if (!objective.id || objective.id.trim() === '') {
                errors.push(
                    this.createError(
                        ValidationErrorType.MISSING_REQUIRED_FIELD,
                        'medium',
                        `Objetivo en posición ${index} debe tener un ID`,
                        'id'
                    )
                );
            }

            if (!objective.description || objective.description.trim() === '') {
                errors.push(
                    this.createError(
                        ValidationErrorType.MISSING_REQUIRED_FIELD,
                        'low',
                        `Objetivo ${objective.id} debe tener una descripción`,
                        'description'
                    )
                );
            }

            if (
                !objective.relatedEntities ||
                objective.relatedEntities.length === 0
            ) {
                errors.push(
                    this.createError(
                        ValidationErrorType.MISSING_REQUIRED_FIELD,
                        'low',
                        `Objetivo ${objective.id} debe referenciar al menos una entidad`,
                        'relatedEntities'
                    )
                );
            }

            if (
                objective.priority !== undefined &&
                (objective.priority < 0 || objective.priority > 10)
            ) {
                errors.push(
                    this.createError(
                        ValidationErrorType.CONSTRAINT_VIOLATION,
                        'low',
                        `La prioridad del objetivo debe estar entre 0 y 10`,
                        'priority'
                    )
                );
            }
        });

        return errors;
    }

    /**
     * Validar restricciones del sistema
     */
    private validateConstraints(
        constraints: SystemConstraint[]
    ): ValidationError[] {
        const errors: ValidationError[] = [];

        constraints.forEach((constraint) => {
            if (!constraint.id || constraint.id.trim() === '') {
                errors.push(
                    this.createError(
                        ValidationErrorType.MISSING_REQUIRED_FIELD,
                        'medium',
                        `Restricción debe tener un ID válido`,
                        'id'
                    )
                );
            }

            if (!constraint.formula || constraint.formula.trim() === '') {
                errors.push(
                    this.createError(
                        ValidationErrorType.MISSING_REQUIRED_FIELD,
                        'medium',
                        `Restricción ${constraint.id} debe tener una fórmula`,
                        'formula'
                    )
                );
            }

            if (!constraint.entities || constraint.entities.length === 0) {
                errors.push(
                    this.createError(
                        ValidationErrorType.MISSING_REQUIRED_FIELD,
                        'low',
                        `Restricción ${constraint.id} debe referenciar al menos una entidad`,
                        'entities'
                    )
                );
            }

            // Validar sintaxis básica de fórmula
            if (constraint.formula) {
                errors.push(...this.validateConstraintFormula(constraint));
            }
        });

        return errors;
    }

    // ========================================================================
    // VALIDACIONES ESPECÍFICAS
    // ========================================================================

    /**
     * Validar integridad referencial
     */
    private validateReferentialIntegrity(
        system: SystemDefinition
    ): ValidationError[] {
        const errors: ValidationError[] = [];
        const entityIds = new Set(system.entities.map((e) => e.id));

        // Verificar referencias en objetivos
        system.objectives.forEach((objective) => {
            objective.relatedEntities.forEach((entityId) => {
                if (!entityIds.has(entityId)) {
                    errors.push(
                        this.createError(
                            ValidationErrorType.ORPHANED_ENTITY,
                            'medium',
                            `Objetivo ${objective.id} referencia entidad inexistente: ${entityId}`,
                            'relatedEntities'
                        )
                    );
                }
            });
        });

        // Verificar referencias en relaciones
        system.relationships.forEach((relationship) => {
            if (!entityIds.has(relationship.sourceId)) {
                errors.push(
                    this.createError(
                        ValidationErrorType.ORPHANED_ENTITY,
                        'high',
                        `Relación ${relationship.id} referencia entidad origen inexistente: ${relationship.sourceId}`,
                        'sourceId',
                        undefined,
                        relationship.id
                    )
                );
            }

            if (!entityIds.has(relationship.targetId)) {
                errors.push(
                    this.createError(
                        ValidationErrorType.ORPHANED_ENTITY,
                        'high',
                        `Relación ${relationship.id} referencia entidad destino inexistente: ${relationship.targetId}`,
                        'targetId',
                        undefined,
                        relationship.id
                    )
                );
            }
        });

        // Verificar referencias en restricciones
        system.constraints.forEach((constraint) => {
            constraint.entities.forEach((entityId) => {
                if (!entityIds.has(entityId)) {
                    errors.push(
                        this.createError(
                            ValidationErrorType.ORPHANED_ENTITY,
                            'medium',
                            `Restricción ${constraint.id} referencia entidad inexistente: ${entityId}`,
                            'entities'
                        )
                    );
                }
            });
        });

        return errors;
    }

    /**
     * Validar consistencia lógica
     */
    private validateLogicalConsistency(
        system: SystemDefinition
    ): ValidationError[] {
        const errors: ValidationError[] = [];

        // Detectar dependencias circulares
        const circularDeps = this.detectCircularDependencies(
            system.relationships
        );
        if (circularDeps.length > 0) {
            errors.push(
                this.createError(
                    ValidationErrorType.CIRCULAR_DEPENDENCY,
                    'high',
                    `Dependencias circulares detectadas: ${circularDeps.join(', ')}`,
                    'relationships'
                )
            );
        }

        // Verificar consistencia de tipos de relación
        errors.push(
            ...this.validateRelationshipTypeConsistency(system.relationships)
        );

        // Verificar entidades aisladas
        const isolatedEntities = this.findIsolatedEntities(system);
        if (isolatedEntities.length > 0) {
            isolatedEntities.forEach((entityId) => {
                errors.push(
                    this.createError(
                        ValidationErrorType.LOGICAL_ERROR,
                        'low',
                        `Entidad aislada detectada: ${entityId}`,
                        'relationships',
                        'Considerar agregar relaciones o eliminar la entidad',
                        entityId
                    )
                );
            });
        }

        return errors;
    }

    /**
     * Verificar problemas de rendimiento
     */
    private checkPerformanceIssues(
        system: SystemDefinition
    ): ValidationError[] {
        const errors: ValidationError[] = [];

        // Verificar entidades con demasiadas relaciones
        const entityRelationCount = new Map<string, number>();

        system.relationships.forEach((rel) => {
            entityRelationCount.set(
                rel.sourceId,
                (entityRelationCount.get(rel.sourceId) || 0) + 1
            );
            entityRelationCount.set(
                rel.targetId,
                (entityRelationCount.get(rel.targetId) || 0) + 1
            );
        });

        entityRelationCount.forEach((count, entityId) => {
            if (count > 100) {
                // Umbral configurable
                errors.push(
                    this.createError(
                        ValidationErrorType.PERFORMANCE_ISSUE,
                        'medium',
                        `Entidad ${entityId} tiene demasiadas relaciones (${count}), puede afectar el rendimiento`,
                        'relationships',
                        'Considerar dividir la entidad o optimizar las relaciones',
                        entityId
                    )
                );
            }
        });

        // Verificar complejidad del grafo
        const graphComplexity = this.calculateGraphComplexity(system);
        if (graphComplexity > 0.8) {
            // Umbral de complejidad
            errors.push(
                this.createError(
                    ValidationErrorType.PERFORMANCE_ISSUE,
                    'low',
                    `Alta complejidad del grafo detectada (${Math.round(graphComplexity * 100)}%)`,
                    'system',
                    'Simplificar la estructura del sistema'
                )
            );
        }

        return errors;
    }

    // ========================================================================
    // VALIDACIONES DE FAMILIA
    // ========================================================================

    /**
     * Validar miembros de familia
     */
    private validateFamilyMembers(members: FamilyMember[]): ValidationError[] {
        const errors: ValidationError[] = [];
        const memberIds = new Set<string>();

        members.forEach((member, index) => {
            // ID único
            if (!member.id || member.id.trim() === '') {
                errors.push(
                    this.createError(
                        ValidationErrorType.MISSING_REQUIRED_FIELD,
                        'high',
                        `Miembro en posición ${index} debe tener un ID`,
                        'id'
                    )
                );
            } else if (memberIds.has(member.id)) {
                errors.push(
                    this.createError(
                        ValidationErrorType.CONSTRAINT_VIOLATION,
                        'critical',
                        `ID de miembro duplicado: ${member.id}`,
                        'id'
                    )
                );
            } else {
                memberIds.add(member.id);
            }

            // Nombre
            if (!member.name || member.name.trim() === '') {
                errors.push(
                    this.createError(
                        ValidationErrorType.MISSING_REQUIRED_FIELD,
                        'medium',
                        `Miembro ${member.id} debe tener un nombre`,
                        'name'
                    )
                );
            }

            // Edad válida
            if (
                member.age !== undefined &&
                (member.age < 0 || member.age > 150)
            ) {
                errors.push(
                    this.createError(
                        ValidationErrorType.CONSTRAINT_VIOLATION,
                        'medium',
                        `Edad inválida para ${member.name}: ${member.age}`,
                        'age'
                    )
                );
            }

            // Género válido
            if (
                member.gender &&
                !['male', 'female', 'other', 'prefer_not_to_say'].includes(
                    member.gender
                )
            ) {
                errors.push(
                    this.createError(
                        ValidationErrorType.INVALID_DATA_TYPE,
                        'low',
                        `Género inválido para ${member.name}: ${member.gender}`,
                        'gender'
                    )
                );
            }
        });

        return errors;
    }

    /**
     * Validar relaciones familiares
     */
    private validateFamilyRelationships(
        relationships: Relationship[],
        members: FamilyMember[]
    ): ValidationError[] {
        const errors: ValidationError[] = [];
        const memberIds = new Set(members.map((m) => m.id));

        relationships.forEach((rel, index) => {
            // Verificar que los miembros existen
            if (!memberIds.has(rel.person1Id)) {
                errors.push(
                    this.createError(
                        ValidationErrorType.ORPHANED_ENTITY,
                        'high',
                        `Relación en posición ${index} referencia miembro inexistente: ${rel.person1Id}`,
                        'person1Id'
                    )
                );
            }

            if (!memberIds.has(rel.person2Id)) {
                errors.push(
                    this.createError(
                        ValidationErrorType.ORPHANED_ENTITY,
                        'high',
                        `Relación en posición ${index} referencia miembro inexistente: ${rel.person2Id}`,
                        'person2Id'
                    )
                );
            }

            // Verificar tipo de relación válido
            const validTypes = [
                'parent',
                'child',
                'sibling',
                'spouse',
                'grandparent',
                'grandchild',
                'cousin',
                'uncle',
                'aunt',
                'nephew',
                'niece',
            ];
            if (!validTypes.includes(rel.type)) {
                errors.push(
                    this.createError(
                        ValidationErrorType.INVALID_DATA_TYPE,
                        'medium',
                        `Tipo de relación inválido: ${rel.type}`,
                        'type'
                    )
                );
            }

            // Verificar auto-relación
            if (rel.person1Id === rel.person2Id) {
                errors.push(
                    this.createError(
                        ValidationErrorType.LOGICAL_ERROR,
                        'medium',
                        'Una persona no puede tener relación consigo misma',
                        'person1Id'
                    )
                );
            }
        });

        return errors;
    }

    /**
     * Validar reglas específicas de familia
     */
    private validateFamilySpecificRules(
        family: FamilyDataset
    ): ValidationError[] {
        const errors: ValidationError[] = [];

        // Verificar que no hay más de 2 padres por persona
        const parentCounts = new Map<string, number>();

        if (family.relationships) {
            family.relationships.forEach((rel) => {
                if (rel.type === 'parent') {
                    parentCounts.set(
                        rel.person2Id,
                        (parentCounts.get(rel.person2Id) || 0) + 1
                    );
                }
            });

            parentCounts.forEach((count, childId) => {
                if (count > 2) {
                    errors.push(
                        this.createError(
                            ValidationErrorType.LOGICAL_ERROR,
                            'medium',
                            `${childId} tiene más de 2 padres registrados`,
                            'relationships'
                        )
                    );
                }
            });
        }

        return errors;
    }

    /**
     * Validar fechas de familia
     */
    private validateFamilyDates(family: FamilyDataset): ValidationError[] {
        const errors: ValidationError[] = [];

        if (family.metadata?.createdAt) {
            const createdDate = new Date(family.metadata.createdAt);
            const now = new Date();

            if (createdDate > now) {
                errors.push(
                    this.createError(
                        ValidationErrorType.CONSTRAINT_VIOLATION,
                        'medium',
                        'La fecha de creación no puede estar en el futuro',
                        'createdAt'
                    )
                );
            }
        }

        if (family.metadata?.lastUpdated) {
            const lastUpdated = new Date(family.metadata.lastUpdated);
            const now = new Date();

            if (lastUpdated > now) {
                errors.push(
                    this.createError(
                        ValidationErrorType.CONSTRAINT_VIOLATION,
                        'medium',
                        'La fecha de última actualización no puede estar en el futuro',
                        'lastUpdated'
                    )
                );
            }
        }

        return errors;
    }

    // ========================================================================
    // VALIDACIONES DE OPTIMIZACIÓN
    // ========================================================================

    /**
     * Validar variables de optimización
     */
    private validateOptimizationVariables(
        variables: OptimizationVariable[]
    ): ValidationError[] {
        const errors: ValidationError[] = [];
        const variableNames = new Set<string>();

        variables.forEach((variable, index) => {
            // Nombre único y válido
            if (!variable.name || variable.name.trim() === '') {
                errors.push(
                    this.createError(
                        ValidationErrorType.MISSING_REQUIRED_FIELD,
                        'high',
                        `Variable en posición ${index} debe tener un nombre`,
                        'name'
                    )
                );
            } else if (variableNames.has(variable.name)) {
                errors.push(
                    this.createError(
                        ValidationErrorType.CONSTRAINT_VIOLATION,
                        'high',
                        `Nombre de variable duplicado: ${variable.name}`,
                        'name'
                    )
                );
            } else {
                variableNames.add(variable.name);
            }

            // Tipo válido
            if (
                !variable.type ||
                !['continuous', 'integer', 'binary'].includes(variable.type)
            ) {
                errors.push(
                    this.createError(
                        ValidationErrorType.INVALID_DATA_TYPE,
                        'medium',
                        `Tipo de variable inválido: ${variable.type}`,
                        'type'
                    )
                );
            }

            // Límites válidos
            if (
                variable.lowerBound !== undefined &&
                variable.upperBound !== undefined
            ) {
                if (variable.lowerBound > variable.upperBound) {
                    errors.push(
                        this.createError(
                            ValidationErrorType.CONSTRAINT_VIOLATION,
                            'medium',
                            `Límite inferior no puede ser mayor que el superior para variable ${variable.name}`,
                            'bounds'
                        )
                    );
                }
            }

            // Variables binarias deben tener límites 0-1
            if (variable.type === 'binary') {
                if (
                    variable.lowerBound !== undefined &&
                    variable.lowerBound !== 0
                ) {
                    errors.push(
                        this.createError(
                            ValidationErrorType.CONSTRAINT_VIOLATION,
                            'medium',
                            `Variable binaria ${variable.name} debe tener límite inferior 0`,
                            'lowerBound'
                        )
                    );
                }
                if (
                    variable.upperBound !== undefined &&
                    variable.upperBound !== 1
                ) {
                    errors.push(
                        this.createError(
                            ValidationErrorType.CONSTRAINT_VIOLATION,
                            'medium',
                            `Variable binaria ${variable.name} debe tener límite superior 1`,
                            'upperBound'
                        )
                    );
                }
            }
        });

        return errors;
    }

    /**
     * Validar objetivos de optimización
     */
    private validateOptimizationObjectives(
        objectives: any[]
    ): ValidationError[] {
        const errors: ValidationError[] = [];

        if (!objectives || objectives.length === 0) {
            errors.push(
                this.createError(
                    ValidationErrorType.MISSING_REQUIRED_FIELD,
                    'critical',
                    'El problema debe tener al menos un objetivo',
                    'objectives'
                )
            );
            return errors;
        }

        objectives.forEach((objective, index) => {
            if (!objective.expression || objective.expression.trim() === '') {
                errors.push(
                    this.createError(
                        ValidationErrorType.MISSING_REQUIRED_FIELD,
                        'high',
                        `Objetivo en posición ${index} debe tener una expresión`,
                        'expression'
                    )
                );
            }

            if (
                !objective.type ||
                !['minimize', 'maximize'].includes(objective.type)
            ) {
                errors.push(
                    this.createError(
                        ValidationErrorType.INVALID_DATA_TYPE,
                        'medium',
                        `Tipo de objetivo inválido: ${objective.type}`,
                        'type'
                    )
                );
            }
        });

        return errors;
    }

    /**
     * Validar restricciones de optimización
     */
    private validateOptimizationConstraints(
        constraints: OptimizationConstraint[]
    ): ValidationError[] {
        const errors: ValidationError[] = [];

        constraints.forEach((constraint, index) => {
            if (!constraint.expression || constraint.expression.trim() === '') {
                errors.push(
                    this.createError(
                        ValidationErrorType.MISSING_REQUIRED_FIELD,
                        'medium',
                        `Restricción en posición ${index} debe tener una expresión`,
                        'expression'
                    )
                );
            }

            if (
                !constraint.operator ||
                !['<=', '>=', '=', '<', '>'].includes(constraint.operator)
            ) {
                errors.push(
                    this.createError(
                        ValidationErrorType.INVALID_DATA_TYPE,
                        'medium',
                        `Operador de restricción inválido: ${constraint.operator}`,
                        'operator'
                    )
                );
            }

            if (
                constraint.rightHandSide === undefined ||
                constraint.rightHandSide === null
            ) {
                errors.push(
                    this.createError(
                        ValidationErrorType.MISSING_REQUIRED_FIELD,
                        'medium',
                        `Restricción en posición ${index} debe tener un valor del lado derecho`,
                        'rightHandSide'
                    )
                );
            }
        });

        return errors;
    }

    /**
     * Validar configuración de optimización
     */
    private validateOptimizationConfig(config: any): ValidationError[] {
        const errors: ValidationError[] = [];

        if (config.maxIterations !== undefined && config.maxIterations <= 0) {
            errors.push(
                this.createError(
                    ValidationErrorType.CONSTRAINT_VIOLATION,
                    'low',
                    'El número máximo de iteraciones debe ser positivo',
                    'maxIterations'
                )
            );
        }

        if (config.tolerance !== undefined && config.tolerance < 0) {
            errors.push(
                this.createError(
                    ValidationErrorType.CONSTRAINT_VIOLATION,
                    'low',
                    'La tolerancia debe ser no negativa',
                    'tolerance'
                )
            );
        }

        if (config.timeLimit !== undefined && config.timeLimit <= 0) {
            errors.push(
                this.createError(
                    ValidationErrorType.CONSTRAINT_VIOLATION,
                    'low',
                    'El límite de tiempo debe ser positivo',
                    'timeLimit'
                )
            );
        }

        return errors;
    }

    /**
     * Validar consistencia matemática
     */
    private validateMathematicalConsistency(
        problem: OptimizationProblem
    ): ValidationError[] {
        const errors: ValidationError[] = [];

        // Verificar que todas las variables en los objetivos están definidas
        const variableNames = new Set(problem.variables.map((v) => v.name));

        problem.objectives.forEach((objective, index) => {
            const referencedVars = this.extractVariableNames(
                objective.expression
            );
            referencedVars.forEach((varName) => {
                if (!variableNames.has(varName)) {
                    errors.push(
                        this.createError(
                            ValidationErrorType.ORPHANED_ENTITY,
                            'high',
                            `Objetivo ${index} referencia variable no definida: ${varName}`,
                            'expression'
                        )
                    );
                }
            });
        });

        // Verificar variables en restricciones
        problem.constraints.forEach((constraint, index) => {
            const referencedVars = this.extractVariableNames(
                constraint.expression
            );
            referencedVars.forEach((varName) => {
                if (!variableNames.has(varName)) {
                    errors.push(
                        this.createError(
                            ValidationErrorType.ORPHANED_ENTITY,
                            'high',
                            `Restricción ${index} referencia variable no definida: ${varName}`,
                            'expression'
                        )
                    );
                }
            });
        });

        return errors;
    }

    // ========================================================================
    // MÉTODOS AUXILIARES
    // ========================================================================

    /**
     * Detectar dependencias circulares en relaciones
     */
    private detectCircularDependencies(
        relationships: SystemRelationship[]
    ): string[] {
        const graph = new Map<string, string[]>();
        const visited = new Set<string>();
        const recursionStack = new Set<string>();
        const cycles: string[] = [];

        // Construir grafo de dependencias
        relationships.forEach((rel) => {
            if (!graph.has(rel.sourceId)) graph.set(rel.sourceId, []);
            graph.get(rel.sourceId)!.push(rel.targetId);
        });

        // DFS para detectar ciclos
        const hasCycle = (node: string): boolean => {
            if (recursionStack.has(node)) {
                cycles.push(node);
                return true;
            }
            if (visited.has(node)) return false;

            visited.add(node);
            recursionStack.add(node);

            const neighbors = graph.get(node) || [];
            for (const neighbor of neighbors) {
                if (hasCycle(neighbor)) return true;
            }

            recursionStack.delete(node);
            return false;
        };

        // Verificar todos los nodos
        for (const node of graph.keys()) {
            if (!visited.has(node)) {
                hasCycle(node);
            }
        }

        return cycles;
    }

    /**
     * Encontrar entidades aisladas
     */
    private findIsolatedEntities(system: SystemDefinition): string[] {
        const connectedEntities = new Set<string>();

        system.relationships.forEach((rel) => {
            connectedEntities.add(rel.sourceId);
            connectedEntities.add(rel.targetId);
        });

        return system.entities
            .filter((entity) => !connectedEntities.has(entity.id))
            .map((entity) => entity.id);
    }

    /**
     * Calcular complejidad del grafo
     */
    private calculateGraphComplexity(system: SystemDefinition): number {
        const numEntities = system.entities.length;
        const numRelationships = system.relationships.length;

        if (numEntities === 0) return 0;

        // Complejidad basada en densidad del grafo
        const maxPossibleEdges = (numEntities * (numEntities - 1)) / 2;
        const density =
            maxPossibleEdges > 0 ? numRelationships / maxPossibleEdges : 0;

        return Math.min(density, 1);
    }

    /**
     * Validar consistencia de tipos de relación
     */
    private validateRelationshipTypeConsistency(
        relationships: SystemRelationship[]
    ): ValidationError[] {
        const errors: ValidationError[] = [];

        // Verificar que relaciones del mismo tipo tengan propiedades consistentes
        const typeGroups = new Map<string, SystemRelationship[]>();

        relationships.forEach((rel) => {
            if (!typeGroups.has(rel.type)) {
                typeGroups.set(rel.type, []);
            }
            typeGroups.get(rel.type)!.push(rel);
        });

        typeGroups.forEach((rels, type) => {
            // Verificar consistencia de direccionalidad dentro del mismo tipo
            const directional = rels.filter((r) => r.isDirectional);
            const bidirectional = rels.filter((r) => !r.isDirectional);

            if (directional.length > 0 && bidirectional.length > 0) {
                errors.push(
                    this.createError(
                        ValidationErrorType.INCONSISTENT_DATA,
                        'low',
                        `Tipo de relación '${type}' tiene tanto relaciones direccionales como bidireccionales`,
                        'isDirectional',
                        'Considerar usar tipos diferentes para cada direccionalidad'
                    )
                );
            }
        });

        return errors;
    }

    /**
     * Validar propiedades de entidad
     */
    private validateEntityProperties(entity: SystemEntity): ValidationError[] {
        const errors: ValidationError[] = [];

        if (entity.properties) {
            Object.entries(entity.properties).forEach(([key, value]) => {
                // Verificar que las claves no estén vacías
                if (!key || key.trim() === '') {
                    errors.push(
                        this.createError(
                            ValidationErrorType.INVALID_DATA_TYPE,
                            'low',
                            `Entidad ${entity.id} tiene una propiedad con clave vacía`,
                            'properties',
                            undefined,
                            entity.id
                        )
                    );
                }

                // Verificar tipos de datos básicos
                if (value === null || value === undefined) {
                    errors.push(
                        this.createError(
                            ValidationErrorType.INVALID_DATA_TYPE,
                            'low',
                            `Propiedad '${key}' de entidad ${entity.id} tiene valor nulo`,
                            'properties',
                            undefined,
                            entity.id
                        )
                    );
                }
            });
        }

        return errors;
    }

    /**
     * Validar fórmula de restricción
     */
    private validateConstraintFormula(
        constraint: SystemConstraint
    ): ValidationError[] {
        const errors: ValidationError[] = [];

        try {
            // Validación básica de sintaxis de fórmula
            const formula = constraint.formula.trim();

            // Verificar que no esté vacía
            if (formula === '') {
                errors.push(
                    this.createError(
                        ValidationErrorType.MISSING_REQUIRED_FIELD,
                        'medium',
                        `Fórmula de restricción ${constraint.id} está vacía`,
                        'formula'
                    )
                );
                return errors;
            }

            // Verificar caracteres válidos
            const validChars = /^[a-zA-Z0-9\s\+\-\*\/\(\)\.\,\<\>\=\!]+$/;
            if (!validChars.test(formula)) {
                errors.push(
                    this.createError(
                        ValidationErrorType.INVALID_DATA_TYPE,
                        'medium',
                        `Fórmula de restricción ${constraint.id} contiene caracteres inválidos`,
                        'formula',
                        'Usar solo letras, números y operadores matemáticos básicos'
                    )
                );
            }

            // Verificar balance de paréntesis
            const openParens = (formula.match(/\(/g) || []).length;
            const closeParens = (formula.match(/\)/g) || []).length;
            if (openParens !== closeParens) {
                errors.push(
                    this.createError(
                        ValidationErrorType.INVALID_DATA_TYPE,
                        'medium',
                        `Fórmula de restricción ${constraint.id} tiene paréntesis desbalanceados`,
                        'formula'
                    )
                );
            }
        } catch (error) {
            errors.push(
                this.createError(
                    ValidationErrorType.INVALID_DATA_TYPE,
                    'medium',
                    `Error al validar fórmula de restricción ${constraint.id}: ${error instanceof Error ? error.message : 'Error desconocido'}`,
                    'formula'
                )
            );
        }

        return errors;
    }

    /**
     * Extraer nombres de variables de una expresión
     */
    private extractVariableNames(expression: string): string[] {
        // Expresión regular simple para encontrar nombres de variables
        const variablePattern = /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g;
        const matches = expression.match(variablePattern) || [];

        // Filtrar palabras reservadas
        const reservedWords = [
            'sin',
            'cos',
            'tan',
            'log',
            'exp',
            'sqrt',
            'max',
            'min',
            'abs',
        ];
        return matches.filter(
            (match) => !reservedWords.includes(match.toLowerCase())
        );
    }

    /**
     * Aplicar reglas personalizadas
     */
    private applyCustomRules(system: SystemDefinition): ValidationError[] {
        const errors: ValidationError[] = [];

        this.customRules
            .filter((rule) => rule.enabled)
            .sort((a, b) => b.priority - a.priority)
            .forEach((rule) => {
                try {
                    const ruleErrors = rule.validator(system);
                    errors.push(...ruleErrors);
                } catch (error) {
                    errors.push(
                        this.createError(
                            ValidationErrorType.LOGICAL_ERROR,
                            'low',
                            `Error en regla personalizada ${rule.name}: ${error instanceof Error ? error.message : 'Error desconocido'}`,
                            'customRules'
                        )
                    );
                }
            });

        return errors;
    }

    /**
     * Generar advertencias
     */
    private generateWarnings(
        system: SystemDefinition,
        errors: ValidationError[]
    ): ValidationWarning[] {
        const warnings: ValidationWarning[] = [];

        // Advertir sobre entidades sin descripción
        system.entities.forEach((entity) => {
            if (!entity.description || entity.description.trim() === '') {
                warnings.push({
                    id: `warning_${Date.now()}_${entity.id}`,
                    type: 'missing_description',
                    severity: 'low',
                    message: `Entidad ${entity.name} podría beneficiarse de una descripción`,
                    entityId: entity.id,
                });
            }
        });

        // Advertir sobre sistemas simples
        if (system.entities.length < 3) {
            warnings.push({
                id: `warning_${Date.now()}_simple_system`,
                type: 'simple_system',
                severity: 'low',
                message:
                    'Sistema muy simple, considerar agregar más entidades para mayor realismo',
            });
        }

        // Advertir sobre falta de objetivos
        if (!system.objectives || system.objectives.length === 0) {
            warnings.push({
                id: `warning_${Date.now()}_no_objectives`,
                type: 'missing_objectives',
                severity: 'medium',
                message:
                    'Sistema sin objetivos definidos, considerar agregar objetivos para mayor claridad',
            });
        }

        return warnings;
    }

    /**
     * Calcular puntuación de validación
     */
    private calculateValidationScore(
        errors: ValidationError[],
        warnings: ValidationWarning[]
    ): number {
        const criticalErrors = errors.filter(
            (e) => e.severity === 'critical'
        ).length;
        const highErrors = errors.filter((e) => e.severity === 'high').length;
        const mediumErrors = errors.filter(
            (e) => e.severity === 'medium'
        ).length;
        const lowErrors = errors.filter((e) => e.severity === 'low').length;
        const warningCount = warnings.length;

        // Penalizaciones por tipo de error
        const score = Math.max(
            0,
            100 -
                criticalErrors * 40 -
                highErrors * 25 -
                mediumErrors * 15 -
                lowErrors * 5 -
                warningCount * 2
        );

        return Math.round(score);
    }

    /**
     * Determinar si el sistema es válido
     */
    private isSystemValid(errors: ValidationError[]): boolean {
        return (
            errors.filter(
                (e) => e.severity === 'critical' || e.severity === 'high'
            ).length === 0
        );
    }

    /**
     * Crear error de validación
     */
    private createError(
        type: ValidationErrorType,
        severity: 'low' | 'medium' | 'high' | 'critical',
        message: string,
        field?: string,
        suggestion?: string,
        entityId?: string
    ): ValidationError {
        return {
            id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            severity,
            message,
            field,
            suggestion,
            entityId,
        };
    }

    // ========================================================================
    // GENERADORES DE SUGERENCIAS
    // ========================================================================

    /**
     * Generar sugerencias para sistemas
     */
    private generateSystemSuggestions(
        errors: ValidationError[],
        system: SystemDefinition
    ): string[] {
        const suggestions: string[] = [];

        if (
            errors.some(
                (e) => e.type === ValidationErrorType.MISSING_REQUIRED_FIELD
            )
        ) {
            suggestions.push(
                'Completar todos los campos requeridos del sistema'
            );
        }

        if (
            errors.some((e) => e.type === ValidationErrorType.ORPHANED_ENTITY)
        ) {
            suggestions.push(
                'Verificar que todas las referencias a entidades sean válidas'
            );
        }

        if (
            errors.some(
                (e) => e.type === ValidationErrorType.CIRCULAR_DEPENDENCY
            )
        ) {
            suggestions.push(
                'Revisar y romper las dependencias circulares en las relaciones'
            );
        }

        if (system.entities.length > 20) {
            suggestions.push(
                'Considerar dividir el sistema en módulos más pequeños'
            );
        }

        if (system.relationships.length === 0) {
            suggestions.push(
                'Agregar relaciones entre entidades para crear un sistema conectado'
            );
        }

        return suggestions;
    }

    /**
     * Generar sugerencias para familias
     */
    private generateFamilySuggestions(
        errors: ValidationError[],
        family: FamilyDataset
    ): string[] {
        const suggestions: string[] = [];

        if (errors.some((e) => e.field === 'age')) {
            suggestions.push('Verificar que todas las edades sean realistas');
        }

        if (family.members && family.members.length < 3) {
            suggestions.push(
                'Considerar agregar más miembros para un árbol genealógico más completo'
            );
        }

        if (!family.relationships || family.relationships.length === 0) {
            suggestions.push(
                'Agregar relaciones familiares para conectar los miembros'
            );
        }

        if (errors.some((e) => e.type === ValidationErrorType.LOGICAL_ERROR)) {
            suggestions.push('Revisar la lógica de las relaciones familiares');
        }

        return suggestions;
    }

    /**
     * Generar sugerencias para problemas de optimización
     */
    private generateOptimizationSuggestions(
        errors: ValidationError[],
        problem: OptimizationProblem
    ): string[] {
        const suggestions: string[] = [];

        if (errors.some((e) => e.field === 'expression')) {
            suggestions.push(
                'Verificar la sintaxis de las expresiones matemáticas'
            );
        }

        if (problem.variables.length > 100) {
            suggestions.push(
                'Considerar simplificar el problema reduciendo el número de variables'
            );
        }

        if (problem.constraints.length > 500) {
            suggestions.push(
                'Gran número de restricciones puede afectar el rendimiento'
            );
        }

        if (
            errors.some((e) => e.type === ValidationErrorType.ORPHANED_ENTITY)
        ) {
            suggestions.push(
                'Asegurar que todas las variables estén definidas antes de usarlas'
            );
        }

        return suggestions;
    }

    // ========================================================================
    // MÉTODOS DE GESTIÓN
    // ========================================================================

    /**
     * Agregar regla personalizada de validación
     */
    addCustomRule(rule: ValidationRule): void {
        // Verificar que la regla no exista ya
        const existingRuleIndex = this.customRules.findIndex(
            (r) => r.id === rule.id
        );
        if (existingRuleIndex >= 0) {
            this.customRules[existingRuleIndex] = rule;
        } else {
            this.customRules.push(rule);
        }

        // Ordenar por prioridad
        this.customRules.sort((a, b) => b.priority - a.priority);

        console.log(`✅ Regla personalizada agregada: ${rule.name}`);
    }

    /**
     * Remover regla personalizada
     */
    removeCustomRule(ruleId: string): boolean {
        const initialLength = this.customRules.length;
        this.customRules = this.customRules.filter(
            (rule) => rule.id !== ruleId
        );

        const removed = this.customRules.length < initialLength;
        if (removed) {
            console.log(`🗑️ Regla personalizada removida: ${ruleId}`);
        }

        return removed;
    }

    /**
     * Listar reglas personalizadas
     */
    getCustomRules(): ValidationRule[] {
        return [...this.customRules];
    }

    /**
     * Actualizar configuración del validador
     */
    updateConfig(newConfig: Partial<ValidatorConfig>): void {
        this.config = { ...this.config, ...newConfig };
        console.log('⚙️ Configuración del validador actualizada');
    }

    /**
     * Obtener configuración actual
     */
    getConfig(): ValidatorConfig {
        return { ...this.config };
    }

    /**
     * Obtener estadísticas de validación
     */
    getValidationStats(): ValidationStats | null {
        if (this.validationHistory.length === 0) return null;

        const lastValidation =
            this.validationHistory[this.validationHistory.length - 1];

        return {
            totalEntities: 0, // Se calcularía del último sistema validado
            totalRelationships: 0,
            totalConstraints: 0,
            validationTime: 0, // Se mediría en la validación real
            criticalErrors: lastValidation.errors.filter(
                (e) => e.severity === 'critical'
            ).length,
            highErrors: lastValidation.errors.filter(
                (e) => e.severity === 'high'
            ).length,
            mediumErrors: lastValidation.errors.filter(
                (e) => e.severity === 'medium'
            ).length,
            lowErrors: lastValidation.errors.filter((e) => e.severity === 'low')
                .length,
            warnings: lastValidation.warnings.length,
        };
    }

    /**
     * Limpiar historial de validación
     */
    clearValidationHistory(): void {
        this.validationHistory = [];
        console.log('🗑️ Historial de validación limpiado');
    }

    /**
     * Obtener historial de validación
     */
    getValidationHistory(): ValidationResult[] {
        return [...this.validationHistory];
    }
}

// ============================================================================
// FUNCIONES DE CONVENIENCIA
// ============================================================================

/**
 * Crear validador con configuración por defecto
 */
export function createSystemValidator(
    config?: Partial<ValidatorConfig>
): SystemValidator {
    return new SystemValidator(config);
}

/**
 * Crear validador para desarrollo (más permisivo)
 */
export function createDevelopmentValidator(): SystemValidator {
    return new SystemValidator({
        strictMode: false,
        enablePerformanceChecks: false,
        enableLogicalChecks: true,
        maxEntities: 100,
        maxRelationships: 500,
        enableSuggestions: true,
    });
}

/**
 * Crear validador para producción (más estricto)
 */
export function createProductionValidator(): SystemValidator {
    return new SystemValidator({
        strictMode: true,
        enablePerformanceChecks: true,
        enableLogicalChecks: true,
        maxEntities: 10000,
        maxRelationships: 50000,
        enableSuggestions: true,
    });
}

/**
 * Validar sistema de forma rápida sin instanciar clase
 */
export function quickValidateSystem(system: SystemDefinition): boolean {
    const validator = createSystemValidator();
    const result = validator.validateSystem(system);
    return result.isValid;
}

// Exportar clase principal y tipos
export { SystemValidator, ValidationErrorType };
export type {
    ValidationResult,
    ValidationError,
    ValidationWarning,
    ValidatorConfig,
    ValidationContext,
    ValidationRule,
    ValidationStats,
};
