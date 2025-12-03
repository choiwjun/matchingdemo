'use client';

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    showCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, helperText, showCount, maxLength, className, id, value, ...props }, ref) => {
        const textareaId = id || props.name;
        const currentLength = typeof value === 'string' ? value.length : 0;

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={textareaId}
                    value={value}
                    maxLength={maxLength}
                    className={clsx(
                        'block w-full rounded-lg border px-4 py-2.5 transition-colors duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                        'disabled:bg-gray-100 disabled:cursor-not-allowed',
                        'resize-y min-h-[100px]',
                        error
                            ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500'
                            : 'border-gray-300 text-gray-900 placeholder-gray-400',
                        className
                    )}
                    {...props}
                />
                <div className="mt-1 flex justify-between">
                    <div>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
                    </div>
                    {showCount && maxLength && (
                        <p className="text-sm text-gray-500">
                            {currentLength} / {maxLength}
                        </p>
                    )}
                </div>
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';
