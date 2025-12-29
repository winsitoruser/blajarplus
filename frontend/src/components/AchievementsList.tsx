'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import api from '@/lib/api';

interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement: number;
  xpReward: number;
  progress: number;
  unlocked: boolean;
  unlockedAt: string | null;
}

export function AchievementsList() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await api.get('/gamification/achievements');
      setAchievements(response.data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      // Use mock data if API fails
      setAchievements([
        { id: '1', code: 'first_lesson', name: 'First Step', description: 'Complete your first lesson', icon: '🎯', category: 'lessons', requirement: 1, xpReward: 50, progress: 1, unlocked: true, unlockedAt: '2024-12-01' },
        { id: '2', code: 'week_warrior', name: 'Week Warrior', description: 'Maintain 7-day streak', icon: '🔥', category: 'streak', requirement: 7, xpReward: 100, progress: 7, unlocked: true, unlockedAt: '2024-12-15' },
        { id: '3', code: 'knowledge_seeker', name: 'Knowledge Seeker', description: 'Complete 10 lessons', icon: '📚', category: 'lessons', requirement: 10, xpReward: 150, progress: 10, unlocked: true, unlockedAt: '2024-12-20' },
        { id: '9', code: 'marathon', name: 'Marathon', description: 'Study for 3 hours in one day', icon: '🏃', category: 'time', requirement: 3, xpReward: 150, progress: 1, unlocked: false, unlockedAt: null },
        { id: '10', code: 'master', name: 'Master', description: 'Reach level 20', icon: '👑', category: 'level', requirement: 20, xpReward: 500, progress: 12, unlocked: false, unlockedAt: null },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'All', icon: '🏆' },
    { value: 'lessons', label: 'Lessons', icon: '📚' },
    { value: 'streak', label: 'Streak', icon: '🔥' },
    { value: 'time', label: 'Time', icon: '⏱️' },
    { value: 'social', label: 'Social', icon: '👥' },
    { value: 'level', label: 'Level', icon: '⭐' },
  ];

  const filteredAchievements = filter === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === filter);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Achievements</h3>
          <p className="text-sm text-gray-600">
            {unlockedCount} of {totalCount} unlocked
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-indigo-600">{Math.round((unlockedCount / totalCount) * 100)}%</div>
          <div className="text-xs text-gray-600">Completion</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => setFilter(cat.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
              filter === cat.value
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{cat.icon}</span>
            <span className="text-sm font-medium">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAchievements.map(achievement => (
          <Card 
            key={achievement.id}
            className={`hover:shadow-lg transition ${
              achievement.unlocked 
                ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' 
                : 'bg-gray-50 opacity-75'
            }`}
          >
            <CardContent className="p-4">
              <div className="flex gap-4">
                {/* Icon */}
                <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center text-3xl ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg' 
                    : 'bg-gray-200'
                }`}>
                  {achievement.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={`font-bold ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                      {achievement.name}
                    </h4>
                    {achievement.unlocked && (
                      <span className="flex-shrink-0 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                        ✓ Unlocked
                      </span>
                    )}
                  </div>
                  
                  <p className={`text-sm mb-3 ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                    {achievement.description}
                  </p>

                  {/* Progress */}
                  {!achievement.unlocked && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Progress</span>
                        <span>{achievement.progress} / {achievement.requirement}</span>
                      </div>
                      <Progress 
                        value={(achievement.progress / achievement.requirement) * 100} 
                        className="h-2"
                      />
                    </div>
                  )}

                  {/* Unlocked Date or Reward */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                    {achievement.unlocked ? (
                      <span className="text-xs text-gray-500">
                        {new Date(achievement.unlockedAt!).toLocaleDateString('id-ID', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">Not unlocked yet</span>
                    )}
                    <span className="text-xs font-medium text-indigo-600">
                      +{achievement.xpReward} XP
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <p className="text-gray-500">No achievements in this category yet</p>
        </div>
      )}
    </div>
  );
}
