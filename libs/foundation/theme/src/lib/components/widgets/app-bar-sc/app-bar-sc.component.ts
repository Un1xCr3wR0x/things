/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, HostListener, Inject, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  BaseComponent,
  BilingualText,
  LanguageToken,
  LoginService,
  Notification,
  NotificationCount,
  NotificationService,
  RoleIdEnum,
  RouterConstants,
  SideMenuStateToken,
  StorageService,
  SystemService
} from '@gosi-ui/core';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';
import { NotifyLogoutDcComponent } from './notify-logout-dc/notify-logout-dc.component';

export class DateList {
  fromDate: any;
  toDate: any;
  dayofWeek: any;
  gregorianDiff: any;
  hijiriDiff: any;
  notes: any;
}
/**
 * This component holds the application header elements.
 *
 * @export
 * @class AppBarScComponent
 *
 */
@Component({
  selector: 'gosi-app-bar-sc',
  templateUrl: './app-bar-sc.component.html',
  styleUrls: ['./app-bar-sc.component.scss']
})
export class AppBarScComponent extends BaseComponent implements OnInit {
  heading$: Observable<string>;
  selectedLang = 'en';
  selectedApp = ApplicationTypeEnum.PRIVATE;
  isMenuOpen: boolean;
  showOptions = false;
  isAppPublic = false;
  isAppIndividual = false;
  isAppPrivate = false;
  preferenceRoute = '/home/profile/user-activity/preference';
  dateLIst: DateList[] = [];
  daysList: any[] = [];
  isContractDoc = false;
  userActivityAllowedRoles = [
    RoleIdEnum.SUPER_ADMIN,
    RoleIdEnum.GCC_ADMIN,
    RoleIdEnum.BRANCH_ADMIN,
    RoleIdEnum.OH_ADMIN,
    RoleIdEnum.REG_ADMIN,
    RoleIdEnum.CNT_ADMIN,
    RoleIdEnum.CSR,
    RoleIdEnum.CALL_CENTRE_AGENT,
    RoleIdEnum.AMEEN_USER,
    RoleIdEnum.INSURANCE_PRTN_EXTN_SPVR,
    RoleIdEnum.REGISTRATION_CONTRIBUTIONS_OPERATIONS_OFFICER,
    RoleIdEnum.BRANCH_MANAGER,
    RoleIdEnum.INS_PROT_EXT_SPVSR,
    RoleIdEnum.GCC_CSR,
    RoleIdEnum.FC,
    RoleIdEnum.RELATION_OFFICER,
    RoleIdEnum.OH_FC,
    RoleIdEnum.OH_OFFICER,
    RoleIdEnum.INS_BENF_OFFICER_SPVR,
    RoleIdEnum.ROLE_DOCTOR,
    RoleIdEnum.FC_SUPERVISOR,
    RoleIdEnum.SOCIAL_INS_INSP,
    RoleIdEnum.REG_CONT_OPER_SPVSR,
    RoleIdEnum.CLM_MGR,
    RoleIdEnum.COLLECTION_OFFICER,
    RoleIdEnum.COLLECTIONS_DEPARTMENT_MANAGER,
    RoleIdEnum.CUSTOMER_CARE_DEPARTMENT_MANAGER,
    RoleIdEnum.CUSTOMER_CARE_DEPARTMENT_HEAD,
    RoleIdEnum.CUSTOMER_CARE_OFFICER,
    RoleIdEnum.CUSTOMER_CARE_SENIOR_OFFICER,
    RoleIdEnum.CUSTOMER_SERVICE_AND_BRANCHES_GENERAL_DIRECTOR,
    RoleIdEnum.CUSTOMER_SERVICE_SUPERVISOR,
    RoleIdEnum.GENERAL_DIRECTOR_FOR_INSPECTION_AND_COLLECTION,
    RoleIdEnum.GDISO,
    RoleIdEnum.GDES,
    RoleIdEnum.INSURANCE_BENEFIT_SECTION_MANAGER,
    RoleIdEnum.INSURANCE_OPERATIONS_MANAGER,
    RoleIdEnum.MEDICAL_BOARD_SECRETARY,
    RoleIdEnum.MC_OFFICER,
    RoleIdEnum.MEDICAL_SERVICES_DEPARTMENT_MANAGER,
    RoleIdEnum.BOARD_OFFICER,
    RoleIdEnum.MS_OFFICER,
    RoleIdEnum.SENIOR_OPERATION_ANALYST,
    RoleIdEnum.VIOLATION_COMMITTEE_HEAD,
    RoleIdEnum.VIOLATION_COMMITTEE_MEMBER,
    RoleIdEnum.WORK_INJURIES_OCUPATIONAL_DISEASES_DOCTOR,
    RoleIdEnum.WORK_INJURIES_OCCUPATIONAL_DISEASES_SPECIALIST,
    RoleIdEnum.MEDICAL_AUDITOR,
    RoleIdEnum.MEDICA_AUDITOR,
    RoleIdEnum.INSURANCE_BENEFIT_OPERATION_OFFICER,
    RoleIdEnum.GD_MS_OS,
    RoleIdEnum.COMPLAINT_MANAGER,
    RoleIdEnum.COMPLAINT_CLERK,
    RoleIdEnum.AMEEN_INTERNAL_SUPERVISOR,
    RoleIdEnum.MISC_VALIDATOR,
    RoleIdEnum.FEATURE_360_ALL_USER,
    RoleIdEnum.SEND_SMS,
    RoleIdEnum.INQUIRY_FOR_CONTRACTSAUHENTICATION,
    RoleIdEnum.COLLECTIONS_SUPERVISOR,
    RoleIdEnum.ACCOUNTING_CLERK,
    RoleIdEnum.GOVERNMENT_COLLECTION_OFFICER,
    RoleIdEnum.GOVERNMENT_SECTOR_COLLECTION_MANAGER,
    RoleIdEnum.ACCOUNT_SPECIALIST,
    RoleIdEnum.EXCEPTIONAL_WAIVER_OFFICER,
    RoleIdEnum.FINANCIAL_CONTROL_SPECIALIST_FOR_ACCOUNT_ADJUSTMENTS,
    RoleIdEnum.SUBSCRIBER,
    RoleIdEnum.VIC,
    RoleIdEnum.GUEST,
    RoleIdEnum.AOV_REVIEWER,
    RoleIdEnum.AOV_APPROVER_1,
    RoleIdEnum.AOV_APPROVER_2,
    RoleIdEnum.AOV_APPROVER_3,
    RoleIdEnum.AOV_EXECUTER
  ];
  notificationAllowedRoles = [
    RoleIdEnum.SUPER_ADMIN,
    RoleIdEnum.GCC_ADMIN,
    RoleIdEnum.BRANCH_ADMIN,
    RoleIdEnum.OH_ADMIN,
    RoleIdEnum.REG_ADMIN,
    RoleIdEnum.CNT_ADMIN,
    RoleIdEnum.SUBSCRIBER,
    RoleIdEnum.VIC
  ];
  registrationNo: string;
  notifications: Notification[] = [];
  notificationCount: NotificationCount;
  bsModalRef: BsModalRef;
  width;
  mobileView: boolean;
  @Input() isSideMenu: Boolean = true;
  @Input() heading = '';
  @Input() showGosiLogo = true;
  @Input() showTaminatyLogo = false;
  @Input() showAmeenLogo = true;
  @Input() hideIcons: boolean;
  @Input() showSideBarToggle = true;
  @Input() onlyTranslate = false;
  @Input() disableHomeLinks = false;

