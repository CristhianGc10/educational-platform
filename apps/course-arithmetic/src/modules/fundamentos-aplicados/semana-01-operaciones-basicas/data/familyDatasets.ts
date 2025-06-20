// ============================================================================
// DATASETS DE FAMILIAS - ARCHIVO COMPLETO
// ============================================================================

import {
    FamilyDataset,
    FamilyMember,
    Relationship,
    RelationshipType,
} from '../types/relationships';

// ============================================================================
// FAMILIAS SIMPLES
// ============================================================================

export const FAMILIA_GARCIA: FamilyDataset = {
    id: 'garcia-001',
    name: 'Familia García',
    description: 'Una familia nuclear típica con dos padres y dos hijos',
    members: [
        {
            id: 'garcia-padre',
            name: 'Carlos García',
            age: 45,
            gender: 'male',
            occupation: 'Ingeniero',
            traits: ['responsable', 'trabajador', 'familiar'],
        },
        {
            id: 'garcia-madre',
            name: 'María García',
            age: 42,
            gender: 'female',
            occupation: 'Profesora',
            traits: ['cariñosa', 'organizada', 'paciente'],
        },
        {
            id: 'garcia-hijo1',
            name: 'Alejandro García',
            age: 16,
            gender: 'male',
            occupation: 'Estudiante',
            traits: ['deportista', 'estudioso', 'sociable'],
        },
        {
            id: 'garcia-hija1',
            name: 'Sofia García',
            age: 12,
            gender: 'female',
            occupation: 'Estudiante',
            traits: ['artística', 'curiosa', 'amigable'],
        },
    ],
    relationships: [
        {
            id: 'rel-001',
            person1Id: 'garcia-padre',
            person2Id: 'garcia-madre',
            type: 'spouse',
            strength: 0.9,
            description: 'Matrimonio de 18 años',
        },
        {
            id: 'rel-002',
            person1Id: 'garcia-padre',
            person2Id: 'garcia-hijo1',
            type: 'parent',
            strength: 0.85,
            description: 'Relación padre-hijo',
        },
        {
            id: 'rel-003',
            person1Id: 'garcia-padre',
            person2Id: 'garcia-hija1',
            type: 'parent',
            strength: 0.9,
            description: 'Relación padre-hija',
        },
        {
            id: 'rel-004',
            person1Id: 'garcia-madre',
            person2Id: 'garcia-hijo1',
            type: 'parent',
            strength: 0.8,
            description: 'Relación madre-hijo',
        },
        {
            id: 'rel-005',
            person1Id: 'garcia-madre',
            person2Id: 'garcia-hija1',
            type: 'parent',
            strength: 0.95,
            description: 'Relación madre-hija muy estrecha',
        },
        {
            id: 'rel-006',
            person1Id: 'garcia-hijo1',
            person2Id: 'garcia-hija1',
            type: 'sibling',
            strength: 0.7,
            description: 'Hermanos con buena relación',
        },
    ],
    metadata: {
        createdAt: new Date('2024-01-15'),
        lastUpdated: new Date('2024-01-15'),
        version: '1.0.0',
        tags: ['nuclear', 'tradicional', 'clase-media'],
        complexity: 'simple',
        educationalLevel: 'básico',
    },
};

export const FAMILIA_LOPEZ: FamilyDataset = {
    id: 'lopez-001',
    name: 'Familia López',
    description: 'Familia monoparental con madre soltera y tres hijos',
    members: [
        {
            id: 'lopez-madre',
            name: 'Ana López',
            age: 38,
            gender: 'female',
            occupation: 'Enfermera',
            traits: ['fuerte', 'independiente', 'dedicada'],
        },
        {
            id: 'lopez-hijo1',
            name: 'Diego López',
            age: 15,
            gender: 'male',
            occupation: 'Estudiante',
            traits: ['responsable', 'maduro', 'protector'],
        },
        {
            id: 'lopez-hija1',
            name: 'Camila López',
            age: 11,
            gender: 'female',
            occupation: 'Estudiante',
            traits: ['creativa', 'sensible', 'inteligente'],
        },
        {
            id: 'lopez-hijo2',
            name: 'Mateo López',
            age: 7,
            gender: 'male',
            occupation: 'Estudiante',
            traits: ['energético', 'divertido', 'travieso'],
        },
    ],
    relationships: [
        {
            id: 'rel-lopez-001',
            person1Id: 'lopez-madre',
            person2Id: 'lopez-hijo1',
            type: 'parent',
            strength: 0.9,
            description: 'Relación muy estrecha, él es su apoyo',
        },
        {
            id: 'rel-lopez-002',
            person1Id: 'lopez-madre',
            person2Id: 'lopez-hija1',
            type: 'parent',
            strength: 0.85,
            description: 'Relación cariñosa madre-hija',
        },
        {
            id: 'rel-lopez-003',
            person1Id: 'lopez-madre',
            person2Id: 'lopez-hijo2',
            type: 'parent',
            strength: 0.8,
            description: 'Relación tierna con el menor',
        },
        {
            id: 'rel-lopez-004',
            person1Id: 'lopez-hijo1',
            person2Id: 'lopez-hija1',
            type: 'sibling',
            strength: 0.75,
            description: 'Hermanos que se cuidan mutuamente',
        },
        {
            id: 'rel-lopez-005',
            person1Id: 'lopez-hijo1',
            person2Id: 'lopez-hijo2',
            type: 'sibling',
            strength: 0.8,
            description: 'Hermano mayor protector',
        },
        {
            id: 'rel-lopez-006',
            person1Id: 'lopez-hija1',
            person2Id: 'lopez-hijo2',
            type: 'sibling',
            strength: 0.7,
            description: 'Hermanos con diferencia de edad',
        },
    ],
    metadata: {
        createdAt: new Date('2024-01-15'),
        lastUpdated: new Date('2024-01-15'),
        version: '1.0.0',
        tags: ['monoparental', 'madre-soltera', 'resiliente'],
        complexity: 'medium',
        educationalLevel: 'básico',
    },
};

