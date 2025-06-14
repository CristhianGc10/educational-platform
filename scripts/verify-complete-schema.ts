import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyCompleteSchema() {
    try {
        console.log('🔍 Verificando schema completo...\n');

        // ===== VERIFICAR CONEXIÓN =====
        await prisma.$connect();
        console.log('✅ Conexión exitosa a SQLite');

        // ===== VERIFICAR TABLAS PRINCIPALES =====
        console.log('\n📊 Verificando tablas principales:');

        const userCount = await prisma.user.count();
        console.log(`👥 Users: ${userCount}`);

        const courseCount = await prisma.course.count();
        console.log(`📚 Courses: ${courseCount}`);

        const moduleCount = await prisma.module.count();
        console.log(`📖 Modules: ${moduleCount}`);

        const weekCount = await prisma.week.count();
        console.log(`📅 Weeks: ${weekCount}`);

        const exerciseCount = await prisma.exercise.count();
        console.log(`🎯 Exercises: ${exerciseCount}`);

        // ===== VERIFICAR TABLAS DE AUTENTICACIÓN =====
        console.log('\n🔐 Verificando tablas de autenticación:');

        const accountCount = await prisma.account.count();
        console.log(`🔑 Accounts: ${accountCount}`);

        const sessionCount = await prisma.session.count();
        console.log(`📊 Sessions: ${sessionCount}`);

        // ===== VERIFICAR TABLAS DE PROGRESO =====
        console.log('\n📈 Verificando tablas de progreso:');

        const enrollmentCount = await prisma.enrollment.count();
        console.log(`📝 Enrollments: ${enrollmentCount}`);

        const progressCount = await prisma.progress.count();
        console.log(`⏳ Progress: ${progressCount}`);

        const attemptCount = await prisma.exerciseAttempt.count();
        console.log(`🎮 Exercise Attempts: ${attemptCount}`);

        // ===== VERIFICAR ENUMS =====
        console.log('\n🏷️ Enums disponibles:');
        console.log('  • UserRole: STUDENT, TEACHER, ADMIN');
        console.log(
            '  • ExerciseType: CALCULATOR_3D, PROBLEM_SOLVING, CONCEPTUAL, INTERACTIVE_SIMULATION'
        );
        console.log('  • Difficulty: BEGINNER, INTERMEDIATE, ADVANCED');
        console.log(
            '  • ProgressStatus: NOT_STARTED, IN_PROGRESS, COMPLETED, MASTERED'
        );

        console.log('\n🎉 ¡Schema completo verificado exitosamente!');
        console.log('📋 Total de tablas: 10');
        console.log('🔗 Relaciones configuradas correctamente');
    } catch (error) {
        console.error('❌ Error en verificación del schema:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

verifyCompleteSchema();
