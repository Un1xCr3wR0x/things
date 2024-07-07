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
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';
import { IndividualNotifyLogoutDcComponent } from './notify-logout-dc/notify-logout-dc.component';

/**
 * This component holds the application header elements.
 *
 * @export
 * @class IndividualAppBarScComponent
 *
 */
@Component({
  selector: 'gosi-individual-app-bar-sc',
  templateUrl: './individual-app-bar-sc.component.html',
  styleUrls: ['./individual-app-bar-sc.component.scss']
})
export class IndividualAppBarScComponent extends BaseComponent implements OnInit {
  heading$: Observable<string>;
  selectedLang = 'en';
  selectedApp = ApplicationTypeEnum.PRIVATE;
  isMenuOpen: boolean;
  showOptions = false;
  isAppPublic = false;
  isAppIndividual = false;
  userActivityAllowedRoles = [
    RoleIdEnum.SUPER_ADMIN,
    RoleIdEnum.GCC_ADMIN,
    RoleIdEnum.BRANCH_ADMIN,
    RoleIdEnum.OH_ADMIN,
    RoleIdEnum.REG_ADMIN,
    RoleIdEnum.CNT_ADMIN,
    RoleIdEnum.SUBSCRIBER,
    RoleIdEnum.VIC,
    RoleIdEnum.GUEST
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
    this.onWindowResize();
    this.selectedApp = <ApplicationTypeEnum>this.appToken;
    this.isAppPublic = this.appToken === ApplicationTypeEnum.PUBLIC ? true : false;
    this.isAppIndividual = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
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
  }
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.width = window.innerWidth;
    if (this.width < 790) {
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
    this.bsModalRef = this.modalService.show(IndividualNotifyLogoutDcComponent, {
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
}
