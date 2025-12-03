// Helper to parse JSON arrays safely from SQLite string fields
export const parseJsonArray = <T = string>(value: string | null | undefined): T[] => {
    if (!value) return [];
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

// Helper to stringify array for SQLite storage
export const stringifyArray = (arr: unknown[]): string => {
    return JSON.stringify(arr || []);
};

// Format currency in Japanese Yen
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY',
    }).format(amount);
};

// Format date in Japanese format
export const formatDate = (dateString: string | Date): string => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

// Format datetime in Japanese format
export const formatDateTime = (dateString: string | Date): string => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
