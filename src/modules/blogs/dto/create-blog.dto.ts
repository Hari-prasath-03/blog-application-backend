import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({
    description: 'Title of the blog post',
    example: 'My First Blog Post',
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @ApiProperty({
    description: 'Slug of the blog post',
    example: 'my-first-blog-post',
  })
  @IsString()
  @IsNotEmpty({ message: 'Slug is required' })
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must not contain spaces. Use hyphens instead.',
  })
  slug: string;

  @ApiProperty({
    description: 'Content of the blog post',
    example: 'This is the content of my first blog post.',
  })
  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  content: string;

  @ApiProperty({
    description: 'Summary of the blog post',
    example: 'A brief summary of my first blog post.',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  summary?: string;
}
