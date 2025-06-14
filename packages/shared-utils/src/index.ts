// 🛠️ Shared Utility Functions
export const version = '1.0.0';

// Utilidades de formateo
export const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(2)}%`;
};

export const formatCurrency = (value: number, currency = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(value);
};

// Utilidades de validación
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
    return password.length >= 8;
};

// Utilidades matemáticas básicas
export const roundToDecimals = (value: number, decimals: number): number => {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

// Utilidades de fecha
export const formatDate = (date: Date): string => {
    return date.toLocaleDateString('es-ES');
};
