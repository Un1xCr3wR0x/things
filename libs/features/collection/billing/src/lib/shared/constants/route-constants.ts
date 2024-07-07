export class RouteConstants {
  /** Route for add contributor search. */
  public static get ROUTER_CONTRIBUTOR_SEARCH(): string {
    return '/home/contributor/search';
  }
  public static get ROUTE_VIEW_RECORD(): string {
    return 'home/billing/establishment/bill-history/previous-bill';
  }
  public static get ROUTE_VIEW_ESCLATION(): string {
    return `home/billing/establishment/bill-history/previous-bill/old-bills`;
  }
  public static EST_PROFILE_ROUTE(regNo: number): string {
    return `/home/establishment/profile/${regNo}/view`;
  }
}
