import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto, CreateConversationDto } from './dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createConversation(userId: string, dto: CreateConversationDto) {
    // Determine if user is student or tutor
    // For simplicity, assume dto.participantId is tutorId and userId is studentId
    // In real implementation, you'd check user roles
    
    // Check if conversation already exists
    const existing = await this.prisma.conversation.findFirst({
      where: {
        studentId: userId,
        tutorId: dto.participantId,
      },
    });

    if (existing) {
      return existing;
    }

    // Create new conversation
    const conversation = await this.prisma.conversation.create({
      data: {
        studentId: userId,
        tutor: { connect: { id: dto.participantId } },
      },
      include: {
        tutor: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
              },
            },
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
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.studentId !== userId && conversation.tutorId !== userId) {
      throw new ForbiddenException('You are not a participant in this conversation');
    }

    // Create message
    const message = await this.prisma.message.create({
      data: {
        conversation: { connect: { id: dto.conversationId } },
        sender: { connect: { id: userId } },
        content: dto.message,
        fileUrl: dto.attachmentUrl,
        messageType: dto.attachmentUrl ? 'file' : 'text',
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
    const conversations = await this.prisma.conversation.findMany({
      where: {
        OR: [
          { studentId: userId },
          { tutorId: userId },
        ],
      },
      include: {
        tutor: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
              },
            },
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
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.studentId !== userId && conversation.tutorId !== userId) {
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
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.studentId !== userId && conversation.tutorId !== userId) {
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

  async getTotalUnreadCount(userId: string) {
    // Get all conversations where user is participant
    const conversations = await this.prisma.conversation.findMany({
      where: {
        OR: [
          { studentId: userId },
          { tutorId: userId },
        ],
      },
      select: {
        id: true,
      },
    });

    const conversationIds = conversations.map(c => c.id);

    // Count all unread messages across all conversations
    const totalUnread = await this.prisma.message.count({
      where: {
        conversationId: { in: conversationIds },
        senderUserId: { not: userId },
        readAt: null,
      },
    });

    return { totalUnread };
  }
}
