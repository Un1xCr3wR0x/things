/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ApplicationTypeEnum, GccCountryEnum, RouterConstants, BilingualText, Lov } from '@gosi-ui/core';

export class MBConstants {
  /**
   * Gcc Countries array
   */
  public static get GCC_NATIONAL(): string[] {
    return [
      GccCountryEnum.KUWAIT,
      GccCountryEnum.UAE,
      GccCountryEnum.QATAR,
      GccCountryEnum.BAHRAIN,
      GccCountryEnum.OMAN
    ];
  }
  public static get HEAD_OFFICE_VALUE(): Lov {
    return { value: { arabic: 'المركز الرئيسي ', english: 'Head office' }, code: 0, sequence: 0 };
  }
  public static get LICENSE_MAX_LENGTH(): number {
    return 15;
  }

  public static get GCC_REG_NO_MAX_LENGTH(): number {
    return 50;
  }

  public static get EST_NAME_ARABIC_MAX_LENGTH(): number {
    return 80;
  }

  public static get EST_NAME_ENGLISH_MAX_LENGTH(): number {
    return 60;
  }

  public static get PERSON_NAME_ARABIC_MAX_LENGTH(): number {
    return 15;
  }

  public static get PERSON_NAME_ENGLISH_MAX_LENGTH(): number {
    return 40;
  }

  public static get PERSON_NAME_MIN_LENGTH(): number {
    return 2;
  }

  public static get NAME_MIN_LENGTH(): number {
    return 2;
  }

  public static get ENGLISH_NAME_MAX_LENGTH(): number {
    return 40;
  }

  public static get CRN_MAX_LENGTH(): number {
    return 10;
  }

  public static get RECRUITMENT_MAX_LENGTH(): number {
    return 10;
  }

  public static get MAIN_EST_REG_NUMBER(): number {
    return 9;
  }

  public static get ARABIC_NAME_MAX_LENGTH(): number {
    return 15;
  }

  public static get MIN_MAX_LENGTH_ACCOUNT_NUMBER(): number {
    return 24;
  }
  public static get ISD_PREFIX_MAPPING() {
    return {
      sa: '+966',
      kw: '+965',
      bh: '+973',
      om: '+968',
      qa: '+974',
      ae: '+971'
    };
  }
  public static get DAYS_WEEK() {
    return [
      {
        value: 'sunday',
        label: {
          english: 'Sunday',
          arabic: 'الأحد'
        }
      },
      {
        value: 'monday',
        label: {
          english: 'Monday',
          arabic: 'الإثنين'
        }
      },
      {
        value: 'tuesday',
        label: {
          english: 'Tuesday',
          arabic: 'الثّلاثاء'
        }
      },
      {
        value: 'wednesday',
        label: {
          english: 'Wednesday',
          arabic: 'الأربعاء'
        }
      },
      {
        value: 'thursday',
        label: {
          english: 'Thursday',
          arabic: 'الخميس'
        }
      },
      {
        value: 'friday',
        label: {
          english: 'Friday',
          arabic: 'الجمعة'
        }
      },
      {
        value: 'saturday',
        label: {
          english: 'Saturday',
          arabic: 'السّبت'
        }
      }
    ];
  }
  //Changes corresponding toe GCC Country
  public static get DEFAULT_GCCID_LENGTH(): number {
    return 15;
  }

  public static get GCC_REG_MAX_LENGTH(): number {
    return 50;
  }

  //Rejection Reason
  public static get REJECTION_REASON_OTHERS(): string {
    return 'Others';
  }

  /** If adhoc session start time  */

  public static get ADHOC(): string {
    return 'Ad Hoc';
  }

  public static get REASON_MAX_LENGTH(): number {
    return 100;
  }
  /** Route for create session */
  public static get SCHEDULED_SESSION(): string {
    return 'MEDICAL-BOARD.SCHEDULED-SESSIONS';
  }
  /** Route for adhoc session */
  public static get SESSION_CONFIGURATIONS(): string {
    return 'MEDICAL-BOARD.SESSION-CONFIGURATIONS';
  }