// ============================================================================
// FAMILIAS MEDIAS
// ============================================================================

export const FAMILIA_RODRIGUEZ: FamilyDataset = {
    id: 'rodriguez-001',
    name: 'Familia Rodríguez (Extendida)',
    description: 'Familia extendida con tres generaciones viviendo juntas',
    members: [
        // Abuelos
        {
            id: 'rodriguez-abuelo',
            name: 'Roberto Rodríguez',
            age: 72,
            gender: 'male',
            occupation: 'Jubilado',
            traits: ['sabio', 'tranquilo', 'cuentacuentos'],
        },
        {
            id: 'rodriguez-abuela',
            name: 'Carmen Rodríguez',
            age: 69,
            gender: 'female',
            occupation: 'Jubilada',
            traits: ['cocinera', 'cariñosa', 'tradicional'],
        },
        // Padres
        {
            id: 'rodriguez-padre',
            name: 'Miguel Rodríguez',
            age: 44,
            gender: 'male',
            occupation: 'Contador',
            traits: ['organizado', 'responsable', 'familiar'],
        },
        {
            id: 'rodriguez-madre',
            name: 'Patricia Rodríguez',
            age: 41,
            gender: 'female',
            occupation: 'Médica',
            traits: ['dedicada', 'inteligente', 'equilibrada'],
        },
        // Hijos
        {
            id: 'rodriguez-hijo1',
            name: 'Gabriel Rodríguez',
            age: 18,
            gender: 'male',
            occupation: 'Universitario',
            traits: ['ambicioso', 'estudioso', 'independiente'],
        },
        {
            id: 'rodriguez-hija1',
            name: 'Valentina Rodríguez',
            age: 14,
            gender: 'female',
            occupation: 'Estudiante',
            traits: ['artística', 'expresiva', 'rebelde'],
        },
        {
            id: 'rodriguez-hijo2',
            name: 'Santiago Rodríguez',
            age: 9,
            gender: 'male',
            occupation: 'Estudiante',
            traits: ['curioso', 'tecnológico', 'ingenioso'],
        },
    ],
    relationships: [
        // Relaciones abuelos-padres
        {
            id: 'rel-rod-001',
            person1Id: 'rodriguez-abuelo',
            person2Id: 'rodriguez-padre',
            type: 'parent',
            strength: 0.8,
            description: 'Padre e hijo, relación tradicional',
        },
        {
            id: 'rel-rod-002',
            person1Id: 'rodriguez-abuela',
            person2Id: 'rodriguez-padre',
            type: 'parent',
            strength: 0.85,
            description: 'Madre e hijo muy unidos',
        },
        // Matrimonio
        {
            id: 'rel-rod-003',
            person1Id: 'rodriguez-padre',
            person2Id: 'rodriguez-madre',
            type: 'spouse',
            strength: 0.9,
            description: 'Matrimonio sólido de 20 años',
        },
        {
            id: 'rel-rod-004',
            person1Id: 'rodriguez-abuelo',
            person2Id: 'rodriguez-abuela',
            type: 'spouse',
            strength: 0.95,
            description: 'Matrimonio de 50 años',
        },
        // Padres-hijos
        {
            id: 'rel-rod-005',
            person1Id: 'rodriguez-padre',
            person2Id: 'rodriguez-hijo1',
            type: 'parent',
            strength: 0.75,
            description: 'Relación que se está ajustando',
        },
        {
            id: 'rel-rod-006',
            person1Id: 'rodriguez-padre',
            person2Id: 'rodriguez-hija1',
            type: 'parent',
            strength: 0.7,
            description: 'Etapa rebelde de la adolescente',
        },
        {
            id: 'rel-rod-007',
            person1Id: 'rodriguez-padre',
            person2Id: 'rodriguez-hijo2',
            type: 'parent',
            strength: 0.9,
            description: 'Relación muy estrecha padre-hijo',
        },
        {
            id: 'rel-rod-008',
            person1Id: 'rodriguez-madre',
            person2Id: 'rodriguez-hijo1',
            type: 'parent',
            strength: 0.8,
            description: 'Comprensión mutua',
        },
        {
            id: 'rel-rod-009',
            person1Id: 'rodriguez-madre',
            person2Id: 'rodriguez-hija1',
            type: 'parent',
            strength: 0.65,
            description: 'Conflictos típicos madre-hija adolescente',
        },
        {
            id: 'rel-rod-010',
            person1Id: 'rodriguez-madre',
            person2Id: 'rodriguez-hijo2',
            type: 'parent',
            strength: 0.85,
            description: 'Cuidado y apoyo escolar',
        },
        // Abuelos-nietos
        {
            id: 'rel-rod-011',
            person1Id: 'rodriguez-abuelo',
            person2Id: 'rodriguez-hijo1',
            type: 'grandparent',
            strength: 0.8,
            description: 'Consejos de vida y experiencia',
        },
        {
            id: 'rel-rod-012',
            person1Id: 'rodriguez-abuelo',
            person2Id: 'rodriguez-hija1',
            type: 'grandparent',
            strength: 0.85,
            description: 'Abuelo comprensivo',
        },
        {
            id: 'rel-rod-013',
            person1Id: 'rodriguez-abuelo',
            person2Id: 'rodriguez-hijo2',
            type: 'grandparent',
            strength: 0.9,
            description: 'Compañeros de aventuras',
        },
        {
            id: 'rel-rod-014',
            person1Id: 'rodriguez-abuela',
            person2Id: 'rodriguez-hijo1',
            type: 'grandparent',
            strength: 0.75,
            description: 'Abuela preocupada por su futuro',
        },
        {
            id: 'rel-rod-015',
            person1Id: 'rodriguez-abuela',
            person2Id: 'rodriguez-hija1',
            type: 'grandparent',
            strength: 0.8,
            description: 'Confidencias entre mujeres',
        },
        {
            id: 'rel-rod-016',
            person1Id: 'rodriguez-abuela',
            person2Id: 'rodriguez-hijo2',
            type: 'grandparent',
            strength: 0.95,
            description: 'El consentido de la abuela',
        },
        // Hermanos
        {
            id: 'rel-rod-017',
            person1Id: 'rodriguez-hijo1',
            person2Id: 'rodriguez-hija1',
            type: 'sibling',
            strength: 0.6,
            description: 'Diferencia de edad y etapas',
        },
        {
            id: 'rel-rod-018',
            person1Id: 'rodriguez-hijo1',
            person2Id: 'rodriguez-hijo2',
            type: 'sibling',
            strength: 0.75,
            description: 'Hermano mayor protector',
        },
        {
            id: 'rel-rod-019',
            person1Id: 'rodriguez-hija1',
            person2Id: 'rodriguez-hijo2',
            type: 'sibling',
            strength: 0.7,
            description: 'Hermana que cuida al menor',
        },
    ],
    metadata: {
        createdAt: new Date('2024-01-15'),
        lastUpdated: new Date('2024-01-15'),
        version: '1.0.0',
        tags: ['extendida', 'tres-generaciones', 'tradicional'],
        complexity: 'medium',
        educationalLevel: 'intermedio',
    },
};