  @Output() submit: EventEmitter<string> = new EventEmitter();
  /**
   * Creates an instance of AppBarComponent.
   *
   * @memberof AppBarComponent
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(SideMenuStateToken) readonly sideMenuState: BehaviorSubject<boolean>,
    readonly translate: TranslateService,
    readonly storageService: StorageService,
    readonly loginService: LoginService,
    readonly router: Router,
    readonly notificationService: NotificationService,
    readonly modalService: BsModalService,
    private authTokenService: AuthTokenService,
    readonly systemService: SystemService
  ) {
    super();
  }

  ngOnInit() {
    this.selectedApp = <ApplicationTypeEnum>this.appToken;
    this.isAppPublic = this.appToken === ApplicationTypeEnum.PUBLIC ? true : false;
    this.isAppIndividual = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
    this.onWindowResize();
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    if (this.isAppPublic || this.isAppIndividual) {
      this.notificationService.fetchNotificationList().pipe(take(1)).subscribe();
      this.notificationService.getNotification().subscribe(res => {
        this.notifications = res;
      });
      this.notificationService
        .getNotificationCount()
        .pipe(filter(res => res !== null))
        .subscribe(res => {
          this.notificationCount = res;
        });
      //Need to activate this trigger in authtoken service
      this.authTokenService.notifyLogout
        .asObservable()
        .pipe(
          tap(willExpire => {
            if (willExpire) {
              this.showLogoutFeedback(willExpire);
            }
          })
        )
        .subscribe();
    }
    this.language.subscribe(lang => (this.selectedLang = lang));
    this.sideMenuState.subscribe(state => {
      this.isMenuOpen = state;
      this.toggleSideMenu();
    });
    if (this.storageService.getLocalValue('lang')) {
      this.selectedLang = this.storageService.getLocalValue('lang');
    }
    this.changeLang(this.selectedLang);
    this.onWindowResize();
  }
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.width = window.innerWidth;
    // condition made specific for individual app mobile view
    if (this.width < 768 && this.isAppIndividual) {
      this.mobileView = true;
    } else this.mobileView = false;
  }
  toggleSideMenu() {
    const dom: Element = document.querySelector('body');
    if (!this.isSideMenu) {
      dom.classList.toggle('hide-menu', true);
    } else {
      dom.classList.toggle('hide-menu', !this.isMenuOpen);
      dom.classList.toggle('show-menu', this.isMenuOpen);
    }
  }

  toggleSidebar() {
    this.sideMenuState.next(!this.isMenuOpen);
  }

  toggleMenuOptions() {
    const dom: Element = document.querySelector('body');
    this.showOptions = !this.showOptions;
    dom.classList.toggle('show-menu-options', this.showOptions);
  }

  /**
   * This method is to change language based on selection.
   *
   * @param {string} language
   * @memberof AppBarBaseComponent
   */

