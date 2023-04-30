import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RemoteFilesService } from 'src/remote-files/remote-files.service';
import { StripeService } from 'src/stripe/stripe.service';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dtos/create-user.dto';
import { USER } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(USER)
    private userRepository: Repository<USER>,
    private readonly filesService: RemoteFilesService,
    private stripeService: StripeService,
  ) {}

  async create(userData: CreateUserDto) {
    const stripeCustomer = await this.stripeService.createCustomer(
      userData.name,
      userData.email,
    );

    const newUser = await this.userRepository.create({
      ...userData,
      stripeCustomerId: stripeCustomer.id,
    });
    await this.userRepository.save(newUser);
    return newUser;
  }
  allUsers = async (): Promise<USER[]> => {
    return await this.userRepository.find();
  };
  async getById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  // async addAvatar(userId: string, imageBuffer: Buffer, filename: string) {
  //   const user = await this.getById(userId);
  //   if (user.avatar) {
  //     await this.userRepository.update(userId, {
  //       ...user,
  //       avatar: null,
  //     });
  //     await this.filesService.deletePublicFile(user.avatar.id);
  //   }
  //   const avatar = await this.filesService.uploadPublicFile(
  //     imageBuffer,
  //     filename,
  //   );
  //   await this.userRepository.update(userId, {
  //     ...user,
  //     avatar,
  //   });
  //   return avatar;
  // }

  // async deleteAvatar(userId: string) {
  //   const user = await this.getById(userId);
  //   const fileId = user.avatar?.id;
  //   if (fileId) {
  //     await this.userRepository.update(userId, {
  //       ...user,
  //       avatar: null,
  //     });
  //     await this.filesService.deletePublicFile(fileId);
  //   }
  // }
}
