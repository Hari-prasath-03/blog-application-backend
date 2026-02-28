import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import BlogResponseDto from './dto/blog-response.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PrismaExceptionFilter } from './filter/prisma-exception.filter';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('Blogs')
@ApiBasicAuth('JWT-Auth')
@UseGuards(JwtAuthGuard)
@Controller('blogs')
@UseFilters(new PrismaExceptionFilter())
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all blog posts' })
  @ApiResponse({
    status: 200,
    description: 'List of blog posts retrieved successfully.',
    type: [BlogResponseDto],
  })
  async getAll(@GetUser('id') userId: string): Promise<BlogResponseDto[]> {
    return await this.blogsService.getAll(userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a single blog post by ID' })
  @ApiResponse({
    status: 200,
    description: 'Blog post retrieved successfully.',
    type: BlogResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Blog post not found.' })
  async getById(
    @GetUser('id') userId: string,
    @Param('id') blogId: string,
  ): Promise<BlogResponseDto> {
    return await this.blogsService.getById(userId, blogId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiBody({ type: CreateBlogDto })
  @ApiResponse({
    status: 201,
    description: 'Blog post created successfully.',
    type: BlogResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async create(
    @GetUser('id') userId: string,
    @Body() createBlogDto: CreateBlogDto,
  ): Promise<BlogResponseDto> {
    return await this.blogsService.create(userId, createBlogDto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing blog post' })
  @ApiBody({ type: UpdateBlogDto })
  @ApiResponse({
    status: 200,
    description: 'Blog post updated successfully.',
    type: BlogResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. You do not have permission to update this blog post.',
  })
  @ApiResponse({ status: 404, description: 'Blog post not found.' })
  async update(
    @GetUser('id') userId: string,
    @Param('id') blogId: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<BlogResponseDto> {
    return await this.blogsService.update(userId, blogId, updateBlogDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a blog post' })
  @ApiResponse({ status: 204, description: 'Blog post deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. You do not have permission to delete this blog post.',
  })
  @ApiResponse({ status: 404, description: 'Blog post not found.' })
  async delete(
    @GetUser('id') userId: string,
    @Param('id') blogId: string,
  ): Promise<void> {
    await this.blogsService.delete(userId, blogId);
  }

  // Likes

  @Post(':id/like')
  async like(@Param('id') blogId: string, @GetUser('id') userId: string) {
    return this.blogsService.like(blogId, userId);
  }

  @Delete(':id/like')
  async unlike(@Param('id') blogId: string, @GetUser('id') userId: string) {
    return this.blogsService.unlike(blogId, userId);
  }

  // Comments

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Param('id') blogId: string,
    @GetUser('id') userId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.blogsService.createComment(blogId, userId, dto);
  }

  @Get(':id/comments')
  async getComments(
    @Param('id') blogId: string,
    @Query('page') page = '0',
    @Query('size') size = '10',
  ) {
    return this.blogsService.getComments(blogId, Number(page), Number(size));
  }
}
