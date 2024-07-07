/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/**
 * Filter with query param for getting branches under admin
 */
export class AdminBranchQueryParam {
  branchFilter: Filter = new Filter();
  page: PageDetails = new PageDetails();
  searchParam: string = undefined;
  fetchEligibleForMedicalInsuranceExtension: boolean;
  fetchEligibleForMedicalInsuranceExtensionEnrollment: boolean;
}

/**
 * Class used as a filter to fetch the branches under the loggedIn admin with various scenarios
 */
export class Filter {
  includeBranches = false; // if true will fetch only the branches under group, else will bring the main establishment of the groups which the loggedInAdmin has access to
  excludeBranches = false; // When passed true with adminId the branches under logged In admin will be fetched which is not under the admin (adminId)
  eligibleToUpdate = true; //Only the branches under branch/super/gcc admin will be shown
  registrationNo: number = undefined; //Authorised registration number - mainRegNo for super admin and any branchRegNo with access if branch admin or role admin
  role: number = undefined; // Role of the logged in person
  status: number[] = []; // Establishment statuses to be displayed
  adminId: number; //Branches with corresponding roles of this person. This person should be under the logged in admin
  fieldOffice: Array<number>; // to be removed
  location: Array<number>;
  legalEntity: Array<number>;
  roles: Array<number>;
}

export class PageDetails {
  pageNo: number;
  size: number;
}
