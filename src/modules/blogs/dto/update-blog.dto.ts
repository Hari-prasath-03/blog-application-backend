import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateBlogDto {
  @ApiProperty({
    description: 'The title of the blog post',
    example: 'My Updated Blog Post',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'The slug for the blog post (URL-friendly identifier)',
    example: 'my-updated-blog-post',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9-]+$/)
  slug?: string;

  @ApiProperty({
    description: 'The content of the blog post',
    example: 'This is the updated content of my blog post.',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'A brief summary of the blog post',
    example: 'This is a summary of my updated blog post.',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({
    description: 'Whether the blog post is published or not',
    example: true,
    nullable: true,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
