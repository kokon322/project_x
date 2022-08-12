import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

describe('AppModule', () => {
  let testModule: TestingModule;
  let mockTypeOrmModule;
  let mockMongooseModule;
  let mockConfigModule;

  beforeEach(async () => {
    testModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TypeOrmModule)
      .useValue(mockTypeOrmModule)
      .overrideProvider(MongooseModule)
      .useValue(mockMongooseModule)
      .overrideProvider(ConfigModule)
      .useValue(mockConfigModule)
      .compile();
  });

  afterAll(async () => {
    await testModule.close();
  });

  describe('AppModule test', () => {
    it('AppModule should be defined', () => {
      expect(testModule).toBeDefined();
    });
  });
});
