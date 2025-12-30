'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, Award, TrendingUp, Activity, Target, Clock, CheckCircle } from 'lucide-react';

interface Analytics {
  totalUsers: number;
  totalCourses: number;
  totalLessons: number;
  totalMaterials: number;
  activeLearnersWeek: number;
  totalCertifications: number;
  averageCompletionRate: number;
  topCourses: Array<{
    courseId: string;
    _count: { userId: number };
  }>;
}

interface CourseAnalytics {
  enrollments: number;
  completions: number;
  completionRate: number;
  averageScore: number;
  materialProgress: Array<{
    courseMaterialId: string;
    _count: { userId: number };
    _avg: { progress: number };
  }>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [courseAnalytics, setCourseAnalytics] = useState<Record<string, CourseAnalytics>>({});
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch platform analytics
      const response = await fetch('http://localhost:3000/api/language-learning/admin/analytics', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">Failed to load analytics</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Platform performance and user insights</p>
        </div>

        {/* Period Selector */}
        <div className="flex space-x-2 mb-6">
          {['day', 'week', 'month', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-blue-500">
            <CardHeader className="pb-3">
              <CardDescription>Total Users</CardDescription>
              <CardTitle className="text-3xl flex items-center justify-between">
                {analytics.totalUsers.toLocaleString()}
                <Users className="h-8 w-8 text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+12% from last {selectedPeriod}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-green-500">
            <CardHeader className="pb-3">
              <CardDescription>Active Learners</CardDescription>
              <CardTitle className="text-3xl flex items-center justify-between">
                {analytics.activeLearnersWeek.toLocaleString()}
                <Activity className="h-8 w-8 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                <span>Last 7 days</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-purple-500">
            <CardHeader className="pb-3">
              <CardDescription>Certifications Issued</CardDescription>
              <CardTitle className="text-3xl flex items-center justify-between">
                {analytics.totalCertifications.toLocaleString()}
                <Award className="h-8 w-8 text-purple-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+8% from last {selectedPeriod}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-orange-500">
            <CardHeader className="pb-3">
              <CardDescription>Avg Completion Rate</CardDescription>
              <CardTitle className="text-3xl flex items-center justify-between">
                {Math.round(analytics.averageCompletionRate)}%
                <Target className="h-8 w-8 text-orange-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+5% from last {selectedPeriod}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {analytics.totalCourses}
              </div>
              <p className="text-sm text-gray-600">Active courses available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Lessons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600 mb-2">
                {analytics.totalLessons}
              </div>
              <p className="text-sm text-gray-600">Total lessons created</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
                Materials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {analytics.totalMaterials}
              </div>
              <p className="text-sm text-gray-600">Study materials available</p>
            </CardContent>
          </Card>
        </div>

        {/* Top Courses */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Top Courses by Enrollment</CardTitle>
            <CardDescription>Most popular courses this {selectedPeriod}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topCourses.map((course, index) => (
                <div key={course.courseId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-600' :
                      'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold">Course {course.courseId.substring(0, 8)}...</div>
                      <div className="text-sm text-gray-600">{course._count.userId} enrollments</div>
                    </div>
                  </div>
                  <Badge variant="outline">{course._count.userId} students</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Engagement Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
              <CardDescription>Daily active users trend</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-2" />
                  <p>Chart visualization would go here</p>
                  <p className="text-sm">(Integrate with Chart.js or Recharts)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completion Rates</CardTitle>
              <CardDescription>Course completion over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                  <p>Chart visualization would go here</p>
                  <p className="text-sm">(Integrate with Chart.js or Recharts)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">98%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">4.8</div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">85%</div>
                <div className="text-sm text-gray-600">User Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">2.5h</div>
                <div className="text-sm text-gray-600">Avg Session</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
