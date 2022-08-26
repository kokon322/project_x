import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class GetUserByEmailDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}