// apps/course-arithmetic/src/modules/fundamentos-aplicados/semana-01-operaciones-basicas/data/algorithmBlocks.ts

import type {
  AlgorithmBlock,
  BlockInput,
  BlockOutput,
  BlockParameter,
  ValidationResult as RelationshipValidationResult
} from '../types/relationships';

// Tipo local para evitar conflicto
interface LocalValidationResult {
  isValid: boolean;
  message: string;
  suggestions?: string[];
}

// Bloques de entrada
const INPUT_BLOCKS: AlgorithmBlock[] = [
  {
    id: 'input_family_data',
    type: 'input',
    name: 'Datos de Familia',
    description: 'Entrada de información familiar',
    category: 'input',
    inputs: [],
    outputs: [
      {
        id: 'family_output',
        name: 'Familia',
        type: 'object',
        description: 'Objeto familia con personas y relaciones'
      }
    ],
    parameters: [
      {
        id: 'family_selector',
        name: 'Seleccionar Familia',
        type: 'select',
        defaultValue: 'family_1',
        options: ['family_1', 'family_2', 'family_3'],
        description: 'Familia a analizar'
      }
    ]
  },
  {
    id: 'input_person_data',
    type: 'input',
    name: 'Datos de Persona',
    description: 'Entrada de información de una persona específica',
    category: 'input',
    inputs: [],
    outputs: [
      {
        id: 'person_output',
        name: 'Persona',
        type: 'object',
        description: 'Objeto persona con propiedades'
      }
    ],
    parameters: [
      {
        id: 'person_selector',
        name: 'Seleccionar Persona',
        type: 'select',
        defaultValue: '',
        options: [],
        description: 'Persona específica a analizar'
      }
    ]
  }
];

// Bloques de procesamiento
const PROCESS_BLOCKS: AlgorithmBlock[] = [
  {
    id: 'process_count_members',
    type: 'process',
    name: 'Contar Miembros',
    description: 'Cuenta el número total de miembros en la familia',
    category: 'analysis',
    inputs: [
      {
        id: 'family_input',
        name: 'Familia',
        type: 'object',
        required: true,
        description: 'Familia a analizar'
      }
    ],
    outputs: [
      {
        id: 'count_output',
        name: 'Cantidad',
        type: 'number',
        description: 'Número de miembros'
      }
    ],
    parameters: [],
    code: `
      function countMembers(family) {
        return family.people ? family.people.length : 0;
      }
    `
  },
  {
    id: 'process_find_parents',
    type: 'process',
    name: 'Encontrar Padres',
    description: 'Identifica los padres en la familia',
    category: 'analysis',
    inputs: [
      {
        id: 'family_input',
        name: 'Familia',
        type: 'object',
        required: true,
        description: 'Familia a analizar'
      }
    ],
    outputs: [
      {
        id: 'parents_output',
        name: 'Padres',
        type: 'array',
        description: 'Lista de padres'
      }
    ],
    parameters: [],
    code: `
      function findParents(family) {
        return family.people.filter(person => 
          person.role === 'father' || person.role === 'mother'
        );
      }
    `
  },
  {
    id: 'process_analyze_relationships',
    type: 'process',
    name: 'Analizar Relaciones',
    description: 'Analiza los tipos de relaciones en la familia',
    category: 'analysis',
    inputs: [
      {
        id: 'family_input',
        name: 'Familia',
        type: 'object',
        required: true,
        description: 'Familia a analizar'
      }
    ],
    outputs: [
      {
        id: 'analysis_output',
        name: 'Análisis',
        type: 'object',
        description: 'Análisis de relaciones'
      }
    ],
    parameters: [
      {
        id: 'analysis_type',
        name: 'Tipo de Análisis',
        type: 'select',
        defaultValue: 'basic',
        options: ['basic', 'detailed', 'statistical'],
        description: 'Nivel de detalle del análisis'
      }
    ],
    code: `
      function analyzeRelationships(family, analysisType = 'basic') {
        const analysis = {
          totalRelationships: family.relationships.length,
          types: {}
        };
        
        family.relationships.forEach(rel => {
          analysis.types[rel.type] = (analysis.types[rel.type] || 0) + 1;
        });
        
        return analysis;
      }
    `
  }
];

// Bloques de salida
const OUTPUT_BLOCKS: AlgorithmBlock[] = [
  {
    id: 'output_display_result',
    type: 'output',
    name: 'Mostrar Resultado',
    description: 'Muestra el resultado del análisis',
    category: 'output',
    inputs: [
      {
        id: 'result_input',
        name: 'Resultado',
        type: 'object',
        required: true,
        description: 'Resultado a mostrar'
      }
    ],
    outputs: [],
    parameters: [
      {
        id: 'display_format',
        name: 'Formato',
        type: 'select',
        defaultValue: 'table',
        options: ['table', 'chart', 'text'],
        description: 'Formato de visualización'
      }
    ]
  },
  {
    id: 'output_generate_report',
    type: 'output',
    name: 'Generar Reporte',
    description: 'Genera un reporte detallado',
    category: 'output',
    inputs: [
      {
        id: 'data_input',
        name: 'Datos',
        type: 'object',
        required: true,
        description: 'Datos para el reporte'
      }
    ],
    outputs: [],
    parameters: [
      {
        id: 'report_type',
        name: 'Tipo de Reporte',
        type: 'select',
        defaultValue: 'summary',
        options: ['summary', 'detailed', 'statistical'],
        description: 'Tipo de reporte a generar'
      }
    ]
  }
];