export const FAMILIA_MARTINEZ: FamilyDataset = {
    id: 'martinez-001',
    name: 'Familia Martínez (Reconstruida)',
    description: 'Familia reconstruida con hijos de matrimonios anteriores',
    members: [
        {
            id: 'martinez-padre',
            name: 'Fernando Martínez',
            age: 46,
            gender: 'male',
            occupation: 'Arquitecto',
            traits: ['creativo', 'paciente', 'adaptable'],
        },
        {
            id: 'martinez-madre',
            name: 'Isabella Martínez',
            age: 43,
            gender: 'female',
            occupation: 'Psicóloga',
            traits: ['empática', 'comunicativa', 'resiliente'],
        },
        // Hijos de Fernando
        {
            id: 'martinez-hijo1',
            name: 'Nicolás Martínez',
            age: 17,
            gender: 'male',
            occupation: 'Estudiante',
            traits: ['reservado', 'artístico', 'leal'],
        },
        {
            id: 'martinez-hija1',
            name: 'Emilia Martínez',
            age: 13,
            gender: 'female',
            occupation: 'Estudiante',
            traits: ['extrovertida', 'deportista', 'adaptable'],
        },
        // Hijos de Isabella
        {
            id: 'martinez-hijo2',
            name: 'Sebastián Martínez',
            age: 15,
            gender: 'male',
            occupation: 'Estudiante',
            traits: ['intelectual', 'observador', 'cauteloso'],
        },
        // Hijo de ambos
        {
            id: 'martinez-hija2',
            name: 'Luna Martínez',
            age: 5,
            gender: 'female',
            occupation: 'Preescolar',
            traits: ['alegre', 'unificadora', 'cariñosa'],
        },
    ],
    relationships: [
        // Matrimonio actual
        {
            id: 'rel-mart-001',
            person1Id: 'martinez-padre',
            person2Id: 'martinez-madre',
            type: 'spouse',
            strength: 0.85,
            description: 'Segunda oportunidad en el amor',
        },
        // Fernando con sus hijos biológicos
        {
            id: 'rel-mart-002',
            person1Id: 'martinez-padre',
            person2Id: 'martinez-hijo1',
            type: 'parent',
            strength: 0.8,
            description: 'Adaptándose a los cambios familiares',
        },
        {
            id: 'rel-mart-003',
            person1Id: 'martinez-padre',
            person2Id: 'martinez-hija1',
            type: 'parent',
            strength: 0.85,
            description: 'Relación sólida padre-hija',
        },
        // Fernando con hijo de Isabella
        {
            id: 'rel-mart-004',
            person1Id: 'martinez-padre',
            person2Id: 'martinez-hijo2',
            type: 'parent',
            strength: 0.6,
            description: 'Construyendo la relación de padrastro',
        },
        // Isabella con hijos de Fernando
        {
            id: 'rel-mart-005',
            person1Id: 'martinez-madre',
            person2Id: 'martinez-hijo1',
            type: 'parent',
            strength: 0.65,
            description: 'Respeto mutuo en construcción',
        },
        {
            id: 'rel-mart-006',
            person1Id: 'martinez-madre',
            person2Id: 'martinez-hija1',
            type: 'parent',
            strength: 0.75,
            description: 'Buena relación madrastra-hijastra',
        },
        // Isabella con su hijo biológico
        {
            id: 'rel-mart-007',
            person1Id: 'martinez-madre',
            person2Id: 'martinez-hijo2',
            type: 'parent',
            strength: 0.9,
            description: 'Relación madre-hijo muy estrecha',
        },
        // Ambos con Luna
        {
            id: 'rel-mart-008',
            person1Id: 'martinez-padre',
            person2Id: 'martinez-hija2',
            type: 'parent',
            strength: 0.95,
            description: 'El orgullo del padre',
        },
        {
            id: 'rel-mart-009',
            person1Id: 'martinez-madre',
            person2Id: 'martinez-hija2',
            type: 'parent',
            strength: 0.95,
            description: 'Amor incondicional madre-hija',
        },
        // Entre hermanastros
        {
            id: 'rel-mart-010',
            person1Id: 'martinez-hijo1',
            person2Id: 'martinez-hijo2',
            type: 'sibling',
            strength: 0.5,
            description: 'Respeto cauteloso entre hermanastros',
        },
        {
            id: 'rel-mart-011',
            person1Id: 'martinez-hija1',
            person2Id: 'martinez-hijo2',
            type: 'sibling',
            strength: 0.7,
            description: 'Mejor adaptación entre hermanastros',
        },
        // Todos con Luna (hermana común)
        {
            id: 'rel-mart-012',
            person1Id: 'martinez-hijo1',
            person2Id: 'martinez-hija2',
            type: 'sibling',
            strength: 0.9,
            description: 'Hermano mayor protector',
        },
        {
            id: 'rel-mart-013',
            person1Id: 'martinez-hija1',
            person2Id: 'martinez-hija2',
            type: 'sibling',
            strength: 0.85,
            description: 'Hermana mayor cuidadora',
        },
        {
            id: 'rel-mart-014',
            person1Id: 'martinez-hijo2',
            person2Id: 'martinez-hija2',
            type: 'sibling',
            strength: 0.8,
            description: 'Hermano medio protector',
        },
        // Entre hermanos biológicos
        {
            id: 'rel-mart-015',
            person1Id: 'martinez-hijo1',
            person2Id: 'martinez-hija1',
            type: 'sibling',
            strength: 0.75,
            description: 'Hermanos que se apoyan en los cambios',
        },
    ],
    metadata: {
        createdAt: new Date('2024-01-15'),
        lastUpdated: new Date('2024-01-15'),
        version: '1.0.0',
        tags: ['reconstruida', 'compleja', 'adaptación'],
        complexity: 'complex',
        educationalLevel: 'intermedio',
    },
};

