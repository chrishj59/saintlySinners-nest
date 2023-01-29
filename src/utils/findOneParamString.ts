import { IsString } from 'class-validator';

class FindOneStringParams {
  @IsString()
  id: string;
}

export default FindOneStringParams;
