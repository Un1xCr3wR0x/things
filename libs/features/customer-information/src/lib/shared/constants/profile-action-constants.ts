/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class ProfileActionConstants {
  public static ROUTE_CONSTANTS(
    personId?: number,
    userRoles?: any,
    fromEstablishment?: boolean,
    establishmentRegNo?: number,
    showUnifyEngTimeLine?: boolean,
    showCertificates?: boolean
  ) {
    let vicUser = userRoles.filter(item => item.role.english === 'VIC');
    let guestUser = userRoles.filter(item => item.role.english === 'Guest');
    let dependentUser = userRoles.filter(item => item.role.english === 'Dependent');
    let beneficiaryUser = userRoles.filter(item => item.role.english === 'Beneficiary');
    let contributorUser = userRoles.filter(item => item.role.english === 'Contributor');
    let establishmentUser = userRoles.filter(
      item => item.role.english === 'Establishment Admin' || item.role.english === 'Establishment Owner'
    );
    let heirUser = userRoles.filter(item => item.role.english === 'Heir');
    let authorisedUser = userRoles.filter(item => item.role.english === 'Authorized Person');
    let fromEst = fromEstablishment;
    let estRegNo = establishmentRegNo;
    let routes = [];

    if (establishmentUser.length > 0) {
      if (contributorUser.length > 0 || vicUser.length > 0) {
        if (beneficiaryUser.length > 0) {
          routes = [
            {
              label: 'OVERVIEW',
              icon: 'house-user',
              isImage: false,
              url: `/home/profile/individual/internal/${personId}/overview`
            },
            {
              label: 'TRANSACTION-HISTORY',
              icon: 'exchange-alt',
              isImage: false,
              url: `/home/profile/individual/internal/${personId}/transaction-history`
            },
            {
              label: 'CONTRIBUTORS-OVERVIEW',
              icon: 'briefcase',
              isImage: false,
              url: !fromEst
                ? `/home/profile/individual/internal/${personId}/engagements`
                : `/home/profile/individual/internal/${personId}/engagements/establishment/${estRegNo}`
            },
            {
              label: 'BENEFITS',
              isImage: true,
              icon: 'assets/images/Benefits.svg',
              activeIcon: 'assets/images/Benefits-green.svg',
              url: `/home/profile/individual/internal/${personId}/benefits`
            },
            {
              label: 'BENEFITS-PAYMENT-HISTORY',
              isImage: true,
              icon: 'assets/images/Benefits.svg',
              activeIcon: 'assets/images/Benefits-green.svg',
              url: `/home/profile/individual/internal/${personId}/benefits-payment-history`
            },
            // {
            //   label: 'MEDICAL-BOARD-SESSIONS',
            //   icon: 'notes-medical',
            //   isImage: false,
            //   url: `/home/establishment/certificates/${socialInsuranceNo}/view`
            // },
            {
              label: 'MEDICAL-BOARD-ASSESSMENTS',
              icon: 'notes-medical',
              isImage: false,
              url: `/home/profile/individual/internal/${personId}/medical-board`
            },

            {
              label: 'OCCUPATIONAL-HAZARDS',
              icon: 'user-injured',
              isImage: false,
              url: `/home/profile/individual/internal/${personId}/occupational-hazards`
            },
            // {
            //   label: 'DOCTOR-DETAILS',
            //   icon: 'file-signature',
            //   isImage: false,
            //   url: '/home/contributor/transfer/all'
            // },
            {
              label: 'ESTABLISHMENT-DETAILS',
              icon: 'building',
              isImage: false,
              url: `/home/profile/individual/internal/${personId}/establishments`
            },
            {
              label: 'FINANCIAL-DETAILS',
              icon: 'wallet',
              isImage: false,
              url: `/home/profile/individual/internal/${personId}/financial-details`
            },
            {
              label: 'CERIFICATE-OR-DOCUMENTS',
              icon: 'assets/images/Certificate.svg',
              activeIcon: 'assets/images/Certificate_highlight.svg',
              isImage: true,
              url: `/home/profile/individual/internal/${personId}/records`
            },
            {
              label: 'PERSONAL-DETAILS',
              icon: 'user',
              isImage: false,
              url: `/home/profile/individual/internal/${personId}/personal-details`
            },
            // {
            //   label: 'CUSTOMER-CONTACT',
            //   icon: 'comment',
            //   isImage: false,
            //   url: `/home/profile/individual/internal/${personId}/customer-contact`
            // }
          ];
        } else {
          routes = [
            {
              label: 'OVERVIEW',
              icon: 'house-user',
              isImage: false,
              url: `/home/profile/individual/internal/${personId}/overview`
            },
            {
              label: 'TRANSACTION-HISTORY',
              icon: 'exchange-alt',
              isImage: false,
              url: `/home/profile/individual/internal/${personId}/transaction-history`
            },
            {
              label: 'CONTRIBUTORS-OVERVIEW',
              icon: 'briefcase',
              isImage: false,
              url: !fromEst
                ? `/home/profile/individual/internal/${personId}/engagements`
                : `/home/profile/individual/internal/${personId}/engagements/establishment/${estRegNo}`
            },
            {
              label: 'BENEFITS',
              isImage: true,
              icon: 'assets/images/Benefits.svg',
              activeIcon: 'assets/images/Benefits-green.svg',
              url: `/home/profile/individual/internal/${personId}/benefits`
            },
            {
              label: 'BENEFITS-PAYMENT-HISTORY',
              isImage: true,
              icon: 'assets/images/Benefits.svg',
              activeIcon: 'assets/images/Benefits-green.svg',
              url: `/home/profile/individual/internal/${personId}/benefits-payment-history`
            },
            // {
            //   label: 'MEDICAL-BOARD-SESSIONS',
            //   icon: 'notes-medical',
            //   isImage: false,
            //   url: `/home/establishment/certificates/${socialInsuranceNo}/view`
            // },
            {
              label: 'MEDICAL-BOARD-ASSESSMENTS',
              icon: 'notes-medical',
              isImage: false,
              url: `/home/profile/individual/internal/${personId}/medical-board`
            },
            {
              label: 'OCCUPATIONAL-HAZARDS',
              icon: 'user-injured',
              isImage: false,
              url: `/home/profile/individual/internal/${personId}/occupational-hazards`
            },
            // {
            //   label: 'DOCTOR-DETAILS',
            //   icon: 'file-signature',
            //   isImage: false,
            //   url: '/home/contributor/transfer/all'
            // },
            {
              label: 'ESTABLISHMENT-DETAILS',
              icon: 'building',
              isImage: false,
              url: `/home/profile/individual/internal/${personId}/establishments`
            },
            {
              label: 'FINANCIAL-DETAILS',
              icon: 'wallet',
              isImage: false,
              url: `/home/profile/individual/internal/${personId}/financial-details`
            },
            {
              label: 'CERIFICATE-OR-DOCUMENTS',
              icon: 'assets/images/Certificate.svg',
              activeIcon: 'assets/images/Certificate_highlight.svg',
              isImage: true,
              url: `/home/profile/individual/internal/${personId}/records`
            },
            {
              label: 'PERSONAL-DETAILS',
              icon: 'user',
              isImage: false,
              url: `/home/profile/individual/internal/${personId}/personal-details`
            },
            // {
            //   label: 'CUSTOMER-CONTACT',
            //   icon: 'comment',
            //   isImage: false,
            //   url: `/home/profile/individual/internal/${personId}/customer-contact`
            // }
          ];
        }
      } else {
        routes = [
          {
            label: 'OVERVIEW',
            icon: 'house-user',
            isImage: false,
            url: `/home/profile/individual/internal/${personId}/overview`
          },
          {
            label: 'TRANSACTION-HISTORY',
            icon: 'exchange-alt',
            isImage: false,
            url: `/home/profile/individual/internal/${personId}/transaction-history`
          },
          // {
          //   label: 'BENEFITS',
          //   icon: 'Benefits',
          //   isImage: true,
          //   url: `/home/profile/individual/internal/${socialInsuranceNo}/benefits`
          // },
          // {
          //   label: 'MEDICAL-BOARD-SESSIONS',
          //   icon: 'notes-medical',
          //   isImage: false,
          //   url: `/home/establishment/certificates/${socialInsuranceNo}/view`
          // },
          // {
          //   label: 'DOCTOR-DETAILS',
          //   icon: 'file-signature',
          //   isImage: false,
          //   url: '/home/contributor/transfer/all'
          // },
          {
            label: 'ESTABLISHMENT-DETAILS',
            icon: 'building',
            isImage: false,
            url: `/home/profile/individual/internal/${personId}/establishments`
          },
          {
            label: 'FINANCIAL-DETAILS',
            icon: 'wallet',
            isImage: false,
            url: `/home/profile/individual/internal/${personId}/financial-details`
          },
          {
            label: 'CERIFICATE-OR-DOCUMENTS',
            icon: 'assets/images/Certificate.svg',
            activeIcon: 'assets/images/Certificate_highlight.svg',
            isImage: true,
            url: `/home/profile/individual/internal/${personId}/records`
          },
          {
            label: 'PERSONAL-DETAILS',
            icon: 'user',
            isImage: false,
            url: `/home/profile/individual/internal/${personId}/personal-details`
          },
          // {
          //   label: 'CUSTOMER-CONTACT',
          //   icon: 'comment',
          //   isImage: false,
          //   url: `/home/profile/individual/internal/${personId}/customer-contact`
          // }
        ];
      }
    } else if (contributorUser.length > 0 || vicUser.length > 0) {
      routes = [
        {
          label: 'OVERVIEW',
          icon: 'house-user',
          isImage: false,
          url: `/home/profile/individual/internal/${personId}/overview`
        },
        {
          label: 'TRANSACTION-HISTORY',
          icon: 'exchange-alt',
          isImage: false,
          url: `/home/profile/individual/internal/${personId}/transaction-history`
        },
        {
          label: 'CONTRIBUTORS-OVERVIEW',
          icon: 'briefcase',
          isImage: false,
          url: !fromEst
            ? `/home/profile/individual/internal/${personId}/engagements`
            : `/home/profile/individual/internal/${personId}/engagements/establishment/${estRegNo}`
        },
        {
          label: 'BENEFITS',
          isImage: true,
          icon: 'assets/images/Benefits.svg',
          activeIcon: 'assets/images/Benefits-green.svg',
          url: `/home/profile/individual/internal/${personId}/benefits`
        },
        {
          label: 'BENEFITS-PAYMENT-HISTORY',
          isImage: true,
          icon: 'assets/images/Benefits.svg',
          activeIcon: 'assets/images/Benefits-green.svg',
          url: `/home/profile/individual/internal/${personId}/benefits-payment-history`
        },
        // {
        //   label: 'MEDICAL-BOARD-SESSIONS',
        //   icon: 'notes-medical',
        //   isImage: false,
        //   url: `/home/establishment/certificates/${socialInsuranceNo}/view`
        // },
        {
          label: 'MEDICAL-BOARD-ASSESSMENTS',
          icon: 'notes-medical',
          isImage: false,
          url: `/home/profile/individual/internal/${personId}/medical-board`
        },
        {
          label: 'OCCUPATIONAL-HAZARDS',
          icon: 'user-injured',
          isImage: false,
          url: `/home/profile/individual/internal/${personId}/occupational-hazards`
        },
        // {
        //   label: 'DOCTOR-DETAILS',
        //   icon: 'file-signature',
        //   isImage: false,
        //   url: '/home/contributor/transfer/all'
        // },
        {
          label: 'FINANCIAL-DETAILS',
          icon: 'wallet',
          isImage: false,
          url: `/home/profile/individual/internal/${personId}/financial-details`
        },
        {
          label: 'CERIFICATE-OR-DOCUMENTS',
          icon: 'assets/images/Certificate.svg',
          activeIcon: 'assets/images/Certificate_highlight.svg',
          isImage: true,
          url: `/home/profile/individual/internal/${personId}/records`
        },
        {
          label: 'PERSONAL-DETAILS',
          icon: 'user',
          isImage: false,
          url: `/home/profile/individual/internal/${personId}/personal-details`
        },
        // {
        //   label: 'CUSTOMER-CONTACT',
        //   icon: 'comment',
        //   isImage: false,
        //   url: `/home/profile/individual/internal/${personId}/customer-contact`
        // }
      ];
    } else if (beneficiaryUser.length > 0) {
      routes = [
        {
          label: 'OVERVIEW',
          icon: 'house-user',
          isImage: false,
          url: `/home/profile/individual/internal/${personId}/overview`
        },
        {
          label: 'TRANSACTION-HISTORY',
          icon: 'exchange-alt',
          isImage: false,
          url: `/home/profile/individual/internal/${personId}/transaction-history`
        },
        {
          label: 'CERIFICATE-OR-DOCUMENTS',
          icon: 'assets/images/Certificate.svg',
          activeIcon: 'assets/images/Certificate_highlight.svg',
          isImage: true,
          url: `/home/profile/individual/internal/${personId}/records`
        },
        {
          label: 'BENEFITS',
          isImage: true,
          icon: 'assets/images/Benefits.svg',
          activeIcon: 'assets/images/Benefits-green.svg',
          url: `/home/profile/individual/internal/${personId}/benefits`
        },
        {
          label: 'BENEFITS-PAYMENT-HISTORY',
          isImage: true,
          icon: 'assets/images/Benefits.svg',
          activeIcon: 'assets/images/Benefits-green.svg',
          url: `/home/profile/individual/internal/${personId}/benefits-payment-history`
        },
        {
          label: 'MEDICAL-BOARD-ASSESSMENTS',
          icon: 'notes-medical',
          isImage: false,
          url: `/home/profile/individual/internal/${personId}/medical-board`
        },
        {
          label: 'FINANCIAL-DETAILS',
          icon: 'wallet',
          isImage: false,
          url: `/home/profile/individual/internal/${personId}/financial-details`
        },
        {
          label: 'PERSONAL-DETAILS',
          icon: 'user',
          isImage: false,
          url: `/home/profile/individual/internal/${personId}/personal-details`
        },
        // {
        //   label: 'CUSTOMER-CONTACT',
        //   icon: 'comment',
        //   isImage: false,
        //   url: `/home/profile/individual/internal/${personId}/customer-contact`
        // }
      ];
    } else if (guestUser.length > 0 || dependentUser.length > 0) {
      routes = [
        {
          label: 'OVERVIEW',
          icon: 'house-user',
          isImage: false,
          url: `/home/profile/individual/internal/${personId}/overview`
        },
        {
          label: 'TRANSACTION-HISTORY',
          icon: 'exchange-alt',
          isImage: false,
          url: `/home/profile/individual/internal/${personId}/transaction-history`
        },
        {
          label: 'CERIFICATE-OR-DOCUMENTS',
          icon: 'assets/images/Certificate.svg',
          activeIcon: 'assets/images/Certificate_highlight.svg',
          isImage: true,
          url: `/home/profile/individual/internal/${personId}/records`
        },
        {
          label: 'BENEFITS',
          isImage: true,
          icon: 'assets/images/Benefits.svg',
          activeIcon: 'assets/images/Benefits-green.svg',
          url: `/home/profile/individual/internal/${personId}/benefits`
        },
        {
          label: 'BENEFITS-PAYMENT-HISTORY',
          isImage: true,
          icon: 'assets/images/Benefits.svg',
          activeIcon: 'assets/images/Benefits-green.svg',
          url: `/home/profile/individual/internal/${personId}/benefits-payment-history`
        },
        {
          label: 'MEDICAL-BOARD-ASSESSMENTS',
          icon: 'notes-medical',
          isImage: false,
          url: `/home/profile/individual/internal/${personId}/medical-board`
        },
        {
          label: 'FINANCIAL-DETAILS',
          icon: 'wallet',
          isImage: false,
          url: `/home/profile/individual/internal/${personId}/financial-details`
        },
        {
          label: 'PERSONAL-DETAILS',
          icon: 'user',
          isImage: false,
          url: `/home/profile/individual/internal/${personId}/personal-details`
        },
        // {
        //   label: 'CUSTOMER-CONTACT',
        //   icon: 'comment',
        //   isImage: false,
        //   url: `/home/profile/individual/internal/${personId}/customer-contact`
        // }
      ];
    } else if (authorisedUser.length > 0 || heirUser.length > 0) {
      routes = [
        {
          label: 'OVERVIEW',
          icon: 'house-user',
          isImage: false,
          url: `/home/profile/individual/internal/${personId}/overview`
        },
        {
          label: 'TRANSACTION-HISTORY',
          icon: 'exchange-alt',
          isImage: false,
          url: `/home/profile/individual/internal/${personId}/transaction-history`
        },
        {
          label: 'CERIFICATE-OR-DOCUMENTS',
          icon: 'assets/images/Certificate.svg',
          activeIcon: 'assets/images/Certificate_highlight.svg',
          isImage: true,
          url: `/home/profile/individual/internal/${personId}/records`
        },
        {
          label: 'BENEFITS',
          isImage: true,
          icon: 'assets/images/Benefits.svg',
          activeIcon: 'assets/images/Benefits-green.svg',
          url: `/home/profile/individual/internal/${personId}/benefits`
        },
        {
          label: 'BENEFITS-PAYMENT-HISTORY',
          isImage: true,
          icon: 'assets/images/Benefits.svg',
          activeIcon: 'assets/images/Benefits-green.svg',
          url: `/home/profile/individual/internal/${personId}/benefits-payment-history`
        },
        {
          label: 'MEDICAL-BOARD-ASSESSMENTS',
          icon: 'notes-medical',
          isImage: false,
          url: `/home/profile/individual/internal/${personId}/medical-board`
        },
        {
          label: 'FINANCIAL-DETAILS',
          icon: 'wallet',
          isImage: false,
          url: `/home/profile/individual/internal/${personId}/financial-details`
        },
        {
          label: 'PERSONAL-DETAILS',
          icon: 'user',
          isImage: false,
          url: `/home/profile/individual/internal/${personId}/personal-details`
        },
        // {
        //   label: 'CUSTOMER-CONTACT',
        //   icon: 'comment',
        //   isImage: false,
        //   url: `/home/profile/individual/internal/${personId}/customer-contact`
        // }
      ];
    }

    // if (showUnifyEngTimeLine)
    //   routes.push({
    //     label: 'UNIFIED-ENGAGEMENTS',
    //     icon: 'user',
    //     isImage: false,
    //     url: `/home/profile/individual/internal/${personId}/pension-reform`
    //   });

    if (showCertificates) {
      routes.push({
        label: 'CERTIFICATES',
        icon: 'assets/images/Certificate.svg',
        activeIcon: 'assets/images/Certificate_highlight.svg',
        isImage: true,
        url: `/home/profile/individual/internal/${personId}/individual-certificate`
      });
    }

    /**
     * Add route for accessing the customer survey page.
     * This route is available for all roles.
     * Revisit after determining the specific role requirements.
     */
    // routes.push({
    //   label: 'SURVEY',
    //   icon: 'star',
    //   isImage: false,
    //   url: `/home/profile/individual/internal/${personId}/customer-survey`
    // });

    /**
     * Add route for accessing the notification page.
     * This route is a new profile CRM feature and is available for all users.
     */
    // routes.push({
    //   label: 'NOTIFICATION',
    //   icon: 'bell',
    //   isImage: false,
    //   url: `/home/profile/individual/internal/${personId}/notification`
    // });
    return routes;
  }
}
