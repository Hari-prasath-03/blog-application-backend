import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BlogResponseDto } from './dto/blog-response.dto';
import { FeetPageResponseDto } from './dto/feet-page-response.dto';

@Injectable()
export class PublicService {
  constructor(private readonly prismaService: PrismaService) {}

  async getBlogBySlug(slug: string, userId: string): Promise<BlogResponseDto> {
    const blog = await this.prismaService.blog.findFirst({
      where: { slug, isPublished: true },
      select: {
        id: true,
        title: true,
        content: true,
        summary: true,
        slug: true,
        publishedAt: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
        ...(userId && {
          likes: {
            where: { userId },
            select: { id: true },
          },
        }),
      },
    });

    if (!blog) {
      throw new NotFoundException('Blog post not found');
    }

    return { ...blog, likedByMe: blog.likes?.length > 0 };
  }

  async getFeed(
    page: number,
    limit: number,
    userId: string,
  ): Promise<FeetPageResponseDto> {
    const skip = page * limit;

    const [blogs, totalItems] = await Promise.all([
      this.prismaService.blog.findMany({
        where: {
          isPublished: true,
        },
        skip,
        take: limit,
        orderBy: {
          publishedAt: 'desc',
        },
        select: {
          id: true,
          title: true,
          slug: true,
          summary: true,
          publishedAt: true,
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: { likes: true, comments: true },
          },
          ...(userId && {
            likes: {
              where: { userId },
              select: { id: true },
            },
          }),
        },
      }),
      this.prismaService.blog.count({
        where: {
          isPublished: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);
    return {
      data: blogs.map(({ likes, ...blog }) => ({
        ...blog,
        likedByMe: userId ? likes.length > 0 : false,
      })),
      page,
      size: limit,
      totalItems,
      totalPages,
    };
  }
}
