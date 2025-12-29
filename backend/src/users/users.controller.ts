import { Controller, Get, Put, Post, Body, UseGuards, Req, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UploadService } from '../upload/upload.service';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class UsersController {
  constructor(
    private usersService: UsersService,
    private uploadService: UploadService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@Req() req) {
    return this.usersService.findById(req.user.id);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user profile' })
  updateProfile(@Req() req, @Body() data: any) {
    return this.usersService.updateProfile(req.user.id, data);
  }

  @Post('me/password')
  @ApiOperation({ summary: 'Update user password' })
  updatePassword(@Req() req, @Body() data: { currentPassword: string; newPassword: string }) {
    return this.usersService.updatePassword(req.user.id, data.currentPassword, data.newPassword);
  }

  @Post('me/avatar')
  @ApiOperation({ summary: 'Upload user avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate file
    const validation = this.uploadService.validateImageFile(file);
    if (!validation.valid) {
      throw new BadRequestException(validation.error);
    }

    // Get current user to delete old avatar
    const user = await this.usersService.findById(req.user.id);
    if (user.avatarUrl) {
      await this.uploadService.deleteAvatar(user.avatarUrl);
    }

    // Save new avatar
    const avatarUrl = await this.uploadService.saveAvatar(file);

    // Update user profile
    return this.usersService.updateProfile(req.user.id, { avatarUrl });
  }

  @Post('me/avatar/delete')
  @ApiOperation({ summary: 'Delete user avatar' })
  async deleteAvatar(@Req() req) {
    const user = await this.usersService.findById(req.user.id);
    if (user.avatarUrl) {
      await this.uploadService.deleteAvatar(user.avatarUrl);
      return this.usersService.updateProfile(req.user.id, { avatarUrl: null });
    }
    return user;
  }
}
