import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from 'src/authorisation/authorisation.guard';
import { Message } from 'src/common/interfaces/message.interface';
import { MessagesService } from 'src/messages/messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}
  private logger = new Logger('messages controller');
  @Get('public')
  async getPublic(): Promise<Message> {
    this.logger.log('get private called');
    return this.messagesService.getPublicMessage();
  }

  @UseGuards(AuthorizationGuard)
  @Get('protected')
  async getProtected(): Promise<Message> {
    this.logger.log('get protected called');
    return this.messagesService.getProtectedMessage();
  }

  @UseGuards(AuthorizationGuard)
  @Get('admin')
  async getAdmin(): Promise<Message> {
    return this.messagesService.getAdminMessage();
  }
}
