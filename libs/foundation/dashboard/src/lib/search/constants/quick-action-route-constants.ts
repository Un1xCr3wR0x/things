/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class QuickActionRouteConstants {
  public static ROUTE_CONSTANTS(registrationNo?: number) {
    return [
      {
        label: 'UPDATE-WAGE',
        url: `/home/establishment/profile/${registrationNo}/view/contributor-list`
        // showForPPA: true
      },
      {
        label: 'REGISTER-CONTRIBUTOR',
        url: '/home/contributor/search',
        showForPPA: true
      },
      {
        label: 'MANAGE-ESTABLISHMENT',
        url: `/home/establishment/profile/${registrationNo}/view`,
        showForPPA: true
      },
      {
        label: 'DOWNLOAD-CERTIFICATE',
        url: `/home/establishment/certificates/${registrationNo}/view`
      },
      {
        label: 'BILL-DASHBOARD',
        url: `/home/billing/establishment/dashboard/view`
      },
      {
        label: 'TRANSFER-ALL-CONTRIBUTORS',
        url: '/home/contributor/transfer/all'
      },
      {
        label: 'VIEW-TRANSACTION-HISTORY',
        url: `/home/transactions/list/${registrationNo}`
      },
      {
        label: 'VIEW-VIOLATIONS',
        url: `/home/violations/violation-history/${registrationNo}`
      }
      // {
      //   label: 'COMPLAINTS',
      //   url: ''
      // }
    ];
  }
}
