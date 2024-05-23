/* eslint-disable no-underscore-dangle,@typescript-eslint/no-explicit-any,@typescript-eslint/explicit-function-return-type */
// noinspection JSUnusedGlobalSymbols,UnnecessaryLocalVariableJS

import { Injectable } from '@nestjs/common';

import { LikeStatusType } from '../../features/comments/types/comments/input';
import { PaginationWithItems } from '../../features/common/types/output';

export interface ILikesQueryRepository {
  getLikeByUserId(id: string, userId: string): Promise<any | null>;
  getManyLikesByUserId(ids: string[], userId: string): Promise<any[]>;
}
@Injectable()
export class LikesToMapperManager {
  async getUserLikeStatuses<T extends { _id: string }>(
    items: PaginationWithItems<T>,
    repository: ILikesQueryRepository,
    userId: string,
    likeIdName: string,
  ) {
    //create an array of id
    const itemsId = items.items.map((item) => item._id);
    const likes = await repository.getManyLikesByUserId(itemsId, userId);

    const likeStatuses = likes.reduce(
      (statuses, like) => {
        if (like && like[likeIdName]) {
          statuses[like[likeIdName]] = like.likeStatus;
        }
        return statuses;
      },
      {} as Record<string, LikeStatusType>,
    );

    return likeStatuses;
  }

  generateDto<T extends { _id: string } & { toDto: (likeStatus: LikeStatusType) => any }>(
    items: PaginationWithItems<T>,
    likeStatuses: Record<string, LikeStatusType>,
  ) {
    const updatedItems = items.items.map((item) => {
      const likeStatus = likeStatuses[item._id] ?? 'None';
      return item.toDto(likeStatus);
    });
    return { ...items, items: updatedItems };
  }
}
