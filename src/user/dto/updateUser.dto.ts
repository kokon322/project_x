import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @MinLength(4)
  @MaxLength(20)
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MinLength(4)
  @MaxLength(20)
  lastName: string;
}