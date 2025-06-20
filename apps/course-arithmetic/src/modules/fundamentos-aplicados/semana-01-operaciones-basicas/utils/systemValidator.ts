// ============================================================================
// VALIDADOR DE SISTEMAS RELACIONALES
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
 * Validador de sistemas principal
 */
class SystemValidator {
    private config: ValidatorConfig;
    private customRules: ValidationRule[];

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

    /**
     * Validar sistema completo
     */
    validateSystem(
        system: SystemDefinition,
        context?: ValidationContext
    ): ValidationResult {
        const errors: ValidationError[] = [];
        const warnings: ValidationWarning[] = [];

        // Validaciones básicas
        errors.push(...this.validateBasicStructure(system));
        errors.push(...this.validateEntities(system.entities));
        errors.push(
            ...this.validateRelationships(system.relationships, system.entities)
        );
        errors.push(...this.validateConstraints(system.constraints));
        errors.push(...this.validateObjectives(system.objectives));

        // Validaciones de integridad
        errors.push(...this.validateDataIntegrity(system));
        errors.push(...this.validateReferentialIntegrity(system));

        // Validaciones opcionales
        if (this.config.enableLogicalChecks) {
            errors.push(...this.validateLogicalConsistency(system));
        }

        if (this.config.enablePerformanceChecks) {
            warnings.push(...this.checkPerformanceIssues(system));
        }

        // Aplicar reglas personalizadas
        errors.push(...this.applyCustomRules(system));

        // Calcular puntuación
        const score = this.calculateValidationScore(errors, warnings);

        // Generar sugerencias
        const suggestions = this.config.enableSuggestions
            ? this.generateSuggestions(errors, warnings, system)
            : [];

        return {
            isValid:
                errors.filter(
                    (e) => e.severity === 'critical' || e.severity === 'high'
                ).length === 0,
            errors,
            warnings,
            suggestions,
            score,
        };
    }

