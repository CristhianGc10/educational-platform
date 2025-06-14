// 📊 Analytics Engine
export const version = '1.0.0';

// Interfaces para eventos de analytics
export interface LearningEvent {
    userId: string;
    eventType: string;
    timestamp: Date;
    data: Record<string, any>;
}

export interface ProgressMetric {
    userId: string;
    metricName: string;
    value: number;
    timestamp: Date;
}

// Clase base del motor de analytics
export class AnalyticsEngine {
    private events: LearningEvent[] = [];

    trackEvent(event: LearningEvent): void {
        this.events.push(event);
        // TODO: Enviar a backend
    }

    getEvents(userId: string): LearningEvent[] {
        return this.events.filter((event) => event.userId === userId);
    }

    calculateProgress(userId: string): ProgressMetric[] {
        // Implementación básica
        return [];
    }
}

// Funciones utilitarias
export const createEvent = (
    userId: string,
    eventType: string,
    data: Record<string, any>
): LearningEvent => {
    return {
        userId,
        eventType,
        timestamp: new Date(),
        data,
    };
};
