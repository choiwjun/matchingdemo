// Type definitions for Prisma models
// Since SQLite doesn't support enums, we define them here for type safety

export enum ProjectStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

export enum ProposalStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN"
}

export enum ContractStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

export enum UserRole {
  USER = "USER",
  BUSINESS = "BUSINESS",
  ADMIN = "ADMIN"
}

export enum NotificationType {
  NEW_PROPOSAL = "NEW_PROPOSAL",
  NEW_MESSAGE = "NEW_MESSAGE",
  CONTRACT_CONFIRMED = "CONTRACT_CONFIRMED",
  CONTRACT_COMPLETED = "CONTRACT_COMPLETED",
  REVIEW_REQUEST = "REVIEW_REQUEST",
  SYSTEM = "SYSTEM"
}
