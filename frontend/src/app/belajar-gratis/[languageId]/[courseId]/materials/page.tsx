'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import MaterialViewer from '@/components/language-learning/MaterialViewer';
import CertificationDisplay from '@/components/language-learning/CertificationDisplay';
import LearningPathTimeline from '@/components/language-learning/LearningPathTimeline';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Award, Target } from 'lucide-react';

export default function CourseMaterialsPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="materials" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="materials" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Study Materials</span>
            </TabsTrigger>
            <TabsTrigger value="certification" className="flex items-center space-x-2">
              <Award className="h-4 w-4" />
              <span>Certification</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Learning Path</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="materials">
            <MaterialViewer courseId={courseId} />
          </TabsContent>

          <TabsContent value="certification">
            <CertificationDisplay courseId={courseId} />
          </TabsContent>

          <TabsContent value="timeline">
            <LearningPathTimeline courseId={courseId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
