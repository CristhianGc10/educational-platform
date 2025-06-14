// ===== apps/main-platform/src/components/dashboard/CourseCard.tsx =====
interface ProgressType {
    userId: string;
    status: string;
    masteryLevel: number;
}

interface WeekType {
    id: string;
    progress: ProgressType[];
}

interface ModuleType {
    id: string;
    weeks: WeekType[];
}

interface Course {
    id: string;
    slug: string;
    title: string;
    description: string;
    modules: ModuleType[];
}

interface CourseCardProps {
    course: Course;
    userId: string;
}

export function CourseCard({ course, userId }: CourseCardProps) {
    // Calcular progreso del curso
    const totalWeeks = course.modules.reduce(
        (acc, module) => acc + module.weeks.length,
        0
    );
    const completedWeeks = course.modules.reduce((acc, module) => {
        return (
            acc +
            module.weeks.filter((week) =>
                week.progress.some(
                    (p) => p.userId === userId && p.status === 'COMPLETED'
                )
            ).length
        );
    }, 0);

    const progressPercentage =
        totalWeeks > 0 ? (completedWeeks / totalWeeks) * 100 : 0;

    return (
        <div className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow">
            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                    {course.description}
                </p>

                <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progreso</span>
                        <span>{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                        {completedWeeks} de {totalWeeks} semanas
                    </span>
                    <a
                        href={`/courses/${course.slug}`}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                        {progressPercentage > 0 ? 'Continuar' : 'Comenzar'}
                    </a>
                </div>
            </div>
        </div>
    );
}
