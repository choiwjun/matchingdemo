'use client';

import React from 'react';
import { clsx } from 'clsx';
import Image from 'next/image';

interface AvatarProps {
    src?: string | null;
    alt?: string;
    name?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    showStatus?: boolean;
    status?: 'online' | 'offline' | 'busy' | 'away';
}

export function Avatar({
    src,
    alt = 'Avatar',
    name,
    size = 'md',
    className,
    showStatus = false,
    status = 'offline',
}: AvatarProps) {
    const sizeStyles = {
        xs: 'w-6 h-6 text-xs',
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-12 h-12 text-lg',
        xl: 'w-16 h-16 text-xl',
    };

    const statusSizes = {
        xs: 'w-1.5 h-1.5',
        sm: 'w-2 h-2',
        md: 'w-2.5 h-2.5',
        lg: 'w-3 h-3',
        xl: 'w-4 h-4',
    };

    const statusColors = {
        online: 'bg-green-500',
        offline: 'bg-gray-400',
        busy: 'bg-red-500',
        away: 'bg-yellow-500',
    };

    const getInitials = (name?: string) => {
        if (!name) return '?';
        const names = name.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return name[0].toUpperCase();
    };

    const getColorFromName = (name?: string) => {
        if (!name) return 'bg-gray-500';
        const colors = [
            'bg-red-500',
            'bg-orange-500',
            'bg-amber-500',
            'bg-yellow-500',
            'bg-lime-500',
            'bg-green-500',
            'bg-emerald-500',
            'bg-teal-500',
            'bg-cyan-500',
            'bg-sky-500',
            'bg-blue-500',
            'bg-indigo-500',
            'bg-violet-500',
            'bg-purple-500',
            'bg-fuchsia-500',
            'bg-pink-500',
            'bg-rose-500',
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    return (
        <div className={clsx('relative inline-flex flex-shrink-0', className)}>
            {src ? (
                <Image
                    src={src}
                    alt={alt}
                    width={64}
                    height={64}
                    className={clsx('rounded-full object-cover', sizeStyles[size])}
                />
            ) : (
                <div
                    className={clsx(
                        'rounded-full flex items-center justify-center text-white font-medium',
                        sizeStyles[size],
                        getColorFromName(name)
                    )}
                >
                    {getInitials(name)}
                </div>
            )}
            {showStatus && (
                <span
                    className={clsx(
                        'absolute bottom-0 right-0 rounded-full ring-2 ring-white',
                        statusSizes[size],
                        statusColors[status]
                    )}
                />
            )}
        </div>
    );
}

interface AvatarGroupProps {
    children: React.ReactNode;
    max?: number;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function AvatarGroup({ children, max = 4, size = 'md' }: AvatarGroupProps) {
    const childArray = React.Children.toArray(children);
    const visibleChildren = childArray.slice(0, max);
    const remainingCount = childArray.length - max;

    const overlapStyles = {
        xs: '-ml-1.5',
        sm: '-ml-2',
        md: '-ml-2.5',
        lg: '-ml-3',
        xl: '-ml-4',
    };

    const sizeStyles = {
        xs: 'w-6 h-6 text-xs',
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-12 h-12 text-lg',
        xl: 'w-16 h-16 text-xl',
    };

    return (
        <div className="flex items-center">
            {visibleChildren.map((child, index) => (
                <div key={index} className={clsx(index > 0 && overlapStyles[size], 'ring-2 ring-white rounded-full')}>
                    {React.isValidElement(child) && React.cloneElement(child as React.ReactElement<AvatarProps>, { size })}
                </div>
            ))}
            {remainingCount > 0 && (
                <div
                    className={clsx(
                        overlapStyles[size],
                        'ring-2 ring-white rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium',
                        sizeStyles[size]
                    )}
                >
                    +{remainingCount}
                </div>
            )}
        </div>
    );
}
