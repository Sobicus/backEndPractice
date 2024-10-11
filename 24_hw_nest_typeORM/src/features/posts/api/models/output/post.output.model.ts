import { ApiProperty } from '@nestjs/swagger';
export class NewestLikesType {
  @ApiProperty()
  addedAt: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  login: string;
}
export class ExtendedLikesInfoType {
  @ApiProperty({ description: 'Total likes for parent item' })
  likesCount: number;
  @ApiProperty({ description: 'Total dislikes for parent item' })
  dislikesCount: number;
  @ApiProperty({
    description: 'Send None if you want to unlikelike\\like',
    enum: ['None', 'Like', 'Dislike'],
  })
  myStatus: string;
  @ApiProperty({ nullable: true, type: [NewestLikesType] })
  newestLikes: NewestLikesType[];
}
export class PostOutputModelType {
  @ApiProperty()
  id: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  shortDescription: string;
  @ApiProperty()
  content: string;
  @ApiProperty()
  blogId: string;
  @ApiProperty()
  blogName: string;
  @ApiProperty()
  createdAt: string;
  @ApiProperty()
  // extendedLikesInfo: {
  //   likesCount: number;
  //
  //   dislikesCount: number;
  //
  //   myStatus: string;
  //
  //   newestLikes: NewestLikesType[];
  // };
  extendedLikesInfo: ExtendedLikesInfoType;
}
export class PaginationPostsType {
  @ApiProperty()
  pagesCount: number;
  @ApiProperty()
  page: number;
  @ApiProperty()
  pageSize: number;
  @ApiProperty()
  totalCount: number;
  @ApiProperty({ type: [PostOutputModelType] })
  items: PostOutputModelType[];
}
