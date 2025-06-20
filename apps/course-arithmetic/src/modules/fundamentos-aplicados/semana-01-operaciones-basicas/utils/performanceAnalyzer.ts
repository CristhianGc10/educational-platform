// ============================================================================
// ANALIZADOR DE RENDIMIENTO DEL SISTEMA - VERSIÓN COMPLETA CORREGIDA
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
 * Tendencias de rendimiento - CORREGIDO
 */
interface PerformanceTrends {
    responseTimeTrend: number; // % cambio - CORREGIDO: era responseTimetrend
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
 * Configuración de predicción
 */
interface PredictionConfig {
    enabled: boolean;
    windowSize: number; // número de muestras para análisis
    confidenceThreshold: number; // 0-100
    forecastHorizon: number; // minutos hacia el futuro
}

/**
 * Resultado de predicción
 */
interface PredictionResult {
    metric: string;
    currentValue: number;
    predictedValue: number;
    confidence: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    timeToThreshold?: number; // minutos hasta alcanzar umbral crítico
}

/**
 * Analizador de rendimiento principal - IMPLEMENTACIÓN COMPLETA
 */
export class PerformanceAnalyzer {
    private config: AnalyzerConfig;
    private samples: PerformanceSample[] = [];
    private alerts: PerformanceAlert[] = [];
    private monitoringInterval?: NodeJS.Timeout;
    private predictionConfig: PredictionConfig;

    constructor(config: Partial<AnalyzerConfig> = {}) {
        this.config = {
            enableRealTimeMonitoring: true,
            sampleInterval: 5000, // 5 segundos
            retentionPeriod: 30, // 30 días
            alertThresholds: {
                responseTime: 2000, // 2 segundos
                errorRate: 5, // 5%
                cpuUsage: 80, // 80%
                memoryUsage: 85, // 85%
            },
            enablePredictiveAnalysis: false,
            ...config,
        };

        this.predictionConfig = {
            enabled: this.config.enablePredictiveAnalysis,
            windowSize: 20,
            confidenceThreshold: 70,
            forecastHorizon: 30, // 30 minutos
        };

        if (this.config.enableRealTimeMonitoring) {
            this.startMonitoring();
        }
    }

    /**
     * Iniciar monitoreo en tiempo real
     */
    startMonitoring(): void {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
        }

        this.monitoringInterval = setInterval(() => {
            this.collectSample();
        }, this.config.sampleInterval);

        console.log(
            `🔍 Monitoreo de rendimiento iniciado (intervalo: ${this.config.sampleInterval}ms)`
        );
    }

