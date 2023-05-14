import { IsNumberString, IsString, IsUUID } from '@nestjs/class-validator';

export class FindOneStringParams {
  @IsString()
  id: string;
}

export class FindOneNumberParams {
  @IsNumberString()
  id: string;
}
export class FindOneUUIDParams {
  @IsUUID()
  id: string;
}

export default FindOneStringParams;
