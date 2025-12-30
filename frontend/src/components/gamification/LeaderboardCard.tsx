'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';

interface LeaderboardEntry {
  id: string;
  level: number;
  totalXp: number;
  user: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
}

export default function LeaderboardCard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get('/gamification/leaderboard?limit=10');
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (index: number): string => {
    if (index === 0) return 'from-yellow-400 to-yellow-600';
    if (index === 1) return 'from-gray-300 to-gray-500';
    if (index === 2) return 'from-orange-400 to-orange-600';
    return 'from-gray-200 to-gray-300';
  };

  const getRankEmoji = (index: number): string => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '🏅';
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle>Loading Leaderboard...</CardTitle>
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
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          <span className="text-xl font-bold">Leaderboard</span>
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">Top learners this month</p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {leaderboard.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No data available yet</p>
            </div>
          ) : (
            leaderboard.map((entry, index) => (
              <div
                key={entry.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  index < 3
                    ? 'bg-gradient-to-r ' + getRankColor(index) + ' shadow-md'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {/* Rank */}
                <div className="flex-shrink-0 w-12 text-center">
                  <div className="text-2xl">{getRankEmoji(index)}</div>
                  <div className={`text-xs font-bold ${index < 3 ? 'text-white' : 'text-gray-600'}`}>
                    #{index + 1}
                  </div>
                </div>

                {/* Avatar */}
                <div className="flex-shrink-0">
                  {entry.user.avatarUrl ? (
                    <img
                      src={entry.user.avatarUrl}
                      alt={entry.user.fullName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg border-2 border-white shadow-md">
                      {entry.user.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <p className={`font-bold truncate ${index < 3 ? 'text-white' : 'text-gray-900'}`}>
                    {entry.user.fullName}
                  </p>
                  <p className={`text-sm ${index < 3 ? 'text-white/90' : 'text-gray-600'}`}>
                    Level {entry.level}
                  </p>
                </div>

                {/* XP */}
                <div className="text-right">
                  <p className={`text-lg font-bold ${index < 3 ? 'text-white' : 'text-purple-600'}`}>
                    {entry.totalXp.toLocaleString()}
                  </p>
                  <p className={`text-xs ${index < 3 ? 'text-white/80' : 'text-gray-500'}`}>
                    XP
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
