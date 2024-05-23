export class PaginationWithItems<T> {
  public pagesCount: number;
  constructor(
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items: T[],
  ) {
    this.pagesCount = Math.ceil(totalCount / pageSize);
  }
}
