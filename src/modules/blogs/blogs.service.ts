import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import BlogResponseDto from './dto/blog-response.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(userId: string): Promise<BlogResponseDto[]> {
    return await this.prismaService.blog.findMany({
      where: { authorId: userId },
      select: {
        id: true,
        title: true,
        content: true,
        summary: true,
        slug: true,
        authorId: true,
        isPublished: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getById(userId: string, blogId: string): Promise<BlogResponseDto> {
    const blog = await this.prismaService.blog.findFirst({
      where: { id: blogId, authorId: userId },
      select: {
        id: true,
        title: true,
        content: true,
        summary: true,
        slug: true,
        authorId: true,
        isPublished: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    if (blog.authorId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to view this blog post',
      );
    }

    return blog;
  }

  async create(
    id: string,
    createBlogDto: CreateBlogDto,
  ): Promise<BlogResponseDto> {
    const { title, content, summary, slug } = createBlogDto;

    const blog = await this.prismaService.blog.create({
      data: {
        title,
        content,
        summary,
        slug,
        authorId: id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        summary: true,
        slug: true,
        authorId: true,
        isPublished: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return blog;
  }

  async update(
    userId: string,
    blogId: string,
    updateBlogDto: UpdateBlogDto,
  ): Promise<BlogResponseDto> {
    const blog = await this.prismaService.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    if (blog.authorId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this blog post',
      );
    }

    const updateData: UpdateBlogDto & { publishedAt?: Date | null } = {
      ...updateBlogDto,
    };

    if (updateBlogDto.isPublished && !blog.isPublished) {
      updateData.publishedAt = new Date();
    }

    if (updateBlogDto.isPublished === false) {
      updateData.publishedAt = null;
    }

    const updatedBlog = await this.prismaService.blog.update({
      where: { id: blogId },
      data: updateData,
      select: {
        id: true,
        title: true,
        content: true,
        summary: true,
        slug: true,
        authorId: true,
        isPublished: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedBlog;
  }

  async delete(userId: string, blogId: string): Promise<void> {
    const blog = await this.prismaService.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    if (blog.authorId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this blog post',
      );
    }

    await this.prismaService.blog.delete({
      where: { id: blogId },
    });
  }
}
