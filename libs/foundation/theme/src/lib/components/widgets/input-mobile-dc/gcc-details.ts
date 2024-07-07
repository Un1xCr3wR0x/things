/*
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/**
 * This class is to return gcc country details.
 * @export
 * @class GCCDetails
 */
export class GCCDetails {
  public static get SAUDI_MOBILE_CODE() {
    return {
      key: 'sa',
      label: {
        english: 'KSA',
        arabic: 'المملكة العربية السعودية'
      },
      icon: 'flag-icon-sa',
      format: '00 000 0000',
      prefix: '+966 ',
      exampleEn: '(+966) 57 *** ****',
      exampleAr: '**** *** 57 (966+)'
    };
  }

  public static get KUWAIT_MOBILE_CODE() {
    return {
      key: 'kw',
      label: {
        english: 'Kuwait',
        arabic: 'الكويت'
      },
      icon: 'flag-icon-kw',
      format: '0000 0000',
      prefix: '+965 ',
      exampleEn: '(+965) **** ****',
      exampleAr: '**** **** (965+)'
    };
  }

  public static get BAHRAIN_MOBILE_CODE() {
    return {
      key: 'bh',
      label: {
        english: 'Bahrain',
        arabic: 'البحرين'
      },
      icon: 'flag-icon-bh',
      format: '0000 0000',
      prefix: '+973 ',
      exampleEn: '(+973) **** ****',
      exampleAr: '**** **** (973+)'
    };
  }

  public static get OMAN_MOBILE_CODE() {
    return {
      key: 'om',
      label: {
        english: 'Oman',
        arabic: 'سلطنة عمان'
      },
      icon: 'flag-icon-om',
      format: '00 000000',
      prefix: '+968 ',
      exampleEn: '(+968) ** ******',
      exampleAr: '****** ** (968+)'
    };
  }

  public static get QATAR_MOBILE_CODE() {
    return {
      key: 'qa',
      label: {
        english: 'Qatar',
        arabic: 'دولة قطر'
      },
      icon: 'flag-icon-qa',
      format: '0000 0000',
      prefix: '+974 ',
      exampleEn: '(+974) **** ****',
      exampleAr: '**** **** (974+)'
    };
  }

  public static get UAE_MOBILE_CODE() {
    return {
      key: 'ae',
      label: {
        english: 'UAE',
        arabic: 'الإمارات العربية المتحدة'
      },
      icon: 'flag-icon-ae',
      format: '0 000 00000',
      altFormats: ['0 000 0000'],
      prefix: '+971 ',
      exampleEn: '(+971) 6 582 4523 or (+971) 6 582 45231',
      exampleAr: '4523 582 6 (971+) or 45231 582 6 (971+)'
    };
  }
  //get gcc establishment country code
  public static get GCC_LIST() {
    return [
      GCCDetails.SAUDI_MOBILE_CODE,
      GCCDetails.KUWAIT_MOBILE_CODE,
      GCCDetails.BAHRAIN_MOBILE_CODE,
      GCCDetails.OMAN_MOBILE_CODE,
      GCCDetails.QATAR_MOBILE_CODE,
      GCCDetails.UAE_MOBILE_CODE
    ];
  }

  public static get PREFIX_KEY_MAPPING(): object {
    return {
      '+966': GCCDetails.SAUDI_MOBILE_CODE.key,
      '+965': GCCDetails.KUWAIT_MOBILE_CODE.key,
      '+973': GCCDetails.BAHRAIN_MOBILE_CODE.key,
      '+968': GCCDetails.OMAN_MOBILE_CODE.key,
      '+974': GCCDetails.QATAR_MOBILE_CODE.key,
      '+971': GCCDetails.UAE_MOBILE_CODE.key
    };
  }
}