  changeLang(lang: string) {
    const html: Element = document.querySelector('html');
    if (lang === 'en') {
      this.translate.use('en');
      html.setAttribute('lang', 'en');
      html.setAttribute('dir', 'ltr');
    } else {
      this.translate.use('ar');
      html.setAttribute('lang', 'ar');
      html.setAttribute('dir', 'rtl');
    }
    this.selectedLang = lang;
    this.language.next(lang);
    this.storageService.setLocalValue('lang', lang);
  }

  logOut() {
    this.authTokenService.doLogout();
  }
  navigateToManageproRoute() {
    this.router.navigate(['/home/profile/user-activity/preference']);
  }

  navigateToRoute(route: string) {
    this.router.navigate([route]);
  }
  viewAllNotifications() {
    this.router.navigate([RouterConstants.ROUTE_NOTIFICATIONS]);
  }
  navigateToContactUs() {
    this.router.navigate([RouterConstants.ROUTE_INDIVIDUAL_CONTACT]);
  }

  /**
   * Method to trigger session expiration info
   */
  showLogoutFeedback(timeBeforeLogout: number) {
    this.bsModalRef = this.modalService.show(NotifyLogoutDcComponent, {
      ignoreBackdropClick: true,
      class: 'modal-md modal-dialog-centered',
      initialState: {
        timeBeforeLogout: timeBeforeLogout
      }
    });
    this.bsModalRef.content.closeSubject.subscribe(res => {
      if (res === true) {
        this.bsModalRef.hide();
      }
    });
  }