// Bloques de condición
const CONDITION_BLOCKS: AlgorithmBlock[] = [
  {
    id: 'condition_family_size',
    type: 'condition',
    name: 'Tamaño de Familia',
    description: 'Evalúa si la familia cumple criterios de tamaño',
    category: 'logic',
    inputs: [
      {
        id: 'family_input',
        name: 'Familia',
        type: 'object',
        required: true,
        description: 'Familia a evaluar'
      }
    ],
    outputs: [
      {
        id: 'condition_output',
        name: 'Resultado',
        type: 'boolean',
        description: 'Verdadero si cumple la condición'
      }
    ],
    parameters: [
      {
        id: 'min_members',
        name: 'Mínimo de Miembros',
        type: 'number',
        defaultValue: 3,
        description: 'Número mínimo de miembros'
      },
      {
        id: 'max_members',
        name: 'Máximo de Miembros',
        type: 'number',
        defaultValue: 10,
        description: 'Número máximo de miembros'
      }
    ],
    code: `
      function checkFamilySize(family, minMembers = 3, maxMembers = 10) {
        const size = family.people.length;
        return size >= minMembers && size <= maxMembers;
      }
    `
  }
];

// Todos los bloques disponibles
export const AVAILABLE_BLOCKS: AlgorithmBlock[] = [
  ...INPUT_BLOCKS,
  ...PROCESS_BLOCKS,
  ...OUTPUT_BLOCKS,
  ...CONDITION_BLOCKS
];

// Función para obtener bloques por categoría
export function getBlocksByCategory(category: string): AlgorithmBlock[] {
  return AVAILABLE_BLOCKS.filter(block => block.category === category);
}

// Función para obtener bloques por tipo
export function getBlocksByType(type: AlgorithmBlock['type']): AlgorithmBlock[] {
  return AVAILABLE_BLOCKS.filter(block => block.type === type);
}

// Función para validar un bloque
export function validateBlock(block: AlgorithmBlock): LocalValidationResult {
  if (!block.id || !block.name) {
    return {
      isValid: false,
      message: 'El bloque debe tener ID y nombre',
      suggestions: ['Asigna un ID único', 'Proporciona un nombre descriptivo']
    };
  }

  if (block.type === 'input' && block.inputs.length > 0) {
    return {
      isValid: false,
      message: 'Los bloques de entrada no deben tener inputs',
      suggestions: ['Elimina las entradas del bloque input']
    };
  }

  if (block.type === 'output' && block.outputs.length > 0) {
    return {
      isValid: false,
      message: 'Los bloques de salida no deben tener outputs',
      suggestions: ['Elimina las salidas del bloque output']
    };
  }

  return {
    isValid: true,
    message: 'Bloque válido'
  };
}

// Función para obtener bloque por ID
export function getBlockById(id: string): AlgorithmBlock | undefined {
  return AVAILABLE_BLOCKS.find(block => block.id === id);
}

// Plantillas de algoritmos predefinidas
export const ALGORITHM_TEMPLATES = [
  {
    id: 'template_basic_analysis',
    name: 'Análisis Básico de Familia',
    description: 'Plantilla para análisis básico de estructura familiar',
    category: 'basic',
    blocks: [
      'input_family_data',
      'process_count_members',
      'process_find_parents',
      'output_display_result'
    ],
    connections: [
      {
        id: 'conn_1',
        fromBlockId: 'input_family_data',
        fromOutputId: 'family_output',
        toBlockId: 'process_count_members',
        toInputId: 'family_input'
      },
      {
        id: 'conn_2',
        fromBlockId: 'input_family_data',
        fromOutputId: 'family_output',
        toBlockId: 'process_find_parents',
        toInputId: 'family_input'
      }
    ],
    isStarterTemplate: true
  }
];

// Categorías de bloques
export const BLOCK_CATEGORIES = [
  {
    id: 'input',
    name: 'Entrada',
    description: 'Bloques para ingresar datos',
    color: '#3B82F6'
  },
  {
    id: 'analysis',
    name: 'Análisis',
    description: 'Bloques para procesar y analizar datos',
    color: '#10B981'
  },
  {
    id: 'logic',
    name: 'Lógica',
    description: 'Bloques para evaluaciones condicionales',
    color: '#F59E0B'
  },
  {
    id: 'output',
    name: 'Salida',
    description: 'Bloques para mostrar resultados',
    color: '#EF4444'
  }
];

export default AVAILABLE_BLOCKS;