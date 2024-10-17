import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
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
import { USER_ADDRESS } from './entity/userAddress.entity';
import { UserAddressDto } from './dtos/userAddress.dto';
import { boolean } from 'joi';
import { XTR_PRODUCT_REVIEW } from 'src/xtrader/entity/xtr-product-review.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(USER)
    private userRepository: Repository<USER>,

    @InjectRepository(AUTHJS_USER)
    private authJsUserRepo: Repository<AUTHJS_USER>,

    @InjectRepository(USER_ADDRESS)
    private addressRepo: Repository<USER_ADDRESS>,

    @InjectRepository(XTR_PRODUCT)
    private prodRepo: Repository<XTR_PRODUCT>,

    @InjectRepository(XTR_PRODUCT_REVIEW)
    private reviewRepo: Repository<XTR_PRODUCT_REVIEW>,

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

  async getAllUsers(): Promise<AUTHJS_USER[]> {
    const users = await this.authJsUserRepo.find();

    return users;
  }
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

  public async getUserAddress(userId: string): Promise<USER_ADDRESS[]> {
    const user = await this.authJsUserRepo.findOne({
      where: { id: userId },
      relations: ['addresses'],
    });

    if (!user) {
      throw new BadRequestException(`No user found with id ${userId}`);
    }
    return user.addresses;
  }

  public async addUserAddress(
    userId: string,
    address: UserAddressDto,
  ): Promise<USER_ADDRESS> {
    const user = await this.authJsUserRepo.findOne({
      where: { id: userId },
      relations: ['addresses'],
    });
    if (!user) {
      throw new BadRequestException(`User id is invalid`);
    }
    const userAddressList = user.addresses;

    if (address.default) {
      const defaultAddressList = userAddressList.filter(
        (addr) => addr.default === true,
      );
      if (defaultAddressList) {
        // set each to not default
        defaultAddressList.forEach(async (addr) => {
          await this.addressRepo.update({ id: addr.id }, { default: false });
        });
      }
    }

    const _address = new USER_ADDRESS();
    _address.addressName = address.addressName;
    _address.default = address.default;
    _address.firstName = address.firstName;
    _address.lastName = address.lastName;
    _address.street = address.street;
    _address.street2 = address.street2;
    _address.town = address.town;
    _address.county = address.county;
    _address.postCode = address.postCode;
    userAddressList.push(_address);
    user.addresses = userAddressList;
    await this.authJsUserRepo.save(user, { reload: true });

    return _address;
  }

  public async updateUserAddress(
    userId: string,
    address: UserAddressDto,
  ): Promise<USER_ADDRESS> {
    const user = await this.authJsUserRepo.findOne({
      where: { id: userId },
      relations: ['addresses'],
    });
    if (!user) {
      throw new BadRequestException(`User id is invalid`);
    }

    const addrList = user.addresses;
    const _address = await this.addressRepo.findOne({ where: { id: userId } });

    if (!_address) {
      throw new BadRequestException('Could not find address for supplied id');
    }

    _address.addressName = address.addressName;
    _address.county = address.county;
    _address.default = address.default;
    _address.firstName = address.firstName;
    _address.lastName = address.lastName;
    _address.postCode = address.postCode;
    _address.street = address.street;
    _address.street2 = address.street2;
    _address.town = address.town;

    const { affected } = await this.addressRepo.update(
      { id: address.id },
      _address,
    );

    if (affected !== 1) {
      throw new BadRequestException(
        `Could not update address with id ${address.id}  `,
      );
    }

    const addrIdx = addrList.findIndex((addr) => addr.id === address.id);
    addrList[addrIdx] = _address;

    return _address;
  }

  async getUserLikedItems(userId: string): Promise<XTR_PRODUCT[] | unknown> {
    const user = await this.authJsUserRepo.findOne({
      where: { id: userId },
      relations: ['likedProds'],
    });

    if (!user) {
      throw new BadRequestException(`No user found for id ${userId}`);
    }
    return user.likedProds;
  }
  async addLikeItem(dto: UserLikeItemDto): Promise<ResponseMessageDto> {
    const newLiked = dto.liked;

    const user = await this.authJsUserRepo.findOne({
      where: { id: dto.userId },
    });
    const prod = await this.prodRepo.findOne({
      where: { id: dto.productId },
      relations: ['likes'],
    });

    let likes: AUTHJS_USER[] = [];
    if (!prod.likes || prod.likes.length === 0) {
      likes.push(user);
      prod.likes = likes;
      prod.numLikes = likes.length;
    } else {
      const prodLikes = prod.likes;
      const prodUserLikes = prodLikes.filter((l) => l.id === user.id);

      if (prodUserLikes.length > 0) {
        if (!newLiked) {
          const otherUserLikes = prodLikes.filter((l) => l.id !== user.id);

          prod.likes = otherUserLikes;
          prod.numLikes = otherUserLikes.length;
        } else {
          prodLikes.push(user);
          prod.likes = prodLikes;
          prod.numLikes = prodLikes.length;
        }
      }
    }

    // prod.likes = likes;
    // prod.numLikes = likes.length;
    const _prod = await prod.save({ reload: true });

    return {
      status: MessageStatusEnum.SUCCESS,
      message: `Number of product likes ${JSON.stringify(
        _prod.numLikes,
        null,
        2,
      )}`,
    };
  }

  async getUser(id: string): Promise<AUTHJS_USER | ResponseMessageDto> {
    const user = await this.authJsUserRepo.findOne({
      relations: ['addresses'],
      where: { id, addresses: { default: true } },
    });
    if (!user) {
      throw new BadRequestException(`No user with ID ${id}`);
    }
    return user;
  }

  async updateUser(
    id: string,
    userDetails: UserDetailsDto,
  ): Promise<AUTHJS_USER | ResponseMessageDto> {
    const user = await this.authJsUserRepo.findOne({
      where: { id },
      relations: ['addresses'],
    });

    if (!user) {
      throw new BadRequestException(`No user with ID ${id}`);
    }

    const birthDate = new Date(userDetails.birthDate);

    let defaultAddress = await this.addressRepo.findOne({
      where: { id: userDetails.addressId },
    });

    if (!defaultAddress) {
      defaultAddress = new USER_ADDRESS();
    }
    defaultAddress.firstName = userDetails.firstName;
    defaultAddress.lastName = userDetails.lastName;
    defaultAddress.street = userDetails.street;
    defaultAddress.street2 = userDetails.street2;
    defaultAddress.town = userDetails.town;
    defaultAddress.county = userDetails.county;
    defaultAddress.postCode = userDetails.postCode;
    defaultAddress.default = true;
    if (!defaultAddress.id) {
      defaultAddress = await this.addressRepo.save(defaultAddress, {
        reload: true,
      });
    }
    let userAddresses = user.addresses;
    if (!userAddresses) {
      userAddresses = [];
    }
    const addressIdx = userAddresses?.findIndex(
      (a) => a.id === userDetails.addressId,
    );
    if (addressIdx === -1) {
      // address not found
      userAddresses.push(defaultAddress);
    } else {
      userAddresses[addressIdx] = defaultAddress;
    }
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

    const _user = await this.authJsUserRepo.save(user, { reload: true });
    return _user;
  }

  async getUserReviews(id: string): Promise<XTR_PRODUCT_REVIEW[]> {
    return await this.reviewRepo.find({ where: { user: { id } } });
  }

  async getUserOrders(id: string): Promise<AUTHJS_USER> {
    const user = await this.authJsUserRepo.findOne({
      relations: ['orders', 'orders.orderLines'],
      order: {
        orders: {
          createdDate: 'DESC',
        },
      },
      where: { id },
    });
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async getUserOverview(id: string): Promise<AUTHJS_USER> {
    const user = await this.authJsUserRepo.findOne({
      relations: ['likedProds', 'reviews', 'orders'],
      where: { id },
    });
    if (!user) {
      throw new NotFoundException();
    }

    return user;
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
