'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { chatApi } from '@/lib/api';

export default function ChatPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await chatApi.getConversations();
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      // Use mock data if backend is not available
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const isStudent = user.role === 'student';
      
      const mockConversations = [
        {
          id: '1',
          otherParticipant: {
            fullName: isStudent ? 'Budi Santoso' : 'Ahmad Rizki',
            avatarUrl: null,
          },
          messages: [
            {
              message: isStudent 
                ? 'Baik, saya siap mengajar besok jam 10 pagi. Jangan lupa siapkan materi yang ingin dipelajari ya!'
                : 'Pak, besok saya bisa les jam berapa?',
              createdAt: new Date('2024-12-28T15:30:00').toISOString(),
            },
          ],
          unreadCount: 1,
        },
        {
          id: '2',
          otherParticipant: {
            fullName: isStudent ? 'Siti Nurhaliza' : 'Dewi Lestari',
            avatarUrl: null,
          },
          messages: [
            {
              message: isStudent
                ? 'Great! See you tomorrow at 2 PM for our English conversation class.'
                : 'Miss, untuk materi IELTS speaking sudah saya pelajari.',
              createdAt: new Date('2024-12-27T10:15:00').toISOString(),
            },
          ],
          unreadCount: 0,
        },
        {
          id: '3',
          otherParticipant: {
            fullName: isStudent ? 'Dewi Lestari' : 'Fajar Ramadhan',
            avatarUrl: null,
          },
          messages: [
            {
              message: isStudent
                ? 'Untuk project React kamu, coba dulu buat component sederhana. Nanti kita review bareng.'
                : 'Kak, saya sudah coba bikin component tapi masih error.',
              createdAt: new Date('2024-12-26T14:20:00').toISOString(),
            },
          ],
          unreadCount: 0,
        },
      ];
      setConversations(mockConversations);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Pesan</h1>

          {conversations.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-semibold mb-2">Belum ada percakapan</h3>
                <p className="text-gray-600 mb-6">
                  Mulai chat dengan tutor setelah Anda melakukan booking
                </p>
                <Link href="/search">
                  <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    Cari Tutor
                  </button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {conversations.map((conversation: any) => {
                const otherUser = conversation.otherParticipant;
                const lastMessage = conversation.messages?.[0];

                return (
                  <Link
                    key={conversation.id}
                    href={`/chat/${conversation.id}`}
                  >
                    <Card className="hover:shadow-md transition cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center">
                              {otherUser?.avatarUrl ? (
                                <img
                                  src={otherUser.avatarUrl}
                                  alt={otherUser.fullName}
                                  className="w-14 h-14 rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-2xl">
                                  {otherUser?.fullName?.charAt(0)}
                                </span>
                              )}
                            </div>
                            {conversation.unreadCount > 0 && (
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {conversation.unreadCount}
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-lg truncate">
                                {otherUser?.fullName}
                              </h3>
                              {lastMessage && (
                                <span className="text-sm text-gray-500">
                                  {new Date(lastMessage.createdAt).toLocaleDateString('id-ID', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                              )}
                            </div>
                            {lastMessage && (
                              <p className="text-gray-600 truncate">
                                {lastMessage.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
