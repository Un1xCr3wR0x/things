/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class RouterConstants {
  public static get ROUTE_ESTABLISHMENT_SUMMARY(): string {
    return `/dashboard/search/establishment/summary`;
  }
  public static ROUTE_ESTABLISHMENT_PROFILE(registrationNo: number): string {
    return `/home/establishment/profile/${registrationNo}/view`;
  }
  public static ROUTE_ESTABLISHMENT_GROUP_PROFILE(registrationNo: number): string {
    return `/home/establishment/profile/group/${registrationNo}`;
  }
}
