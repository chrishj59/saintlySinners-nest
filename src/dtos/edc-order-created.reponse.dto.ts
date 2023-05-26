import { IsEnum, IsString } from 'class-validator';
import { MessageStatusEnum } from 'src/enums/Message-status.enum';

type orderResponseType = {
  orderNumber: number;
  orderId: string;
  pdfid?: string;
};
export class EdcOrderCreatedResponseDto {
  @IsEnum(MessageStatusEnum)
  status: MessageStatusEnum = MessageStatusEnum.SUCCESS;
  orderMessage: orderResponseType;
}
