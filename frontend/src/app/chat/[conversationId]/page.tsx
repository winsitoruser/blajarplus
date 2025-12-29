'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { chatApi } from '@/lib/api';

export default function ChatConversationPage() {
  const params = useParams();
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherUser, setOtherUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('user') || '{}').id 
    : null;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchMessages();
    markAsRead();
  }, [params.conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const response = await chatApi.getMessages(params.conversationId as string);
      setMessages(response.data.data);
      
      if (response.data.data.length > 0) {
        const firstMessage = response.data.data[0];
        const other = firstMessage.senderId === currentUserId 
          ? firstMessage.receiver 
          : firstMessage.sender;
        setOtherUser(other);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await chatApi.markAsRead(params.conversationId as string);
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const response = await chatApi.sendMessage({
        conversationId: params.conversationId,
        message: newMessage.trim(),
      });

      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
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

      <div className="flex-1 bg-gray-50 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b px-4 py-4">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <button
              onClick={() => router.push('/chat')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Kembali
            </button>
            {otherUser && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  {otherUser.avatarUrl ? (
                    <img
                      src={otherUser.avatarUrl}
                      alt={otherUser.fullName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg">{otherUser.fullName?.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <div className="font-semibold">{otherUser.fullName}</div>
                  <div className="text-sm text-gray-600">Online</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-gray-600">Belum ada pesan. Mulai percakapan!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message: any) => {
                  const isOwn = message.senderId === currentUserId;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                          isOwn
                            ? 'bg-primary-600 text-white'
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">
                          {message.message}
                        </p>
                        <div
                          className={`text-xs mt-1 ${
                            isOwn ? 'text-primary-100' : 'text-gray-500'
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white border-t px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <Input
                type="text"
                placeholder="Ketik pesan..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={sending}
                className="flex-1"
              />
              <Button type="submit" disabled={sending || !newMessage.trim()}>
                {sending ? 'Mengirim...' : 'Kirim'}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
