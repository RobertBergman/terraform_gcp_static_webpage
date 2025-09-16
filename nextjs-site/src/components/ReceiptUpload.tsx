'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ReceiptUploadProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;
}

export default function ReceiptUpload({ onUpload, isLoading = false }: ReceiptUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onUpload(file);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    disabled: isLoading,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`mt-2 flex justify-center rounded-lg border border-dashed ${
          isDragActive ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'
        } px-6 py-10 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-300"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
              clipRule="evenodd"
            />
          </svg>
          <div className="mt-4 flex text-sm leading-6 text-gray-600">
            <input {...getInputProps()} />
            <label className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
              {isLoading ? (
                <span>Uploading...</span>
              ) : (
                <>
                  <span>Upload a file</span>
                  <p className="pl-1">or drag and drop</p>
                </>
              )}
            </label>
          </div>
          <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF, PDF up to 10MB</p>
        </div>
      </div>
      {preview && !isLoading && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-900">Preview</h3>
          <div className="mt-2">
            {preview.startsWith('data:application/pdf') ? (
              <div className="p-4 bg-gray-100 rounded">
                <p className="text-sm text-gray-600">PDF receipt uploaded successfully</p>
              </div>
            ) : (
              <img src={preview} alt="Receipt preview" className="max-h-64 rounded" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}