import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
    try {
        console.log('🔌 Probando conexión a la base de datos...');

        // Test básico de conexión
        await prisma.$connect();
        console.log('✅ Conexión exitosa a PostgreSQL');

        // Test de query básica (compatible con SQLite y PostgreSQL)
        const result =
            await prisma.$queryRaw`SELECT datetime('now') as current_time`;
        console.log('🕐 Hora del servidor:', result);

        // Test de conteo (debería ser 0 la primera vez)
        const userCount = await prisma.user.count();
        console.log('👥 Usuarios en la base:', userCount);

        console.log('🎉 ¡Base de datos funcionando correctamente!');
    } catch (error) {
        console.error('❌ Error de conexión:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