  public static get MB_SESSIONS(): string {
    return 'MEDICAL-BOARD.MB-SESSIONS';
  }
  public static get INVTATIONS(): string {
    return 'MEDICAL-BOARD.INVTATIONS';
  }
  /** Route for adhoc session */
  public static get SESSION_MEMBERS(): string {
    return 'MEDICAL-BOARD.MEMBERS';
  }
  public static get MEDICAL_BOARD_OFFICER(): string {
    return 'MEDICAL-BOARD.MEDICAL-BOARD-OFFICER';
  }
  public static get TIME_ERR_MESSAGE(): BilingualText {
    return {
      english: 'End time should be after start time',
      arabic: 'يجب أن يكون وقت  الانتهاء بعد وقت البدء'
    };
  }
  public static get PAST_TIME_ERR_MESSAGE(): BilingualText {
    return {
      english: 'Start time should not be earlier than current time',
      arabic: 'يجب أن لا يكون وقت بدء اللحنة الطبية قبل الوقت الحالي'
    };
  }
  public static get AM(): BilingualText {
    return {
      english: 'AM',
      arabic: 'ص'
    };
  }
  public static get PM(): BilingualText {
    return {
      english: 'PM',
      arabic: 'م'
    };
  }
  /** Route for adhoc session */
  public static get SESSION_PARTICIPANTS(): string {
    return 'MEDICAL-BOARD.PARTICIPANTS';
  }
  /** Route for create session */
  public static get ROUTE_MEDICAL_BOARD_SESSION_DETAILS(): string {
    return 'home/medical-board/medical-board-session';
  }
  /** Route for create session */
  public static get ROUTE_SESSION_DETAILS(): string {
    return '/home/medical-board/medical-board-session/regular-session';
  }
  public static get ROUTE_PARTICIPANTS_QUEUE(): string {
    return '/home/medical-board/medical-board-participant-queue/view';
  }
  public static get ROUTE_ASSIGN_SESSION(): string {
    return '/home/medical-board/medical-board-participant-queue/assign';
  }
  /** Route for adhoc session */
  public static get ROUTE_ADHOC_SESSION_DETAILS(): string {
    return 'home/medical-board/medical-board-session/adhoc-session';
  }
  /** Route for modify create session */
  public static get MODIFY_REGULAR_SESSION_ROUTE(): string {
    return `/home/medical-board/medical-board-session/regular-session/edit`;
  }
  public static ROUTE_BENEFIT_LIST(regNo: number, sin: number): string {
    return `home/profile/individual/internal/${sin}/benefits`;
  }
  public static get SESSION_CHANNEL(): Lov[] {
    return [
      {
        value: { english: 'GOSI Office', arabic: 'مكتب التأمينات' },
        sequence: 0
      },
      {
        value: { english: 'Virtual', arabic: 'افتراضية' },
        sequence: 1
      }
    ];
  }
  public static get AD_HOC_SESSION_CHANNEL(): Lov[] {
    return [
      {
        value: { english: 'GOSI Office', arabic: 'مكتب التأمينات' },
        sequence: 0
      },
      {
        value: { english: 'Virtual', arabic: 'افتراضية' },
        sequence: 1
      },
      {
        value: { english: 'Semi-Virtual', arabic: 'شبه افتراضية' },
        sequence: 2
      }
    ];
  }
  public static get MEDICAL_BOARD_TYPE(): Lov[] {
    return [
      {
        value: { english: 'Primary Medical Board', arabic: 'اللجنة الطبية الابتدائية' },
        sequence: 0
      },
      {
        value: { english: 'Appeal Medical Board', arabic: 'اللجنة الطبية الاستئنافية' },
        sequence: 1
      }
    ];
  }
  public static get REPLACEMENT_LIST(): Lov[] {
    return [
      {
        sequence: 1,
        code: 1001,
        value: new BilingualText()
      }
    ];
  }
  public static get AVAILABILITY_LIST(): Lov[] {
    return [
      {
        sequence: 1,
        code: 1001,
        value: {
          arabic: 'متوفر',
          english: 'Available'
        }
      },
      {
        sequence: 2,
        code: 1002,
        value: {
          arabic: 'غير متوفر',
          english: 'Not Available'
        }
      }
    ];
  }
  /** Route for modify adhoc session */
  public static get MODIFY_ADHOC_SESSION_ROUTE(): string {
    return `/home/medical-board/medical-board-session/adhoc-session/edit`;
  }
  /** Route for modify adhoc session */
  public static RESCHEDULE_SESSION() {
    return `/home/medical-board/medical-board-session-status/1/reschedule-session`;
  }
  public static get SESSION_STATUS(): string {
    return `home/medical-board/medical-board-session-status`;
  }

  /** Route for Add Unavailable Period. */
  public static REMOVEMESSAGE(startDate, endDate): BilingualText {
    return {
      english: `Are you sure you want to remove ${startDate} ->  ${endDate} from the unavailable periods?`,
      arabic: `هل أنت متأكد من إلغاء  الفترة ${endDate} <- ${startDate}  ؟`
    };
  }
  /** Route for Add Unavailable Period. */
  public static HOLD_START_MESSAGE(startDate: string): BilingualText {
    return {
      english: `Medical board session will not be created for ${startDate} since the session invitation date for contracted doctors are already passed.`,
      arabic: `لن يتم إنشاء اللجنة الطبية ليوم ${startDate} بسبب ان تاريخ الدعوات المرسلة للاطباء المتعاقدين منتهية`
    };
  }
  /** Route for Add Unavailable Period. */
  public static HOLD_END_MESSAGE(startDate: string, endDate: string): BilingualText {
    return {
      english: `Medical board sessions will not be created from ${startDate} to ${endDate} since the session invitation dates for contracted doctors are already passed.`,
      arabic: `لن يتم إنشاء اللجنة الطبية ليوم ${startDate} بسبب ان تاريخ الدعوات المرسلة للاطباء المتعاقدين منتهية`
    };
  }

