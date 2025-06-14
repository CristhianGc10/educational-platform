// 📦 packages/shared-ui/src/index.ts - ARCHIVO PRINCIPAL DE EXPORTS
export const version = '1.0.0';

// Componentes
export { Button, type ButtonProps } from './components/Button/Button';
export { Input, type InputProps } from './components/Input/Input';
export {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    type CardProps,
} from './components/Card/Card';
export {
    LoadingSpinner,
    type LoadingSpinnerProps,
} from './components/LoadingSpinner/LoadingSpinner';
export {
    Toast,
    type ToastProps,
    type ToastType,
} from './components/Toast/Toast';

// Utilidades
export { cn } from './utils/cn';

// Hooks (placeholder para futuros hooks)
export const useToggle = (initialValue: boolean = false) => {
    const [value, setValue] = React.useState(initialValue);
    const toggle = React.useCallback(() => setValue((v) => !v), []);
    return [value, toggle] as const;
};

// Re-exports necesarios para TypeScript
import React from 'react';
export { React };
