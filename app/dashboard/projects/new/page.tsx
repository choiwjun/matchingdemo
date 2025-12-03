'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button, Input, Select, Textarea, FileUpload } from '@/components/ui';
import { CATEGORIES, REGIONS, BUDGET_RANGES } from '@/lib/constants';

interface ProjectFormData {
    title: string;
    description: string;
    category: string;
    location: string;
    address: string;
    budgetRange: string;
    budgetMin?: number;
    budgetMax?: number;
    deadline: string;
    requirements: string;
}

export default function NewProjectPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [attachments, setAttachments] = useState<File[]>([]);
    const [step, setStep] = useState(1);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ProjectFormData>();

    const budgetRange = watch('budgetRange');

    const onSubmit = async (data: ProjectFormData) => {
        setIsLoading(true);
        setError('');

        try {
            // Find budget range values
            const selectedBudget = BUDGET_RANGES.find(b => b.id === data.budgetRange);
            
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('category', data.category);
            formData.append('location', data.location);
            formData.append('address', data.address || '');
            formData.append('budgetMin', String(selectedBudget?.min || 0));
            formData.append('budgetMax', String(selectedBudget?.max || 0));
            formData.append('deadline', data.deadline || '');
            formData.append('requirements', data.requirements || '');

            images.forEach((image) => {
                formData.append('images', image);
            });

            attachments.forEach((file) => {
                formData.append('attachments', file);
            });

            const response = await fetch('/api/projects', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || '案件の登録に失敗いたしました。');
            }

            router.push('/dashboard/projects?created=true');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'エラーが発生いたしました。');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.back()}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <h1 className="text-xl font-bold text-gray-900">新規案件の登録</h1>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 max-w-3xl">
                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8">
                    {['基本情報', '詳細内容', 'ファイル添付'].map((label, index) => (
                        <React.Fragment key={index}>
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                                        step > index + 1
                                            ? 'bg-green-500 text-white'
                                            : step === index + 1
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-200 text-gray-500'
                                    }`}
                                >
                                    {step > index + 1 ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                <span className="text-xs mt-2 text-gray-600">{label}</span>
                            </div>
                            {index < 2 && (
                                <div
                                    className={`w-20 h-1 mx-2 ${
                                        step > index + 1 ? 'bg-green-500' : 'bg-gray-200'
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

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Step 1: Basic Info */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">基本情報</h2>

                                <Input
                                    label="案件タイトル"
                                    placeholder="例：マンションのインテリアリフォーム"
                                    {...register('title', {
                                        required: 'タイトルを入力してください。',
                                        maxLength: {
                                            value: 100,
                                            message: 'タイトルは100文字以内で入力してください。',
                                        },
                                    })}
                                    error={errors.title?.message}
                                />

                                <Select
                                    label="カテゴリ"
                                    options={CATEGORIES.map((c) => ({
                                        value: c.id,
                                        label: `${c.icon} ${c.nameKo}`,
                                    }))}
                                    placeholder="カテゴリを選択してください"
                                    {...register('category', {
                                        required: 'カテゴリを選択してください。',
                                    })}
                                    error={errors.category?.message}
                                />

                                <Select
                                    label="地域"
                                    options={REGIONS.map((r) => ({
                                        value: r.id,
                                        label: r.name,
                                    }))}
                                    placeholder="地域を選択してください"
                                    {...register('location', {
                                        required: '地域を選択してください。',
                                    })}
                                    error={errors.location?.message}
                                />

                                <Input
                                    label="詳細住所"
                                    placeholder="正確な住所を入力してください（任意）"
                                    {...register('address')}
                                    helperText="詳細住所はマッチング後に公開されます。"
                                />

                                <div className="flex justify-end">
                                    <Button type="button" onClick={() => setStep(2)}>
                                        次へ
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Details */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">詳細内容</h2>

                                <Textarea
                                    label="案件の説明"
                                    placeholder="作業内容を詳しくご説明ください。より正確なお見積もりを受け取ることができます。"
                                    rows={5}
                                    {...register('description', {
                                        required: '説明を入力してください。',
                                        minLength: {
                                            value: 20,
                                            message: '20文字以上で入力してください。',
                                        },
                                    })}
                                    error={errors.description?.message}
                                    showCount
                                    maxLength={2000}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        予算範囲
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {BUDGET_RANGES.map((range) => (
                                            <label
                                                key={range.id}
                                                className={`relative flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                                    budgetRange === range.id
                                                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    value={range.id}
                                                    {...register('budgetRange', {
                                                        required: '予算範囲を選択してください。',
                                                    })}
                                                    className="sr-only"
                                                />
                                                <span className="text-sm font-medium">{range.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.budgetRange && (
                                        <p className="mt-1 text-sm text-red-600">{errors.budgetRange.message}</p>
                                    )}
                                </div>

                                <Input
                                    label="締切日"
                                    type="date"
                                    {...register('deadline')}
                                    helperText="提案を受け取りたい締切日を設定してください。（任意）"
                                />

                                <Textarea
                                    label="追加のご要望"
                                    placeholder="特にご希望の条件やご要望がございましたら入力してください。（任意）"
                                    rows={3}
                                    {...register('requirements')}
                                />

                                <div className="flex gap-3 justify-between">
                                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                                        戻る
                                    </Button>
                                    <Button type="button" onClick={() => setStep(3)}>
                                        次へ
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: File Upload */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">ファイル添付</h2>

                                <FileUpload
                                    label="写真をアップロード"
                                    accept={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
                                    maxFiles={10}
                                    maxSize={5 * 1024 * 1024}
                                    value={images}
                                    onChange={setImages}
                                    helperText="作業現場や関連写真をアップロードしてください。（最大10枚）"
                                    previewType="image"
                                />

                                <FileUpload
                                    label="添付ファイル"
                                    accept={['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
                                    maxFiles={5}
                                    maxSize={10 * 1024 * 1024}
                                    value={attachments}
                                    onChange={setAttachments}
                                    helperText="図面、見積書などの関連資料をアップロードしてください。（最大5件）"
                                    previewType="file"
                                />

                                <div className="bg-blue-50 rounded-lg p-4">
                                    <h3 className="font-medium text-blue-900 mb-2">登録についてのご案内</h3>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>・案件が登録されると、関連する事業者に通知が送信されます。</li>
                                        <li>・事業者からの提案を確認し、ご希望の事業者をお選びいただけます。</li>
                                        <li>・個人情報はマッチング後に相手方にのみ公開されます。</li>
                                    </ul>
                                </div>

                                <div className="flex gap-3 justify-between">
                                    <Button type="button" variant="outline" onClick={() => setStep(2)}>
                                        戻る
                                    </Button>
                                    <Button type="submit" isLoading={isLoading}>
                                        案件を登録する
                                    </Button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </main>
        </div>
    );
}
