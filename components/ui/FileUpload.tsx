'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { clsx } from 'clsx';
import Image from 'next/image';

interface FileUploadProps {
    label?: string;
    accept?: string[];
    maxFiles?: number;
    maxSize?: number;
    multiple?: boolean;
    value?: File[];
    onChange?: (files: File[]) => void;
    error?: string;
    helperText?: string;
    showPreview?: boolean;
    previewType?: 'image' | 'file';
}

export function FileUpload({
    label,
    accept = ['image/*'],
    maxFiles = 5,
    maxSize = 5 * 1024 * 1024,
    multiple = true,
    value = [],
    onChange,
    error,
    helperText,
    showPreview = true,
    previewType = 'image',
}: FileUploadProps) {
    const [previews, setPreviews] = useState<string[]>([]);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const newFiles = multiple ? [...value, ...acceptedFiles].slice(0, maxFiles) : acceptedFiles.slice(0, 1);
            onChange?.(newFiles);

            if (previewType === 'image') {
                const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
                setPreviews((prev) => (multiple ? [...prev, ...newPreviews].slice(0, maxFiles) : newPreviews));
            }
        },
        [value, maxFiles, multiple, onChange, previewType]
    );

    const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
        onDrop,
        accept: accept.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
        maxFiles: multiple ? maxFiles - value.length : 1,
        maxSize,
        multiple,
        disabled: value.length >= maxFiles,
    });

    const removeFile = (index: number) => {
        const newFiles = value.filter((_, i) => i !== index);
        onChange?.(newFiles);

        if (previewType === 'image' && previews[index]) {
            URL.revokeObjectURL(previews[index]);
            setPreviews((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}

            <div
                {...getRootProps()}
                className={clsx(
                    'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
                    isDragActive
                        ? 'border-primary-500 bg-primary-50'
                        : error
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50',
                    value.length >= maxFiles && 'opacity-50 cursor-not-allowed'
                )}
            >
                <input {...getInputProps()} />
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
                <p className="mt-2 text-sm text-gray-600">
                    {isDragActive ? (
                        '파일을 놓으세요'
                    ) : (
                        <>
                            <span className="font-medium text-primary-600">클릭하여 업로드</span> 또는 드래그 앤 드롭
                        </>
                    )}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                    최대 {maxFiles}개, {formatFileSize(maxSize)} 이하
                </p>
            </div>

            {/* Error messages */}
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            {fileRejections.length > 0 && (
                <p className="mt-1 text-sm text-red-600">
                    일부 파일이 거부되었습니다. 파일 형식과 크기를 확인하세요.
                </p>
            )}
            {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}

            {/* Preview */}
            {showPreview && value.length > 0 && (
                <div className="mt-4">
                    {previewType === 'image' ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {value.map((file, index) => (
                                <div key={index} className="relative group">
                                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                        <Image
                                            src={previews[index] || URL.createObjectURL(file)}
                                            alt={file.name}
                                            width={200}
                                            height={200}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    <p className="mt-1 text-xs text-gray-500 truncate">{file.name}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200 border rounded-lg">
                            {value.map((file, index) => (
                                <li key={index} className="flex items-center justify-between p-3">
                                    <div className="flex items-center gap-3">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="p-1 text-gray-400 hover:text-red-500"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
