import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { Match } from '../../decorator/match.decorator';
import { ErrorMessages } from '../../constant/errorMessages';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  firstName: string;

  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  lastName: string;

  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(10)
  password?: string;

  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Match('password', { message: ErrorMessages.PASSWORD_SHOULD_BE_EQUAL })
  confirmPassword?: string;
}