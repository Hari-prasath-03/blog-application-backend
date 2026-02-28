export class BlogResponseDto {
  id: string;
  slug: string;
  title: string;
  content: string;
  summary: string | null;
  publishedAt: Date | null;
  author: {
    id: string;
    name: string;
  };
  _count: {
    comments: number;
    likes: number;
  };
}
