export class SortingDbHelper<T> {
  constructor(
    private readonly sortBy: string,
    private readonly orderSort: 'asc' | 'desc',
  ) {}

  public get orderBy(): T {
    return { [this.sortBy]: this.orderSort } as T;
  }
}
