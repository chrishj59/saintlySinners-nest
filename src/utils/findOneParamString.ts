import { IsNumberString } from '@nestjs/class-validator';
import { IsString } from 'class-validator';

class FindOneStringParams {
  @IsString()
  id: string;
}

export class FindOneNumberParams {
  @IsNumberString()
  id: string;
}

export default FindOneStringParams;
