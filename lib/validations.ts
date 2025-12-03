import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email('유효한 이메일을 입력해주세요.'),
    password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
    firstName: z.string().min(1, '이름을 입력해주세요.'),
    lastName: z.string().min(1, '성을 입력해주세요.'),
    phone: z.string().optional(),
    role: z.enum(['USER', 'BUSINESS', 'ADMIN']),
});

export const loginSchema = z.object({
    email: z.string().email('유효한 이메일을 입력해주세요.'),
    password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

export const projectSchema = z.object({
    title: z.string().min(5, '제목은 최소 5자 이상이어야 합니다.'),
    description: z.string().min(20, '설명은 최소 20자 이상이어야 합니다.'),
    category: z.string().min(1, '카테고리를 선택해주세요.'),
    location: z.string().min(1, '위치를 입력해주세요.'),
    budgetMin: z.number().optional(),
    budgetMax: z.number().optional(),
    deadline: z.date().optional(),
    images: z.array(z.string()).optional(),
});

export const proposalSchema = z.object({
    projectId: z.string(),
    amount: z.number().min(0, '금액은 0 이상이어야 합니다.'),
    description: z.string().min(20, '제안 내용은 최소 20자 이상이어야 합니다.'),
    timeline: z.string().optional(),
    attachments: z.array(z.string()).optional(),
});

export const reviewSchema = z.object({
    contractId: z.string(),
    rating: z.number().min(1).max(5, '평점은 1-5 사이여야 합니다.'),
    comment: z.string().optional(),
    images: z.array(z.string()).optional(),
});
