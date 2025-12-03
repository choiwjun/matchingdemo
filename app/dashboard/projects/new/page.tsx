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
                throw new Error(result.error || '프로젝트 등록에 실패했습니다.');
            }

            router.push('/dashboard/projects?created=true');
        } catch (err) {
            setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
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
                            <h1 className="text-xl font-bold text-gray-900">새 프로젝트 등록</h1>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 max-w-3xl">
                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8">
                    {['기본 정보', '상세 내용', '파일 업로드'].map((label, index) => (
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
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h2>

                                <Input
                                    label="프로젝트 제목"
                                    placeholder="예: 아파트 인테리어 리모델링"
                                    {...register('title', {
                                        required: '제목을 입력해주세요.',
                                        maxLength: {
                                            value: 100,
                                            message: '제목은 100자 이내로 입력해주세요.',
                                        },
                                    })}
                                    error={errors.title?.message}
                                />

                                <Select
                                    label="카테고리"
                                    options={CATEGORIES.map((c) => ({
                                        value: c.id,
                                        label: `${c.icon} ${c.nameKo}`,
                                    }))}
                                    placeholder="카테고리를 선택하세요"
                                    {...register('category', {
                                        required: '카테고리를 선택해주세요.',
                                    })}
                                    error={errors.category?.message}
                                />

                                <Select
                                    label="지역"
                                    options={REGIONS.map((r) => ({
                                        value: r.id,
                                        label: r.name,
                                    }))}
                                    placeholder="지역을 선택하세요"
                                    {...register('location', {
                                        required: '지역을 선택해주세요.',
                                    })}
                                    error={errors.location?.message}
                                />

                                <Input
                                    label="상세 주소"
                                    placeholder="정확한 주소를 입력하세요 (선택)"
                                    {...register('address')}
                                    helperText="상세 주소는 매칭 후 공개됩니다."
                                />

                                <div className="flex justify-end">
                                    <Button type="button" onClick={() => setStep(2)}>
                                        다음
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Details */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">상세 내용</h2>

                                <Textarea
                                    label="프로젝트 설명"
                                    placeholder="작업 내용을 자세히 설명해주세요. 더 정확한 견적을 받을 수 있습니다."
                                    rows={5}
                                    {...register('description', {
                                        required: '설명을 입력해주세요.',
                                        minLength: {
                                            value: 20,
                                            message: '20자 이상 입력해주세요.',
                                        },
                                    })}
                                    error={errors.description?.message}
                                    showCount
                                    maxLength={2000}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        예산 범위
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
                                                        required: '예산 범위를 선택해주세요.',
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
                                    label="마감일"
                                    type="date"
                                    {...register('deadline')}
                                    helperText="제안을 받고 싶은 마감일을 설정하세요. (선택)"
                                />

                                <Textarea
                                    label="추가 요구사항"
                                    placeholder="특별히 원하시는 조건이나 요구사항을 입력하세요. (선택)"
                                    rows={3}
                                    {...register('requirements')}
                                />

                                <div className="flex gap-3 justify-between">
                                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                                        이전
                                    </Button>
                                    <Button type="button" onClick={() => setStep(3)}>
                                        다음
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: File Upload */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">파일 업로드</h2>

                                <FileUpload
                                    label="사진 업로드"
                                    accept={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
                                    maxFiles={10}
                                    maxSize={5 * 1024 * 1024}
                                    value={images}
                                    onChange={setImages}
                                    helperText="작업 현장이나 관련 사진을 업로드하세요. (최대 10장)"
                                    previewType="image"
                                />

                                <FileUpload
                                    label="첨부파일"
                                    accept={['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
                                    maxFiles={5}
                                    maxSize={10 * 1024 * 1024}
                                    value={attachments}
                                    onChange={setAttachments}
                                    helperText="도면, 견적서 등 관련 문서를 업로드하세요. (최대 5개)"
                                    previewType="file"
                                />

                                <div className="bg-blue-50 rounded-lg p-4">
                                    <h3 className="font-medium text-blue-900 mb-2">등록 안내</h3>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>• 프로젝트가 등록되면 관련 사업자들에게 알림이 발송됩니다.</li>
                                        <li>• 사업자들의 제안을 검토하고 원하는 사업자를 선택할 수 있습니다.</li>
                                        <li>• 개인정보는 매칭 후 상대방에게만 공개됩니다.</li>
                                    </ul>
                                </div>

                                <div className="flex gap-3 justify-between">
                                    <Button type="button" variant="outline" onClick={() => setStep(2)}>
                                        이전
                                    </Button>
                                    <Button type="submit" isLoading={isLoading}>
                                        프로젝트 등록
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
