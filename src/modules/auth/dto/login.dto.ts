import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Provide a valid email address' })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'P@ssw0rd!',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
