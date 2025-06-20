// data/familyDatasets.ts

import { Family, FamilyDataset } from '../types/relationships';

export const ALL_FAMILIES: Family[] = [
    {
        id: 'family-1-simple',
        name: 'Familia García',
        description: 'Una familia nuclear simple con padres e hijos',
        complexity: 'basic',
        members: [
            {
                id: 'carlos-garcia',
                name: 'Carlos García',
                age: 42,
                gender: 'male',
                generation: 1,
                position: [0, 0, 0],
                relationships: ['maria-garcia', 'sofia-garcia', 'diego-garcia'],
            },
            {
                id: 'maria-garcia',
                name: 'María García',
                age: 38,
                gender: 'female',
                generation: 1,
                position: [2, 0, 0],
                relationships: [
                    'carlos-garcia',
                    'sofia-garcia',
                    'diego-garcia',
                ],
            },
            {
                id: 'sofia-garcia',
                name: 'Sofía García',
                age: 16,
                gender: 'female',
                generation: 2,
                position: [0, -2, 0],
                relationships: [
                    'carlos-garcia',
                    'maria-garcia',
                    'diego-garcia',
                ],
            },
            {
                id: 'diego-garcia',
                name: 'Diego García',
                age: 12,
                gender: 'male',
                generation: 2,
                position: [2, -2, 0],
                relationships: [
                    'carlos-garcia',
                    'maria-garcia',
                    'sofia-garcia',
                ],
            },
        ],
        relationships: [
            {
                id: 'rel-1',
                type: 'spouse',
                from: 'carlos-garcia',
                to: 'maria-garcia',
                strength: 1.0,
                verified: true,
            },
            {
                id: 'rel-2',
                type: 'parent',
                from: 'carlos-garcia',
                to: 'sofia-garcia',
                strength: 1.0,
                verified: true,
            },
            {
                id: 'rel-3',
                type: 'parent',
                from: 'carlos-garcia',
                to: 'diego-garcia',
                strength: 1.0,
                verified: true,
            },
            {
                id: 'rel-4',
                type: 'parent',
                from: 'maria-garcia',
                to: 'sofia-garcia',
                strength: 1.0,
                verified: true,
            },
            {
                id: 'rel-5',
                type: 'parent',
                from: 'maria-garcia',
                to: 'diego-garcia',
                strength: 1.0,
                verified: true,
            },
            {
                id: 'rel-6',
                type: 'sibling',
                from: 'sofia-garcia',
                to: 'diego-garcia',
                strength: 0.9,
                verified: true,
            },
        ],
        suggestedPatterns: [
            'linear_sum',
            'age_difference',
            'generation_pattern',
        ],
    },
    {
        id: 'family-2-extended',
        name: 'Familia Rodríguez',
        description: 'Familia extendida con tres generaciones',
        complexity: 'intermediate',
        members: [
            {
                id: 'abuelo-rodriguez',
                name: 'Roberto Rodríguez',
                age: 78,
                gender: 'male',
                generation: 0,
                position: [1, 2, 0],
                relationships: [
                    'abuela-rodriguez',
                    'padre-rodriguez',
                    'tia-rodriguez',
                ],
            },
            {
                id: 'abuela-rodriguez',
                name: 'Carmen Rodríguez',
                age: 75,
                gender: 'female',
                generation: 0,
                position: [3, 2, 0],
                relationships: [
                    'abuelo-rodriguez',
                    'padre-rodriguez',
                    'tia-rodriguez',
                ],
            },
            {
                id: 'padre-rodriguez',
                name: 'Miguel Rodríguez',
                age: 45,
                gender: 'male',
                generation: 1,
                position: [0, 0, 0],
                relationships: [
                    'madre-rodriguez',
                    'hijo1-rodriguez',
                    'hijo2-rodriguez',
                ],
            },
            {
                id: 'madre-rodriguez',
                name: 'Ana Rodríguez',
                age: 43,
                gender: 'female',
                generation: 1,
                position: [2, 0, 0],
                relationships: [
                    'padre-rodriguez',
                    'hijo1-rodriguez',
                    'hijo2-rodriguez',
                ],
            },
            {
                id: 'tia-rodriguez',
                name: 'Elena Rodríguez',
                age: 40,
                gender: 'female',
                generation: 1,
                position: [4, 0, 0],
                relationships: ['primo-rodriguez'],
            },
            {
                id: 'hijo1-rodriguez',
                name: 'Andrés Rodríguez',
                age: 18,
                gender: 'male',
                generation: 2,
                position: [0, -2, 0],
                relationships: [
                    'padre-rodriguez',
                    'madre-rodriguez',
                    'hijo2-rodriguez',
                    'primo-rodriguez',
                ],
            },
            {
                id: 'hijo2-rodriguez',
                name: 'Lucía Rodríguez',
                age: 14,
                gender: 'female',
                generation: 2,
                position: [2, -2, 0],
                relationships: [
                    'padre-rodriguez',
                    'madre-rodriguez',
                    'hijo1-rodriguez',
                    'primo-rodriguez',
                ],
            },
            {
                id: 'primo-rodriguez',
                name: 'Javier Rodríguez',
                age: 16,
                gender: 'male',
                generation: 2,
                position: [4, -2, 0],
                relationships: [
                    'tia-rodriguez',
                    'hijo1-rodriguez',
                    'hijo2-rodriguez',
                ],
            },
        ],
        relationships: [
            // Generación 0
            {
                id: 'rel-r1',
                type: 'spouse',
                from: 'abuelo-rodriguez',
                to: 'abuela-rodriguez',
                strength: 1.0,
                verified: true,
            },

            // Generación 0 a 1
            {
                id: 'rel-r2',
                type: 'parent',
                from: 'abuelo-rodriguez',
                to: 'padre-rodriguez',
                strength: 1.0,
                verified: true,
            },
            {
                id: 'rel-r3',
                type: 'parent',
                from: 'abuela-rodriguez',
                to: 'padre-rodriguez',
                strength: 1.0,
                verified: true,
            },
            {
                id: 'rel-r4',
                type: 'parent',
                from: 'abuelo-rodriguez',
                to: 'tia-rodriguez',
                strength: 1.0,
                verified: true,
            },
            {
                id: 'rel-r5',
                type: 'parent',
                from: 'abuela-rodriguez',
                to: 'tia-rodriguez',
                strength: 1.0,
                verified: true,
            },

            // Generación 1
            {
                id: 'rel-r6',
                type: 'spouse',
                from: 'padre-rodriguez',
                to: 'madre-rodriguez',
                strength: 1.0,
                verified: true,
            },
            {
                id: 'rel-r7',
                type: 'sibling',
                from: 'padre-rodriguez',
                to: 'tia-rodriguez',
                strength: 0.8,
                verified: true,
            },

            // Generación 1 a 2
            {
                id: 'rel-r8',
                type: 'parent',
                from: 'padre-rodriguez',
                to: 'hijo1-rodriguez',
                strength: 1.0,
                verified: true,
            },
            {
                id: 'rel-r9',
                type: 'parent',
                from: 'madre-rodriguez',
                to: 'hijo1-rodriguez',
                strength: 1.0,
                verified: true,
            },
            {
                id: 'rel-r10',
                type: 'parent',
                from: 'padre-rodriguez',
                to: 'hijo2-rodriguez',
                strength: 1.0,
                verified: true,
            },
            {
                id: 'rel-r11',
                type: 'parent',
                from: 'madre-rodriguez',
                to: 'hijo2-rodriguez',
                strength: 1.0,
                verified: true,
            },
            {
                id: 'rel-r12',
                type: 'parent',
                from: 'tia-rodriguez',
                to: 'primo-rodriguez',
                strength: 1.0,
                verified: true,
            },

            // Generación 2
            {
                id: 'rel-r13',
                type: 'sibling',
                from: 'hijo1-rodriguez',
                to: 'hijo2-rodriguez',
                strength: 0.9,
                verified: true,
            },
        ],
        suggestedPatterns: [
            'generation_pattern',
            'extended_family',
            'sibling_groups',
            'age_difference',
        ],
    },
    {
        id: 'family-3-mathematical',
        name: 'Familia Fibonacci',
        description:
            'Familia con edades que siguen patrones matemáticos específicos',
        complexity: 'advanced',
        members: [
            {
                id: 'fib-1',
                name: 'Luis Fibonacci',
                age: 55,
                gender: 'male',
                generation: 1,
                position: [0, 0, 0],
                relationships: ['fib-2', 'fib-3', 'fib-4', 'fib-5'],
            },
            {
                id: 'fib-2',
                name: 'Sara Fibonacci',
                age: 34,
                gender: 'female',
                generation: 1,
                position: [2, 0, 0],
                relationships: ['fib-1', 'fib-3', 'fib-4', 'fib-5'],
            },
            {
                id: 'fib-3',
                name: 'Pablo Fibonacci',
                age: 21,
                gender: 'male',
                generation: 2,
                position: [0, -2, 0],
                relationships: ['fib-1', 'fib-2', 'fib-4', 'fib-5'],
            },
            {
                id: 'fib-4',
                name: 'Clara Fibonacci',
                age: 13,
                gender: 'female',
                generation: 2,
                position: [2, -2, 0],
                relationships: ['fib-1', 'fib-2', 'fib-3', 'fib-5'],
            },
            {
                id: 'fib-5',
                name: 'Emma Fibonacci',
                age: 8,
                gender: 'female',
                generation: 2,
                position: [4, -2, 0],
                relationships: ['fib-1', 'fib-2', 'fib-3', 'fib-4'],
            },
        ],
        relationships: [
            {
                id: 'rel-f1',
                type: 'spouse',
                from: 'fib-1',
                to: 'fib-2',
                strength: 1.0,
                verified: true,
            },
            {
                id: 'rel-f2',
                type: 'parent',
                from: 'fib-1',
                to: 'fib-3',
                strength: 1.0,
                verified: true,
            },
            {
                id: 'rel-f3',
                type: 'parent',
                from: 'fib-2',
                to: 'fib-3',
                strength: 1.0,
                verified: true,
            },
            {
                id: 'rel-f4',
                type: 'parent',
                from: 'fib-1',
                to: 'fib-4',
                strength: 1.0,
                verified: true,
            },
            {
                id: 'rel-f5',
                type: 'parent',
                from: 'fib-2',
                to: 'fib-4',
                strength: 1.0,
                verified: true,
            },
            {
                id: 'rel-f6',
                type: 'parent',
                from: 'fib-1',
                to: 'fib-5',
                strength: 1.0,
                verified: true,
            },
            {
                id: 'rel-f7',
                type: 'parent',
                from: 'fib-2',
                to: 'fib-5',
                strength: 1.0,
                verified: true,
            },
            {
                id: 'rel-f8',
                type: 'sibling',
                from: 'fib-3',
                to: 'fib-4',
                strength: 0.9,
                verified: true,
            },
            {
                id: 'rel-f9',
                type: 'sibling',
                from: 'fib-4',
                to: 'fib-5',
                strength: 0.9,
                verified: true,
            },
            {
                id: 'rel-f10',
                type: 'sibling',
                from: 'fib-3',
                to: 'fib-5',
                strength: 0.8,
                verified: true,
            },
        ],
        suggestedPatterns: [
            'linear_sum',
            'age_difference',
            'mathematical_sequence',
        ],
    },
    // ... más familias con diferentes patrones y complejidades
];

