import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto, CreateConversationDto } from './dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createConversation(userId: string, dto: CreateConversationDto) {
    // Get user to determine if they are student or tutor
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const otherUser = await this.prisma.user.findUnique({
      where: { id: dto.participantId },
    });

    if (!user || !otherUser) {
      throw new NotFoundException('User not found');
    }

    // Determine studentId and tutorId
    let studentId: string;
    let tutorId: string;

    if (user.role === 'student') {
      studentId = userId;
      const tutorProfile = await this.prisma.tutorProfile.findUnique({
        where: { userId: dto.participantId },
      });
      if (!tutorProfile) {
        throw new NotFoundException('Tutor profile not found');
      }
      tutorId = tutorProfile.id;
    } else {
      const tutorProfile = await this.prisma.tutorProfile.findUnique({
        where: { userId },
      });
      if (!tutorProfile) {
        throw new NotFoundException('Tutor profile not found');
      }
      tutorId = tutorProfile.id;
      studentId = dto.participantId;
    }

    // Check if conversation already exists
    const existing = await this.prisma.conversation.findUnique({
      where: {
        studentId_tutorId: {
          studentId,
          tutorId,
        },
      },
      include: {
        tutor: {
          include: {
            user: true,
          },
        },
      },
    });

    if (existing) {
      return existing;
    }

    // Create new conversation
    const conversation = await this.prisma.conversation.create({
      data: {
        studentId,
        tutorId,
      },
      include: {
        tutor: {
          include: {
            user: true,
          },
        },
      },
    });

    return conversation;
  }

  async sendMessage(userId: string, dto: SendMessageDto) {
    // Verify conversation exists and user is participant
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: dto.conversationId },
      include: {
        tutor: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Check if user is participant (either student or tutor)
    if (conversation.studentId !== userId && conversation.tutor.userId !== userId) {
      throw new ForbiddenException('You are not a participant in this conversation');
    }

    // Create message
    const message = await this.prisma.message.create({
      data: {
        conversationId: dto.conversationId,
        senderUserId: userId,
        content: dto.message,
        fileUrl: dto.attachmentUrl,
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Update conversation last message
    await this.prisma.conversation.update({
      where: { id: dto.conversationId },
      data: {
        lastMessageAt: new Date(),
      },
    });

    return message;
  }

  async getConversations(userId: string) {
    // Get user to check role
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let conversations;
    if (user.role === 'student') {
      conversations = await this.prisma.conversation.findMany({
        where: { studentId: userId },
        include: {
          tutor: {
            include: {
              user: true,
            },
          },
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: {
          lastMessageAt: 'desc',
        },
      });
    } else {
      const tutorProfile = await this.prisma.tutorProfile.findUnique({
        where: { userId },
      });
      if (!tutorProfile) {
        throw new NotFoundException('Tutor profile not found');
      }
      conversations = await this.prisma.conversation.findMany({
        where: { tutorId: tutorProfile.id },
        include: {
          tutor: {
            include: {
              user: true,
            },
          },
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: {
          lastMessageAt: 'desc',
        },
      });
    }

    // Count unread messages for each conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await this.prisma.message.count({
          where: {
            conversationId: conv.id,
            senderUserId: { not: userId },
            readAt: null,
          },
        });

        return {
          ...conv,
          unreadCount,
        };
      }),
    );

    return conversationsWithUnread;
  }

  async getMessages(userId: string, conversationId: string, page = 1, limit = 50) {
    // Verify user is participant
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        tutor: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.studentId !== userId && conversation.tutor.userId !== userId) {
      throw new ForbiddenException('You are not a participant in this conversation');
    }

    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      this.prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          sender: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
            },
          },
        },
      }),
      this.prisma.message.count({ where: { conversationId } }),
    ]);

    return {
      data: messages.reverse(), // Reverse to show oldest first
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async markAsRead(userId: string, conversationId: string) {
    // Verify user is participant
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        tutor: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.studentId !== userId && conversation.tutor.userId !== userId) {
      throw new ForbiddenException('You are not a participant in this conversation');
    }

    // Mark all messages as read (messages not sent by current user)
    await this.prisma.message.updateMany({
      where: {
        conversationId,
        senderUserId: { not: userId },
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    return { message: 'Messages marked as read' };
  }

  async deleteMessage(userId: string, messageId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderUserId !== userId) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    await this.prisma.message.delete({
      where: { id: messageId },
    });

    return { message: 'Message deleted successfully' };
  }

  async getTotalUnreadCount(userId: string): Promise<number> {
    // Get all conversations for the user
    const conversations = await this.getConversations(userId);
    
    // Sum up all unread counts
    const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
    
    return totalUnread;
  }
}