// ============================================================================
// FAMILIAS COMPLEJAS
// ============================================================================

export const FAMILIA_TORRES: FamilyDataset = {
    id: 'torres-001',
    name: 'Familia Torres (Multigeneracional)',
    description: 'Familia compleja de cuatro generaciones con múltiples ramas',
    members: [
        // Bisabuela
        {
            id: 'torres-bisabuela',
            name: 'Esperanza Torres',
            age: 89,
            gender: 'female',
            occupation: 'Jubilada',
            traits: ['sabia', 'matriarca', 'fuerte'],
        },
        // Abuelos paternos
        {
            id: 'torres-abuelo-p',
            name: 'Antonio Torres',
            age: 68,
            gender: 'male',
            occupation: 'Jubilado',
            traits: ['trabajador', 'estricto', 'proveedor'],
        },
        {
            id: 'torres-abuela-p',
            name: 'Rosa Torres',
            age: 65,
            gender: 'female',
            occupation: 'Jubilada',
            traits: ['cariñosa', 'mediadora', 'cocinera'],
        },
        // Abuelos maternos
        {
            id: 'torres-abuelo-m',
            name: 'Luis Herrera',
            age: 70,
            gender: 'male',
            occupation: 'Jubilado',
            traits: ['intelectual', 'callado', 'observador'],
        },
        {
            id: 'torres-abuela-m',
            name: 'Gloria Herrera',
            age: 67,
            gender: 'female',
            occupation: 'Jubilada',
            traits: ['moderna', 'independiente', 'viajera'],
        },
        // Tíos/Tías
        {
            id: 'torres-tio1',
            name: 'Ricardo Torres',
            age: 45,
            gender: 'male',
            occupation: 'Empresario',
            traits: ['exitoso', 'competitivo', 'generoso'],
        },
        {
            id: 'torres-tia1',
            name: 'Claudia Herrera',
            age: 39,
            gender: 'female',
            occupation: 'Artista',
            traits: ['creativa', 'libre', 'inspiradora'],
        },
        // Padres
        {
            id: 'torres-padre',
            name: 'Eduardo Torres',
            age: 42,
            gender: 'male',
            occupation: 'Médico',
            traits: ['dedicado', 'serio', 'comprometido'],
        },
        {
            id: 'torres-madre',
            name: 'Lucía Torres',
            age: 40,
            gender: 'female',
            occupation: 'Abogada',
            traits: ['determinada', 'justa', 'equilibrada'],
        },
        // Hijos principales
        {
            id: 'torres-hijo1',
            name: 'Andrés Torres',
            age: 19,
            gender: 'male',
            occupation: 'Universitario',
            traits: ['idealista', 'rebelde', 'inteligente'],
        },
        {
            id: 'torres-hija1',
            name: 'Catalina Torres',
            age: 16,
            gender: 'female',
            occupation: 'Estudiante',
            traits: ['perfeccionista', 'responsable', 'líder'],
        },
        {
            id: 'torres-hijo2',
            name: 'Tomás Torres',
            age: 12,
            gender: 'male',
            occupation: 'Estudiante',
            traits: ['curioso', 'científico', 'metódico'],
        },
        // Primos
        {
            id: 'torres-primo1',
            name: 'Marcos Torres',
            age: 17,
            gender: 'male',
            occupation: 'Estudiante',
            traits: ['deportista', 'popular', 'carismático'],
        },
        {
            id: 'torres-prima1',
            name: 'Sofía Herrera',
            age: 14,
            gender: 'female',
            occupation: 'Estudiante',
            traits: ['artística', 'sensible', 'talentosa'],
        },
    ],
    relationships: [
        // Relaciones generación 1 (bisabuela)
        {
            id: 'rel-torres-001',
            person1Id: 'torres-bisabuela',
            person2Id: 'torres-abuelo-p',
            type: 'parent',
            strength: 0.8,
            description: 'Madre e hijo, relación tradicional',
        },

        // Relaciones generación 2 (abuelos)
        {
            id: 'rel-torres-002',
            person1Id: 'torres-abuelo-p',
            person2Id: 'torres-abuela-p',
            type: 'spouse',
            strength: 0.85,
            description: 'Matrimonio de 45 años',
        },
        {
            id: 'rel-torres-003',
            person1Id: 'torres-abuelo-m',
            person2Id: 'torres-abuela-m',
            type: 'spouse',
            strength: 0.8,
            description: 'Matrimonio de 42 años',
        },

        // Relaciones generación 2 → 3 (abuelos → tíos/padres)
        {
            id: 'rel-torres-004',
            person1Id: 'torres-abuelo-p',
            person2Id: 'torres-padre',
            type: 'parent',
            strength: 0.75,
            description: 'Padre e hijo con expectativas altas',
        },
        {
            id: 'rel-torres-005',
            person1Id: 'torres-abuelo-p',
            person2Id: 'torres-tio1',
            type: 'parent',
            strength: 0.8,
            description: 'Orgullo por el éxito del hijo',
        },
        {
            id: 'rel-torres-006',
            person1Id: 'torres-abuela-p',
            person2Id: 'torres-padre',
            type: 'parent',
            strength: 0.9,
            description: 'Relación muy estrecha madre-hijo',
        },
        {
            id: 'rel-torres-007',
            person1Id: 'torres-abuela-p',
            person2Id: 'torres-tio1',
            type: 'parent',
            strength: 0.85,
            description: 'Madre orgullosa de ambos hijos',
        },
        {
            id: 'rel-torres-008',
            person1Id: 'torres-abuelo-m',
            person2Id: 'torres-madre',
            type: 'parent',
            strength: 0.8,
            description: 'Respeto mutuo padre-hija',
        },
        {
            id: 'rel-torres-009',
            person1Id: 'torres-abuelo-m',
            person2Id: 'torres-tia1',
            type: 'parent',
            strength: 0.7,
            description: 'Diferencias generacionales',
        },
        {
            id: 'rel-torres-010',
            person1Id: 'torres-abuela-m',
            person2Id: 'torres-madre',
            type: 'parent',
            strength: 0.85,
            description: 'Admiración mutua entre mujeres exitosas',
        },
        {
            id: 'rel-torres-011',
            person1Id: 'torres-abuela-m',
            person2Id: 'torres-tia1',
            type: 'parent',
            strength: 0.8,
            description: 'Apoyo a la creatividad de la hija',
        },

        // Matrimonio principal
        {
            id: 'rel-torres-012',
            person1Id: 'torres-padre',
            person2Id: 'torres-madre',
            type: 'spouse',
            strength: 0.9,
            description: 'Matrimonio sólido de profesionales',
        },

        // Hermanos (generación 3)
        {
            id: 'rel-torres-013',
            person1Id: 'torres-padre',
            person2Id: 'torres-tio1',
            type: 'sibling',
            strength: 0.7,
            description: 'Hermanos con personalidades diferentes',
        },
        {
            id: 'rel-torres-014',
            person1Id: 'torres-madre',
            person2Id: 'torres-tia1',
            type: 'sibling',
            strength: 0.6,
            description: 'Hermanas con caminos muy diferentes',
        },

        // Padres → hijos (generación 3 → 4)
        {
            id: 'rel-torres-015',
            person1Id: 'torres-padre',
            person2Id: 'torres-hijo1',
            type: 'parent',
            strength: 0.65,
            description: 'Conflictos generacionales sobre el futuro',
        },
        {
            id: 'rel-torres-016',
            person1Id: 'torres-padre',
            person2Id: 'torres-hija1',
            type: 'parent',
            strength: 0.85,
            description: 'Admiración por la responsabilidad de la hija',
        },
        {
            id: 'rel-torres-017',
            person1Id: 'torres-padre',
            person2Id: 'torres-hijo2',
            type: 'parent',
            strength: 0.9,
            description: 'Compartiendo la pasión por la ciencia',
        },
        {
            id: 'rel-torres-018',
            person1Id: 'torres-madre',
            person2Id: 'torres-hijo1',
            type: 'parent',
            strength: 0.7,
            description: 'Comprende sus ideales pero se preocupa',
        },
        {
            id: 'rel-torres-019',
            person1Id: 'torres-madre',
            person2Id: 'torres-hija1',
            type: 'parent',
            strength: 0.8,
            description: 'Modelo a seguir para la hija',
        },
        {
            id: 'rel-torres-020',
            person1Id: 'torres-madre',
            person2Id: 'torres-hijo2',
            type: 'parent',
            strength: 0.85,
            description: 'Apoyo en el desarrollo intelectual',
        },

        // Tíos → primos
        {
            id: 'rel-torres-021',
            person1Id: 'torres-tio1',
            person2Id: 'torres-primo1',
            type: 'parent',
            strength: 0.8,
            description: 'Padre orgulloso del talento deportivo',
        },
        {
            id: 'rel-torres-022',
            person1Id: 'torres-tia1',
            person2Id: 'torres-prima1',
            type: 'parent',
            strength: 0.9,
            description: 'Conexión artística madre-hija',
        },

        // Hermanos directos
        {
            id: 'rel-torres-023',
            person1Id: 'torres-hijo1',
            person2Id: 'torres-hija1',
            type: 'sibling',
            strength: 0.75,
            description: 'Respeto mutuo entre hermanos diferentes',
        },
        {
            id: 'rel-torres-024',
            person1Id: 'torres-hijo1',
            person2Id: 'torres-hijo2',
            type: 'sibling',
            strength: 0.8,
            description: 'Hermano mayor mentor',
        },
        {
            id: 'rel-torres-025',
            person1Id: 'torres-hija1',
            person2Id: 'torres-hijo2',
            type: 'sibling',
            strength: 0.85,
            description: 'Hermana responsable que cuida al menor',
        },

        // Primos entre sí
        {
            id: 'rel-torres-026',
            person1Id: 'torres-hijo1',
            person2Id: 'torres-primo1',
            type: 'cousin',
            strength: 0.7,
            description: 'Primos de edades similares',
        },
        {
            id: 'rel-torres-027',
            person1Id: 'torres-hija1',
            person2Id: 'torres-primo1',
            type: 'cousin',
            strength: 0.6,
            description: 'Primos con personalidades diferentes',
        },
        {
            id: 'rel-torres-028',
            person1Id: 'torres-hija1',
            person2Id: 'torres-prima1',
            type: 'cousin',
            strength: 0.8,
            description: 'Primas que se apoyan mutuamente',
        },
        {
            id: 'rel-torres-029',
            person1Id: 'torres-hijo2',
            person2Id: 'torres-prima1',
            type: 'cousin',
            strength: 0.7,
            description: 'Primo y prima con buena relación',
        },

        // Relaciones especiales bisabuela-bisnietos
        {
            id: 'rel-torres-030',
            person1Id: 'torres-bisabuela',
            person2Id: 'torres-hijo1',
            type: 'grandparent',
            strength: 0.8,
            description: 'Bisabuela que entiende la rebeldía',
        },
        {
            id: 'rel-torres-031',
            person1Id: 'torres-bisabuela',
            person2Id: 'torres-hija1',
            type: 'grandparent',
            strength: 0.9,
            description: 'Admiración por la fortaleza de la bisnieta',
        },

        // Abuelos-nietos (algunas relaciones destacadas)
        {
            id: 'rel-torres-032',
            person1Id: 'torres-abuelo-p',
            person2Id: 'torres-hijo1',
            type: 'grandparent',
            strength: 0.6,
            description: 'Diferencias de opinión sobre el futuro',
        },
        {
            id: 'rel-torres-033',
            person1Id: 'torres-abuela-p',
            person2Id: 'torres-hija1',
            type: 'grandparent',
            strength: 0.9,
            description: 'Abuela orgullosa de la nieta responsable',
        },
        {
            id: 'rel-torres-034',
            person1Id: 'torres-abuelo-m',
            person2Id: 'torres-hijo2',
            type: 'grandparent',
            strength: 0.85,
            description: 'Compartiendo el amor por el conocimiento',
        },
    ],
    metadata: {
        createdAt: new Date('2024-01-15'),
        lastUpdated: new Date('2024-01-15'),
        version: '1.0.0',
        tags: [
            'multigeneracional',
            'compleja',
            'profesional',
            'tradicional-moderna',
        ],
        complexity: 'complex',
        educationalLevel: 'avanzado',
    },
};

