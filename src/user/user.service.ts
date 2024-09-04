import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RemoteFilesService } from 'src/remote-files/remote-files.service';
import { StripeService } from 'src/stripe/stripe.service';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dtos/create-user.dto';
import { USER } from './entity/user.entity';
import { UserLikeItemDto } from './dtos/user-like.dto';
import { ResponseMessageDto } from 'src/dtos/response-message-dto';
import { MessageStatusEnum } from 'src/enums/Message-status.enum';
import { AUTHJS_USER } from './entity/authJsUser.entity';
import { XTR_PRODUCT } from 'src/xtrader/entity/xtr-product.entity';
import { UserDetailsDto } from './dtos/user-details.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(USER)
    private userRepository: Repository<USER>,

    @InjectRepository(AUTHJS_USER)
    private authJsUserRepo: Repository<AUTHJS_USER>,

    @InjectRepository(XTR_PRODUCT)
    private prodRepo: Repository<XTR_PRODUCT>,

    private readonly filesService: RemoteFilesService,
    private stripeService: StripeService,
  ) {}

  logger = new Logger('User Service');
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

  async getUserLikedItems(userId: string): Promise<XTR_PRODUCT[] | unknown> {
    const user = await this.authJsUserRepo.findOne({
      where: { id: userId },
      relations: ['likedProds'],
    });
    this.logger.log(`user with likes ${JSON.stringify(user, null, 2)}`);

    if (!user) {
      throw new BadRequestException(`No user found for id ${userId}`);
    }
    return user.likedProds;
  }
  async addLikeItem(dto: UserLikeItemDto): Promise<ResponseMessageDto> {
    this.logger.log(`likeItem called with ${JSON.stringify(dto, null, 2)}`);
    const newLiked = dto.liked;
    this.logger.log(`newLiked:  ${newLiked}`);
    const user = await this.authJsUserRepo.findOne({
      where: { id: dto.userId },
    });
    const prod = await this.prodRepo.findOne({
      where: { id: dto.productId },
      relations: ['likes'],
    });

    this.logger.log(`found user ${JSON.stringify(user, null, 2)}`);
    this.logger.log(`found product to like ${JSON.stringify(prod, null, 2)}`);
    let likes: AUTHJS_USER[] = [];
    if (!prod.likes || prod.likes.length === 0) {
      this.logger.log(`empty likes ${JSON.stringify(prod.likes, null)}`);
      likes.push(user);
      prod.likes = likes;
      prod.numLikes = likes.length;
    } else {
      this.logger.log(
        `product has likes ${JSON.stringify(prod.likes, null, 2)}`,
      );
      const prodLikes = prod.likes;
      const prodUserLikes = prodLikes.filter((l) => l.id === user.id);

      this.logger.log(
        `userLikes for product ${JSON.stringify(prodUserLikes, null, 2)}`,
      );

      if (prodUserLikes.length > 0) {
        if (!newLiked) {
          this.logger.log('need to remove from likes');
          const otherUserLikes = prodLikes.filter((l) => l.id !== user.id);
          this.logger.log(
            `otherUserLikes ${JSON.stringify(otherUserLikes, null, 2)}`,
          );
          prod.likes = otherUserLikes;
          prod.numLikes = otherUserLikes.length;
        } else {
          this.logger.log('need to add to product likes');
          prodLikes.push(user);
          prod.likes = prodLikes;
          prod.numLikes = prodLikes.length;
        }
      }
    }
    this.logger.log(`likes ${JSON.stringify(likes, null, 2)}`);
    // prod.likes = likes;
    // prod.numLikes = likes.length;
    const _prod = await prod.save({ reload: true });
    this.logger.log(
      `updated product with likes ${JSON.stringify(_prod, null, 2)}`,
    );
    return {
      status: MessageStatusEnum.SUCCESS,
      message: `Number of product likes ${JSON.stringify(
        _prod.numLikes,
        null,
        2,
      )}`,
    };
  }

  async updateUser(
    id: string,
    userDetails: UserDetailsDto,
  ): Promise<AUTHJS_USER | ResponseMessageDto> {
    const user = await this.authJsUserRepo.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException(`No user with ID ${id}`);
    }
    const birthDate = new Date(userDetails.birthDate);
    user.birthDate = birthDate;

    user.county = userDetails.county;
    user.displayName = userDetails.displayName;
    user.email = userDetails.email;
    user.firstName = userDetails.firstName;
    user.image = userDetails.image;
    user.lastName = userDetails.lastName;
    user.mobPhone = userDetails.mobPhone;
    user.name = userDetails.mobPhone;
    user.postCode = userDetails.postCode;
    user.role = userDetails.role;
    user.street = userDetails.street;
    user.street2 = userDetails.street;
    user.title = userDetails.title;
    user.town = userDetails.town;

    const _user = await this.authJsUserRepo.save(user, { reload: true });
    return _user;
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
