import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../app.module";

describe("AppModule", () => {
  let testModule: TestingModule;

  beforeEach(async () => {
    testModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
  });

  afterAll(async () => {
    await testModule.close();
  });

  describe("AppModule test", () => {
    it("AppModule should be defined", () => {
      expect(testModule).toBeDefined();
    });
  });
});