// ============================================================================
// ARRAYS DE FAMILIAS POR COMPLEJIDAD
// ============================================================================

export const SIMPLE_FAMILIES: FamilyDataset[] = [FAMILIA_GARCIA, FAMILIA_LOPEZ];

export const MEDIUM_FAMILIES: FamilyDataset[] = [
    FAMILIA_RODRIGUEZ,
    FAMILIA_MARTINEZ,
];

export const COMPLEX_FAMILIES: FamilyDataset[] = [FAMILIA_TORRES];

export const ALL_FAMILIES: FamilyDataset[] = [
    ...SIMPLE_FAMILIES,
    ...MEDIUM_FAMILIES,
    ...COMPLEX_FAMILIES,
];

// ============================================================================
// FUNCIONES UTILITARIAS
// ============================================================================

/**
 * Obtener familias por nivel de complejidad
 */
export function getFamiliesByComplexity(
    complexity: 'simple' | 'medium' | 'complex'
): FamilyDataset[] {
    switch (complexity) {
        case 'simple':
            return SIMPLE_FAMILIES;
        case 'medium':
            return MEDIUM_FAMILIES;
        case 'complex':
            return COMPLEX_FAMILIES;
        default:
            return ALL_FAMILIES;
    }
}

/**
 * Obtener familias para una fase específica
 */
