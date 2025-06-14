#!/usr/bin/env bash
set -euo pipefail

echo "📁 Verificando schema de Prisma..."
if [[ -f "prisma/schema.prisma" ]]; then
  echo "✅ prisma/schema.prisma existe"
else
  echo "❌ prisma/schema.prisma NO EXISTE"
  echo "Debes crear el schema completo primero"
  exit 1
fi

echo "🔍 Verificando variables de entorno..."
if grep -qE "^DATABASE_URL=" .env; then
  echo "✅ DATABASE_URL configurado"
else
  echo "❌ DATABASE_URL NO configurado en .env"
  echo 'Agrega: DATABASE_URL="file:./prisma/dev.db"'
  exit 1
fi

echo "🔧 Generando cliente Prisma..."
npx prisma generate

echo "🗄️ Verificando migraciones..."
npx prisma migrate status

echo "🔄 Aplicando migraciones (si corresponde)..."
npx prisma migrate deploy

echo "✅ Verificando cliente generado..."
if [[ -d "node_modules/.prisma/client" ]]; then
  echo "✅ Cliente Prisma generado correctamente"
else
  echo "❌ Cliente Prisma NO se generó"
  exit 1
fi

echo
echo "🎉 PRISMA CLIENT CONFIGURADO CORRECTAMENTE"
echo "=========================================="
echo
echo "🚀 AHORA PROBAR BUILD:"
echo "cd apps/main-platform"
echo "npm run build"
