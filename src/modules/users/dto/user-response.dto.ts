import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: 'cjkcknjz43d',
    description: 'The unique identifier of the user',
  })
  id: string;

  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  email: string;

  @ApiProperty({ example: 'admin', description: 'The role of the user' })
  role: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00Z',
    description: 'The date and time when the user was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-02T00:00:00Z',
    description: 'The date and time when the user was last updated',
  })
  updatedAt: Date;
}
