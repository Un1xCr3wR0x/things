/*
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/**
 * This class is to return gcc country details.
 * @export
 * @class GCCCurrency
 */

export class GCCCurrencyList {
  public static get SAUDI_CURRENCY_CODE() {
    return {
      key: 'SAR',
      label: {
        english: 'SAR',
        arabic: 'ريال'
      },
      path: 'assets/icons/svg/english_SAR.svg'
    };
  }

  public static get KUWAIT_CURRENCY_CODE() {
    return {
      key: 'KWD',
      label: {
        english: 'KWD',
        arabic: ' كويتي'
      },
      path: 'KWD'
    };
  }

  public static get BAHRAIN_CURRENCY_CODE() {
    return {
      key: 'BHD',
      label: {
        english: 'BHD',
        arabic: ' بحريني'
      }
    };
  }

  public static get OMAN_CURRENCY_CODE() {
    return {
      key: 'OMR',
      label: {
        english: 'OMR',
        arabic: ' عماني'
      }
    };
  }

  public static get QATAR_CURRENCY_CODE() {
    return {
      key: 'QAR',
      label: {
        english: 'QAR',
        arabic: ' قطري'
      }
    };
  }

  public static get UAE_CURRENCY_CODE() {
    return {
      key: 'AED',
      label: {
        english: 'AED',
        arabic: ' إماراتي'
      }
    };
  }
  //get gcc establishment country code
  public static get GCC_LIST() {
    return [
      GCCCurrencyList.SAUDI_CURRENCY_CODE,
      GCCCurrencyList.KUWAIT_CURRENCY_CODE,
      GCCCurrencyList.BAHRAIN_CURRENCY_CODE,
      GCCCurrencyList.OMAN_CURRENCY_CODE,
      GCCCurrencyList.QATAR_CURRENCY_CODE,
      GCCCurrencyList.UAE_CURRENCY_CODE
    ];
  }
}
