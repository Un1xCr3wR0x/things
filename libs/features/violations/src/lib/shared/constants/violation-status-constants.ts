import { ViolationStatusEnum } from '../enums';

export class ViolationStatus {
  public static get VIOLATION_STATUS() {
    return [
      {
        english: ViolationStatusEnum.APPROVED,
        arabic: 'تم الاعتماد'
      },
      {
        english: ViolationStatusEnum.CANCELLED,
        arabic: 'ملغاة'
      }
    ];
  }
}
