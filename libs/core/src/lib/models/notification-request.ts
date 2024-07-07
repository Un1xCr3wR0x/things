export class NotificationRequest {
  page: PageRequest = new PageRequest();
  sort: SortRequest = new SortRequest();
}
export class PageRequest {
  pageNo: number;
  pageSize: number;
}
export class SortRequest {
  column: string;
  direction: string;
}