    /**
     * Validar familia como sistema relacional
     */
    validateFamily(family: FamilyDataset): ValidationResult {
        const errors: ValidationError[] = [];
        const warnings: ValidationWarning[] = [];

        // Validar estructura básica de la familia
        if (!family.id || family.id.trim() === '') {
            errors.push(
                this.createError(
                    ValidationErrorType.MISSING_REQUIRED_FIELD,
                    'critical',
                    'Family must have a valid ID',
                    'id'
                )
            );
        }

        if (!family.name || family.name.trim() === '') {
            errors.push(
                this.createError(
                    ValidationErrorType.MISSING_REQUIRED_FIELD,
                    'high',
                    'Family must have a name',
                    'name'
                )
            );
        }

        // Validar miembros
        errors.push(...this.validateFamilyMembers(family.members));

        // Validar relaciones familiares
        errors.push(
            ...this.validateFamilyRelationships(
                family.relationships,
                family.members
            )
        );

        // Validaciones específicas de familias
        errors.push(...this.validateFamilyLogic(family));

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
                    'Optimization problem must have a valid ID',
                    'id'
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
        errors.push(...this.validateOptimizationConfig(problem.config));

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

    /**
     * Agregar regla personalizada de validación
     */
    addCustomRule(rule: ValidationRule): void {
        this.customRules.push(rule);
        this.customRules.sort((a, b) => b.priority - a.priority);
    }

    /**
     * Remover regla personalizada
     */
    removeCustomRule(ruleId: string): boolean {
        const initialLength = this.customRules.length;
        this.customRules = this.customRules.filter(
            (rule) => rule.id !== ruleId
        );
        return this.customRules.length < initialLength;
    }

    /**
     * Obtener estadísticas del validador
     */
    getStats() {
        return {
            customRules: this.customRules.length,
            enabledRules: this.customRules.filter((rule) => rule.enabled)
                .length,
            config: { ...this.config },
        };
    }

    // ===== MÉTODOS PRIVADOS =====

    private validateBasicStructure(
        system: SystemDefinition
    ): ValidationError[] {
        const errors: ValidationError[] = [];

        if (!system.id || system.id.trim() === '') {
            errors.push(
                this.createError(
                    ValidationErrorType.MISSING_REQUIRED_FIELD,
                    'critical',
                    'System must have a valid ID',
                    'id'
                )
            );
        }

        if (!system.name || system.name.trim() === '') {
            errors.push(
                this.createError(
                    ValidationErrorType.MISSING_REQUIRED_FIELD,
                    'high',
                    'System must have a name',
                    'name'
                )
            );
        }

        if (!system.entities || system.entities.length === 0) {
            errors.push(
                this.createError(
                    ValidationErrorType.MISSING_REQUIRED_FIELD,
                    'high',
                    'System must have at least one entity',
                    'entities'
                )
            );
        }

        return errors;
    }

    private validateEntities(entities: SystemEntity[]): ValidationError[] {
        const errors: ValidationError[] = [];
        const entityIds = new Set<string>();

        entities.forEach((entity) => {
            // Verificar ID único
            if (entityIds.has(entity.id)) {
                errors.push(
                    this.createError(
                        ValidationErrorType.INCONSISTENT_DATA,
                        'high',
                        `Duplicate entity ID: ${entity.id}`,
                        'entities',
                        entity.id
                    )
                );
            } else {
                entityIds.add(entity.id);
            }

            // Verificar campos requeridos
            if (!entity.name || entity.name.trim() === '') {
                errors.push(
                    this.createError(
                        ValidationErrorType.MISSING_REQUIRED_FIELD,
                        'medium',
                        `Entity ${entity.id} must have a name`,
                        'name',
                        entity.id
                    )
                );
            }

            // Verificar propiedades
            entity.properties.forEach((property) => {
                if (!property.name || property.name.trim() === '') {
                    errors.push(
                        this.createError(
                            ValidationErrorType.MISSING_REQUIRED_FIELD,
                            'low',
                            `Property in entity ${entity.id} must have a name`,
                            'properties',
                            entity.id
                        )
                    );
                }
            });
        });

        // Verificar límites de rendimiento
        if (entities.length > this.config.maxEntities) {
            errors.push(
                this.createError(
                    ValidationErrorType.PERFORMANCE_ISSUE,
                    'medium',
                    `Too many entities (${entities.length}). Consider reducing to improve performance.`,
                    'entities'
                )
            );
        }

        return errors;
    }

    private validateRelationships(
        relationships: SystemRelationship[],
        entities: SystemEntity[]
    ): ValidationError[] {
        const errors: ValidationError[] = [];
        const entityIds = new Set(entities.map((e) => e.id));

        relationships.forEach((relationship) => {
            // Verificar que las entidades referenciadas existen
            if (!entityIds.has(relationship.fromEntityId)) {
                errors.push(
                    this.createError(
                        ValidationErrorType.ORPHANED_ENTITY,
                        'high',
                        `Relationship ${relationship.id} references non-existent entity: ${relationship.fromEntityId}`,
                        'relationships',
                        undefined,
                        relationship.id
                    )
                );
            }

            if (!entityIds.has(relationship.toEntityId)) {
                errors.push(
                    this.createError(
                        ValidationErrorType.ORPHANED_ENTITY,
                        'high',
                        `Relationship ${relationship.id} references non-existent entity: ${relationship.toEntityId}`,
                        'relationships',
                        undefined,
                        relationship.id
                    )
                );
            }

            // Verificar auto-referencias válidas
            if (
                relationship.fromEntityId === relationship.toEntityId &&
                !relationship.isDirectional
            ) {
                errors.push(
                    this.createError(
                        ValidationErrorType.LOGICAL_ERROR,
                        'medium',
                        `Self-referencing relationship ${relationship.id} should be directional`,
                        'relationships',
                        undefined,
                        relationship.id
                    )
                );
            }

            // Verificar fuerza de relación
            if (relationship.strength < 0 || relationship.strength > 1) {
                errors.push(
                    this.createError(
                        ValidationErrorType.CONSTRAINT_VIOLATION,
                        'low',
                        `Relationship strength must be between 0 and 1`,
                        'strength',
                        undefined,
                        relationship.id
                    )
                );
            }
        });

        return errors;
    }

    private validateConstraints(
        constraints: SystemConstraint[]
    ): ValidationError[] {
        const errors: ValidationError[] = [];

        constraints.forEach((constraint) => {
            if (!constraint.formula || constraint.formula.trim() === '') {
                errors.push(
                    this.createError(
                        ValidationErrorType.MISSING_REQUIRED_FIELD,
                        'medium',
                        `Constraint ${constraint.id} must have a formula`,
                        'formula'
                    )
                );
            }

            if (!constraint.entities || constraint.entities.length === 0) {
                errors.push(
                    this.createError(
                        ValidationErrorType.MISSING_REQUIRED_FIELD,
                        'low',
                        `Constraint ${constraint.id} should reference at least one entity`,
                        'entities'
                    )
                );
            }
        });

        return errors;
    }

    private validateObjectives(
        objectives: SystemObjective[]
    ): ValidationError[] {
        const errors: ValidationError[] = [];

        if (objectives.length === 0) {
            errors.push(
                this.createError(
                    ValidationErrorType.MISSING_REQUIRED_FIELD,
                    'medium',
                    'System should have at least one objective',
                    'objectives'
                )
            );
        }

        objectives.forEach((objective) => {
            if (objective.target <= 0) {
                errors.push(
                    this.createError(
                        ValidationErrorType.CONSTRAINT_VIOLATION,
                        'low',
                        `Objective ${objective.id} target should be positive`,
                        'target'
                    )
                );
            }

            if (objective.priority < 1 || objective.priority > 5) {
                errors.push(
                    this.createError(
                        ValidationErrorType.CONSTRAINT_VIOLATION,
                        'low',
                        `Objective priority must be between 1 and 5`,
                        'priority'
                    )
                );
            }
        });

        return errors;
    }

    private validateDataIntegrity(system: SystemDefinition): ValidationError[] {
        const errors: ValidationError[] = [];

        // Verificar integridad de fechas
        const now = new Date();
        if (system.metadata.lastUpdated > now) {
            errors.push(
                this.createError(
                    ValidationErrorType.INCONSISTENT_DATA,
                    'medium',
                    'Last updated date cannot be in the future',
                    'lastUpdated'
                )
            );
        }

        return errors;
    }

    private validateReferentialIntegrity(
        system: SystemDefinition
    ): ValidationError[] {
        const errors: ValidationError[] = [];
        const entityIds = new Set(system.entities.map((e) => e.id));

        // Verificar que todas las referencias en objetivos sean válidas
        system.objectives.forEach((objective) => {
            objective.relatedEntities.forEach((entityId) => {
                if (!entityIds.has(entityId)) {
                    errors.push(
                        this.createError(
                            ValidationErrorType.ORPHANED_ENTITY,
                            'medium',
                            `Objective ${objective.id} references non-existent entity: ${entityId}`,
                            'relatedEntities'
                        )
                    );
                }
            });
        });

        return errors;
    }

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
                    `Circular dependencies detected: ${circularDeps.join(', ')}`,
                    'relationships'
                )
            );
        }

        return errors;
    }

    private checkPerformanceIssues(
        system: SystemDefinition
    ): ValidationWarning[] {
        const warnings: ValidationWarning[] = [];

        // Verificar complejidad de relaciones
        const avgRelationshipsPerEntity =
            system.relationships.length / system.entities.length;
        if (avgRelationshipsPerEntity > 10) {
            warnings.push({
                id: `perf_${Date.now()}`,
                type: ValidationErrorType.PERFORMANCE_ISSUE,
                severity: 'medium',
                message: 'High relationship density may impact performance',
                field: 'relationships',
                suggestion: 'Consider simplifying the relationship structure',
            });
        }

        return warnings;
    }

    private validateFamilyMembers(members: FamilyMember[]): ValidationError[] {
        const errors: ValidationError[] = [];
        const memberIds = new Set<string>();

        members.forEach((member) => {
            if (memberIds.has(member.id)) {
                errors.push(
                    this.createError(
                        ValidationErrorType.INCONSISTENT_DATA,
                        'high',
                        `Duplicate member ID: ${member.id}`,
                        'members',
                        member.id
                    )
                );
            } else {
                memberIds.add(member.id);
            }

            if (member.age < 0 || member.age > 150) {
                errors.push(
                    this.createError(
                        ValidationErrorType.CONSTRAINT_VIOLATION,
                        'medium',
                        `Invalid age for member ${member.name}: ${member.age}`,
                        'age',
                        member.id
                    )
                );
            }

            if (!['M', 'F'].includes(member.gender)) {
                errors.push(
                    this.createError(
                        ValidationErrorType.INVALID_DATA_TYPE,
                        'low',
                        `Invalid gender for member ${member.name}: ${member.gender}`,
                        'gender',
                        member.id
                    )
                );
            }
        });

        return errors;
    }

    private validateFamilyRelationships(
        relationships: Relationship[],
        members: FamilyMember[]
    ): ValidationError[] {
        const errors: ValidationError[] = [];
        const memberIds = new Set(members.map((m) => m.id));

        relationships.forEach((relationship) => {
            if (!memberIds.has(relationship.fromPersonId)) {
                errors.push(
                    this.createError(
                        ValidationErrorType.ORPHANED_ENTITY,
                        'high',
                        `Relationship references non-existent member: ${relationship.fromPersonId}`,
                        'relationships',
                        undefined,
                        relationship.id
                    )
                );
            }

            if (!memberIds.has(relationship.toPersonId)) {
                errors.push(
                    this.createError(
                        ValidationErrorType.ORPHANED_ENTITY,
                        'high',
                        `Relationship references non-existent member: ${relationship.toPersonId}`,
                        'relationships',
                        undefined,
                        relationship.id
                    )
                );
            }
        });

        return errors;
    }

    private validateFamilyLogic(family: FamilyDataset): ValidationError[] {
        const errors: ValidationError[] = [];

        // Verificar lógica de edades en relaciones padre-hijo
        family.relationships
            .filter((rel) => rel.type === 'parent')
            .forEach((rel) => {
                const parent = family.members.find(
                    (m) => m.id === rel.fromPersonId
                );
                const child = family.members.find(
                    (m) => m.id === rel.toPersonId
                );

                if (parent && child && parent.age <= child.age) {
                    errors.push(
                        this.createError(
                            ValidationErrorType.LOGICAL_ERROR,
                            'medium',
                            `Parent ${parent.name} (${parent.age}) should be older than child ${child.name} (${child.age})`,
                            'age',
                            parent.id
                        )
                    );
                }
            });

        return errors;
    }

    private validateOptimizationVariables(
        variables: OptimizationVariable[]
    ): ValidationError[] {
        const errors: ValidationError[] = [];

        variables.forEach((variable) => {
            if (variable.lowerBound >= variable.upperBound) {
                errors.push(
                    this.createError(
                        ValidationErrorType.CONSTRAINT_VIOLATION,
                        'high',
                        `Variable ${variable.name}: lower bound must be less than upper bound`,
                        'bounds'
                    )
                );
            }

            if (variable.initialValue !== undefined) {
                if (
                    variable.initialValue < variable.lowerBound ||
                    variable.initialValue > variable.upperBound
                ) {
                    errors.push(
                        this.createError(
                            ValidationErrorType.CONSTRAINT_VIOLATION,
                            'medium',
                            `Variable ${variable.name}: initial value outside bounds`,
                            'initialValue'
                        )
                    );
                }
            }
        });

        return errors;
    }

    private validateOptimizationObjectives(
        objectives: any[]
    ): ValidationError[] {
        const errors: ValidationError[] = [];

        if (objectives.length === 0) {
            errors.push(
                this.createError(
                    ValidationErrorType.MISSING_REQUIRED_FIELD,
                    'critical',
                    'Optimization problem must have at least one objective',
                    'objectives'
                )
            );
        }

        return errors;
    }

    private validateOptimizationConstraints(
        constraints: OptimizationConstraint[]
    ): ValidationError[] {
        const errors: ValidationError[] = [];

        constraints.forEach((constraint) => {
            if (!constraint.expression || constraint.expression.trim() === '') {
                errors.push(
                    this.createError(
                        ValidationErrorType.MISSING_REQUIRED_FIELD,
                        'medium',
                        `Constraint ${constraint.id} must have an expression`,
                        'expression'
                    )
                );
            }
        });

        return errors;
    }

    private validateOptimizationConfig(config: any): ValidationError[] {
        const errors: ValidationError[] = [];

        if (config.maxIterations <= 0) {
            errors.push(
                this.createError(
                    ValidationErrorType.CONSTRAINT_VIOLATION,
                    'medium',
                    'Maximum iterations must be positive',
                    'maxIterations'
                )
            );
        }

        if (config.tolerance <= 0) {
            errors.push(
                this.createError(
                    ValidationErrorType.CONSTRAINT_VIOLATION,
                    'medium',
                    'Tolerance must be positive',
                    'tolerance'
                )
            );
        }

        return errors;
    }

    private applyCustomRules(system: SystemDefinition): ValidationError[] {
        const errors: ValidationError[] = [];

        this.customRules
            .filter((rule) => rule.enabled)
            .forEach((rule) => {
                try {
                    const ruleErrors = rule.validator(system);
                    errors.push(...ruleErrors);
                } catch (error) {
                    console.error(
                        `Error applying custom rule ${rule.id}:`,
                        error
                    );
                }
            });

        return errors;
    }

    private detectCircularDependencies(
        relationships: SystemRelationship[]
    ): string[] {
        // Implementación simplificada de detección de ciclos
        const graph = new Map<string, string[]>();

        relationships.forEach((rel) => {
            if (!graph.has(rel.fromEntityId)) {
                graph.set(rel.fromEntityId, []);
            }
            graph.get(rel.fromEntityId)!.push(rel.toEntityId);
        });

        const visited = new Set<string>();
        const recursionStack = new Set<string>();
        const cycles: string[] = [];

        const hasCycle = (node: string): boolean => {
            visited.add(node);
            recursionStack.add(node);

            const neighbors = graph.get(node) || [];
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    if (hasCycle(neighbor)) {
                        cycles.push(`${node} -> ${neighbor}`);
                        return true;
                    }
                } else if (recursionStack.has(neighbor)) {
                    cycles.push(`${node} -> ${neighbor}`);
                    return true;
                }
            }

            recursionStack.delete(node);
            return false;
        };

        graph.forEach((_, node) => {
            if (!visited.has(node)) {
                hasCycle(node);
            }
        });

        return cycles;
    }

    private calculateValidationScore(
        errors: ValidationError[],
        warnings: ValidationWarning[]
    ): number {
        let score = 100;

        errors.forEach((error) => {
            switch (error.severity) {
                case 'critical':
                    score -= 25;
                    break;
                case 'high':
                    score -= 15;
                    break;
                case 'medium':
                    score -= 8;
                    break;
                case 'low':
                    score -= 3;
                    break;
            }
        });

        warnings.forEach((warning) => {
            score -= 1;
        });

        return Math.max(0, score);
    }

    private generateSuggestions(
        errors: ValidationError[],
        warnings: ValidationWarning[],
        system: SystemDefinition
    ): string[] {
        const suggestions: string[] = [];

        if (
            errors.some(
                (e) => e.type === ValidationErrorType.MISSING_REQUIRED_FIELD
            )
        ) {
            suggestions.push('Ensure all required fields are filled');
        }

        if (
            errors.some((e) => e.type === ValidationErrorType.ORPHANED_ENTITY)
        ) {
            suggestions.push('Remove or fix broken entity references');
        }

        if (
            warnings.some(
                (w) => w.type === ValidationErrorType.PERFORMANCE_ISSUE
            )
        ) {
            suggestions.push(
                'Consider optimizing system structure for better performance'
            );
        }

        if (system.entities.length > 50) {
            suggestions.push(
                'Large systems may benefit from modular organization'
            );
        }

        return suggestions;
    }

    private generateFamilySuggestions(
        errors: ValidationError[],
        family: FamilyDataset
    ): string[] {
        const suggestions: string[] = [];

        if (errors.some((e) => e.field === 'age')) {
            suggestions.push(
                'Verify that all ages are realistic and consistent with relationships'
            );
        }

        if (family.members.length > 10) {
            suggestions.push(
                'Consider breaking large families into smaller groups for better analysis'
            );
        }

        return suggestions;
    }

    private generateOptimizationSuggestions(
        errors: ValidationError[],
        problem: OptimizationProblem
    ): string[] {
        const suggestions: string[] = [];

        if (errors.some((e) => e.field === 'bounds')) {
            suggestions.push(
                'Ensure variable bounds are realistic and achievable'
            );
        }

        if (problem.variables.length > 20) {
            suggestions.push(
                'Consider reducing problem dimensionality for faster convergence'
            );
        }

        return suggestions;
    }

    private createError(
        type: ValidationErrorType,
        severity: ValidationError['severity'],
        message: string,
        field?: string,
        entityId?: string,
        relationshipId?: string
    ): ValidationError {
        return {
            id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            severity,
            message,
            field,
            entityId,
            relationshipId,
            suggestion: this.getSuggestionForError(type),
        };
    }

    private getSuggestionForError(type: ValidationErrorType): string {
        switch (type) {
            case ValidationErrorType.MISSING_REQUIRED_FIELD:
                return 'Fill in the required field with valid data';
            case ValidationErrorType.CONSTRAINT_VIOLATION:
                return 'Adjust the value to meet the constraint requirements';
            case ValidationErrorType.ORPHANED_ENTITY:
                return 'Remove the reference or create the missing entity';
            case ValidationErrorType.CIRCULAR_DEPENDENCY:
                return 'Restructure relationships to eliminate cycles';
            default:
                return 'Review and correct the identified issue';
        }
    }
}

/**
 * Función de conveniencia para crear un validador
 */
export function createSystemValidator(
    config?: Partial<ValidatorConfig>
): SystemValidator {
    return new SystemValidator(config);
}

/**
 * Función para validación rápida
 */
export function quickValidate(system: SystemDefinition): boolean {
    const validator = new SystemValidator({ strictMode: false });
    const result = validator.validateSystem(system);
    return result.isValid;
}

/**
 * Función para validación estricta
 */
export function strictValidate(system: SystemDefinition): ValidationResult {
    const validator = new SystemValidator({ strictMode: true });
    return validator.validateSystem(system);
}

export default SystemValidator;
