'use client';

import React, { createContext, useContext, useState } from 'react';
import { clsx } from 'clsx';

interface TabsContextType {
    activeTab: string;
    setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

interface TabsProps {
    children: React.ReactNode;
    defaultValue: string;
    className?: string;
    onChange?: (value: string) => void;
}

export function Tabs({ children, defaultValue, className, onChange }: TabsProps) {
    const [activeTab, setActiveTab] = useState(defaultValue);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        onChange?.(value);
    };

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
            <div className={className}>{children}</div>
        </TabsContext.Provider>
    );
}

interface TabsListProps {
    children: React.ReactNode;
    className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
    return (
        <div
            className={clsx(
                'flex border-b border-gray-200',
                className
            )}
        >
            {children}
        </div>
    );
}

interface TabsTriggerProps {
    children: React.ReactNode;
    value: string;
    className?: string;
    disabled?: boolean;
}

export function TabsTrigger({ children, value, className, disabled = false }: TabsTriggerProps) {
    const context = useContext(TabsContext);
    if (!context) throw new Error('TabsTrigger must be used within Tabs');

    const { activeTab, setActiveTab } = context;
    const isActive = activeTab === value;

    return (
        <button
            type="button"
            onClick={() => !disabled && setActiveTab(value)}
            disabled={disabled}
            className={clsx(
                'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                isActive
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                disabled && 'opacity-50 cursor-not-allowed',
                className
            )}
        >
            {children}
        </button>
    );
}

interface TabsContentProps {
    children: React.ReactNode;
    value: string;
    className?: string;
}

export function TabsContent({ children, value, className }: TabsContentProps) {
    const context = useContext(TabsContext);
    if (!context) throw new Error('TabsContent must be used within Tabs');

    if (context.activeTab !== value) return null;

    return <div className={clsx('py-4', className)}>{children}</div>;
}
