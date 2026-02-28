import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({ message: 'Content must not be empty.' })
  @MaxLength(500, { message: 'Content must not exceed 500 characters.' })
  content: string;
}
