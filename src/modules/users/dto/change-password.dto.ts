import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password of the user',
    example: 'currentPassword123',
    minLength: 6,
  })
  @IsString({ message: 'Current password must be a string' })
  @IsNotEmpty({ message: 'Current password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  currentPassword: string;

  @ApiProperty({
    description: 'New password for the user',
    example: 'newPassword123',
    minLength: 6,
  })
  @IsString({ message: 'New password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  newPassword: string;
}