export function getFamiliesForPhase(phase: number): FamilyDataset[] {
    switch (phase) {
        case 1:
            return SIMPLE_FAMILIES;
        case 2:
            return [...SIMPLE_FAMILIES, ...MEDIUM_FAMILIES];
        case 3:
            return [...MEDIUM_FAMILIES, ...COMPLEX_FAMILIES];
        case 4:
            return ALL_FAMILIES;
        default:
            return ALL_FAMILIES;
    }
}

/**
 * Obtener familia por ID
 */
export function getFamilyById(id: string): FamilyDataset | undefined {
    return ALL_FAMILIES.find((family) => family.id === id);
}

/**
 * Buscar familias por tags
 */
export function searchFamiliesByTags(tags: string[]): FamilyDataset[] {
    return ALL_FAMILIES.filter((family) =>
        family.metadata?.tags?.some((tag) =>
            tags.some((searchTag) =>
                tag.toLowerCase().includes(searchTag.toLowerCase())
            )
        )
    );
}

/**
 * Obtener estadísticas de una familia
 */
export function getFamilyStatistics(family: FamilyDataset) {
    const members = family.members;
    const relationships = family.relationships;

    return {
        totalMembers: members.length,
        averageAge:
            members.reduce((sum, member) => sum + (member.age || 0), 0) /
            members.length,
        generations: calculateGenerations(family),
        relationshipDensity:
            relationships.length /
            ((members.length * (members.length - 1)) / 2),
        genderDistribution: {
            male: members.filter((m) => m.gender === 'male').length,
            female: members.filter((m) => m.gender === 'female').length,
            other: members.filter((m) => m.gender === 'other').length,
        },
        relationshipTypes: countRelationshipTypes(relationships),
        complexity: family.metadata?.complexity || 'unknown',
    };
}

