import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto, CreateConversationDto } from './dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createConversation(userId: string, dto: CreateConversationDto) {
    // Check if conversation already exists
    const existing = await this.prisma.conversation.findFirst({
      where: {
        OR: [
          {
            AND: [
              { participant1Id: userId },
              { participant2Id: dto.participantId },
            ],
          },
          {
            AND: [
              { participant1Id: dto.participantId },
              { participant2Id: userId },
            ],
          },
        ],
      },
    });

    if (existing) {
      return existing;
    }

    // Create new conversation
    const conversation = await this.prisma.conversation.create({
      data: {
        participant1Id: userId,
        participant2Id: dto.participantId,
      },
      include: {
        participant1: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        participant2: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
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

    if (conversation.participant1Id !== userId && conversation.participant2Id !== userId) {
      throw new ForbiddenException('You are not a participant in this conversation');
    }

    // Determine receiver
    const receiverId = conversation.participant1Id === userId
      ? conversation.participant2Id
      : conversation.participant1Id;

    // Create message
    const message = await this.prisma.message.create({
      data: {
        conversationId: dto.conversationId,
        senderId: userId,
        receiverId,
        message: dto.message,
        attachmentUrl: dto.attachmentUrl,
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        receiver: {
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
          { participant1Id: userId },
          { participant2Id: userId },
        ],
      },
      include: {
        participant1: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        participant2: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
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
            receiverId: userId,
            isRead: false,
          },
        });

        return {
          ...conv,
          unreadCount,
          otherParticipant: conv.participant1Id === userId
            ? conv.participant2
            : conv.participant1,
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

    if (conversation.participant1Id !== userId && conversation.participant2Id !== userId) {
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

    if (conversation.participant1Id !== userId && conversation.participant2Id !== userId) {
      throw new ForbiddenException('You are not a participant in this conversation');
    }

    // Mark all messages as read
    await this.prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
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

    if (message.senderId !== userId) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    await this.prisma.message.delete({
      where: { id: messageId },
    });

    return { message: 'Message deleted successfully' };
  }
}
