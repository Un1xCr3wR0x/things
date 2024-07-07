/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
/**
 *
 * This class is to declare complaints module constants.
 *
 * @export
 * @class LovListConstants
 */
import { CategoryEnum } from '../enums';
export class LovListConstants {
  public static get CATEGORY() {
    return 'COMPLAINTS';
  }
  public static get DOMAIN_CATEGORY() {
    return 'ComplaintsManagement';
  }
  public static get PRIORITY(){
    return 'priority';
  }
  public static get ESTABLISHMENT() {
    return 'Establishment';
  }
  public static get SUGGESTION_CATEGORY() {
    return 'Suggestion';
  }
  public static get SUGGESTION_SUB_CATEGORY() {
    return 'SuggestionRegistration';
  }

  public static get GOSIBRANCHES() {
    return 'GosiBranches';
  }
  public static get REGISTRATION() {
    return 'REGISTRATION';
  }
  public static get LOVLIST_ESTABLISHMENT() {
    return 'Establishment';
  }
  public static get LOVLIST_CONTRIBUTOR() {
    return 'Contributor';
  }
  public static get GOSILOCATION() {
    return 'Location';
  }
  public static get OTHERS() {
    return [
      {
        value: {
          english: 'Other',
          arabic: ''
        },
        sequence: 1
      }
    ];
  }
  public static get GOSI_WEBSITE() {
    return {
      value: 'Gosi Website and Taminaty',

      subValue: 'GosiWebsite'
    };
  }
  public static get BRANCHES() {
    return {
      value: 'Branch',
      subValue: 'GosiBranches'
    };
  }
  public static get ANNUITY() {
    return 'Annuity';
  }
  public static get MEDICAL_BOARD() {
    return 'Medical Board';
  }
  public static get SANED() {
    return 'Saned';
  }
  public static get ENQUIRY_TYPES() {
    return [
      {
        value: 'Annuity',
        subValue: 'ContributorEnquiryAnnuity'
      },
      {
        value: 'Medical Board',
        subValue: 'ContributorEnquiryMedicalBoard'
      },
      {
        value: 'Saned',
        subValue: 'ContributorEnquirySaned'
      }
    ];
  }
  public static get LABELS() {
    return [
      {
        value: CategoryEnum.COMPLAINT,
        typeLabel: 'COMPLAINT-TYPE-LABEL',
        subTypeLabel: 'COMPLAINT-SUB-TYPE-LABEL',
        dateLabel: 'COMPLAINT-DATE',
        timeLabel: 'COMPLAINT-TIME',
        detailLabel: 'COMPLAINT-DESCRIPTION',
        dbValue: 'Complaint',
        desriptionLabel: 'YOUR-COMPLAINT',
        heading: 'COMPLAINT-SUMMARY',
        modalHeader: 'COMPLAINT-MODALHEADER',
        resubmitHeader: 'RESUBMIT-COMPLAINT'
      },
      {
        value: CategoryEnum.ENQUIRY,
        typeLabel: 'ENQUIRY-TYPE-LABEL',
        subTypeLabel: 'ENQUIRY-SUB-TYPE-LABEL',
        dateLabel: 'ENQUIRY-DATE',
        timeLabel: 'ENQUIRY-TIME',
        detailLabel: 'ENQUIRY-DESCRIPTION',
        dbValue: CategoryEnum.ENQUIRY,
        desriptionLabel: 'YOUR-ENQUIRY',
        heading: 'ENQUIRY-SUMMARY',
        modalHeader: 'ENQUIRY-MODALHEADER',
        resubmitHeader: 'RESUBMIT-ENQUIRY'
      },
      {
        value: CategoryEnum.SUGGESTION,
        typeLabel: 'SUGGESTION-LABEL',
        subTypeLabel: 'SUGGESTION-SUBTYPE-LABEL',
        heading: 'SUGGESTION-SUMMARY',
        dbValue: 'Suggestion',
        modalHeader: 'SUGGESTION-MODALHEADER',
        desriptionLabel: 'YOUR-SUGGESTION',
        suggestionTypeLabel: 'SUGGESTION-TYPE-LABEL',
        suggestionSubTypeLabel: 'SUGGESTION-SUB-TYPE-LABEL',
        resubmitHeader: 'RESUBMIT-SUGGESTION'
      },
      {
        value: CategoryEnum.APPEAL,
        dateLabel: 'APPEAL-DATE',
        detailLabel: 'APPEAL-DESCRIPTION',
        typeLabel: 'APPEAL-TYPE-LABEL',
        subTypeLabel: 'APPEAL-SUB-TYPE-LABEL',
        dbValue: CategoryEnum.APPEAL,
        heading: 'APPEAL-SUMMARY',
        modalHeader: 'MODIFY-APPEAL',
        resubmitHeader: 'RESUBMIT-APPEAL'
      },
      {
        value: CategoryEnum.PLEA,
        dateLabel: 'PLEA-DATE',
        detailLabel: 'APPEAL-DESCRIPTION',
        dbValue: CategoryEnum.PLEA,
        typeLabel: 'PLEA-TYPE-LABEL',
        subTypeLabel: 'PLEA-SUB-TYPE-LABEL',
        heading: 'PLEA-SUMMARY',
        modalHeader: 'MODIFY-PLEA',
        resubmitHeader: 'RESUBMIT-PLEA'
      },
      {
        value: 'GosiWebsiteTaminaty',
        typeLabel: 'GosiWebsite'
      }
    ];
  }

  public static get SELECTED_OFFICE() {
    return {
      code: 100000088513,
      sequence: 20,
      value: {
        arabic: 'مكتب منطقة الرياض',
        english: 'Riyadh R Office'
      }
    };
  }
  public static get ID_TYPE_LIST() {
    return [
      {
        sequence: 0,
        value: { english: 'National Identification Number', arabic: 'رقم الهوية الوطنية' },
        code: 1000
      },
      {
        sequence: 1,
        value: { english: 'Iqama Number', arabic: 'رقم الإقامة' },
        code: 1001
      }
    ];
  }
  public static get CATEGORY_LIST() {
    return [
      {
        sequence: 0,
        value: { english: 'All Categories', arabic: 'جميع الفئات' }
      },
      {
        sequence: 1,
        value: { english: 'Complaint', arabic: 'شكوى' }
      },
      {
        sequence: 2,
        value: { english: 'Enquiry', arabic: 'استفسار' }
      },
      {
        sequence: 3,
        value: { english: 'Suggestion', arabic: 'اقتراح' }
      },
      {
        sequence: 4,
        value: { english: 'Appeal', arabic: 'اعتراض' }
      },
      {
        sequence: 5,
        value: { english: 'Plea', arabic: 'استئناف' }
      }
    ];
  }
  public static get COMPLAINTValidity_LIST() {
    return [
      { value: { arabic: 'صحيحة', english: 'Valid' }, sequence: 1, code: 1 },
      { value: { arabic: 'غير صحيحة', english: 'Not valid' }, sequence: 2, code: 0 }
    ];
  }
}
export class PriorityListConstants {
  public static get PRIORITY_LIST() {
    return [
      {
        code: 1,
        sequence: 0,
        value: { english: 'High', arabic: 'عالي' }
      },
      {
        code: 3,
        sequence: 1,
        value: { english: 'Medium', arabic: 'متوسط' }
      },
      {
        code: 5,
        sequence: 2,
        value: { english: 'Low', arabic: 'منخفض' }
      }
    ];
  }
}
