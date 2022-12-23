import { IsEnum, IsString } from 'class-validator';
import { MessageStatusEnum } from 'src/enums/Message-status.enum';

export class ResponseMessageDto {
  @IsEnum(MessageStatusEnum)
  status: MessageStatusEnum = MessageStatusEnum.SUCCESS;
  @IsString()
  message: string;
}
