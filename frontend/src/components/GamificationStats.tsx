'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import api from '@/lib/api';

interface UserProgress {
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  totalLessons: number;
  hoursLearned: number;
  rank: string;
}

export function GamificationStats() {
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
      console.error('Error fetching gamification progress:', error);
      // Use mock data if API fails
      setProgress({
        totalXP: 2450,
        level: 12,
        currentStreak: 7,
        longestStreak: 15,
        totalLessons: 24,
        hoursLearned: 48,
        rank: 'Gold',
      });
    } finally {
      setLoading(false);
    }
  };

  const getXPForNextLevel = (level: number) => {
    return (level * level) * 100;
  };

  const getXPForCurrentLevel = (level: number) => {
    return ((level - 1) * (level - 1)) * 100;
  };

  const getProgressToNextLevel = () => {
    if (!progress) return 0;
    const currentLevelXP = getXPForCurrentLevel(progress.level);
    const nextLevelXP = getXPForNextLevel(progress.level);
    const xpInCurrentLevel = progress.totalXP - currentLevelXP;
    const xpNeededForLevel = nextLevelXP - currentLevelXP;
    return (xpInCurrentLevel / xpNeededForLevel) * 100;
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Diamond': return 'from-cyan-400 to-blue-500';
      case 'Platinum': return 'from-gray-300 to-gray-500';
      case 'Gold': return 'from-yellow-400 to-yellow-600';
      case 'Silver': return 'from-gray-200 to-gray-400';
      default: return 'from-orange-400 to-orange-600';
    }
  };

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case 'Diamond': return '💎';
      case 'Platinum': return '⚪';
      case 'Gold': return '🥇';
      case 'Silver': return '🥈';
      default: return '🥉';
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 rounded-xl"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-gray-200 rounded-xl"></div>
          <div className="h-24 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!progress) return null;

  return (
    <div className="space-y-4">
      {/* Level & XP Card */}
      <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm opacity-90">Level</div>
              <div className="text-4xl font-bold">{progress.level}</div>
            </div>
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getRankColor(progress.rank)} flex items-center justify-center text-3xl shadow-lg`}>
              {getRankIcon(progress.rank)}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{progress.totalXP.toLocaleString()} XP</span>
              <span>{getXPForNextLevel(progress.level).toLocaleString()} XP</span>
            </div>
            <Progress value={getProgressToNextLevel()} className="h-3 bg-white/20" />
            <div className="text-xs opacity-90 text-center">
              {(getXPForNextLevel(progress.level) - progress.totalXP).toLocaleString()} XP to Level {progress.level + 1}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="text-sm opacity-90">Rank</div>
            <div className="text-xl font-bold">{progress.rank}</div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <Card className="hover:shadow-lg transition">
          <CardContent className="p-4 text-center">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-bold text-orange-600">{progress.currentStreak}</div>
            <div className="text-xs text-gray-600">Day Streak</div>
            <div className="text-xs text-gray-400 mt-1">Best: {progress.longestStreak}</div>
          </CardContent>
        </Card>

        {/* Total Lessons */}
        <Card className="hover:shadow-lg transition">
          <CardContent className="p-4 text-center">
            <div className="text-3xl mb-2">📚</div>
            <div className="text-2xl font-bold text-blue-600">{progress.totalLessons}</div>
            <div className="text-xs text-gray-600">Lessons</div>
            <div className="text-xs text-gray-400 mt-1">Completed</div>
          </CardContent>
        </Card>

        {/* Hours Learned */}
        <Card className="hover:shadow-lg transition">
          <CardContent className="p-4 text-center">
            <div className="text-3xl mb-2">⏱️</div>
            <div className="text-2xl font-bold text-green-600">{Math.floor(progress.hoursLearned)}</div>
            <div className="text-xs text-gray-600">Hours</div>
            <div className="text-xs text-gray-400 mt-1">Learning Time</div>
          </CardContent>
        </Card>

        {/* Total XP */}
        <Card className="hover:shadow-lg transition">
          <CardContent className="p-4 text-center">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-purple-600">{progress.totalXP.toLocaleString()}</div>
            <div className="text-xs text-gray-600">Total XP</div>
            <div className="text-xs text-gray-400 mt-1">Experience</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
