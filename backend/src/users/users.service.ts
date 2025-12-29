import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,
        avatarUrl: true,
        gender: true,
        birthdate: true,
        role: true,
        status: true,
        createdAt: true,
        addresses: true,
      },
    });
  }

  async updateProfile(userId: string, data: any) {
    // Remove password fields from profile update
    const { password, passwordHash, ...profileData } = data;
    
    return this.prisma.user.update({
      where: { id: userId },
      data: profileData,
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,
        avatarUrl: true,
        gender: true,
        birthdate: true,
        role: true,
      },
    });
  }

  async updatePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // TODO: Add password verification logic here
    // const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    // if (!isValid) throw new Error('Current password is incorrect');
    
    // TODO: Hash new password
    // const hashedPassword = await bcrypt.hash(newPassword, 10);

    return this.prisma.user.update({
      where: { id: userId },
      data: { 
        // passwordHash: hashedPassword 
      },
      select: {
        id: true,
        email: true,
        fullName: true,
      },
    });
  }
}
