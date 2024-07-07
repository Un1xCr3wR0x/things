import { IBreadCrumb } from '@gosi-ui/core';

export class BreadcrumbConstants {
  public static get INDV_BREADCRUMB_VALUES(): IBreadCrumb[] {
    return [
      {
        url: '/home',
        label: 'CONTRIBUTOR.HOME'
      },
      {
        url: '/home/individual/profile',
        label: 'CUSTOMER-INFORMATION.MY-PROFILE'
      },
      {
        url: '/home/individual/profile/modify',
        label: 'CUSTOMER-INFORMATION.MODIFY-CONTACT-DETAILS'
      }
    ];
  }
  public static get INDV_BREADCRUMB_BANKVALUES(): IBreadCrumb[] {
    return [
      {
        url: '/home',
        label: 'CONTRIBUTOR.HOME'
      },
      {
        url: '/home/individual/profile',
        label: 'CUSTOMER-INFORMATION.MY-PROFILE'
      },

      {
        url: '/home/individual/profile/add-bank',
        label: 'CUSTOMER-INFORMATION.ADD-BANK-DETAILS'
      }
    ];
  }
}
