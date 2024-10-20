import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PUBLIC_FILE } from 'src/remote-files/entity/publicFile.entity';

import { RemoteFilesModule } from '../remote-files/remote-files.module';
import { StripeModule } from '../stripe/stripe.module';
import { USER } from './entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

//import { StripeService } from '../stripe/stripe.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([USER, PUBLIC_FILE]),
    RemoteFilesModule,
    StripeModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