  public static REMOVEMEMBER(name: BilingualText): BilingualText {
    return {
      english: `Are you sure you want to remove doctor ${name?.english}  from the medical board session?`,
      arabic: `هل أنت متأكد أنك تريد إبعاد الطبيب ${name?.arabic} من اللجنة الطبية ؟   `
    };
  }
  public static REMOVEPARTICIPANT(name: BilingualText): BilingualText {
    return {
      english: `Are you sure you want to remove ${name?.english}  from the medical board session?`,
      arabic: `هل أنت متأكد أنك تريد إبعاد  ${name?.arabic} من اللجنة الطبية ؟   `
    };
  }
  public static REMOVEPARTICIPANTVDREQUIRED(): BilingualText {
    return {
      english: `This participant has a visting doctor. Removal of this participant will remove the the visiting doctor and appointment will be cancelled. click ok if you want to proceed?`,
      arabic: `المشترك لديه طبيب زائر. بمجرد إزالة  المشترك سيتم إزالة الزيارة
      وسيتم إلغاء الطبيب والموعد. فضلاً قم بالنقر على موافق إذا أردت المتابعة؟
      `
    };
  }
  public static REMOVEHOLD(startDate: string, endDate: string): BilingualText {
    return {
      english: `Are you sure you want to remove the selected period from ${startDate} -> ${endDate} ?`,
      arabic: `هل انت متأكد من حذف الفترة المختارة من ${endDate} <- ${startDate}  ؟`
    };
  }
  public static ANTE_MERIDIAN(): string {
    return 'AM';
  }
  public static POST_MERIDIAN(): string {
    return 'PM';
  }
  /** Error for Modify Unavailable Period. */
  public static DATE_ERROR_MESSAGE(): BilingualText {
    return {
      english: 'Start Date should be less than or equal to  End Date',
      arabic: 'يجب أن يكون تاريخ البداية أقل من تاريخ النهاية أو مساويًا له'
    };
  }

  /** Route for Add Unavailable Period. */
  public static ADD_MEMBER_FEEDBACK_MESSAGE(transactionTraceId): BilingualText {
    return {
      english: `Your request to add medical board member is submitted successfully and is pending for further approval. Transaction ID : ${transactionTraceId}`,
      arabic: `تم تقديم طلبك لإضافة عضو في اللجنة الطبية بنجاح والطلب معلق للمراجعة عليه.رقم المعاملة : ${transactionTraceId}`
    };
  }
  /** Route for JobSector_Private. */
  public static MB_JOBSECTOR_PRIVATE(): BilingualText {
    return {
      english: `Private `,
      arabic: `خاص`
    };
  }
  /** Route for JobSector_Government. */
  public static MB_JOBSECTOR_GOVERNMENT(): BilingualText {
    return {
      english: `Government`,
      arabic: `حكومة`
    };
  }

  public static get INSTRUCTIONS() {
    return [
      {
        english: `Upload recent medical reports that show your current health status`,
        arabic: `تحميل التقارير والفحوصات الطبية الحديثة التي توضح وضعك الصحي الحالي`
      },
      {
        english: `In the event that recent medical reports are not available, you can choose your treatment provider from the list and print a letter addressed to the treatment entity.`,
        arabic: `في حال عدم توفر التقارير الطبية الحديثة، يمكنك اختيار جهة علاجك من القائمة وطباعة خطاب موجهة  للجهة العلاجية `
      },
      {
        english: `Visiting the selected treatment facility and handing over the letter`,
        arabic: `زيارة الجهة العلاجية المختارة وتسليمها الخطاب `
      },
      {
        english: `Upload the recent medical report and submit the application`,
        arabic: `تحميل التقرير الطبي الحديث وتقديم المعاملة `
      }
      // {
      //   english:`In the event that recent medical reports are not available, you can continue and submit the application`,
      //   arabic:`في حال عدم توفر التقارير الطبية الحديثة، يمكنك الاستمرار وتقديم المعاملة `
      // }
    ];
  }
  public static get DOWNLOAD_EXCEL(): string {
    return 'PaymentHistory';
  }
  public static get REQUIRED_CLARIFICATION_FROM_CONTRIBUTOR(): string {
    return 'Required clarification from contributor';
  }
  public static get VISITING_DOCTOR_UNAVAILABILITY(): string {
    return 'Unavailability of visiting Doctor';
  }
  public static get RESCHEDULE_ASSESSMENT(): string{
    return 'Reschedule Assessment'
  }
  public static get REQUEST_CLARIFICATION_FROM_CONTRIBUTOR(): string{
    return 'Required clarification from contributor'
  }
  public static get REQUEST_CLARIFICATION_FROM_HEIR(): string{
    return 'Required clarification from heir'
  }
  public static get ADD_ANOTHER_SPECIALITY(): string{
    return 'Other speciality required for the assessment'
  }
  public static get ADD_VISITING_TRANSACTION_ID(): number{
    return 300387
  }
  public static get REMINDER_SCHEDULE_TRANSACTION_ID(): number{
    return 101519
  }
  public static get APPEAL_TRANSACTION_ID(): number{
    return 101590
  }
}
