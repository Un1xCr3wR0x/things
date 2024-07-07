import { IBreadCrumb } from '@gosi-ui/core';

export class BreadcrumbConstants {
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
        url: '/home/contributor/wage/update/vic-wage',
        label: 'CONTRIBUTOR.MODIFY-VIC-WAGE'
      }
    ];
  }
}
