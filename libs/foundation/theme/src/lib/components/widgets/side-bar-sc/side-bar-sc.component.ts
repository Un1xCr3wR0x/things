/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  AfterViewInit,
  Component,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  OnDestroy,
  TemplateRef
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BaseComponent,
  LanguageToken,
  MenuItem,
  MenuService,
  RouterData,
  RouterDataToken,
  SideMenuStateToken,
  AlertService,
  ContributorToken,
  ContributorTokenDto,
  SendSMSNotificationService,
  BilingualText,
  RoleIdEnum,
  AuthTokenService,
  JWTPayload
} from '@gosi-ui/core';
import { SMSResponseType } from '@gosi-ui/core/lib/models/sms-response-type';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { takeUntil, filter, startWith } from 'rxjs/operators';

import { RegistrationNoToken } from '../../../../../../../../libs/core/src/lib/tokens'; //'../tokens';
import { RegistrationNumber } from '../../../../../../../../libs/core/src/lib/models';
import { EstablishmentService } from '../../../../../../../../libs/features/establishment/src/lib/shared/services';

@Component({
  selector: 'gosi-side-bar-sc',
  templateUrl: './side-bar-sc.component.html',
  styleUrls: ['./side-bar-sc.component.scss']
})
export class SideBarScComponent extends BaseComponent implements AfterViewInit, OnInit, OnChanges, OnDestroy {
  @Input() menuItems: MenuItem[];
  @Input() hideSidebar: Boolean;
  accessRoles = [RoleIdEnum.SEND_SMS];
  sideMenus: MenuItem[] = [];
  modalRef: BsModalRef;
  isSendMessage = false;
  curMobileNumber = null;
  invalidMSISDN = null;
  messageID = null;
  status = null;
  statusDescription = null;
  error: BilingualText;

  selectedLang = 'en';
  width;
  mobileView: boolean;
  placement: string;
  currentMainMenuIndex: number = null;
  responseTypes: SMSResponseType[];
  details = 'sideBar';
  token: JWTPayload;

  isEligibleForMedicalInsurance: boolean;

