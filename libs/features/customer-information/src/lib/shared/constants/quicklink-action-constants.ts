/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class QuickLinkActionContants {
  public static QUICKLINK_CONSTANTS(personId?: number, userRoles?: any) {
    let vicUser = userRoles.filter(item => item.role.english == 'VIC');
    let guestUser = userRoles.filter(item => item.role.english == 'Guest');
    let contributorUser = userRoles.filter(item => item.role.english == 'Contributor');
    let establishmentUser = userRoles.filter(
      item => item.role.english == 'Establishment Admin' || item.role.english == 'Establishment Owner'
    );
    if (establishmentUser.length > 0) {
      if (contributorUser.length > 0 || vicUser.length > 0) {
        return [
          {
            label: 'SEND-OTP',
            icon: 'house-user',
            isImage: false,
            url: `/home/profile/individual/internal/${personId}/otp`
          },
          {
            label: 'SEND-MESSAGE',
            icon: 'sms',
            isImage: false,
            url: `/home/profile/individual/internal/${personId}/sendSMS`
          },
          {
              label: 'ATTORNEY-INQUIRY-SERVICE',
              icon: 'sms',
              isImage: false,
              url: `/home/profile/individual/internal/${personId}/AttorneyInquiry`
          }
        ];
      } else {
        return [
          {
            label: 'SEND-OTP',
            icon: 'house-user',
            isImage: false,
            url: `/home/profile/individual/internal/${personId}/otp`
          },
          {
            label: 'SEND-MESSAGE',
            icon: 'sms',
            isImage: false,
            url: `/home/profile/individual/internal/${personId}/sendSMS`
          },
          {
              label: 'ATTORNEY-INQUIRY-SERVICE',
              icon: 'sms',
              isImage: false,
              url: `/home/profile/individual/internal/${personId}/AttorneyInquiry`
          }
        ];
      }
    }
    if (contributorUser.length > 0 || vicUser.length > 0) {
      return [
        {
          label: 'SEND-OTP',
          icon: 'house-user',
          isImage: false,
          url: `/home/profile/individual/internal/${personId}/otp`
        },
        {
          label: 'SEND-MESSAGE',
          icon: 'sms',
          isImage: false,
          url: `/home/profile/individual/internal/${personId}/sendSMS`
        },
        {
            label: 'ATTORNEY-INQUIRY-SERVICE',
            icon: 'sms',
            isImage: false,
            url: `/home/profile/individual/internal/${personId}/AttorneyInquiry`
        }
      ];
    }

    if (guestUser.length > 0) {
      return [
        {
          label: 'SEND-OTP',
          icon: 'house-user',
          isImage: false,
          url: `/home/profile/individual/internal/${personId}/otp`
        },
        {
          label: 'SEND-MESSAGE',
          icon: 'sms',
          isImage: false,
          url: `/home/profile/individual/internal/${personId}/sendSMS`
        },
        {
            label: 'ATTORNEY-INQUIRY-SERVICE',
            icon: 'sms',
            isImage: false,
            url: `/home/profile/individual/internal/${personId}/AttorneyInquiry`
        }
      ];
    }
  }
}
