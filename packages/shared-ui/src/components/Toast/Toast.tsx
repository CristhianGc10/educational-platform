// 📢 packages/shared-ui/src/components/Toast/Toast.tsx

import React, { useEffect, useState } from 'react';

import { cn } from '../../utils/cn';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
    type?: ToastType;
    message: string;
    description?: string;
    duration?: number;
    onClose?: () => void;
    className?: string;
}

const Toast: React.FC<ToastProps> = ({
    type = 'info',
    message,
    description,
    duration = 5000,
    onClose,
    className,
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                onClose?.();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    if (!isVisible) return null;

    const typeStyles = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
    };

    const iconStyles = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ',
    };

    return (
        <div
            className={cn(
                'fixed top-4 right-4 z-50 p-4 rounded-lg border shadow-lg max-w-md transition-all duration-300',
                typeStyles[type],
                className
            )}
        >
            <div className="flex items-start">
                <span className="text-lg mr-3 flex-shrink-0">
                    {iconStyles[type]}
                </span>
                <div className="flex-1">
                    <h4 className="font-medium">{message}</h4>
                    {description && (
                        <p className="mt-1 text-sm opacity-80">{description}</p>
                    )}
                </div>
                {onClose && (
                    <button
                        onClick={() => {
                            setIsVisible(false);
                            onClose();
                        }}
                        className="ml-3 text-lg opacity-60 hover:opacity-100 transition-opacity"
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );
};

export { Toast };
