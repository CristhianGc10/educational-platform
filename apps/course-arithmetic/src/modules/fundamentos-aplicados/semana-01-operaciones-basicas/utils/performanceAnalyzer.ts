// ============================================================================
// ANALIZADOR DE RENDIMIENTO DEL SISTEMA
// ============================================================================

/**
 * Métricas de rendimiento del sistema
 */
interface PerformanceMetrics {
    responseTime: number; // ms
    throughput: number; // operaciones por segundo
    errorRate: number; // porcentaje de errores
    resourceUtilization: ResourceUtilization;
    userExperience: UserExperienceMetrics;
    algorithmPerformance: AlgorithmPerformance;
}

/**
 * Utilización de recursos
 */
interface ResourceUtilization {
    cpuUsage: number; // porcentaje
    memoryUsage: number; // MB
    networkBandwidth: number; // Mbps
    diskIO: number; // operaciones por segundo
}

/**
 * Métricas de experiencia del usuario
 */
interface UserExperienceMetrics {
    loadTime: number; // ms
    interactionDelay: number; // ms
    renderingPerformance: number; // FPS
    satisfactionScore: number; // 0-100
}

/**
 * Rendimiento de algoritmos
 */
interface AlgorithmPerformance {
    executionTime: number; // ms
    complexity: string;
    scalability: number; // 0-100
    accuracy: number; // 0-100
    convergenceRate: number; // iteraciones
}

/**
 * Configuración del analizador
 */
interface AnalyzerConfig {
    enableRealTimeMonitoring: boolean;
    sampleInterval: number; // ms
    retentionPeriod: number; // días
    alertThresholds: AlertThresholds;
    enablePredictiveAnalysis: boolean;
}

/**
 * Umbrales de alerta
 */
interface AlertThresholds {
    responseTime: number;
    errorRate: number;
    cpuUsage: number;
    memoryUsage: number;
}

/**
 * Reporte de rendimiento
 */
interface PerformanceReport {
    timestamp: Date;
    period: string;
    metrics: PerformanceMetrics;
    trends: PerformanceTrends;
    recommendations: string[];
    alerts: PerformanceAlert[];
}

/**
 * Tendencias de rendimiento
 */
interface PerformanceTrends {
    responseTimetrend: number; // % cambio
    throughputTrend: number;
    errorRateTrend: number;
    resourceTrend: number;
}

/**
 * Alerta de rendimiento
 */
interface PerformanceAlert {
    id: string;
    type: 'warning' | 'critical' | 'info';
    metric: string;
    value: number;
    threshold: number;
    message: string;
    timestamp: Date;
}

/**
 * Muestra de rendimiento histórica
 */
interface PerformanceSample {
    timestamp: Date;
    metrics: PerformanceMetrics;
    context: string;
}

/**
 * Analizador de rendimiento principal
 */
class PerformanceAnalyzer {
    private config: AnalyzerConfig;
    private samples: PerformanceSample[];
    private isMonitoring: boolean;
    private monitoringInterval: NodeJS.Timeout | null;
    private alerts: PerformanceAlert[];

    constructor(config: Partial<AnalyzerConfig> = {}) {
        this.config = {
            enableRealTimeMonitoring: true,
            sampleInterval: 5000, // 5 segundos
            retentionPeriod: 7, // 7 días
            alertThresholds: {
                responseTime: 3000, // 3 segundos
                errorRate: 5, // 5%
                cpuUsage: 80, // 80%
                memoryUsage: 1024, // 1GB
            },
            enablePredictiveAnalysis: false,
            ...config,
        };

        this.samples = [];
        this.isMonitoring = false;
        this.monitoringInterval = null;
        this.alerts = [];
    }

    /**
     * Iniciar monitoreo en tiempo real
     */
    startMonitoring(): void {
        if (this.isMonitoring) return;

        this.isMonitoring = true;
        this.monitoringInterval = setInterval(() => {
            this.collectMetrics();
        }, this.config.sampleInterval);

        console.log('Performance monitoring started');
    }

    /**
     * Detener monitoreo
     */
    stopMonitoring(): void {
        if (!this.isMonitoring) return;

        this.isMonitoring = false;
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }

