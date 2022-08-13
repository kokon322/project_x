import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigService } from './db/PostgresConfigService';
import { MongooseConfigService } from './db/MongooseConfigService';
import { TestController } from './test/test.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
      inject: [MongooseConfigService],
    }),
  ],
  controllers: [TestController],
  providers: [],
})
export class AppModule {
}
