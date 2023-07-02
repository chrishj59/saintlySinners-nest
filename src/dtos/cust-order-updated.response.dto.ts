import { IsEnum, IsString } from 'class-validator';
import { MessageStatusEnum } from 'src/enums/Message-status.enum';

type custOrderResponseType = {
  orderId: string;
  rowsUpdated: number;
};

export class CustOrderUpdatedResponseDto {
  @IsEnum(MessageStatusEnum)
  status: MessageStatusEnum = MessageStatusEnum.SUCCESS;
  orderMessage: custOrderResponseType;
}
