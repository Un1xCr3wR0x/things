import { IBreadCrumb } from '@gosi-ui/core';

export class BreadCrumbConstants {
  public static get CONTRACT_BREADCRUMB_VALUES(): IBreadCrumb[] {
    return [
      {
        url: '/home',
        label: 'CONTRIBUTOR.HOME'
      },
      {
        url: '/home/contributor/individual/contributions',
        label: 'CONTRIBUTOR.CONTRIBUTIONS'
      },
      {
        url: '/home/contributor/contract/individual-contract',
        label: 'CONTRIBUTOR.CONTRACT-AUTH.CONTRACTS-DETAILS'
      }
    ];
  }

  public static get CONTRACT_PRV_BREADCRUMB_VALUES(): IBreadCrumb[] {
    return [
      {
        url: '/home',
        label: 'CONTRIBUTOR.HOME'
      },
      {
        url: '/home/contributor/individual/contributions',
        label: 'CONTRIBUTOR.CONTRIBUTIONS'
      },
      {
        url: '/home/contributor/contract/individual-contract',
        label: 'CONTRIBUTOR.CONTRACT-AUTH.CONTRACT-PREVIEW'
      }
    ];
  }

  public static get CNT_BREADCRUMB_VALUES(): IBreadCrumb[] {
    return [
      {
        url: '/home',
        label: 'CONTRIBUTOR.HOME'
      },
      {
        url: '/home/contributor/individual/contributions',
        label: 'CONTRIBUTOR.CONTRIBUTIONS'
      },
      {
        url: '/home/billing/vic/dashboard',
        label: 'BILLING.BILL'
      }
    ];
  }
  public static get DSB_BREADCRUMB_VALUES(): IBreadCrumb[] {
    return [
      {
        url: '/home',
        label: 'CONTRIBUTOR.HOME'
      },
      {
        url: '/dashboard/individual',
        label: 'CONTRIBUTOR.DASHBOARD'
      },
      {
        url: '/home/billing/vic/dashboard',
        label: 'BILLING.BILL'
      }
    ];
  }
  public static get DASHBOARD_BREADCRUMB_VALUES(): IBreadCrumb[] {
    return [
      {
        url: '/home',
        label: 'CONTRIBUTOR.HOME'
      },
      {
        url: '/dashboard/individual',
        label: 'CONTRIBUTOR.DASHBOARD'
      },
      {
        url: '/home/billing/vic/dashboard',
        label: 'BILLING.BILL'
      }
    ];
  }
  public static get BILL_HISTORY_BREADCRUMB_VALUES(): IBreadCrumb[] {
    return [
      {
        url: '/home',
        label: 'CONTRIBUTOR.HOME'
      },
      {
        url: '/dashboard/individual',
        label: 'CONTRIBUTOR.DASHBOARD'
      },
      {
        url: '/home/billing/vic/bill-history',
        label: 'BILLING.BILL-HISTORY'
      }
    ];
  }
  public static get RECEIPT_BREADCRUMB_VALUES(): IBreadCrumb[] {
    return [
      {
        url: '/home',
        label: 'CONTRIBUTOR.HOME'
      },
      {
        url: '/dashboard/individual',
        label: 'CONTRIBUTOR.DASHBOARD'
      },
      {
        url: '/home/billing/receipt/vic',
        label: 'BILLING.VIC-RECEIPTS'
      }
    ];
  }
  public static get MODIFY_LEAVING_BREADCRUMB_VALUES(): IBreadCrumb[] {
    return [
      {
        url: '/home',
        label: 'CONTRIBUTOR.HOME'
      },
      {
        url: '/home/contributor/individual/contributions',
        label: 'CONTRIBUTOR.CONTRIBUTIONS'
      },
      {
        url: '/home/contributor/individual/LeavingDate',
        label: 'CONTRIBUTOR.E-INSPECTION-MODIFY-LEAVING-DATE'
      }
    ];
  }
  public static get CANCEL_BREADCRUMB_VALUES(): IBreadCrumb[] {
    return [
      {
        url: '/home',
        label: 'CONTRIBUTOR.HOME'
      },
      {
        url: '/home/contributor/individual/contributions',
        label: 'CONTRIBUTOR.CONTRIBUTIONS'
      },
      {
        url: '/home/contributor/individual/Cancelengagement',
        label: 'CONTRIBUTOR.E-INSPECTION-CANCEL-ENGAGEMENT'
      }
    ];
  }
  public static get TERMINATE_BREADCRUMB_VALUES(): IBreadCrumb[] {
    return [
      {
        url: '/home',
        label: 'CONTRIBUTOR.HOME'
      },
      {
        url: '/home/contributor/individual/contributions',
        label: 'CONTRIBUTOR.CONTRIBUTIONS'
      },
      {
        url: '/home/contributor/individual/Terminateengagement',
        label: 'CONTRIBUTOR.TERMINATE-ENGAGEMENT'
      }
    ];
  }
  public static get MODIFY_JOINNING_BREADCRUMB_VALUES(): IBreadCrumb[] {
    return [
      {
        url: '/home',
        label: 'CONTRIBUTOR.HOME'
      },
      {
        url: '/home/contributor/individual/contributions',
        label: 'CONTRIBUTOR.CONTRIBUTIONS'
      },
      {
        url: '/home/contributor/individual/JoiningDate',
        label: 'CONTRIBUTOR.E-INSPECTION-MODIFY-JOINING-DATE'
      }
    ];
  }
  public static get DASHBOARD__URL(): string {
    return '/dashboard/individual';
  }
  public static get CNT__URL(): string {
    return '/home/contributor/individual/contributions';
  }
}
