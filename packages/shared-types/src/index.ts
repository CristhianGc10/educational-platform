// 📝 Shared TypeScript Types
export const version = '1.0.0';

// Tipos base del usuario
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}

// Tipos base del curso
export interface Course {
    id: string;
    name: string;
    description: string;
    modules: Module[];
}

export interface Module {
    id: string;
    name: string;
    description: string;
    weeks: Week[];
}

export interface Week {
    id: string;
    name: string;
    description: string;
    exercises: Exercise[];
}

// Tipos base de ejercicios
export interface Exercise {
    id: string;
    type: 'calculation' | 'conceptual' | 'applied' | 'abstract';
    difficulty: 1 | 2 | 3 | 4 | 5;
    question: string;
    correctAnswer: string;
    hints: string[];
}

// Tipos de progreso
export interface Progress {
    userId: string;
    courseId: string;
    moduleId: string;
    weekId: string;
    completedExercises: string[];
    masteryLevel: 0 | 1 | 2 | 3 | 4;
    lastActivity: Date;
}
