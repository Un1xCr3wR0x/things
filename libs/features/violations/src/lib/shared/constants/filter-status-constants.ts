import { BilingualText } from '@gosi-ui/core';
import { ViolationStatusEnum } from '../enums';

export class FilterStatusConstants {
  public static get STATUS_APPROVED(): BilingualText {
    return {
      english: 'Approved',
      arabic: 'معتمدة'
    };
  }

  public static get STATUS_CANCELLED(): BilingualText {
    return {
      english: 'Cancelled',
      arabic: 'ملغاة'
    };
  }

  public static get STATUS_MODIFIED(): BilingualText {
    return {
      english: 'Modified',
      arabic: 'تم تعديله'
    };
  }
}