// Familias adicionales para completar el dataset de 20 familias
const ADDITIONAL_FAMILIES: Family[] = [
    {
        id: 'family-4-arithmetic',
        name: 'Familia Aritmética',
        description: 'Edades siguen progresión aritmética',
        complexity: 'intermediate',
        members: [
            {
                id: 'ar-1',
                name: 'Pedro Suma',
                age: 50,
                gender: 'male',
                generation: 1,
                position: [0, 0, 0],
                relationships: ['ar-2', 'ar-3', 'ar-4'],
            },
            {
                id: 'ar-2',
                name: 'Laura Suma',
                age: 45,
                gender: 'female',
                generation: 1,
                position: [2, 0, 0],
                relationships: ['ar-1', 'ar-3', 'ar-4'],
            },
            {
                id: 'ar-3',
                name: 'Carlos Suma',
                age: 20,
                gender: 'male',
                generation: 2,
                position: [0, -2, 0],
                relationships: ['ar-1', 'ar-2', 'ar-4'],
            },
            {
                id: 'ar-4',
                name: 'Ana Suma',
                age: 15,
                gender: 'female',
                generation: 2,
                position: [2, -2, 0],
                relationships: ['ar-1', 'ar-2', 'ar-3'],
            },
        ],
        relationships: [
            {
                id: 'rel-ar1',
                type: 'spouse',
                from: 'ar-1',
                to: 'ar-2',
                strength: 1.0,
                verified: true,
            },
            {
                id: 'rel-ar2',
                type: 'parent',
                from: 'ar-1',
                to: 'ar-3',
                strength: 1.0,
                verified: true,
            },
            {
                id: 'rel-ar3',
                type: 'parent',
                from: 'ar-2',
                to: 'ar-3',
                strength: 1.0,
                verified: true,
            },
            {
                id: 'rel-ar4',
                type: 'parent',
                from: 'ar-1',
                to: 'ar-4',
                strength: 1.0,
                verified: true,
            },
            {
                id: 'rel-ar5',
                type: 'parent',
                from: 'ar-2',
                to: 'ar-4',
                strength: 1.0,
                verified: true,
            },
            {
                id: 'rel-ar6',
                type: 'sibling',
                from: 'ar-3',
                to: 'ar-4',
                strength: 0.9,
                verified: true,
            },
        ],
        suggestedPatterns: [
            'linear_sum',
            'age_difference',
            'arithmetic_progression',
        ],
    },
    {
        id: 'family-5-geometric',
        name: 'Familia Geométrica',
        description: 'Relaciones familiares con patrones geométricos',
        complexity: 'advanced',
        members: [
            {
                id: 'geo-1',
                name: 'Roberto Círculo',
                age: 64,
                gender: 'male',
                generation: 1,
                position: [0, 0, 0],
                relationships: ['geo-2', 'geo-3', 'geo-4'],
            },
            {
                id: 'geo-2',
                name: 'María Círculo',
                age: 32,
                gender: 'female',
                generation: 1,
                position: [2, 0, 0],
                relationships: ['geo-1', 'geo-3', 'geo-4'],
            },
            {
                id: 'geo-3',
                name: 'Juan Círculo',
                age: 16,
                gender: 'male',
                generation: 2,
                position: [0, -2, 0],
                relationships: ['geo-1', 'geo-2', 'geo-4'],
            },
            {
                id: 'geo-4',
                name: 'Sofía Círculo',
                age: 8,
                gender: 'female',
                generation: 2,
                position: [2, -2, 0],
                relationships: ['geo-1', 'geo-2', 'geo-3'],
            },
        ],
        relationships: [
            {
                id: 'rel-geo1',
                type: 'spouse',
                from: 'geo-1',
                to: 'geo-2',
                strength: 1.0,
                verified: true,
            },
            {
                id: 'rel-geo2',
                type: 'parent',
                from: 'geo-1',
                to: 'geo-3',
                strength: 1.0,
                verified: true,
            },
            {
                id: 'rel-geo3',
                type: 'parent',
                from: 'geo-2',
                to: 'geo-3',
                strength: 1.0,
                verified: true,
            },
            {
                id: 'rel-geo4',
                type: 'parent',
                from: 'geo-1',
                to: 'geo-4',
                strength: 1.0,
                verified: true,
            },
            {
                id: 'rel-geo5',
                type: 'parent',
                from: 'geo-2',
                to: 'geo-4',
                strength: 1.0,
                verified: true,
            },
            {
                id: 'rel-geo6',
                type: 'sibling',
                from: 'geo-3',
                to: 'geo-4',
                strength: 0.9,
                verified: true,
            },
        ],
        suggestedPatterns: [
            'geometric_progression',
            'age_difference',
            'generation_pattern',
        ],
    },
];

