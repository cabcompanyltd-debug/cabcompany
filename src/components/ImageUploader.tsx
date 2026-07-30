/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Upload, X, RefreshCw, Check, Image as ImageIcon } from 'lucide-react';
import { uploadImage } from '../lib/api';

interface ImageUploaderProps {
  bucket: string;
  imageUrl: string;
  imageKey?: string;
  onUploadSuccess: (url: string, key: string) => void;
  onRemove?: () => void;
  label?: string;
  hint?: string;
}

export default function ImageUploader({
  bucket,
  imageUrl,
  imageKey,
  onUploadSuccess,
  onRemove,
  label = 'Featured Image',
  hint = 'Upload JPG, PNG, or WEBP directly to InsForge Storage'
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(20);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        setProgress(50);
        const base64 = reader.result as string;

        const result = await uploadImage(file, bucket, base64);
        setProgress(100);
        onUploadSuccess(result.url, result.key);
        setTimeout(() => setProgress(null), 1000);
      } catch (err: any) {
        console.error('Image upload error:', err);
        setError(err.message || 'Failed to upload image');
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = async () => {
    if (imageKey) {
      try {
        await fetch('/api/storage/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bucket, key: imageKey })
        });
      } catch (e) {
        console.warn('Storage delete fail notice:', e);
      }
    }
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-black uppercase text-brand-dark/50 tracking-wider">
        {label}
      </label>

      {imageUrl ? (
        <div className="relative group rounded-2xl overflow-hidden border border-black/10 bg-gray-50 max-h-48 flex items-center justify-center">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-2xl"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-3">
            <label className="p-2.5 bg-white text-brand-dark rounded-xl font-bold text-xs cursor-pointer hover:bg-gray-100 transition flex items-center space-x-1.5 shadow">
              <RefreshCw size={14} className={uploading ? 'animate-spin' : ''} />
              <span>Replace Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
            </label>
            {onRemove && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="p-2.5 bg-red-600 text-white rounded-xl font-bold text-xs hover:bg-red-700 transition shadow cursor-pointer"
                title="Remove image"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <label className="border-2 border-dashed border-gray-300 hover:border-brand-green rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-gray-50 hover:bg-emerald-50/20 transition space-y-2">
          <div className="w-10 h-10 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center">
            {uploading ? <RefreshCw size={18} className="animate-spin" /> : <Upload size={18} />}
          </div>
          <div>
            <p className="text-xs font-bold text-brand-dark">Click to upload to InsForge Storage</p>
            <p className="text-[10px] text-brand-dark/50 mt-0.5">{hint}</p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}

      {progress !== null && (
        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-brand-green h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && (
        <p className="text-[10px] font-bold text-red-600 flex items-center space-x-1">
          <X size={12} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
