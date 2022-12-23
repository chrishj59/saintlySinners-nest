import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

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
        database: configService.get('TYPEORM_DATABASE'), //'authTest',
        entities: [],
        synchronize: true,
        schema: 'ss',
        autoLoadEntities: true,
        logging: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
