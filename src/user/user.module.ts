import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicFile } from 'src/remote-files/entity/publicFile.entity';

import { RemoteFilesModule } from '../remote-files/remote-files.module';
import { User } from './entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, PublicFile]), RemoteFilesModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
