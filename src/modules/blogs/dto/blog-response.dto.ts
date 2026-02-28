export default class BlogResponseDto {
  id: string;
  authorId: string;
  title: string;
  slug: string;
  content: string;
  summary: string | null;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
