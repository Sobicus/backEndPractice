import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Comments } from '../domain/comments.entity';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Comments)
    protected commentsRepository: Repository<Comments>,
  ) {}

  async getCommentById(commentId: number): Promise<Comments | null> {
    return await this.commentsRepository
      .createQueryBuilder('comment')
      .select()
      .where('comment.id = :commentId', { commentId })
      .getOne();
    // const comment = await this.dataSource.query(
    //   `SELECT *
    // FROM public."Comments"
    // WHERE "id"=$1`,
    //   [commentId],
    // );
    // return comment[0];
  }

  async deleteComment(commentId: number): Promise<void> {
    await this.commentsRepository
      .createQueryBuilder()
      .delete()
      .where('id = :commentId', { commentId })
      .execute();
    //     await this.dataSource.query(
    //       `DELETE FROM public."Comments"
    // WHERE "id"=CAST($1 as INTEGER)`,
    //       [commentId],
    //     );
  }

  a;

  async updateComment(commentId: string, content: string) {
    await this.commentsRepository
      .createQueryBuilder('comment')
      .update()
      .set({ content })
      .where('comments.id = :commentId', { commentId })
      .execute();
    //--------------------------------------------------------------------
    /*
    or we can find  comment by id and update throw the save method
    const updatedComment = { ...comment, content: command.content };
    and sent to save method
    */
  }

  async createComment(newComment: Comments): Promise<number> {
    const comment = await this.commentsRepository.save(newComment);
    return comment.id;
    //     const comment = await this.dataSource.query(
    //       `INSERT INTO public."Comments"(
    // "content", "userId", "userLogin", "createdAt", "postId")
    // VALUES ($1, $2, $3, $4, $5)
    // RETURNING "id"`,
    //       [
    //         newComment.content,
    //         newComment.userId,
    //         newComment.userLogin,
    //         newComment.createdAt,
    //         newComment.postId,
    //       ],
    //     );
    //
    //     return comment[0].id;
  }

  async deleteAll() {
    await this.dataSource.query(`DELETE FROM public."Comments"`);
  }
}
