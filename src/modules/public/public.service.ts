import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BlogResponseDto } from './dto/blog-response.dto';
import { take } from 'rxjs';
import { FeetPageResponseDto } from './dto/feet-page-response.dto';

@Injectable()
export class PublicService {
  constructor(private readonly prismaService: PrismaService) {}

  async getBlogBySlug(slug: string): Promise<BlogResponseDto> {
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
      },
    });

    if (!blog) {
      throw new NotFoundException('Blog post not found');
    }

    return blog;
  }

  async getFeed(page: number, limit: number): Promise<FeetPageResponseDto> {
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
            select: {
              likes: true,
              comments: true,
            },
          },
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
      data: blogs,
      page,
      size: limit,
      totalItems,
      totalPages,
    };
  }
}
