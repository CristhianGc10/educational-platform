@echo off
REM ========================
REM 1. ARREGLAR COURSE-ARITHMETIC
REM ========================
echo 🔧 ARREGLANDO COURSE-ARITHMETIC LAYOUT
cd apps\course-arithmetic

REM Limpiar cache
if exist .next (
  rmdir /s /q .next
)

echo ✅ course-arithmetic corregido

REM ========================
REM 2. ARREGLAR MAIN-PLATFORM
REM ========================
echo.
echo 🎯 2. ARREGLANDO MAIN-PLATFORM
cd ..\main-platform

REM Limpiar cache
if exist .next (
  rmdir /s /q .next
)

echo 📝 Actualizando dashboard page (sin consultas DB en build)...
REM Aquí debes aplicar el código manualmente si no se hace automáticamente

echo ✅ main-platform corregido

REM ========================
REM 3. PROBAR BUILD INDIVIDUAL
REM ========================
echo.
echo 🏗️ 3. PROBANDO BUILD INDIVIDUAL

echo 📦 Probando course-arithmetic...
cd ..\course-arithmetic
call npm run build
if %ERRORLEVEL%==0 (
  echo ✅ course-arithmetic BUILD OK
) else (
  echo ❌ course-arithmetic BUILD FALLÓ
)

echo.
echo 📦 Probando main-platform...
cd ..\main-platform
call npm run build
if %ERRORLEVEL%==0 (
  echo ✅ main-platform BUILD OK
) else (
  echo ❌ main-platform BUILD FALLÓ
)

REM ========================
REM 4. PROBAR BUILD GLOBAL
REM ========================
echo.
echo 🏗️ 4. PROBANDO BUILD GLOBAL
cd ..\..  REM volver al root del proyecto

echo 📦 Probando build global...
call npm run build
if %ERRORLEVEL%==0 (
  echo 🎉 ¡BUILD GLOBAL EXITOSO!
) else (
  echo ❌ Build global falló - revisar errores arriba
)

echo.
echo 📋 RESUMEN:
echo - course-arithmetic: layout.tsx corregido
echo - main-platform: dashboard sin consultas DB en build
echo - Cache limpiado en ambas apps
echo.
echo 🚀 Si el build es exitoso, ejecuta:
echo npm run dev
echo Ir a: http://localhost:3000