/**
 * Calcular número de generaciones en una familia
 */
function calculateGenerations(family: FamilyDataset): number {
    const relationships = family.relationships;
    const parentChildRels = relationships.filter(
        (rel) => rel.type === 'parent' || rel.type === 'grandparent'
    );

    if (parentChildRels.length === 0) return 1;

    // Simplificación: contar niveles únicos basados en relaciones
    const generations = new Set<number>();

    // Agregar lógica más sofisticada aquí si es necesario
    if (parentChildRels.some((rel) => rel.type === 'grandparent')) {
        return 3; // Al menos 3 generaciones
    } else if (parentChildRels.some((rel) => rel.type === 'parent')) {
        return 2; // Al menos 2 generaciones
    }

    return 1;
}

/**
 * Contar tipos de relaciones
 */
function countRelationshipTypes(
    relationships: Relationship[]
): Record<RelationshipType, number> {
    const counts: Record<string, number> = {};

    relationships.forEach((rel) => {
        counts[rel.type] = (counts[rel.type] || 0) + 1;
    });

    return counts as Record<RelationshipType, number>;
}

/**
 * Generar familia aleatoria simple
 */
export function generateRandomSimpleFamily(): FamilyDataset {
    const id = `random-${Date.now()}`;
    const surnames = [
        'González',
        'Pérez',
        'Sánchez',
        'Ramírez',
        'Flores',
        'Cruz',
    ];
    const maleNames = ['Juan', 'Carlos', 'Luis', 'Miguel', 'Pedro', 'José'];
    const femaleNames = ['María', 'Ana', 'Carmen', 'Rosa', 'Elena', 'Isabel'];

    const surname = surnames[Math.floor(Math.random() * surnames.length)];
    const fatherName = maleNames[Math.floor(Math.random() * maleNames.length)];
    const motherName =
        femaleNames[Math.floor(Math.random() * femaleNames.length)];

    const members: FamilyMember[] = [
        {
            id: `${id}-father`,
            name: `${fatherName} ${surname}`,
            age: 35 + Math.floor(Math.random() * 15),
            gender: 'male',
            occupation: 'Trabajador',
            traits: ['responsable', 'trabajador'],
        },
        {
            id: `${id}-mother`,
            name: `${motherName} ${surname}`,
            age: 30 + Math.floor(Math.random() * 15),
            gender: 'female',
            occupation: 'Trabajadora',
            traits: ['cariñosa', 'organizada'],
        },
    ];

    const numChildren = 1 + Math.floor(Math.random() * 3); // 1-3 hijos

    for (let i = 0; i < numChildren; i++) {
        const isGirl = Math.random() > 0.5;
        const childNames = isGirl ? femaleNames : maleNames;
        const childName =
            childNames[Math.floor(Math.random() * childNames.length)];

        members.push({
            id: `${id}-child-${i + 1}`,
            name: `${childName} ${surname}`,
            age: 5 + Math.floor(Math.random() * 15),
            gender: isGirl ? 'female' : 'male',
            occupation: 'Estudiante',
            traits: ['estudioso', 'alegre'],
        });
    }

    const relationships: Relationship[] = [
        {
            id: `${id}-rel-1`,
            person1Id: `${id}-father`,
            person2Id: `${id}-mother`,
            type: 'spouse',
            strength: 0.8 + Math.random() * 0.2,
            description: 'Matrimonio',
        },
    ];

    // Agregar relaciones padre-hijo y madre-hijo
    for (let i = 0; i < numChildren; i++) {
        relationships.push(
            {
                id: `${id}-rel-father-${i + 1}`,
                person1Id: `${id}-father`,
                person2Id: `${id}-child-${i + 1}`,
                type: 'parent',
                strength: 0.7 + Math.random() * 0.3,
                description: 'Relación padre-hijo',
            },
            {
                id: `${id}-rel-mother-${i + 1}`,
                person1Id: `${id}-mother`,
                person2Id: `${id}-child-${i + 1}`,
                type: 'parent',
                strength: 0.7 + Math.random() * 0.3,
                description: 'Relación madre-hijo',
            }
        );
    }

    // Agregar relaciones entre hermanos
    for (let i = 0; i < numChildren - 1; i++) {
        for (let j = i + 1; j < numChildren; j++) {
            relationships.push({
                id: `${id}-rel-sibling-${i + 1}-${j + 1}`,
                person1Id: `${id}-child-${i + 1}`,
                person2Id: `${id}-child-${j + 1}`,
                type: 'sibling',
                strength: 0.6 + Math.random() * 0.4,
                description: 'Hermanos',
            });
        }
    }

    return {
        id,
        name: `Familia ${surname}`,
        description: `Familia generada aleatoriamente con ${numChildren} hijo(s)`,
        members,
        relationships,
        metadata: {
            createdAt: new Date(),
            lastUpdated: new Date(),
            version: '1.0.0',
            tags: ['generada', 'simple', 'aleatoria'],
            complexity: 'simple',
            educationalLevel: 'básico',
        },
    };
}

// ============================================================================
// EXPORTACIONES PRINCIPALES
// ============================================================================

export default ALL_FAMILIES;