    /**
     * Detener monitoreo
     */
    stopMonitoring(): void {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = undefined;
        }
        console.log('⏹️ Monitoreo de rendimiento detenido');
    }

    /**
     * Recolectar muestra de rendimiento
     */
    private collectSample(): void {
        const metrics = this.getCurrentMetrics();
        const sample: PerformanceSample = {
            timestamp: new Date(),
            metrics,
            context: this.getSystemContext(),
        };

        this.samples.push(sample);
        this.cleanOldSamples();
        this.checkAlerts(metrics);

        if (
            this.predictionConfig.enabled &&
            this.samples.length >= this.predictionConfig.windowSize
        ) {
            this.performPredictiveAnalysis();
        }
    }

    /**
     * Obtener métricas actuales del sistema
     */
    private getCurrentMetrics(): PerformanceMetrics {
        // En una implementación real, esto se obtendría de APIs de sistema
        const baseMetrics = {
            responseTime: this.simulateMetric(800, 3000, 100),
            throughput: this.simulateMetric(50, 200, 10),
            errorRate: this.simulateMetric(0, 10, 0.5),
            resourceUtilization: {
                cpuUsage: this.simulateMetric(30, 90, 5),
                memoryUsage: this.simulateMetric(200, 1000, 50),
                networkBandwidth: this.simulateMetric(10, 100, 5),
                diskIO: this.simulateMetric(50, 500, 25),
            },
            userExperience: {
                loadTime: this.simulateMetric(1000, 5000, 200),
                interactionDelay: this.simulateMetric(50, 300, 20),
                renderingPerformance: this.simulateMetric(30, 60, 2),
                satisfactionScore: this.simulateMetric(60, 100, 5),
            },
            algorithmPerformance: {
                executionTime: this.simulateMetric(10, 200, 10),
                complexity: this.getRandomComplexity(),
                scalability: this.simulateMetric(60, 100, 5),
                accuracy: this.simulateMetric(80, 100, 2),
                convergenceRate: Math.floor(this.simulateMetric(5, 50, 5)),
            },
        };

        return baseMetrics;
    }

    /**
     * Simular métrica con variación realista
     */
    private simulateMetric(min: number, max: number, variance: number): number {
        const base = min + Math.random() * (max - min);
        const variation = (Math.random() - 0.5) * variance;
        return Math.max(min, Math.min(max, base + variation));
    }

    /**
     * Obtener complejidad aleatoria para algoritmos
     */
    private getRandomComplexity(): string {
        const complexities = [
            'O(1)',
            'O(log n)',
            'O(n)',
            'O(n log n)',
            'O(n²)',
            'O(2^n)',
        ];
        return complexities[Math.floor(Math.random() * complexities.length)];
    }

    /**
     * Obtener contexto del sistema
     */
    private getSystemContext(): string {
        const contexts = [
            'normal_operation',
            'high_load',
            'maintenance_window',
            'peak_hours',
            'background_processing',
        ];
        return contexts[Math.floor(Math.random() * contexts.length)];
    }

    /**
     * Limpiar muestras antiguas
     */
    private cleanOldSamples(): void {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionPeriod);

        this.samples = this.samples.filter(
            (sample) => sample.timestamp > cutoffDate
        );
    }

    /**
     * Verificar y generar alertas
     */
    private checkAlerts(metrics: PerformanceMetrics): void {
        const newAlerts: PerformanceAlert[] = [];

        // Verificar tiempo de respuesta
        if (metrics.responseTime > this.config.alertThresholds.responseTime) {
            newAlerts.push({
                id: this.generateAlertId(),
                type:
                    metrics.responseTime >
                    this.config.alertThresholds.responseTime * 1.5
                        ? 'critical'
                        : 'warning',
                metric: 'responseTime',
                value: metrics.responseTime,
                threshold: this.config.alertThresholds.responseTime,
                message: `Tiempo de respuesta elevado: ${Math.round(metrics.responseTime)}ms`,
                timestamp: new Date(),
            });
        }

        // Verificar tasa de errores
        if (metrics.errorRate > this.config.alertThresholds.errorRate) {
            newAlerts.push({
                id: this.generateAlertId(),
                type:
                    metrics.errorRate >
                    this.config.alertThresholds.errorRate * 2
                        ? 'critical'
                        : 'warning',
                metric: 'errorRate',
                value: metrics.errorRate,
                threshold: this.config.alertThresholds.errorRate,
                message: `Tasa de errores elevada: ${metrics.errorRate.toFixed(1)}%`,
                timestamp: new Date(),
            });
        }

        // Verificar uso de CPU
        if (
            metrics.resourceUtilization.cpuUsage >
            this.config.alertThresholds.cpuUsage
        ) {
            newAlerts.push({
                id: this.generateAlertId(),
                type:
                    metrics.resourceUtilization.cpuUsage > 95
                        ? 'critical'
                        : 'warning',
                metric: 'cpuUsage',
                value: metrics.resourceUtilization.cpuUsage,
                threshold: this.config.alertThresholds.cpuUsage,
                message: `Uso de CPU elevado: ${Math.round(metrics.resourceUtilization.cpuUsage)}%`,
                timestamp: new Date(),
            });
        }

        // Verificar uso de memoria
        if (
            metrics.resourceUtilization.memoryUsage >
            this.config.alertThresholds.memoryUsage
        ) {
            newAlerts.push({
                id: this.generateAlertId(),
                type: 'warning',
                metric: 'memoryUsage',
                value: metrics.resourceUtilization.memoryUsage,
                threshold: this.config.alertThresholds.memoryUsage,
                message: `Uso de memoria elevado: ${Math.round(metrics.resourceUtilization.memoryUsage)}MB`,
                timestamp: new Date(),
            });
        }

        this.alerts.push(...newAlerts);
        this.cleanOldAlerts();

        // Notificar alertas críticas
        newAlerts
            .filter((alert) => alert.type === 'critical')
            .forEach((alert) => {
                console.error(`🚨 ALERTA CRÍTICA: ${alert.message}`);
            });
    }

    /**
     * Limpiar alertas antiguas
     */
    private cleanOldAlerts(): void {
        const cutoffDate = new Date();
        cutoffDate.setHours(cutoffDate.getHours() - 24); // Mantener alertas por 24 horas

        this.alerts = this.alerts.filter(
            (alert) => alert.timestamp > cutoffDate
        );
    }

    /**
     * Generar ID único para alertas
     */
    private generateAlertId(): string {
        return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Calcular tendencias de rendimiento - MÉTODO CORREGIDO
     */
    private calculateTrends(samples: PerformanceSample[]): PerformanceTrends {
        if (samples.length < 2) {
            return {
                responseTimeTrend: 0, // CORREGIDO: era responseTimetrend
                throughputTrend: 0,
                errorRateTrend: 0,
                resourceTrend: 0,
            };
        }

        const recentSamples = samples.slice(-10); // Últimas 10 muestras
        const firstMetrics = recentSamples[0].metrics;
        const lastMetrics = recentSamples[recentSamples.length - 1].metrics;

        return {
            responseTimeTrend: this.calculateTrendPercentage(
                // CORREGIDO
                firstMetrics.responseTime,
                lastMetrics.responseTime
            ),
            throughputTrend: this.calculateTrendPercentage(
                firstMetrics.throughput,
                lastMetrics.throughput
            ),
            errorRateTrend: this.calculateTrendPercentage(
                firstMetrics.errorRate,
                lastMetrics.errorRate
            ),
            resourceTrend: this.calculateTrendPercentage(
                firstMetrics.resourceUtilization.cpuUsage,
                lastMetrics.resourceUtilization.cpuUsage
            ),
        };
    }

    /**
     * Calcular porcentaje de tendencia
     */
    private calculateTrendPercentage(
        oldValue: number,
        newValue: number
    ): number {
        if (oldValue === 0) return 0;
        return ((newValue - oldValue) / oldValue) * 100;
    }

    /**
     * Generar recomendaciones basadas en métricas y tendencias
     */
    private generateRecommendations(
        metrics: PerformanceMetrics,
        trends: PerformanceTrends
    ): string[] {
        const recommendations: string[] = [];

        // Recomendaciones basadas en métricas actuales
        if (metrics.responseTime > this.config.alertThresholds.responseTime) {
            recommendations.push(
                'Optimizar tiempo de respuesta implementando cache o mejorando algoritmos'
            );
        }

        if (metrics.errorRate > this.config.alertThresholds.errorRate) {
            recommendations.push(
                'Investigar y corregir las causas de los errores frecuentes'
            );
        }

        if (
            metrics.resourceUtilization.cpuUsage >
            this.config.alertThresholds.cpuUsage
        ) {
            recommendations.push(
                'Considerar optimización de código o escalado horizontal'
            );
        }

        if (metrics.resourceUtilization.memoryUsage > 800) {
            recommendations.push(
                'Revisar memory leaks y optimizar uso de memoria'
            );
        }

        if (metrics.userExperience.loadTime > 3000) {
            recommendations.push('Optimizar carga inicial de la aplicación');
        }

        if (metrics.userExperience.satisfactionScore < 70) {
            recommendations.push(
                'Mejorar experiencia de usuario basada en feedback'
            );
        }

        // Recomendaciones basadas en tendencias - CORREGIDO
        if (trends.responseTimeTrend > 20) {
            // Era responseTimetrend
            recommendations.push(
                'El tiempo de respuesta está aumentando, revisar cambios recientes'
            );
        }

        if (trends.errorRateTrend > 50) {
            recommendations.push(
                'La tasa de errores está creciendo significativamente'
            );
        }

        if (trends.throughputTrend < -20) {
            recommendations.push(
                'El rendimiento está disminuyendo, verificar carga del sistema'
            );
        }

        if (trends.resourceTrend > 30) {
            recommendations.push(
                'El uso de recursos está creciendo, planificar escalado'
            );
        }

        return recommendations;
    }

    /**
     * Filtrar muestras por período
     */
    private filterSamplesByPeriod(period: string): PerformanceSample[] {
        const now = new Date();
        let cutoffDate: Date;

        switch (period) {
            case 'last-hour':
                cutoffDate = new Date(now.getTime() - 60 * 60 * 1000);
                break;
            case 'last-day':
                cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                break;
            case 'last-week':
                cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            default:
                cutoffDate = new Date(now.getTime() - 60 * 60 * 1000); // Default: última hora
        }

        return this.samples.filter((sample) => sample.timestamp >= cutoffDate);
    }

    /**
     * Realizar análisis predictivo
     */
    private performPredictiveAnalysis(): PredictionResult[] {
        if (!this.predictionConfig.enabled) return [];

        const recentSamples = this.samples.slice(
            -this.predictionConfig.windowSize
        );
        const predictions: PredictionResult[] = [];

        // Predicción de tiempo de respuesta
        const responseTimePrediction = this.predictMetric(
            recentSamples.map((s) => s.metrics.responseTime),
            'responseTime'
        );
        if (responseTimePrediction) predictions.push(responseTimePrediction);

        // Predicción de uso de CPU
        const cpuPrediction = this.predictMetric(
            recentSamples.map((s) => s.metrics.resourceUtilization.cpuUsage),
            'cpuUsage'
        );
        if (cpuPrediction) predictions.push(cpuPrediction);

        return predictions;
    }

    /**
     * Predecir métrica específica usando regresión linear simple
     */
    private predictMetric(
        values: number[],
        metricName: string
    ): PredictionResult | null {
        if (values.length < 5) return null;

        // Regresión linear simple
        const n = values.length;
        const x = Array.from({ length: n }, (_, i) => i);
        const y = values;

        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
        const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // Predecir valor futuro
        const futureX =
            n +
            this.predictionConfig.forecastHorizon /
                (this.config.sampleInterval / 60000);
        const predictedValue = slope * futureX + intercept;
        const currentValue = values[values.length - 1];

        // Calcular confianza basada en R²
        const yMean = sumY / n;
        const ssRes = y.reduce(
            (acc, yi, i) => acc + Math.pow(yi - (slope * x[i] + intercept), 2),
            0
        );
        const ssTot = y.reduce((acc, yi) => acc + Math.pow(yi - yMean, 2), 0);
        const rSquared = 1 - ssRes / ssTot;
        const confidence = Math.max(0, Math.min(100, rSquared * 100));

        // Determinar tendencia
        let trend: 'increasing' | 'decreasing' | 'stable';
        const changePercent = Math.abs(
            ((predictedValue - currentValue) / currentValue) * 100
        );
        if (changePercent < 5) {
            trend = 'stable';
        } else if (predictedValue > currentValue) {
            trend = 'increasing';
        } else {
            trend = 'decreasing';
        }

        return {
            metric: metricName,
            currentValue,
            predictedValue: Math.max(0, predictedValue),
            confidence,
            trend,
        };
    }

    /**
     * Registrar métricas de algoritmo específico
     */
    recordAlgorithmMetrics(
        algorithmId: string,
        performance: AlgorithmPerformance
    ): void {
        const timestamp = new Date();

        // En una implementación real, esto se guardaría en una base de datos
        console.log(`📊 Métricas de algoritmo ${algorithmId}:`, {
            timestamp: timestamp.toISOString(),
            ...performance,
        });

        // Opcional: almacenar en memoria para análisis
        if (!this.samples.length) return;

        const lastSample = this.samples[this.samples.length - 1];
        lastSample.metrics.algorithmPerformance = performance;
    }

    /**
     * Generar reporte de rendimiento completo
     */
    generateReport(period: string = 'last-hour'): PerformanceReport {
        const relevantSamples = this.filterSamplesByPeriod(period);
        const currentMetrics =
            relevantSamples.length > 0
                ? relevantSamples[relevantSamples.length - 1].metrics
                : this.getCurrentMetrics();

        const trends = this.calculateTrends(relevantSamples);
        const recommendations = this.generateRecommendations(
            currentMetrics,
            trends
        );
        const activeAlerts = this.alerts.filter(
            (alert) => alert.timestamp > new Date(Date.now() - 60 * 60 * 1000) // Últimas hora
        );

        const report: PerformanceReport = {
            timestamp: new Date(),
            period,
            metrics: currentMetrics,
            trends,
            recommendations,
            alerts: activeAlerts,
        };

        console.log(
            `📈 Reporte de rendimiento generado para período: ${period}`
        );
        return report;
    }

    /**
     * Obtener estadísticas resumidas
     */
    getSummaryStats(): {
        totalSamples: number;
        activeAlerts: number;
        avgResponseTime: number;
        avgThroughput: number;
        avgErrorRate: number;
    } {
        const recentSamples = this.samples.slice(-100); // Últimas 100 muestras

        return {
            totalSamples: this.samples.length,
            activeAlerts: this.alerts.filter(
                (alert) =>
                    alert.timestamp > new Date(Date.now() - 60 * 60 * 1000)
            ).length,
            avgResponseTime:
                recentSamples.length > 0
                    ? recentSamples.reduce(
                          (sum, s) => sum + s.metrics.responseTime,
                          0
                      ) / recentSamples.length
                    : 0,
            avgThroughput:
                recentSamples.length > 0
                    ? recentSamples.reduce(
                          (sum, s) => sum + s.metrics.throughput,
                          0
                      ) / recentSamples.length
                    : 0,
            avgErrorRate:
                recentSamples.length > 0
                    ? recentSamples.reduce(
                          (sum, s) => sum + s.metrics.errorRate,
                          0
                      ) / recentSamples.length
                    : 0,
        };
    }

    /**
     * Actualizar configuración
     */
    updateConfig(newConfig: Partial<AnalyzerConfig>): void {
        this.config = { ...this.config, ...newConfig };

        if (newConfig.enableRealTimeMonitoring !== undefined) {
            if (newConfig.enableRealTimeMonitoring) {
                this.startMonitoring();
            } else {
                this.stopMonitoring();
            }
        }

        if (newConfig.sampleInterval && this.config.enableRealTimeMonitoring) {
            this.stopMonitoring();
            this.startMonitoring();
        }

        console.log('⚙️ Configuración del analizador actualizada');
    }

    /**
     * Limpiar todos los datos
     */
    clearData(): void {
        this.samples = [];
        this.alerts = [];
        console.log('🗑️ Datos del analizador limpiados');
    }

    /**
     * Destructor para limpiar recursos
     */
    destroy(): void {
        this.stopMonitoring();
        this.clearData();
        console.log('💥 Analizador de rendimiento destruido');
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
 * Función para crear un analizador con configuración predeterminada para desarrollo
 */
export function createDevelopmentAnalyzer(): PerformanceAnalyzer {
    return new PerformanceAnalyzer({
        enableRealTimeMonitoring: true,
        sampleInterval: 2000, // 2 segundos para desarrollo
        retentionPeriod: 1, // 1 día
        alertThresholds: {
            responseTime: 1000, // Más estricto para desarrollo
            errorRate: 2,
            cpuUsage: 70,
            memoryUsage: 80,
        },
        enablePredictiveAnalysis: true,
    });
}

/**
 * Función para crear un analizador con configuración para producción
 */
export function createProductionAnalyzer(): PerformanceAnalyzer {
    return new PerformanceAnalyzer({
        enableRealTimeMonitoring: true,
        sampleInterval: 30000, // 30 segundos
        retentionPeriod: 90, // 90 días
        alertThresholds: {
            responseTime: 3000,
            errorRate: 5,
            cpuUsage: 85,
            memoryUsage: 90,
        },
        enablePredictiveAnalysis: true,
    });
}

// Exportar tipos
export type {
    PerformanceMetrics,
    ResourceUtilization,
    UserExperienceMetrics,
    AlgorithmPerformance,
    AnalyzerConfig,
    AlertThresholds,
    PerformanceReport,
    PerformanceTrends,
    PerformanceAlert,
    PerformanceSample,
    PredictionConfig,
    PredictionResult,
};
