import { Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from 'src/authorisation/authorisation.guard';
import { PermissionsGuard } from 'src/authorisation/permissions.guard';
import { Message } from 'src/common/interfaces/message.interface';
import { MessagesService } from 'src/messages/messages.service';

import { MessagesPermissions } from './messages.permissions';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}
  private logger = new Logger('messages controller');
  @Get('public')
  async getPublic(): Promise<Message> {
    return this.messagesService.getPublicMessage();
  }

  @UseGuards(PermissionsGuard([MessagesPermissions.READ_ADMIN]))
  @UseGuards(AuthorizationGuard)
  @Get('protected')
  async getProtected(@Req() req): Promise<Message> {
    return this.messagesService.getProtectedMessage();
  }

  @UseGuards(PermissionsGuard([MessagesPermissions.READ_ADMIN]))
  @UseGuards(AuthorizationGuard)
  @Get('admin')
  async getAdmin(): Promise<Message> {
    return this.messagesService.getAdminMessage();
  }
}
