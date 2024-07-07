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
  RoleIdEnum
} from '@gosi-ui/core';
import { SMSResponseType } from '@gosi-ui/core/lib/models/sms-response-type';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { takeUntil, filter, startWith } from 'rxjs/operators';

@Component({
  selector: 'gosi-side-bar-individual-app-mobile-sc',
  templateUrl: './side-bar-individual-app-mobile-sc.component.html',
  styleUrls: ['./side-bar-individual-app-mobile-sc.component.scss']
})
export class SideBarIndividualAppMobileScComponent
  extends BaseComponent
  implements AfterViewInit, OnInit, OnChanges, OnDestroy
{
  @Input() menuItems: MenuItem[];
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
  data;
  selectedLang = 'en';
  width;
  mobileView: boolean;
  placement: string;
  currentMainMenuIndex: number = null;
  responseTypes: SMSResponseType[];
  kebabeMenuList = [];

  /**
   * Creates an instance of SideBarIndividualAppMobileScComponent
   * @memberof  SideBarIndividualAppMobileScComponent
   *
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RouterDataToken) private routerData: RouterData,
    private router: Router,
    private modalService: BsModalService,
    @Inject(SideMenuStateToken) readonly sideMenu: BehaviorSubject<boolean>,
    readonly menuService: MenuService,
    readonly alertService: AlertService,
    readonly sendSMSNotificationService: SendSMSNotificationService,
    @Inject(ContributorToken) readonly contributorToken: ContributorTokenDto
  ) {
    super();
  }

  ngOnInit() {
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
          this.sideMenus = this.menuService.getMenuItems(this.menuItems, res[0].url, res[1]);
        });
    } else this.sideMenus = this.menuItems;
    const size = 4;
    this.data = [];
    this.data = this.sideMenus.slice(0, size);
    this.kebabeMenuList = this.sideMenus.slice(size, this.menuItems.length);
    this.onWindowResize();
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
