'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Button, Input } from '@/components/ui';

interface ForgotPasswordFormData {
    email: string;
}

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>();

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);
        setError('');

        try {
            // TODO: 실제 비밀번호 재설정 이메일 발송 API 연동
            // 현재는 데모용으로 성공 메시지만 표시
            await new Promise(resolve => setTimeout(resolve, 1000));
            setIsSubmitted(true);
        } catch (e) {
            console.error('Forgot password error:', e);
            setError('エラーが発生しました。もう一度お試しください。');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            メールを送信しました
                        </h2>
                        <p className="text-gray-600 mb-6">
                            パスワード再設定用のリンクをメールでお送りしました。
                            メールをご確認ください。
                        </p>
                        <Link
                            href="/auth/login"
                            className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            ログインページへ戻る
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-block mb-4">
                            <h1 className="text-3xl font-bold text-primary-600">Marketplace</h1>
                        </Link>
                        <h2 className="text-xl font-semibold text-gray-900">パスワードをお忘れですか？</h2>
                        <p className="text-gray-600 mt-1">
                            登録したメールアドレスを入力してください。
                            パスワード再設定用のリンクをお送りします。
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

                        <Button type="submit" fullWidth isLoading={isLoading}>
                            {isLoading ? '送信中...' : 'パスワード再設定リンクを送信'}
                        </Button>
                    </form>

                    {/* Back to Login */}
                    <p className="mt-8 text-center text-sm text-gray-600">
                        <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
                            ← ログインページへ戻る
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
