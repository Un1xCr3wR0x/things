export const menuData = {
  menuItems: [
    {
      label: 'MENUITEM.DASHBOARD',
      link: '/dashboard',
      icon: 'home',
      hasSubMenu: false,
      active: true,
      allowedFeatures: ['Dashboard.All']
    },
    {
      label: 'MENUITEM.CONTRIBUTOR-SERVICE',
      link: '#',
      icon: 'user',
      hasSubMenu: true,
      open: false,
      active: false,
      allowedFeatures: ['Contributor.All', 'Register-Contributor.All'],
      menuItems: [
        {
          label: 'MENUITEM.ADD-CONTRIBUTOR',
          link: '/home/contributor/search',
          icon: '',
          hasSubMenu: false,
          allowedFeatures: ['Contributor.All', 'Register-Contributor.All']
        },
        {
          label: 'MENUITEM.SEARCH',
          link: '/home/profile/contributor/search',
          icon: '',
          hasSubMenu: false,
          allowedFeatures: ['Contributor.All']
        },
        {
          label: 'MENUITEM.MANAGE-WAGE',
          link: '/home/contributor/wage/update/wage-details',
          icon: '',
          hasSubMenu: false,
          allowedFeatures: ['Contributor.All']
        },
        {
          label: 'MENUITEM.TRANSFER-ALL-CONTRIBUTORS',
          link: '/home/contributor/transfer/all',
          icon: '',
          hasSubMenu: false,
          allowedFeatures: ['Contributor.All']
        }
      ]
    },
    {
      label: 'MENUITEM.ESTABLISHMENT-SERVICES',
      link: '#',
      icon: 'building',
      hasSubMenu: true,
      open: false,
      active: false,
      allowedFeatures: ['Establishment.All', 'Occupational-Hazard.All', 'Billing.All'],
      menuItems: [
        {
          label: 'MENUITEM.COMPLETE-PROACTIVE',
          link: '/home/establishment/register/proactive',
          icon: '',
          hasSubMenu: false,
          allowedFeatures: ['Establishment.All']
        },
        {
          label: 'MENUITEM.EST-PROFILE',
          link: '/home/establishment/profile',
          icon: '',
          hasSubMenu: false,
          allowedFeatures: ['Establishment.All']
        },
        {
          label: 'MENUITEM.BRANCHES',
          link: '/home/establishment/change/search',
          icon: '',
          hasSubMenu: false,
          allowedFeatures: ['Establishment.All']
        },
        {
          label: 'MENUITEM.REPORT-OH',
          link: '/home/oh/report',
          icon: '',
          hasSubMenu: false,
          allowedFeatures: ['Occupational-Hazard.All']
        },
        {
          label: 'MENUITEM.SEND-PAYMENT-NOTICE',
          link: '/home/billing/payment/establishment-payment',
          icon: '',
          hasSubMenu: false,
          queryParams: {
            mof: 'false'
          },
          allowedFeatures: ['Billing.All']
        },
        {
          label: 'MENUITEM.WAIVE-ESTABLISHMENT-LATE-FEES',
          link: '/home/billing/penalty-waiver',
          icon: 'file-invoice-dollar',
          hasSubMenu: false,
          allowedFeatures: ['Billing.All']
        }
      ]
    },
    {
      label: 'MENUITEM.TRANSACTION-DETAILS',
      link: '/home/transactions/list',
      icon: 'exchange-alt',
      hasSubMenu: false,
      allowedFeatures: ['Transaction.All']
    },
    {
      label: 'MENUITEM.BILL',
      link: '#',
      icon: 'file-invoice-dollar',
      hasSubMenu: true,
      open: false,
      active: false,
      allowedFeatures: ['Billing.All'],
      menuItems: [
        {
          label: 'MENUITEM.ESTABLISHMENT',
          link: '/home/billing/establishment/dashboard',
          icon: '',
          hasSubMenu: false,
          allowedFeatures: ['Billing.All']
        },
        {
          label: 'MENUITEM.RECEIPT',
          link: '/home/billing/receipt/establishment',
          icon: '',
          hasSubMenu: false,
          allowedFeatures: ['Billing.All']
        }
      ]
    },
    {
      label: 'MENUITEM.INBOX',
      link: '/home/inbox/todolist',
      icon: 'inbox',
      hasSubMenu: false,
      allowedFeatures: ['Inbox.All']
    }
  ]
};
