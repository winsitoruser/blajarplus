'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';

interface UserProgress {
  level: number;
  xp: number;
  totalXp: number;
  streak: number;
  longestStreak: number;
  totalSessions: number;
  totalHours: number;
}

export default function ProgressCard() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await api.get('/gamification/progress');
      setProgress(response.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRank = (level: number): string => {
    if (level >= 50) return 'Diamond';
    if (level >= 30) return 'Platinum';
    if (level >= 20) return 'Gold';
    if (level >= 10) return 'Silver';
    return 'Bronze';
  };

  const getRankColor = (rank: string): string => {
    switch (rank) {
      case 'Diamond': return 'from-cyan-400 to-blue-500';
      case 'Platinum': return 'from-gray-300 to-gray-500';
      case 'Gold': return 'from-yellow-400 to-yellow-600';
      case 'Silver': return 'from-gray-400 to-gray-600';
      default: return 'from-orange-400 to-orange-600';
    }
  };

  const calculateXPForNextLevel = (level: number): number => {
    return (level + 1) * (level + 1) * 100;
  };

  const calculateXPProgress = (currentXP: number, level: number): number => {
    const currentLevelXP = level * level * 100;
    const nextLevelXP = (level + 1) * (level + 1) * 100;
    const xpInCurrentLevel = currentXP - currentLevelXP;
    const xpNeededForLevel = nextLevelXP - currentLevelXP;
    return Math.max(0, Math.min(100, (xpInCurrentLevel / xpNeededForLevel) * 100));
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle>Loading Progress...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (!progress) return null;

  const rank = calculateRank(progress.level);
  const xpProgress = calculateXPProgress(progress.totalXp, progress.level);
  const xpForNextLevel = calculateXPForNextLevel(progress.level);
  const currentLevelXP = progress.level * progress.level * 100;
  const xpInCurrentLevel = progress.totalXp - currentLevelXP;

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-xl font-bold text-purple-900">Your Progress</span>
          <div className={`px-4 py-1 rounded-full bg-gradient-to-r ${getRankColor(rank)} text-white font-bold text-sm shadow-lg`}>
            {rank}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Level and XP */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {progress.level}
              </div>
              <div>
                <p className="text-sm text-gray-600">Level {progress.level}</p>
                <p className="text-xs text-gray-500">{xpInCurrentLevel} / {xpForNextLevel - currentLevelXP} XP</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-600">{progress.totalXp}</p>
              <p className="text-xs text-gray-500">Total XP</p>
            </div>
          </div>
          
          {/* XP Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="bg-white rounded-lg p-3 text-center shadow-sm">
            <div className="text-2xl mb-1">🔥</div>
            <p className="text-xl font-bold text-orange-600">{progress.streak}</p>
            <p className="text-xs text-gray-500">Day Streak</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center shadow-sm">
            <div className="text-2xl mb-1">📚</div>
            <p className="text-xl font-bold text-blue-600">{progress.totalSessions}</p>
            <p className="text-xs text-gray-500">Sessions</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center shadow-sm">
            <div className="text-2xl mb-1">⏱️</div>
            <p className="text-xl font-bold text-green-600">{progress.totalHours.toFixed(1)}h</p>
            <p className="text-xs text-gray-500">Total Hours</p>
          </div>
        </div>

        {/* Longest Streak */}
        {progress.longestStreak > 0 && (
          <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-3 text-center border border-orange-200">
            <p className="text-sm text-gray-700">
              🏆 Best Streak: <span className="font-bold text-orange-600">{progress.longestStreak} days</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