  get showLogoutOnly() {
    return this.systemService.isUnderMaintanance;
  }
  onClear(event) {
    this.dateLIst = [];
  }
  onSubmit(event) {
    const conversion = this.storageService.getLocalValue('conversionList');
    if (conversion) {
      this.dateLIst = JSON.parse(conversion);
    }

    this.notificationService
      .getConversionData(event.fromGregorian, event.fromHijiri, event.toGregorian, event.toHijiri)
      .subscribe((res: any) => {
        res.notes = event.notes;
        const gregDateParts = moment(res.fromDate?.gregorian).format('Do MMMM YYYY').split(' ');
        let GregDate: BilingualText = new BilingualText();
        GregDate.arabic =
          gregDateParts[0] +
          ' ' +
          this.getGregorianMonthFromDate(res.fromDate?.gregorian)?.arabic +
          ' ' +
          gregDateParts[2];
        GregDate.english =
          gregDateParts[0] +
          ' ' +
          this.getGregorianMonthFromDate(res.fromDate?.gregorian)?.english +
          ' ' +
          gregDateParts[2];
        res.gregValue = GregDate;
        const dateparts = moment(res.fromDate?.hijiri).format('Do MMMM YYYY').split(' ');
        let hijiriDate: BilingualText = new BilingualText();
        hijiriDate.arabic =
          dateparts[0] + ' ' + this.getHijiriMonthFromDate(res.fromDate?.hijiri)?.arabic + ' ' + dateparts[2];
        hijiriDate.english =
          dateparts[0] + ' ' + this.getHijiriMonthFromDate(res.fromDate?.hijiri)?.english + ' ' + dateparts[2];
        res.hijiriValue = hijiriDate;
        //res.hijiriValue = dateparts[0] + ' ' + this.getHijiriMonthFromDate(res.fromDate?.hijiri) + ' ' + dateparts[2]
        this.dateLIst.unshift(res);

        if (this.dateLIst.length > 5) {
          this.dateLIst.splice(4, 1);
        }
        this.storageService.setLocalValue('conversionList', JSON.stringify(this.dateLIst));
        this.dateLIst = [...this.dateLIst];
      });
  }

  getHijiriMonthFromDate(date: Date | string) {
    let arrayValue = [
      { english: 'Muharram', arabic: 'محرم' },

      { english: 'Safar', arabic: 'صفر' },

      { english: 'Rabi’ al-Awwal', arabic: 'ربيع الأول ' },

      { english: 'Rabi’ al-Thani', arabic: 'ربيع الثاني' },

      { english: 'Jumada al-Ula', arabic: 'ماد الأولى' },

      { english: 'Jumada al-Alkhirah', arabic: 'جمادى الآخرة' },

      { english: 'Rajab', arabic: 'رجب ' },

      { english: 'Sha’ban', arabic: 'شعبان ' },

      { english: 'Ramadhan', arabic: 'رمضان' },

      { english: 'Shawwal', arabic: 'شوال ' },

      { english: 'Thul-Qi’dah ', arabic: 'ُذو القعدة' },

      { english: 'Thul-Hijjah', arabic: 'ذو الحجة' }
    ];
    return arrayValue[new Date(date).getMonth()];
  }
  getGregorianMonthFromDate(date: Date | string) {
    let arrayValue = [
      { english: 'January', arabic: 'يناير' },
      { english: 'February', arabic: 'فبراير' },
      { english: 'March', arabic: 'مارس' },

      { english: 'April', arabic: 'أبريل' },

      { english: 'May', arabic: 'مايو' },
      { english: 'June', arabic: 'يونيو' },

      { english: 'July', arabic: 'يوليو' },

      { english: 'August', arabic: 'أغسطس' },

      { english: 'September', arabic: 'سبتمبر' },

      { english: 'October', arabic: 'أكتوبر' },

      { english: 'November', arabic: 'نوفمبر' },

      { english: 'December ', arabic: 'ديسمبر' }
    ];
    return arrayValue[new Date(date).getMonth()];
  }
  calculateDays(event) {
    const conversion = this.storageService.getLocalValue('conversionDaysList');
    if (conversion) {
      this.daysList = JSON.parse(conversion);
    }
    this.notificationService.getNumberOfDays(event.gregorian, event.hijiri).subscribe(res => {
      this.daysList.unshift(res);
      if (this.daysList.length > 5) {
        this.daysList.splice(4, 1);
      }
      this.storageService.setLocalValue('conversionDaysList', JSON.stringify(this.daysList));
      this.daysList = [...this.daysList];
    });
  }
}
