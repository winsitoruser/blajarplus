'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, Download, Share2, CheckCircle, XCircle, Clock, Trophy } from 'lucide-react';

interface Certification {
  id: string;
  name: string;
  description: string;
  type: string;
  criteria: {
    minimumScore?: number;
    requiredLessons?: number;
    minimumXP?: number;
  };
  badgeUrl?: string;
  course: {
    title: string;
    language: {
      name: string;
      flag: string;
    };
  };
}

interface UserCertification {
  id: string;
  earnedAt: string;
  certificateNumber: string;
  score?: number;
  certification: Certification;
}

interface EligibilityCheck {
  eligible: boolean;
  checks: {
    minimumScore: boolean;
    requiredLessons: boolean;
    minimumXP: boolean;
  };
  currentProgress: {
    score: number;
    lessonsCompleted: number;
    xpEarned: number;
  };
  requirements: {
    minimumScore?: number;
    requiredLessons?: number;
    minimumXP?: number;
  };
}

export default function CertificationDisplay({ courseId }: { courseId?: string }) {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [userCertifications, setUserCertifications] = useState<UserCertification[]>([]);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [eligibility, setEligibility] = useState<EligibilityCheck | null>(null);
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch available certifications
      if (courseId) {
        const certResponse = await fetch(
          `http://localhost:3000/api/language-learning/courses/${courseId}/certifications`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        if (certResponse.ok) {
          const data = await certResponse.json();
          setCertifications(data);
          if (data.length > 0) {
            setSelectedCert(data[0]);
            checkEligibility(data[0].id);
          }
        }
      }

      // Fetch user's earned certifications
      const userCertResponse = await fetch(
        'http://localhost:3000/api/language-learning/certifications/my',
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (userCertResponse.ok) {
        const data = await userCertResponse.json();
        setUserCertifications(data);
      }
    } catch (error) {
      console.error('Error fetching certifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEligibility = async (certificationId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3000/api/language-learning/certifications/${certificationId}/eligibility`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.ok) {
        const data = await response.json();
        setEligibility(data);
      }
    } catch (error) {
      console.error('Error checking eligibility:', error);
    }
  };

  const issueCertificate = async () => {
    if (!selectedCert || !eligibility?.eligible) return;

    setIssuing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3000/api/language-learning/certifications/${selectedCert.id}/issue`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const newCert = await response.json();
        setUserCertifications(prev => [newCert, ...prev]);
        alert('🎉 Selamat! Sertifikat berhasil diterbitkan!');
        fetchData();
      }
    } catch (error) {
      console.error('Error issuing certificate:', error);
      alert('Gagal menerbitkan sertifikat. Silakan coba lagi.');
    } finally {
      setIssuing(false);
    }
  };

  const downloadCertificate = (cert: UserCertification) => {
    // Generate certificate PDF (simplified - would need proper PDF generation)
    const certificateText = `
CERTIFICATE OF COMPLETION

This certifies that you have successfully completed
${cert.certification.course.title}

Score: ${cert.score}%
Certificate Number: ${cert.certificateNumber}
Issued: ${new Date(cert.earnedAt).toLocaleDateString()}

BlajarPlus Language Academy
    `;
    
    const blob = new Blob([certificateText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-${cert.certificateNumber}.txt`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User's Earned Certifications */}
      {userCertifications.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Trophy className="h-6 w-6 mr-2 text-yellow-600" />
            Sertifikat Saya
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userCertifications.map((cert) => (
              <Card key={cert.id} className="border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-3xl">{cert.certification.course.language.flag}</span>
                        <Badge className="bg-yellow-600 text-white">
                          <Award className="h-3 w-3 mr-1" />
                          Certified
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{cert.certification.name}</CardTitle>
                      <CardDescription className="mt-2">
                        {cert.certification.course.title}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Certificate Number:</span>
                      <span className="font-mono font-semibold">{cert.certificateNumber}</span>
                    </div>
                    {cert.score && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Final Score:</span>
                        <span className="font-semibold text-green-600">{cert.score}%</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Issued:</span>
                      <span className="font-semibold">
                        {new Date(cert.earnedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button
                        onClick={() => downloadCertificate(cert)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button
                        onClick={() => alert('Share feature coming soon!')}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available Certifications */}
      {certifications.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Sertifikasi Tersedia</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {certifications.map((cert) => {
              const alreadyEarned = userCertifications.some(
                uc => uc.certification.id === cert.id
              );

              return (
                <Card
                  key={cert.id}
                  className={`cursor-pointer transition-all ${
                    selectedCert?.id === cert.id
                      ? 'border-2 border-blue-500 shadow-lg'
                      : 'border-2 border-gray-200 hover:border-gray-300'
                  } ${alreadyEarned ? 'opacity-60' : ''}`}
                  onClick={() => {
                    setSelectedCert(cert);
                    checkEligibility(cert.id);
                  }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-3xl">{cert.course.language.flag}</span>
                          {alreadyEarned && (
                            <Badge className="bg-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Earned
                            </Badge>
                          )}
                        </div>
                        <CardTitle>{cert.name}</CardTitle>
                        <CardDescription className="mt-2">
                          {cert.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Course:</span>
                        <span className="font-semibold">{cert.course.title}</span>
                      </div>
                      {cert.criteria.minimumScore && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Min Score:</span>
                          <span className="font-semibold">{cert.criteria.minimumScore}%</span>
                        </div>
                      )}
                      {cert.criteria.requiredLessons && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Required Lessons:</span>
                          <span className="font-semibold">{cert.criteria.requiredLessons}</span>
                        </div>
                      )}
                      {cert.criteria.minimumXP && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Min XP:</span>
                          <span className="font-semibold">{cert.criteria.minimumXP} XP</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Eligibility Check & Issue Certificate */}
      {selectedCert && eligibility && !userCertifications.some(uc => uc.certification.id === selectedCert.id) && (
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-6 w-6 mr-2" />
              Progress Menuju Sertifikasi
            </CardTitle>
            <CardDescription>
              {selectedCert.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Score Progress */}
              {eligibility.requirements.minimumScore && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="flex items-center">
                      {eligibility.checks.minimumScore ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600 mr-1" />
                      )}
                      Average Score
                    </span>
                    <span className="font-semibold">
                      {eligibility.currentProgress.score}% / {eligibility.requirements.minimumScore}%
                    </span>
                  </div>
                  <Progress
                    value={(eligibility.currentProgress.score / eligibility.requirements.minimumScore) * 100}
                    className="h-2"
                  />
                </div>
              )}

              {/* Lessons Progress */}
              {eligibility.requirements.requiredLessons && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="flex items-center">
                      {eligibility.checks.requiredLessons ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600 mr-1" />
                      )}
                      Lessons Completed
                    </span>
                    <span className="font-semibold">
                      {eligibility.currentProgress.lessonsCompleted} / {eligibility.requirements.requiredLessons}
                    </span>
                  </div>
                  <Progress
                    value={(eligibility.currentProgress.lessonsCompleted / eligibility.requirements.requiredLessons) * 100}
                    className="h-2"
                  />
                </div>
              )}

              {/* XP Progress */}
              {eligibility.requirements.minimumXP && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="flex items-center">
                      {eligibility.checks.minimumXP ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600 mr-1" />
                      )}
                      XP Earned
                    </span>
                    <span className="font-semibold">
                      {eligibility.currentProgress.xpEarned} / {eligibility.requirements.minimumXP} XP
                    </span>
                  </div>
                  <Progress
                    value={(eligibility.currentProgress.xpEarned / eligibility.requirements.minimumXP) * 100}
                    className="h-2"
                  />
                </div>
              )}

              {/* Issue Button */}
              <div className="pt-4">
                {eligibility.eligible ? (
                  <Button
                    onClick={issueCertificate}
                    disabled={issuing}
                    className="w-full h-12 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold"
                  >
                    {issuing ? (
                      <>
                        <Clock className="h-5 w-5 mr-2 animate-spin" />
                        Menerbitkan Sertifikat...
                      </>
                    ) : (
                      <>
                        <Award className="h-5 w-5 mr-2" />
                        Terbitkan Sertifikat Sekarang!
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="text-center p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                    <p className="text-yellow-800 font-semibold">
                      Anda belum memenuhi syarat untuk sertifikasi ini
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Selesaikan semua requirement di atas untuk mendapatkan sertifikat
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
