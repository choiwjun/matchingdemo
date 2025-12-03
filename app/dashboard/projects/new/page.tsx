'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
    { id: 'construction', name: '건설/인테리어' },
    { id: 'cleaning', name: '청소/정리' },
    { id: 'moving', name: '이사/운송' },
    { id: 'repair', name: '수리/설치' },
    { id: 'design', name: '디자인' },
    { id: 'it', name: 'IT/개발' },
    { id: 'education', name: '교육/과외' },
    { id: 'event', name: '행사/이벤트' },
    { id: 'other', name: '기타' },
];

export default function NewProjectPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        location: '',
        budgetMin: '',
        budgetMax: '',
        deadline: '',
    });
    const [images, setImages] = useState<File[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Upload images first if any
            const imageUrls: string[] = [];
            if (images.length > 0) {
                const formData = new FormData();
                images.forEach(image => formData.append('files', image));

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (uploadRes.ok) {
                    const { urls } = await uploadRes.json();
                    imageUrls.push(...urls);
                }
            }

            // Create project
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    budgetMin: formData.budgetMin ? parseInt(formData.budgetMin) : null,
                    budgetMax: formData.budgetMax ? parseInt(formData.budgetMax) : null,
                    images: imageUrls,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || '프로젝트 등록에 실패했습니다.');
            }

            const { project } = await response.json();
            router.push(`/dashboard/projects/${project.id}`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">새 프로젝트 등록</h1>
                <p className="text-gray-600 mt-2">프로젝트 정보를 입력하고 전문가의 제안을 받아보세요.</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="card space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        프로젝트 제목 *
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        value={formData.title}
                        onChange={handleChange}
                        className="input"
                        placeholder="예: 아파트 거실 인테리어"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        카테고리 *
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="input"
                        required
                    >
                        <option value="">카테고리 선택</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        상세 설명 *
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="input min-h-[150px]"
                        placeholder="프로젝트에 대해 자세히 설명해주세요..."
                        required
                    />
                </div>

                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                        작업 위치 *
                    </label>
                    <input
                        id="location"
                        name="location"
                        type="text"
                        value={formData.location}
                        onChange={handleChange}
                        className="input"
                        placeholder="예: 서울시 강남구"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        정확한 주소는 계약 후 공유됩니다.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="budgetMin" className="block text-sm font-medium text-gray-700 mb-1">
                            최소 예산 (원)
                        </label>
                        <input
                            id="budgetMin"
                            name="budgetMin"
                            type="number"
                            value={formData.budgetMin}
                            onChange={handleChange}
                            className="input"
                            placeholder="500000"
                        />
                    </div>
                    <div>
                        <label htmlFor="budgetMax" className="block text-sm font-medium text-gray-700 mb-1">
                            최대 예산 (원)
                        </label>
                        <input
                            id="budgetMax"
                            name="budgetMax"
                            type="number"
                            value={formData.budgetMax}
                            onChange={handleChange}
                            className="input"
                            placeholder="1000000"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                        제안 마감일
                    </label>
                    <input
                        id="deadline"
                        name="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={handleChange}
                        className="input"
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>

                <div>
                    <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
                        참고 이미지
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-400 transition-colors">
                        <div className="space-y-1 text-center">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                            >
                                <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                                <label
                                    htmlFor="images"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500"
                                >
                                    <span>파일 업로드</span>
                                    <input
                                        id="images"
                                        name="images"
                                        type="file"
                                        className="sr-only"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </label>
                                <p className="pl-1">또는 드래그 앤 드롭</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF (최대 10MB)</p>
                            {images.length > 0 && (
                                <p className="text-sm text-primary-600 font-medium">
                                    {images.length}개 파일 선택됨
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="btn btn-secondary flex-1"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary flex-1"
                    >
                        {loading ? '등록 중...' : '프로젝트 등록'}
                    </button>
                </div>
            </form>
        </div>
    );
}
