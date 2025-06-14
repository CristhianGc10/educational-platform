import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
    try {
        console.log('🌱 Iniciando seed de la base de datos...');

        // ===== CREAR CURSO DE ARITMÉTICA =====
        const arithmeticCourse = await prisma.course.upsert({
            where: { slug: 'arithmetic' },
            update: {},
            create: {
                slug: 'arithmetic',
                title: 'Aritmética Aplicada',
                description:
                    'Curso completo de aritmética con aplicaciones del mundo real',
                order: 1,
                isActive: true,
            },
        });

        console.log('📚 Curso de Aritmética creado:', arithmeticCourse.title);

        // ===== CREAR MÓDULO: FINANZAS Y COMERCIO =====
        const finanzasModule = await prisma.module.upsert({
            where: {
                courseId_slug: {
                    courseId: arithmeticCourse.id,
                    slug: 'finanzas-comercio',
                },
            },
            update: {},
            create: {
                courseId: arithmeticCourse.id,
                slug: 'finanzas-comercio',
                title: 'Finanzas y Comercio',
                description:
                    'Aplicaciones de aritmética en finanzas y comercio',
                order: 2,
            },
        });

        console.log('📖 Módulo creado:', finanzasModule.title);

        // ===== CREAR SEMANA 6: PORCENTAJES AVANZADOS =====
        const week6 = await prisma.week.upsert({
            where: {
                moduleId_slug: {
                    moduleId: finanzasModule.id,
                    slug: 'semana-06-porcentajes-avanzados',
                },
            },
            update: {},
            create: {
                moduleId: finanzasModule.id,
                slug: 'semana-06-porcentajes-avanzados',
                title: 'Porcentajes Avanzados',
                description:
                    'Cálculos avanzados de porcentajes con aplicaciones comerciales',
                order: 6,
            },
        });

        console.log('📅 Semana creada:', week6.title);

        // ===== CREAR EJERCICIOS DE EJEMPLO =====
        const exercise1 = await prisma.exercise.upsert({
            where: {
                weekId_slug: {
                    weekId: week6.id,
                    slug: 'calculadora-porcentajes-3d',
                },
            },
            update: {},
            create: {
                weekId: week6.id,
                slug: 'calculadora-porcentajes-3d',
                title: 'Calculadora de Porcentajes 3D',
                type: 'CALCULATOR_3D',
                difficulty: 'INTERMEDIATE',
                order: 1,
                content: JSON.stringify({
                    description:
                        'Calcula porcentajes usando la calculadora 3D interactiva',
                    examples: [
                        { problem: '¿Cuál es el 25% de 200?', answer: 50 },
                        {
                            problem: '¿Qué porcentaje es 30 de 120?',
                            answer: 25,
                        },
                    ],
                }),
                solution: JSON.stringify({
                    steps: [
                        'Identifica el valor base',
                        'Identifica el porcentaje a calcular',
                        'Multiplica base × (porcentaje ÷ 100)',
                        'Obtén el resultado',
                    ],
                }),
                hints: JSON.stringify([
                    'Recuerda que porcentaje significa "por cada 100"',
                    'Para el 25%, divide entre 4 o multiplica por 0.25',
                    'Verifica tu respuesta: ¿el resultado tiene sentido?',
                ]),
            },
        });

        const exercise2 = await prisma.exercise.upsert({
            where: {
                weekId_slug: {
                    weekId: week6.id,
                    slug: 'problemas-comerciales',
                },
            },
            update: {},
            create: {
                weekId: week6.id,
                slug: 'problemas-comerciales',
                title: 'Problemas Comerciales',
                type: 'PROBLEM_SOLVING',
                difficulty: 'ADVANCED',
                order: 2,
                content: JSON.stringify({
                    description:
                        'Resuelve problemas reales de porcentajes en contextos comerciales',
                    scenarios: [
                        'Descuentos en tiendas',
                        'Aumentos de precios',
                        'Comisiones por ventas',
                        'Impuestos y recargos',
                    ],
                }),
                solution: JSON.stringify({
                    approach: 'contextual_problem_solving',
                    steps: [
                        'Identifica qué se está calculando',
                        'Determina la base y el porcentaje',
                        'Aplica la fórmula correcta',
                        'Interpreta el resultado en contexto',
                    ],
                }),
                hints: JSON.stringify([
                    'Lee el problema completo antes de empezar',
                    'Identifica los datos conocidos y lo que necesitas encontrar',
                    'Dibuja un diagrama si es necesario',
                ]),
            },
        });

        console.log(
            '🎯 Ejercicios creados:',
            exercise1.title,
            '&',
            exercise2.title
        );

        // ===== CREAR USUARIO DE PRUEBA =====
        const testUser = await prisma.user.upsert({
            where: { email: 'estudiante@test.com' },
            update: {},
            create: {
                email: 'estudiante@test.com',
                name: 'Estudiante de Prueba',
                role: 'STUDENT',
            },
        });

        console.log('👤 Usuario de prueba creado:', testUser.name);

        // ===== CREAR INSCRIPCIÓN =====
        const enrollment = await prisma.enrollment.upsert({
            where: {
                userId_courseId: {
                    userId: testUser.id,
                    courseId: arithmeticCourse.id,
                },
            },
            update: {},
            create: {
                userId: testUser.id,
                courseId: arithmeticCourse.id,
            },
        });

        console.log('📝 Inscripción creada para el usuario de prueba');

        // ===== CREAR PROGRESO INICIAL =====
        const progress = await prisma.progress.upsert({
            where: {
                userId_weekId: {
                    userId: testUser.id,
                    weekId: week6.id,
                },
            },
            update: {},
            create: {
                userId: testUser.id,
                weekId: week6.id,
                status: 'IN_PROGRESS',
                masteryLevel: 1,
                timeSpent: 300, // 5 minutos
            },
        });

        console.log('📈 Progreso inicial creado');

        console.log('\n🎉 ¡Seed completado exitosamente!');
        console.log('📊 Datos creados:');
        console.log('  • 1 Curso (Aritmética)');
        console.log('  • 1 Módulo (Finanzas y Comercio)');
        console.log('  • 1 Semana (Porcentajes Avanzados)');
        console.log('  • 2 Ejercicios');
        console.log('  • 1 Usuario de prueba');
        console.log('  • 1 Inscripción');
        console.log('  • 1 Registro de progreso');
    } catch (error) {
        console.error('❌ Error durante el seed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
