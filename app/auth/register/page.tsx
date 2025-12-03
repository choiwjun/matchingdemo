'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button, Input, Select } from '@/components/ui';
import { CATEGORIES, REGIONS } from '@/lib/constants';

interface RegisterFormData {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: 'USER' | 'BUSINESS';
    region?: string;
    interests?: string[];
    // Business fields
    companyName?: string;
    businessNumber?: string;
}

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>({
        defaultValues: {
            role: 'USER',
        },
    });

    const role = watch('role');
    const password = watch('password');

    const toggleInterest = (categoryId: string) => {
        setSelectedInterests((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    interests: selectedInterests,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || '회원가입에 실패했습니다.');
            }

            router.push('/auth/login?registered=true');
        } catch (err) {
            setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-block mb-4">
                            <h1 className="text-3xl font-bold text-primary-600">Marketplace</h1>
                        </Link>
                        <h2 className="text-xl font-semibold text-gray-900">회원가입</h2>
                        <p className="text-gray-600 mt-1">새로운 계정을 만들어보세요</p>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center mb-8">
                        {[1, 2, 3].map((s) => (
                            <React.Fragment key={s}>
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                                        step >= s
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-200 text-gray-500'
                                    }`}
                                >
                                    {s}
                                </div>
                                {s < 3 && (
                                    <div
                                        className={`w-12 h-1 mx-2 ${
                                            step > s ? 'bg-primary-600' : 'bg-gray-200'
                                        }`}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Step 1: Account Type & Basic Info */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        회원 유형 선택
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <label
                                            className={`relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                                role === 'USER'
                                                    ? 'border-primary-500 bg-primary-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                value="USER"
                                                {...register('role')}
                                                className="sr-only"
                                            />
                                            <svg className="w-12 h-12 text-primary-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="font-medium">일반 사용자</span>
                                            <span className="text-xs text-gray-500 mt-1">서비스를 이용합니다</span>
                                        </label>
                                        <label
                                            className={`relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                                role === 'BUSINESS'
                                                    ? 'border-primary-500 bg-primary-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                value="BUSINESS"
                                                {...register('role')}
                                                className="sr-only"
                                            />
                                            <svg className="w-12 h-12 text-secondary-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            <span className="font-medium">사업자</span>
                                            <span className="text-xs text-gray-500 mt-1">서비스를 제공합니다</span>
                                        </label>
                                    </div>
                                </div>

                                <Input
                                    label="이메일"
                                    type="email"
                                    placeholder="example@email.com"
                                    {...register('email', {
                                        required: '이메일을 입력해주세요.',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: '유효한 이메일 주소를 입력해주세요.',
                                        },
                                    })}
                                    error={errors.email?.message}
                                />

                                <Input
                                    label="비밀번호"
                                    type="password"
                                    placeholder="8자 이상 입력"
                                    {...register('password', {
                                        required: '비밀번호를 입력해주세요.',
                                        minLength: {
                                            value: 8,
                                            message: '비밀번호는 8자 이상이어야 합니다.',
                                        },
                                    })}
                                    error={errors.password?.message}
                                />

                                <Input
                                    label="비밀번호 확인"
                                    type="password"
                                    placeholder="비밀번호 재입력"
                                    {...register('confirmPassword', {
                                        required: '비밀번호를 다시 입력해주세요.',
                                        validate: (value) =>
                                            value === password || '비밀번호가 일치하지 않습니다.',
                                    })}
                                    error={errors.confirmPassword?.message}
                                />

                                <Button
                                    type="button"
                                    fullWidth
                                    onClick={() => setStep(2)}
                                >
                                    다음
                                </Button>
                            </div>
                        )}

                        {/* Step 2: Personal/Business Info */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="성"
                                        placeholder="홍"
                                        {...register('lastName', {
                                            required: '성을 입력해주세요.',
                                        })}
                                        error={errors.lastName?.message}
                                    />
                                    <Input
                                        label="이름"
                                        placeholder="길동"
                                        {...register('firstName', {
                                            required: '이름을 입력해주세요.',
                                        })}
                                        error={errors.firstName?.message}
                                    />
                                </div>

                                <Input
                                    label="전화번호"
                                    type="tel"
                                    placeholder="010-1234-5678"
                                    {...register('phone', {
                                        required: '전화번호를 입력해주세요.',
                                        pattern: {
                                            value: /^[0-9-]+$/,
                                            message: '유효한 전화번호를 입력해주세요.',
                                        },
                                    })}
                                    error={errors.phone?.message}
                                />

                                <Select
                                    label="지역"
                                    options={REGIONS.map((r) => ({ value: r.id, label: r.name }))}
                                    placeholder="지역을 선택하세요"
                                    {...register('region')}
                                />

                                {role === 'BUSINESS' && (
                                    <>
                                        <Input
                                            label="회사명"
                                            placeholder="회사명을 입력하세요"
                                            {...register('companyName', {
                                                required: role === 'BUSINESS' ? '회사명을 입력해주세요.' : false,
                                            })}
                                            error={errors.companyName?.message}
                                        />
                                        <Input
                                            label="사업자등록번호"
                                            placeholder="000-00-00000"
                                            {...register('businessNumber')}
                                            helperText="선택사항입니다. 나중에 입력할 수 있습니다."
                                        />
                                    </>
                                )}

                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        fullWidth
                                        onClick={() => setStep(1)}
                                    >
                                        이전
                                    </Button>
                                    <Button
                                        type="button"
                                        fullWidth
                                        onClick={() => setStep(3)}
                                    >
                                        다음
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Interests */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        관심 분야 선택 {role === 'BUSINESS' && '(서비스 카테고리)'}
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {CATEGORIES.map((category) => (
                                            <button
                                                key={category.id}
                                                type="button"
                                                onClick={() => toggleInterest(category.id)}
                                                className={`flex items-center gap-2 p-3 border-2 rounded-lg transition-all ${
                                                    selectedInterests.includes(category.id)
                                                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <span className="text-xl">{category.icon}</span>
                                                <span className="text-sm font-medium">{category.nameKo}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Terms Agreement */}
                                <div className="space-y-3">
                                    <label className="flex items-start gap-3">
                                        <input type="checkbox" required className="mt-1 w-4 h-4 text-primary-600 rounded" />
                                        <span className="text-sm text-gray-600">
                                            <Link href="/terms" className="text-primary-600 hover:underline">이용약관</Link> 및{' '}
                                            <Link href="/privacy" className="text-primary-600 hover:underline">개인정보 처리방침</Link>에 동의합니다.
                                        </span>
                                    </label>
                                    <label className="flex items-start gap-3">
                                        <input type="checkbox" className="mt-1 w-4 h-4 text-primary-600 rounded" />
                                        <span className="text-sm text-gray-600">
                                            마케팅 정보 수신에 동의합니다. (선택)
                                        </span>
                                    </label>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        fullWidth
                                        onClick={() => setStep(2)}
                                    >
                                        이전
                                    </Button>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        isLoading={isLoading}
                                    >
                                        회원가입 완료
                                    </Button>
                                </div>
                            </div>
                        )}
                    </form>

                    {/* Social Login */}
                    {step === 1 && (
                        <>
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500">또는</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    type="button"
                                    className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Google로 계속하기
                                </button>
                                <button
                                    type="button"
                                    className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                    </svg>
                                    Apple로 계속하기
                                </button>
                            </div>
                        </>
                    )}

                    {/* Login Link */}
                    <p className="mt-8 text-center text-sm text-gray-600">
                        이미 계정이 있으신가요?{' '}
                        <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
                            로그인
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