// Generar 13 familias más con variaciones sistemáticas
const generateAdditionalFamilies = (): Family[] => {
    const families: Family[] = [];

    for (let i = 6; i <= 20; i++) {
        const familyId = `family-${i}-variation`;
        const baseAge = 30 + i * 2;
        const agePattern = i % 3; // 0: linear, 1: fibonacci-like, 2: geometric

        let ages: number[] = [];
        switch (agePattern) {
            case 0: // Linear progression
                ages = [baseAge + 20, baseAge + 15, baseAge - 10, baseAge - 15];
                break;
            case 1: // Fibonacci-like
                ages = [baseAge + 18, baseAge + 12, baseAge - 8, baseAge - 20];
                break;
            case 2: // Geometric-like
                ages = [baseAge + 24, baseAge + 12, baseAge - 6, baseAge - 18];
                break;
        }

        families.push({
            id: familyId,
            name: `Familia Patrón ${i}`,
            description: `Familia con patrón matemático tipo ${agePattern}`,
            complexity:
                i <= 10 ? 'basic' : i <= 15 ? 'intermediate' : 'advanced',
            members: [
                {
                    id: `${familyId}-p1`,
                    name: `Padre ${i}`,
                    age: ages[0],
                    gender: 'male',
                    generation: 1,
                    position: [0, 0, 0],
                    relationships: [
                        `${familyId}-p2`,
                        `${familyId}-c1`,
                        `${familyId}-c2`,
                    ],
                },
                {
                    id: `${familyId}-p2`,
                    name: `Madre ${i}`,
                    age: ages[1],
                    gender: 'female',
                    generation: 1,
                    position: [2, 0, 0],
                    relationships: [
                        `${familyId}-p1`,
                        `${familyId}-c1`,
                        `${familyId}-c2`,
                    ],
                },
                {
                    id: `${familyId}-c1`,
                    name: `Hijo ${i}`,
                    age: ages[2],
                    gender: i % 2 === 0 ? 'male' : 'female',
                    generation: 2,
                    position: [0, -2, 0],
                    relationships: [
                        `${familyId}-p1`,
                        `${familyId}-p2`,
                        `${familyId}-c2`,
                    ],
                },
                {
                    id: `${familyId}-c2`,
                    name: `Hija ${i}`,
                    age: ages[3],
                    gender: i % 2 === 0 ? 'female' : 'male',
                    generation: 2,
                    position: [2, -2, 0],
                    relationships: [
                        `${familyId}-p1`,
                        `${familyId}-p2`,
                        `${familyId}-c1`,
                    ],
                },
            ],
            relationships: [
                {
                    id: `rel-${familyId}-1`,
                    type: 'spouse',
                    from: `${familyId}-p1`,
                    to: `${familyId}-p2`,
                    strength: 1.0,
                    verified: true,
                },
                {
                    id: `rel-${familyId}-2`,
                    type: 'parent',
                    from: `${familyId}-p1`,
                    to: `${familyId}-c1`,
                    strength: 1.0,
                    verified: true,
                },
                {
                    id: `rel-${familyId}-3`,
                    type: 'parent',
                    from: `${familyId}-p2`,
                    to: `${familyId}-c1`,
                    strength: 1.0,
                    verified: true,
                },
                {
                    id: `rel-${familyId}-4`,
                    type: 'parent',
                    from: `${familyId}-p1`,
                    to: `${familyId}-c2`,
                    strength: 1.0,
                    verified: true,
                },
                {
                    id: `rel-${familyId}-5`,
                    type: 'parent',
                    from: `${familyId}-p2`,
                    to: `${familyId}-c2`,
                    strength: 1.0,
                    verified: true,
                },
                {
                    id: `rel-${familyId}-6`,
                    type: 'sibling',
                    from: `${familyId}-c1`,
                    to: `${familyId}-c2`,
                    strength: 0.9,
                    verified: true,
                },
            ],
            suggestedPatterns:
                agePattern === 0
                    ? ['linear_sum', 'age_difference']
                    : agePattern === 1
                      ? ['mathematical_sequence', 'age_difference']
                      : ['geometric_progression', 'generation_pattern'],
        });
    }

    return families;
};

