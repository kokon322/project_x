import { Controller, Get } from '@nestjs/common';

@Controller('')
export class TestController {

  @Get()
  async testController () {
    return {message: " Hello"}
  }

}
