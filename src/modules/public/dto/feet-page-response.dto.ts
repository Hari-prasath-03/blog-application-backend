export class FeetPageResponseDto {
  data: {
    id: string;
    title: string;
    slug: string;
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
    likedByMe: boolean;
  }[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}