// Combinar todas las familias
const COMPLETE_FAMILIES = [
    ...ALL_FAMILIES,
    ...ADDITIONAL_FAMILIES,
    ...generateAdditionalFamilies(),
];

export const FAMILY_DATASET: FamilyDataset = {
    families: COMPLETE_FAMILIES,
    totalMembers: COMPLETE_FAMILIES.reduce(
        (sum, family) => sum + family.members.length,
        0
    ),
    averageComplexity:
        COMPLETE_FAMILIES.filter((f) => f.complexity === 'intermediate')
            .length / COMPLETE_FAMILIES.length,
    availablePatterns: [
        'linear_sum',
        'age_difference',
        'generation_pattern',
        'sibling_groups',
        'parent_child_ratio',
        'gender_distribution',
        'marriage_patterns',
        'extended_family',
        'arithmetic_progression',
        'geometric_progression',
        'mathematical_sequence',
    ],
};

export const getFamiliesByComplexity = (
    complexity: 'basic' | 'intermediate' | 'advanced'
) => {
    return COMPLETE_FAMILIES.filter(
        (family) => family.complexity === complexity
    );
};

export const getFamilyById = (id: string) => {
    return COMPLETE_FAMILIES.find((family) => family.id === id);
};

export const getRandomFamily = () => {
    const randomIndex = Math.floor(Math.random() * COMPLETE_FAMILIES.length);
    return COMPLETE_FAMILIES[randomIndex];
};

export const getFamiliesByPattern = (pattern: string) => {
    return COMPLETE_FAMILIES.filter((family) =>
        family.suggestedPatterns.includes(pattern)
    );
};

export { COMPLETE_FAMILIES as ALL_FAMILIES };
export default FAMILY_DATASET;
