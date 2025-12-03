'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';

interface StarRatingProps {
    value: number;
    onChange?: (value: number) => void;
    readonly?: boolean;
    size?: 'sm' | 'md' | 'lg';
    showValue?: boolean;
    maxStars?: number;
    className?: string;
}

export function StarRating({
    value,
    onChange,
    readonly = false,
    size = 'md',
    showValue = false,
    maxStars = 5,
    className,
}: StarRatingProps) {
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    const sizeStyles = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
    };

    const displayValue = hoverValue ?? value;

    const handleClick = (starValue: number) => {
        if (!readonly && onChange) {
            onChange(starValue);
        }
    };

    const handleMouseEnter = (starValue: number) => {
        if (!readonly) {
            setHoverValue(starValue);
        }
    };

    const handleMouseLeave = () => {
        setHoverValue(null);
    };

    return (
        <div className={clsx('flex items-center gap-1', className)}>
            {[...Array(maxStars)].map((_, index) => {
                const starValue = index + 1;
                const isFilled = starValue <= displayValue;
                const isHalfFilled = !isFilled && starValue - 0.5 <= displayValue;

                return (
                    <button
                        key={index}
                        type="button"
                        onClick={() => handleClick(starValue)}
                        onMouseEnter={() => handleMouseEnter(starValue)}
                        onMouseLeave={handleMouseLeave}
                        className={clsx(
                            'focus:outline-none transition-colors',
                            readonly ? 'cursor-default' : 'cursor-pointer'
                        )}
                        disabled={readonly}
                    >
                        <svg
                            className={clsx(
                                sizeStyles[size],
                                isFilled || isHalfFilled ? 'text-yellow-400' : 'text-gray-300'
                            )}
                            fill={isFilled ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isHalfFilled ? (
                                <defs>
                                    <linearGradient id={`half-${index}`}>
                                        <stop offset="50%" stopColor="currentColor" />
                                        <stop offset="50%" stopColor="transparent" />
                                    </linearGradient>
                                </defs>
                            ) : null}
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                fill={isHalfFilled ? `url(#half-${index})` : isFilled ? 'currentColor' : 'none'}
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                        </svg>
                    </button>
                );
            })}
            {showValue && (
                <span className="ml-2 text-sm font-medium text-gray-600">
                    {value.toFixed(1)}
                </span>
            )}
        </div>
    );
}
