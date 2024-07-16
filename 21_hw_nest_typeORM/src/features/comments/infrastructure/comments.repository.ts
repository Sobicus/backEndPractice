import { Injectable } from '@nestjs/common';
import { InputCreateCommentModel } from '../api/models/input/comments.input.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getCommentById(commentId: string) {
    const comment = await this.dataSource.query(
      `SELECT *
    FROM public."Comments"
    WHERE "id"=$1`,
      [commentId],
    );
    return comment[0];
  }

  async deleteComment(commentId: string): Promise<void> {
    await this.dataSource.query(
      `DELETE FROM public."Comments"
WHERE "id"=CAST($1 as INTEGER)`,
      [commentId],
    );
  }

  async updateComment(commentId: string, content: string) {
    await this.dataSource.query(
      `UPDATE public."Comments"
SET content=$2
WHERE "id"=$1`,
      [commentId, content],
    );
  }

  async createComment(newComment: InputCreateCommentModel): Promise<number> {
    const comment = await this.dataSource.query(
      `INSERT INTO public."Comments"(
"content", "userId", "userLogin", "createdAt", "postId")
VALUES ($1, $2, $3, $4, $5)
RETURNING "id"`,
      [
        newComment.content,
        newComment.userId,
        newComment.userLogin,
        newComment.createdAt,
        newComment.postId,
      ],
    );

    return comment[0].id;
  }
  async deleteAll() {
    await this.dataSource.query(`DELETE FROM public."Comments"`);
  }
}
