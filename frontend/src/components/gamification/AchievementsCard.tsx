'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: string;
  category: string;
  requirement: number;
  points: number;
  progress: number;
  unlocked: boolean;
  completedAt: string | null;
}

export default function AchievementsCard() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await api.get('/gamification/achievements');
      setAchievements(response.data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'unlocked') return achievement.unlocked;
    if (filter === 'locked') return !achievement.unlocked;
    return true;
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalPoints = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0);

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle>Loading Achievements...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Achievements</CardTitle>
          <div className="text-sm text-gray-600">
            <span className="font-bold text-purple-600">{unlockedCount}</span> / {achievements.length}
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex gap-4 mt-2">
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg px-3 py-2 border border-yellow-200">
            <p className="text-xs text-gray-600">Total Points</p>
            <p className="text-lg font-bold text-orange-600">{totalPoints}</p>
          </div>
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg px-3 py-2 border border-green-200">
            <p className="text-xs text-gray-600">Completion</p>
            <p className="text-lg font-bold text-green-600">
              {achievements.length > 0 ? Math.round((unlockedCount / achievements.length) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unlocked')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'unlocked'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Unlocked
          </button>
          <button
            onClick={() => setFilter('locked')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'locked'
                ? 'bg-gray-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Locked
          </button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredAchievements.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No achievements found</p>
            </div>
          ) : (
            filteredAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-md'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`text-4xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900">{achievement.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                      </div>
                      <div className="text-right ml-2">
                        <div className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold border border-yellow-300">
                          +{achievement.points} pts
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    {!achievement.unlocked && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{achievement.progress} / {achievement.requirement}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, (achievement.progress / achievement.requirement) * 100)}%`
                            }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Unlocked Date */}
                    {achievement.unlocked && achievement.completedAt && (
                      <p className="text-xs text-green-600 mt-2 font-medium">
                        ✓ Unlocked on {new Date(achievement.completedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