        console.log('Performance monitoring stopped');
    }

    /**
     * Recopilar métricas actuales
     */
    collectMetrics(context: string = 'system'): PerformanceMetrics {
        const metrics: PerformanceMetrics = {
            responseTime: this.measureResponseTime(),
            throughput: this.measureThroughput(),
            errorRate: this.calculateErrorRate(),
            resourceUtilization: this.measureResourceUtilization(),
            userExperience: this.measureUserExperience(),
            algorithmPerformance: this.measureAlgorithmPerformance(),
        };

        // Guardar muestra
        const sample: PerformanceSample = {
            timestamp: new Date(),
            metrics,
            context,
        };

        this.samples.push(sample);
        this.cleanOldSamples();

        // Verificar alertas
        this.checkAlerts(metrics);

        return metrics;
    }

    /**
     * Generar reporte de rendimiento
     */
    generateReport(period: string = '24h'): PerformanceReport {
        const endTime = new Date();
        const startTime = new Date(
            endTime.getTime() - this.parsePeriod(period)
        );

        const relevantSamples = this.samples.filter(
            (sample) =>
                sample.timestamp >= startTime && sample.timestamp <= endTime
        );

        if (relevantSamples.length === 0) {
            throw new Error('No data available for the specified period');
        }

        const aggregatedMetrics = this.aggregateMetrics(relevantSamples);
        const trends = this.calculateTrends(relevantSamples);
        const recommendations = this.generateRecommendations(
            aggregatedMetrics,
            trends
        );

        return {
            timestamp: new Date(),
            period,
            metrics: aggregatedMetrics,
            trends,
            recommendations,
            alerts: this.alerts.filter((alert) => alert.timestamp >= startTime),
        };
    }

    /**
     * Analizar rendimiento de algoritmo específico
     */
    analyzeAlgorithmPerformance(
        algorithmId: string,
        executionTime: number,
        iterations: number,
        accuracy: number
    ): AlgorithmPerformance {
        const complexity = this.estimateComplexity(executionTime, iterations);
        const scalability = this.estimateScalability(executionTime, iterations);

        const performance: AlgorithmPerformance = {
            executionTime,
            complexity,
            scalability,
            accuracy,
            convergenceRate: iterations,
        };

        // Registrar métricas del algoritmo
        this.recordAlgorithmMetrics(algorithmId, performance);

        return performance;
    }

    /**
     * Obtener métricas en tiempo real
     */
    getRealTimeMetrics(): PerformanceMetrics | null {
        if (this.samples.length === 0) return null;
        return this.samples[this.samples.length - 1].metrics;
    }

    /**
     * Obtener alertas activas
     */
    getActiveAlerts(): PerformanceAlert[] {
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

        return this.alerts.filter((alert) => alert.timestamp >= oneHourAgo);
    }

    /**
     * Limpiar datos históricos
     */
    clearHistory(): void {
        this.samples = [];
        this.alerts = [];
    }

    /**
     * Exportar datos para análisis
     */
    exportData(): {
        samples: PerformanceSample[];
        alerts: PerformanceAlert[];
        config: AnalyzerConfig;
    } {
        return {
            samples: [...this.samples],
            alerts: [...this.alerts],
            config: { ...this.config },
        };
    }

    // ===== MÉTODOS PRIVADOS =====

    private measureResponseTime(): number {
        // Simular medición de tiempo de respuesta
        return Math.random() * 2000 + 500; // 500-2500ms
    }

    private measureThroughput(): number {
        // Simular medición de throughput
        return Math.random() * 100 + 50; // 50-150 ops/sec
    }

    private calculateErrorRate(): number {
        // Simular cálculo de tasa de errores
        return Math.random() * 10; // 0-10%
    }

    private measureResourceUtilization(): ResourceUtilization {
        return {
            cpuUsage: Math.random() * 100,
            memoryUsage: Math.random() * 2048,
            networkBandwidth: Math.random() * 1000,
            diskIO: Math.random() * 500,
        };
    }

    private measureUserExperience(): UserExperienceMetrics {
        return {
            loadTime: Math.random() * 5000 + 1000, // 1-6 segundos
            interactionDelay: Math.random() * 200 + 50, // 50-250ms
            renderingPerformance: Math.random() * 60 + 30, // 30-90 FPS
            satisfactionScore: Math.random() * 100, // 0-100
        };
    }

    private measureAlgorithmPerformance(): AlgorithmPerformance {
        const executionTime = Math.random() * 1000 + 100;
        const iterations = Math.floor(Math.random() * 100) + 10;

        return {
            executionTime,
            complexity: this.estimateComplexity(executionTime, iterations),
            scalability: Math.random() * 100,
            accuracy: Math.random() * 100,
            convergenceRate: iterations,
        };
    }

    private estimateComplexity(
        executionTime: number,
        iterations: number
    ): string {
        const ratio = executionTime / iterations;

        if (ratio < 1) return 'O(1)';
        if (ratio < 10) return 'O(log n)';
        if (ratio < 50) return 'O(n)';
        if (ratio < 200) return 'O(n log n)';
        return 'O(n²)';
    }

    private estimateScalability(
        executionTime: number,
        iterations: number
    ): number {
        // Estimar escalabilidad basada en tiempo y iteraciones
        const efficiency = Math.max(
            0,
            100 - executionTime / 100 - iterations / 10
        );
        return Math.min(100, efficiency);
    }

    private checkAlerts(metrics: PerformanceMetrics): void {
        const thresholds = this.config.alertThresholds;

        // Verificar tiempo de respuesta
        if (metrics.responseTime > thresholds.responseTime) {
            this.addAlert(
                'warning',
                'responseTime',
                metrics.responseTime,
                thresholds.responseTime,
                `Response time ${metrics.responseTime}ms exceeds threshold`
            );
        }

        // Verificar tasa de errores
        if (metrics.errorRate > thresholds.errorRate) {
            this.addAlert(
                'critical',
                'errorRate',
                metrics.errorRate,
                thresholds.errorRate,
                `Error rate ${metrics.errorRate.toFixed(1)}% exceeds threshold`
            );
        }

        // Verificar uso de CPU
        if (metrics.resourceUtilization.cpuUsage > thresholds.cpuUsage) {
            this.addAlert(
                'warning',
                'cpuUsage',
                metrics.resourceUtilization.cpuUsage,
                thresholds.cpuUsage,
                `CPU usage ${metrics.resourceUtilization.cpuUsage.toFixed(1)}% exceeds threshold`
            );
        }

        // Verificar uso de memoria
        if (metrics.resourceUtilization.memoryUsage > thresholds.memoryUsage) {
            this.addAlert(
                'warning',
                'memoryUsage',
                metrics.resourceUtilization.memoryUsage,
                thresholds.memoryUsage,
                `Memory usage ${metrics.resourceUtilization.memoryUsage.toFixed(0)}MB exceeds threshold`
            );
        }
    }

    private addAlert(
        type: PerformanceAlert['type'],
        metric: string,
        value: number,
        threshold: number,
        message: string
    ): void {
        const alert: PerformanceAlert = {
            id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            metric,
            value,
            threshold,
            message,
            timestamp: new Date(),
        };

        this.alerts.push(alert);

        // Mantener solo las últimas 100 alertas
        if (this.alerts.length > 100) {
            this.alerts = this.alerts.slice(-100);
        }
    }

    private cleanOldSamples(): void {
        const cutoffTime = new Date();
        cutoffTime.setDate(cutoffTime.getDate() - this.config.retentionPeriod);

        this.samples = this.samples.filter(
            (sample) => sample.timestamp >= cutoffTime
        );
    }

    private parsePeriod(period: string): number {
        const unit = period.slice(-1);
        const value = parseInt(period.slice(0, -1));

        switch (unit) {
            case 'h':
                return value * 60 * 60 * 1000;
            case 'd':
                return value * 24 * 60 * 60 * 1000;
            case 'm':
                return value * 60 * 1000;
            default:
                return 24 * 60 * 60 * 1000; // Default 24 horas
        }
    }

    private aggregateMetrics(samples: PerformanceSample[]): PerformanceMetrics {
        const count = samples.length;

        return {
            responseTime:
                samples.reduce((sum, s) => sum + s.metrics.responseTime, 0) /
                count,
            throughput:
                samples.reduce((sum, s) => sum + s.metrics.throughput, 0) /
                count,
            errorRate:
                samples.reduce((sum, s) => sum + s.metrics.errorRate, 0) /
                count,
            resourceUtilization: {
                cpuUsage:
                    samples.reduce(
                        (sum, s) =>
                            sum + s.metrics.resourceUtilization.cpuUsage,
                        0
                    ) / count,
                memoryUsage:
                    samples.reduce(
                        (sum, s) =>
                            sum + s.metrics.resourceUtilization.memoryUsage,
                        0
                    ) / count,
                networkBandwidth:
                    samples.reduce(
                        (sum, s) =>
                            sum +
                            s.metrics.resourceUtilization.networkBandwidth,
                        0
                    ) / count,
                diskIO:
                    samples.reduce(
                        (sum, s) => sum + s.metrics.resourceUtilization.diskIO,
                        0
                    ) / count,
            },
            userExperience: {
                loadTime:
                    samples.reduce(
                        (sum, s) => sum + s.metrics.userExperience.loadTime,
                        0
                    ) / count,
                interactionDelay:
                    samples.reduce(
                        (sum, s) =>
                            sum + s.metrics.userExperience.interactionDelay,
                        0
                    ) / count,
                renderingPerformance:
                    samples.reduce(
                        (sum, s) =>
                            sum + s.metrics.userExperience.renderingPerformance,
                        0
                    ) / count,
                satisfactionScore:
                    samples.reduce(
                        (sum, s) =>
                            sum + s.metrics.userExperience.satisfactionScore,
                        0
                    ) / count,
            },
            algorithmPerformance: {
                executionTime:
                    samples.reduce(
                        (sum, s) =>
                            sum + s.metrics.algorithmPerformance.executionTime,
                        0
                    ) / count,
                complexity:
                    samples[samples.length - 1].metrics.algorithmPerformance
                        .complexity,
                scalability:
                    samples.reduce(
                        (sum, s) =>
                            sum + s.metrics.algorithmPerformance.scalability,
                        0
                    ) / count,
                accuracy:
                    samples.reduce(
                        (sum, s) =>
                            sum + s.metrics.algorithmPerformance.accuracy,
                        0
                    ) / count,
                convergenceRate:
                    samples.reduce(
                        (sum, s) =>
                            sum +
                            s.metrics.algorithmPerformance.convergenceRate,
                        0
                    ) / count,
            },
        };
    }

    private calculateTrends(samples: PerformanceSample[]): PerformanceTrends {
        if (samples.length < 2) {
            return {
                responseTimetrend: 0,
                throughputTrend: 0,
                errorRateTrend: 0,
                resourceTrend: 0,
            };
        }

        const firstHalf = samples.slice(0, Math.floor(samples.length / 2));
        const secondHalf = samples.slice(Math.floor(samples.length / 2));

        const firstMetrics = this.aggregateMetrics(firstHalf);
        const secondMetrics = this.aggregateMetrics(secondHalf);

        return {
            responseTimetrend: this.calculateTrendPercentage(
                firstMetrics.responseTime,
                secondMetrics.responseTime
            ),
            throughputTrend: this.calculateTrendPercentage(
                firstMetrics.throughput,
                secondMetrics.throughput
            ),
            errorRateTrend: this.calculateTrendPercentage(
                firstMetrics.errorRate,
                secondMetrics.errorRate
            ),
            resourceTrend: this.calculateTrendPercentage(
                firstMetrics.resourceUtilization.cpuUsage,
                secondMetrics.resourceUtilization.cpuUsage
            ),
        };
    }

    private calculateTrendPercentage(
        oldValue: number,
        newValue: number
    ): number {
        if (oldValue === 0) return 0;
        return ((newValue - oldValue) / oldValue) * 100;
    }

    private generateRecommendations(
        metrics: PerformanceMetrics,
        trends: PerformanceTrends
    ): string[] {
        const recommendations: string[] = [];

        // Recomendaciones basadas en métricas
        if (metrics.responseTime > 2000) {
            recommendations.push(
                'Optimizar tiempo de respuesta implementando cache o mejorando algoritmos'
            );
        }

        if (metrics.errorRate > 5) {
            recommendations.push(
                'Investigar y corregir las causas de los errores frecuentes'
            );
        }

        if (metrics.resourceUtilization.cpuUsage > 80) {
            recommendations.push(
                'Considerar optimización de código o escalado horizontal'
            );
        }

        if (metrics.userExperience.loadTime > 3000) {
            recommendations.push('Optimizar carga inicial de la aplicación');
        }

        // Recomendaciones basadas en tendencias
        if (trends.responseTimetrend > 20) {
            recommendations.push(
                'El tiempo de respuesta está aumentando, revisar cambios recientes'
            );
        }

        if (trends.errorRateTrend > 50) {
            recommendations.push(
                'La tasa de errores está creciendo significativamente'
            );
        }

        return recommendations;
    }

    private recordAlgorithmMetrics(
        algorithmId: string,
        performance: AlgorithmPerformance
    ): void {
        // En una implementación real, esto se guardaría en una base de datos
        console.log(`Algorithm ${algorithmId} performance:`, performance);
    }
}

/**
 * Función de conveniencia para crear un analizador
 */
export function createPerformanceAnalyzer(
    config?: Partial<AnalyzerConfig>
): PerformanceAnalyzer {
    return new PerformanceAnalyzer(config);
}

/**
 * Función para análisis rápido de rendimiento
 */
export function quickPerformanceCheck(): PerformanceMetrics {
    const analyzer = new PerformanceAnalyzer();
    return analyzer.collectMetrics('quick_check');
}

/**
 * Función para benchmark de algoritmo
 */
export function benchmarkAlgorithm(
    algorithmFunction: () => any,
    iterations: number = 1
): AlgorithmPerformance {
    const startTime = Date.now();
    let result;

    for (let i = 0; i < iterations; i++) {
        result = algorithmFunction();
    }

    const executionTime = Date.now() - startTime;
    const analyzer = new PerformanceAnalyzer();

    return analyzer.analyzeAlgorithmPerformance(
        'benchmark',
        executionTime,
        iterations,
        100 // Asumiendo 100% de precisión para el benchmark
    );
}

export default PerformanceAnalyzer;
