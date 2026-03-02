import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PublicService } from './public.service';
import { BlogResponseDto } from './dto/blog-response.dto';
import { FeetPageResponseDto } from './dto/feet-page-response.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { OptionalJwtAuthGuard } from 'src/common/guards/optional-jwt.guard';

@ApiTags('Public')
@Controller('public')
@UseGuards(OptionalJwtAuthGuard)
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('blogs/:slug')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Blog post retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Blog post not found.' })
  async getBlogBySlug(@Param('slug') slug: string, @GetUser('id') userId: string): Promise<BlogResponseDto> {
    return await this.publicService.getBlogBySlug(slug, userId);
  }

  @Get('feed')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Blog feed retrieved successfully.',
  })
  @ApiResponse({
    status: 429,
    description: 'Too Many Requests. Please try again later.',
  })
  async getFeed(
    @Query('page') page = '0',
    @Query('size') size = '10',
    @GetUser('id') userId: string,
  ): Promise<FeetPageResponseDto> {
    return await this.publicService.getFeed(
      parseInt(page),
      parseInt(size),
      userId,
    );
  }
}
