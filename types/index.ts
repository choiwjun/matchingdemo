// ==================== Enums ====================
export enum UserRole {
    USER = 'USER',
    BUSINESS = 'BUSINESS',
    ADMIN = 'ADMIN',
}

export enum ProjectStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export enum ContractStatus {
    PENDING = 'PENDING',
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export enum ProposalStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    WITHDRAWN = 'WITHDRAWN',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
}

export enum NotificationType {
    NEW_PROPOSAL = 'NEW_PROPOSAL',
    NEW_MESSAGE = 'NEW_MESSAGE',
    CONTRACT_CONFIRMED = 'CONTRACT_CONFIRMED',
    CONTRACT_COMPLETED = 'CONTRACT_COMPLETED',
    REVIEW_REQUEST = 'REVIEW_REQUEST',
    PAYMENT_COMPLETED = 'PAYMENT_COMPLETED',
    SYSTEM = 'SYSTEM',
}

export enum ReportStatus {
    PENDING = 'PENDING',
    RESOLVED = 'RESOLVED',
    DISMISSED = 'DISMISSED',
}

// ==================== User Types ====================
export interface User {
    id: string;
    email: string;
    emailVerified?: Date;
    phone?: string;
    phoneVerified: boolean;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    profile?: UserProfile;
    businessProfile?: BusinessProfile;
}

export interface UserProfile {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    region?: string;
    address?: string;
    interests: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface BusinessProfile {
    id: string;
    userId: string;
    companyName: string;
    businessNumber?: string;
    certificate?: string;
    description?: string;
    logo?: string;
    serviceAreas: string[];
    categories: string[];
    portfolioImages: string[];
    priceRange?: string;
    verified: boolean;
    rating: number;
    reviewCount: number;
    responseTime?: number; // in minutes
    createdAt: Date;
    updatedAt: Date;
}

// ==================== Project Types ====================
export interface Project {
    id: string;
    userId: string;
    title: string;
    description: string;
    category: string;
    location: string;
    latitude?: number;
    longitude?: number;
    budgetMin?: number;
    budgetMax?: number;
    images: string[];
    attachments: string[];
    deadline?: Date;
    status: ProjectStatus;
    createdAt: Date;
    updatedAt: Date;
    user?: User;
    proposals?: Proposal[];
    _count?: {
        proposals: number;
    };
}

export interface ProjectFormData {
    title: string;
    description: string;
    category: string;
    location: string;
    latitude?: number;
    longitude?: number;
    budgetMin?: number;
    budgetMax?: number;
    deadline?: string;
    images?: File[];
    attachments?: File[];
}

// ==================== Proposal Types ====================
export interface Proposal {
    id: string;
    projectId: string;
    businessId: string;
    amount: number;
    description: string;
    timeline?: string;
    attachments: string[];
    status: ProposalStatus;
    createdAt: Date;
    updatedAt: Date;
    project?: Project;
    business?: User;
}

export interface ProposalFormData {
    projectId: string;
    amount: number;
    description: string;
    timeline?: string;
    workPlan?: string;
    attachments?: File[];
}

// ==================== Contract Types ====================
export interface Contract {
    id: string;
    projectId: string;
    proposalId: string;
    userId: string;
    businessId: string;
    amount: number;
    status: ContractStatus;
    startDate?: Date;
    endDate?: Date;
    pdfUrl?: string;
    createdAt: Date;
    updatedAt: Date;
    project?: Project;
    proposal?: Proposal;
    user?: User;
    business?: User;
    review?: Review;
    payment?: Payment;
}

// ==================== Chat Types ====================
export interface ChatRoom {
    id: string;
    userIds: string[];
    lastMessageAt?: Date;
    createdAt: Date;
    messages?: Message[];
    participants?: User[];
    unreadCount?: number;
}

export interface Message {
    id: string;
    roomId: string;
    senderId: string;
    content: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    read: boolean;
    createdAt: Date;
    sender?: User;
}

export interface ChatMessageData {
    roomId: string;
    content: string;
    file?: File;
}

// ==================== Payment Types ====================
export interface Payment {
    id: string;
    contractId: string;
    userId: string;
    amount: number;
    platformFee: number;
    netAmount: number;
    method: string;
    status: PaymentStatus;
    transactionId?: string;
    receiptUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Settlement {
    id: string;
    businessId: string;
    amount: number;
    fee: number;
    netAmount: number;
    status: string;
    bankAccount?: string;
    processedAt?: Date;
    createdAt: Date;
}

// ==================== Review Types ====================
export interface Review {
    id: string;
    contractId: string;
    reviewerId: string;
    revieweeId: string;
    rating: number;
    comment?: string;
    images: string[];
    createdAt: Date;
    reviewer?: User;
    reviewee?: User;
    contract?: Contract;
}

export interface ReviewFormData {
    contractId: string;
    rating: number;
    comment?: string;
    images?: File[];
}

// ==================== Notification Types ====================
export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
    read: boolean;
    createdAt: Date;
}

// ==================== Category Types ====================
export interface Category {
    id: string;
    name: string;
    nameKo: string;
    description?: string;
    icon?: string;
    parentId?: string;
    order: number;
    active: boolean;
    children?: Category[];
}

// ==================== Content Types ====================
export interface Content {
    id: string;
    type: 'announcement' | 'faq' | 'banner';
    title: string;
    content: string;
    imageUrl?: string;
    link?: string;
    order: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// ==================== Report Types ====================
export interface Report {
    id: string;
    reporterId: string;
    reportedId: string;
    reason: string;
    description?: string;
    status: ReportStatus;
    resolvedAt?: Date;
    resolvedBy?: string;
    createdAt: Date;
    reporter?: User;
    reported?: User;
}

// ==================== Statistics Types ====================
export interface DashboardStats {
    totalUsers: number;
    totalBusinesses: number;
    totalProjects: number;
    totalContracts: number;
    activeProjects: number;
    completedContracts: number;
    totalRevenue: number;
    monthlyRevenue: number;
    matchingRate: number;
}

export interface MonthlyStats {
    month: string;
    newUsers: number;
    newBusinesses: number;
    newProjects: number;
    completedContracts: number;
    revenue: number;
}

export interface CategoryStats {
    category: string;
    projectCount: number;
    contractCount: number;
    revenue: number;
    popularity: number;
}

// ==================== API Response Types ====================
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// ==================== Form Filter Types ====================
export interface ProjectFilters {
    category?: string;
    location?: string;
    status?: ProjectStatus;
    budgetMin?: number;
    budgetMax?: number;
    sortBy?: 'createdAt' | 'budget' | 'deadline';
    sortOrder?: 'asc' | 'desc';
}

export interface ProposalFilters {
    status?: ProposalStatus;
    sortBy?: 'amount' | 'createdAt' | 'rating';
    sortOrder?: 'asc' | 'desc';
}
