'use client';

import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
    size?: 'sm' | 'md' | 'lg';
    dot?: boolean;
    removable?: boolean;
    onRemove?: () => void;
    className?: string;
}

export function Badge({
    children,
    variant = 'default',
    size = 'md',
    dot = false,
    removable = false,
    onRemove,
    className,
}: BadgeProps) {
    const baseStyles = 'inline-flex items-center font-medium rounded-full';

    const variantStyles = {
        default: 'bg-gray-100 text-gray-800',
        primary: 'bg-primary-100 text-primary-800',
        secondary: 'bg-secondary-100 text-secondary-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        danger: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800',
    };

    const dotColors = {
        default: 'bg-gray-400',
        primary: 'bg-primary-400',
        secondary: 'bg-secondary-400',
        success: 'bg-green-400',
        warning: 'bg-yellow-400',
        danger: 'bg-red-400',
        info: 'bg-blue-400',
    };

    const sizeStyles = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
    };

    return (
        <span className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)}>
            {dot && <span className={clsx('w-1.5 h-1.5 rounded-full mr-1.5', dotColors[variant])} />}
            {children}
            {removable && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-black/10 transition-colors"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </span>
    );
}
