// apps/course-arithmetic/src/app/modules/[moduleId]/[weekId]/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { useParams } from 'next/navigation';

// Lazy load de módulos
const Semana06 = dynamic(
    () =>
        import(
            '@/modules/finanzas-comercio/semana-06-porcentajes-avanzados/page'
        ),
    {
        loading: () => (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        ),
    }
);

// Tipos para el mapeo de módulos
type ModuleId = 'finanzas-comercio';
type WeekId = 'semana-06-porcentajes-avanzados';

// Mapeo de módulos y semanas disponibles
const moduleComponents: Record<
    ModuleId,
    Record<WeekId, React.ComponentType<any>>
> = {
    'finanzas-comercio': {
        'semana-06-porcentajes-avanzados': Semana06,
    },
};

export default function WeekPage() {
    const params = useParams();
    const { moduleId, weekId } = params;

    // Verificar que los parámetros son strings
    const moduleIdStr = Array.isArray(moduleId) ? moduleId[0] : moduleId;
    const weekIdStr = Array.isArray(weekId) ? weekId[0] : weekId;

    // Verificar que los parámetros son válidos antes de buscar el componente
    if (!moduleIdStr || !weekIdStr) {
        console.error('Parámetros de ruta inválidos');
        notFound();
    }

    // Verificar que el módulo existe
    const moduleMap = moduleComponents[moduleIdStr as ModuleId];
    if (!moduleMap) {
        console.error(`Módulo no encontrado: ${moduleIdStr}`);
        notFound();
    }

    // Verificar que la semana existe
    const Component = moduleMap[weekIdStr as WeekId];
    if (!Component) {
        console.error(`Semana no encontrada: ${moduleIdStr}/${weekIdStr}`);
        notFound();
    }

    return <Component />;
}
