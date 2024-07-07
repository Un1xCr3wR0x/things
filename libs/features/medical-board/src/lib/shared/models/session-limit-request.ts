export class SessionLimitRequest {
  pageNo: number = undefined;
  size: number = undefined;

  constructor() {
    this.pageNo = 0;
    this.size = 10;
  }
}
export class SortQueryParam {
  sortBy: string;
  sortOrder: string;
}