  /**
   * Creates an instance of SideBarScComponent
   * @memberof  SideBarScComponent
   *
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RouterDataToken) private routerData: RouterData,
    private router: Router,
    private authService: AuthTokenService,
    private modalService: BsModalService,
    @Inject(SideMenuStateToken) readonly sideMenu: BehaviorSubject<boolean>,
    readonly menuService: MenuService,
    readonly alertService: AlertService,
    readonly sendSMSNotificationService: SendSMSNotificationService,
    @Inject(ContributorToken) readonly contributorToken: ContributorTokenDto,
    @Inject(RegistrationNoToken) readonly registrationNo: RegistrationNumber,
    readonly establishmentService: EstablishmentService
  ) {
    super();
  }

  async getCustomerType(registrationNo) {
    this.menuService.getCustomerType(registrationNo).subscribe(
      (data: any) => {
        let custome_type = data?.elements[0]?.CUSTOMERTYPE;
        this.doInitialize(custome_type);
      },
      err => {
        this.doInitialize(null);
      }
    );
  }

  async ngOnInit() {
    this.token = this.authService.decodeToken(this.authService.getAuthToken());
    let registrationNo = this.registrationNo.value;
    if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      this.isEligibleForMedicalInsurance = await this.checkMedicalInsuranceEligibility();
    }
    if (registrationNo) {
      let page_url = window.location.href;
      if (page_url.includes('establishment/profile')) {
        await this.getCustomerType(registrationNo);
      } else {
        this.doInitialize(null);
      }
    } else {
      this.doInitialize(null);
    }
  }

  doInitialize(establishment_customer_type) {
    this.language.subscribe(lang => {
      this.selectedLang = lang;
    });
    if (this.appToken !== ApplicationTypeEnum.DEV) {
      const routerEvent$ = this.router.events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        startWith(this.router)
      );

      combineLatest([routerEvent$, this.contributorToken.isVic])
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          this.currentMainMenuIndex = null;
          const sideMenues = this.menuService.getMenuItems(
            JSON.parse(JSON.stringify(this.menuItems)),
            res[0].url,
            res[1]
          );
          this.sideMenus = sideMenues.filter(item => {
            if (item.label == 'MENUITEM.VIRTUAL-VISIT') {
              if (establishment_customer_type == null || establishment_customer_type != '1') {
                return false;
              }
            }
            if (item.label === 'MENUITEM.RETIREE-MEDICAL-INSURANCE-EXTENSION') {
              if (!this.isEligibleForMedicalInsurance) {
                return false;
              }
            }
            return true;
          });
        });
    } else this.sideMenus = this.menuItems;
  }

  async checkMedicalInsuranceEligibility(): Promise<boolean> {
    return new Promise(resolve => {
      this.establishmentService.getMedicalInsuranceEstablishmentGroupsUnderAdmin(Number(this.token.uid)).subscribe(
        () => {
          resolve(true);
        },
        () => {
          resolve(false);
        }
      );
    });
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.width = window.innerWidth;
    if (this.width < 767) {
      this.mobileView = true;
    } else this.mobileView = false;
  }
  ngAfterViewInit() {
    this.sideMenu.subscribe(() => {});
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.menuItems && changes.menuItems.currentValue) {
      if (this.appToken !== ApplicationTypeEnum.DEV) this.menuItems = changes.menuItems.currentValue;
    }
    this.language.subscribe(lang => {
      this.selectedLang = lang;
    });
  }

  openMenu(selectedIndex) {
    this.alertService.clearAlerts();
    this.sideMenus.forEach((items, index) => {
      if (index === selectedIndex && items['open'] !== true) {
        items['open'] = true;
      } else if (index === selectedIndex) {
        items['open'] = false;
      } else {
        items['open'] = false;
      }
    });
  }
  menuActive(menu: MenuItem) {
    if (this.router.url === '/login') {
      this.sideMenus.forEach(items => {
        if (items.hasSubMenu === true) {
          items.menuItems.forEach(subItem => {
            subItem.active = false;
          });
        } else if (items.hasSubMenu === false) {
          items.active = false;
        }
      });
      return false;
    }
    if (menu.hasSubMenu === true) {
      return menu.menuItems.find(item => this.router.url.includes(item.link)) ? true : false;
    }

    /**
    else if (menu.hasSubMenu === false && this.router.url.includes(menu.link)) {
      return true;
    } else return false;
     */
  }
  clearRouterData(subMenu?, pop?: PopoverDirective) {
    this.alertService.clearAlerts();
    if (subMenu !== 'undefined') {
      this.sideMenus.forEach(items => {
        if (items.hasSubMenu === true) {
          items.menuItems.forEach(subItem => {
            if (subItem.link === subMenu.link) {
              subItem.active = true;
            } else subItem.active = false;
          });
        } else if (items.hasSubMenu === false) {
          if (items.link === subMenu.link) {
            items.active = true;
          } else items.active = false;
        }
      });
    }
    if (pop) {
      pop.hide();
    }
    this.sideMenu.next(false);
    this.routerData.fromJsonToObject(new RouterData());
  }
  onMouseOver(menu: MenuItem) {
    this.currentMainMenuIndex = this.sideMenus.indexOf(menu);
  }
  onMouseOut() {
    this.currentMainMenuIndex = null;
  }
  showPopupSendMessage(mobileNumber, template: TemplateRef<HTMLElement>) {
    this.isSendMessage = false;
    this.curMobileNumber = mobileNumber;
    const ngbModalOptions: ModalOptions = {
      backdrop: 'static',
      keyboard: false,
      animated: true
    };
    this.modalRef = this.modalService.show(template, ngbModalOptions);
  }

  getSourceSystem(event) {
    this.sendSMSNotificationService
      .getListOfResponses(this.selectedLang, event)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => (this.responseTypes = res.elements));
  }
  sendMessage(message) {
    this.sendSMSNotificationService.SendSMS(message.mobileNumber, message.message).subscribe(
      sendSMSResponse => {
        this.invalidMSISDN = sendSMSResponse.InvalidMSISDN;
        this.messageID = sendSMSResponse.MessageID;
        this.status = sendSMSResponse.Status;
        this.statusDescription = sendSMSResponse.StatusDescription;
        this.isSendMessage = true;
      },
      err => {
        this.error = err?.error?.message;
        this.isSendMessage = false;
      }
    );
  }
  close() {
    this.isSendMessage = false;
    this.curMobileNumber = null;
    this.modalRef.hide();
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
