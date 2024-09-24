import { ApiProperty } from '@nestjs/swagger';

export class BlogOutputModelType {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  websiteUrl: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  isMembership: boolean;
}

export class PaginationBlogsType {
  @ApiProperty()
  pagesCount: number;
  @ApiProperty()
  page: number;
  @ApiProperty()
  pageSize: number;
  @ApiProperty()
  totalCount: number;
  @ApiProperty({ type: [BlogOutputModelType] })
  items: BlogOutputModelType[];
}
