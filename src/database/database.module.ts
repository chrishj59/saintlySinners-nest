import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CUSTOMER_ORDER } from 'src/customer-order/entities/customerOrder.entity';
import { CUSTOMER_ORDER_LINE } from 'src/customer-order/entities/customerOrderLine.entity';
const fs = require('fs');

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('TYPEORM_HOST'), //'postgres',
        port: configService.get('TYPEORM_PORT'), //5432,
        username: configService.get('TYPEORM_USERNAME'),
        password: configService.get('TYPEORM_PASSWORD'),
        database: configService.get('TYPEORM_DATABASE'),
        entities: [CUSTOMER_ORDER, CUSTOMER_ORDER_LINE],
        synchronize: true,
        schema: 'ss',
        autoLoadEntities: true,
        logging: true,
        ssl: {
          rejectUnauthorized: false,
          ca: fs
            .readFileSync(`${process.cwd()}/src/database/ca-certificate-db.crt`)
            .toString(),
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
