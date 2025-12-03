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
                throw new Error(result.error || '会員登録に失敗いたしました。');
            }

            router.push('/auth/login?registered=true');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'エラーが発生いたしました。');
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
                        <h2 className="text-xl font-semibold text-gray-900">新規登録</h2>
                        <p className="text-gray-600 mt-1">新しいアカウントを作成してください</p>
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
                                        会員タイプを選択
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
                                            <span className="font-medium">一般ユーザー</span>
                                            <span className="text-xs text-gray-500 mt-1">サービスを利用します</span>
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
                                            <span className="font-medium">事業者</span>
                                            <span className="text-xs text-gray-500 mt-1">サービスを提供します</span>
                                        </label>
                                    </div>
                                </div>

                                <Input
                                    label="メールアドレス"
                                    type="email"
                                    placeholder="example@email.com"
                                    {...register('email', {
                                        required: 'メールアドレスを入力してください。',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: '有効なメールアドレスを入力してください。',
                                        },
                                    })}
                                    error={errors.email?.message}
                                />

                                <Input
                                    label="パスワード"
                                    type="password"
                                    placeholder="8文字以上で入力"
                                    {...register('password', {
                                        required: 'パスワードを入力してください。',
                                        minLength: {
                                            value: 8,
                                            message: 'パスワードは8文字以上で入力してください。',
                                        },
                                    })}
                                    error={errors.password?.message}
                                />

                                <Input
                                    label="パスワード確認"
                                    type="password"
                                    placeholder="パスワードを再入力"
                                    {...register('confirmPassword', {
                                        required: 'パスワードを再度入力してください。',
                                        validate: (value) =>
                                            value === password || 'パスワードが一致しません。',
                                    })}
                                    error={errors.confirmPassword?.message}
                                />

                                <Button
                                    type="button"
                                    fullWidth
                                    onClick={() => setStep(2)}
                                >
                                    次へ
                                </Button>
                            </div>
                        )}

                        {/* Step 2: Personal/Business Info */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="姓"
                                        placeholder="山田"
                                        {...register('lastName', {
                                            required: '姓を入力してください。',
                                        })}
                                        error={errors.lastName?.message}
                                    />
                                    <Input
                                        label="名"
                                        placeholder="太郎"
                                        {...register('firstName', {
                                            required: '名を入力してください。',
                                        })}
                                        error={errors.firstName?.message}
                                    />
                                </div>

                                <Input
                                    label="電話番号"
                                    type="tel"
                                    placeholder="090-1234-5678"
                                    {...register('phone', {
                                        required: '電話番号を入力してください。',
                                        pattern: {
                                            value: /^[0-9-]+$/,
                                            message: '有効な電話番号を入力してください。',
                                        },
                                    })}
                                    error={errors.phone?.message}
                                />

                                <Select
                                    label="地域"
                                    options={REGIONS.map((r) => ({ value: r.id, label: r.name }))}
                                    placeholder="地域を選択してください"
                                    {...register('region')}
                                />

                                {role === 'BUSINESS' && (
                                    <>
                                        <Input
                                            label="会社名"
                                            placeholder="会社名を入力してください"
                                            {...register('companyName', {
                                                required: role === 'BUSINESS' ? '会社名を入力してください。' : false,
                                            })}
                                            error={errors.companyName?.message}
                                        />
                                        <Input
                                            label="法人番号"
                                            placeholder="0000-00-00000"
                                            {...register('businessNumber')}
                                            helperText="任意項目です。後から入力することもできます。"
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
                                        戻る
                                    </Button>
                                    <Button
                                        type="button"
                                        fullWidth
                                        onClick={() => setStep(3)}
                                    >
                                        次へ
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Interests */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        関心分野を選択 {role === 'BUSINESS' && '（サービスカテゴリ）'}
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
                                            <Link href="/terms" className="text-primary-600 hover:underline">利用規約</Link>および{' '}
                                            <Link href="/privacy" className="text-primary-600 hover:underline">プライバシーポリシー</Link>に同意します。
                                        </span>
                                    </label>
                                    <label className="flex items-start gap-3">
                                        <input type="checkbox" className="mt-1 w-4 h-4 text-primary-600 rounded" />
                                        <span className="text-sm text-gray-600">
                                            マーケティング情報の受信に同意します。（任意）
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
                                        戻る
                                    </Button>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        isLoading={isLoading}
                                    >
                                        登録を完了する
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
                                    <span className="px-4 bg-white text-gray-500">または</span>
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
                                    Googleで続ける
                                </button>
                                <button
                                    type="button"
                                    className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                    </svg>
                                    Appleで続ける
                                </button>
                            </div>
                        </>
                    )}

                    {/* Login Link */}
                    <p className="mt-8 text-center text-sm text-gray-600">
                        既にアカウントをお持ちですか？{' '}
                        <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
                            ログイン
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
