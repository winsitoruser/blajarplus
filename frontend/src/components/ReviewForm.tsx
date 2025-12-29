'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { reviewsApi } from '@/lib/api';

interface ReviewFormProps {
  bookingId: string;
  tutorName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReviewForm({ bookingId, tutorName, onSuccess, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Silakan pilih rating');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await reviewsApi.create({
        bookingId,
        rating,
        comment: comment.trim() || undefined,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengirim review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tulis Review untuk {tutorName}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Rating Stars */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="text-4xl transition-transform hover:scale-110 focus:outline-none"
                >
                  <span
                    className={
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-500'
                        : 'text-gray-300'
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {rating === 1 && 'Sangat Buruk'}
                {rating === 2 && 'Buruk'}
                {rating === 3 && 'Cukup'}
                {rating === 4 && 'Baik'}
                {rating === 5 && 'Sangat Baik'}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Komentar (Opsional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={4}
              placeholder="Ceritakan pengalaman Anda belajar dengan tutor ini..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={submitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              Review Anda akan membantu siswa lain dalam memilih tutor
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={submitting || rating === 0}
              className="flex-1"
            >
              {submitting ? 'Mengirim...' : 'Kirim Review'}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={submitting}
              >
                Batal
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
