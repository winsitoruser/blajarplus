'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface Banner {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  type: 'info' | 'warning' | 'success' | 'promotion';
  target: 'all' | 'student' | 'tutor';
  isActive: boolean;
  order: number;
}

interface BannerCarouselProps {
  userRole?: string;
}

export default function BannerCarousel({ userRole }: BannerCarouselProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchBanners();
  }, [userRole]);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 5000); // Auto-slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const fetchBanners = async () => {
    try {
      const response = await axios.get(`${API_URL}/banners/active`, {
        params: { role: userRole },
      });
      setBanners(response.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-300';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 border-yellow-300';
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-300';
      case 'promotion':
        return 'bg-gradient-to-r from-purple-500 to-pink-600 border-purple-300';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 border-gray-300';
    }
  };

  const handleBannerClick = () => {
    if (currentBanner.linkUrl) {
      window.open(currentBanner.linkUrl, '_blank');
    }
  };

  return (
    <div className="relative w-full">
      <div
        className={`relative rounded-xl overflow-hidden shadow-lg ${
          currentBanner.linkUrl ? 'cursor-pointer' : ''
        } ${getTypeStyles(currentBanner.type)}`}
        onClick={handleBannerClick}
      >
        {/* Banner Content */}
        <div className="relative">
          {currentBanner.imageUrl ? (
            <div className="relative h-48 md:h-64">
              <img
                src={currentBanner.imageUrl}
                alt={currentBanner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{currentBanner.title}</h3>
                {currentBanner.description && (
                  <p className="text-sm opacity-90">{currentBanner.description}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 md:p-8 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">{currentBanner.title}</h3>
              {currentBanner.description && (
                <p className="text-sm md:text-base opacity-90">{currentBanner.description}</p>
              )}
            </div>
          )}
        </div>

        {/* Link Indicator */}
        {currentBanner.linkUrl && (
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-medium">
            Klik untuk info lebih lanjut →
          </div>
        )}
      </div>

      {/* Navigation Dots */}
      {banners.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-blue-600'
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
            aria-label="Previous banner"
          >
            <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
            aria-label="Next banner"
          >
            <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
