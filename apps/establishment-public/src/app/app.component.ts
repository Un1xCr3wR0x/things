import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthTokenService, LoginService, StartupService, StorageService } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'est-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  chatbotHtml: any;
  loadAPI: Promise<any>;
  EnableChatBot: boolean = false;
  userId = 'user1';
  modalRef: BsModalRef;
  currentDate = new Date();
  benefitExpDate = new Date("2024-09-03");
  announceDate = new Date("2024-03-03");
  remainingMonths: number;
  remainingDays: number;
  benefitExpPopupIsShown = false;
  @ViewChild('benefitExpDate', { static: true })
  benefitExpDatePopUp: TemplateRef<HTMLElement>;
  constructor(
    readonly loginService: LoginService,
    readonly startupService: StartupService,
    readonly authTokenService: AuthTokenService,
    readonly modalService: BsModalService,
    readonly storageService: StorageService
  ) { }

  ngOnInit() {
    // if (!this.authTokenService.isValidAuthToken()) this.authTokenService.setAuthToken(null);
    // const matchUrl = window.location.href.match(new RegExp(/access_token=.*/));
    // if(!matchUrl) {
    this.loginService.checkLoginStatus();
    // }
  }
  ngAfterViewInit() {
    if (this.currentDate >= this.announceDate && this.currentDate <= this.benefitExpDate) {
      if (!this.storageService.getLocalValue('disply-benefit-exp-popup')) {
        if (this.storageService.getLocalValue('disply-benefit-exp-popup') !== 'true') {
          this.calculateRemainingTime(this.currentDate,this.benefitExpDate);
          this.showModalByTemplateRef(this.benefitExpDatePopUp);
          this.benefitExpPopupIsShown = true;
          this.storageService.setLocalValue('disply-benefit-exp-popup', this.benefitExpPopupIsShown);
        }
      }
    }
  }
  closeBenefitExpPopup() {
    this.modalService.hide();
  }
  showModalByTemplateRef(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template, { backdrop: "static" })
  }
  calculateRemainingTime(currentDate: Date, finalDate: Date){
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() - 1;
    const currentDay = currentDate.getDate();
    
    const finalYear = finalDate.getFullYear();
    const finalMonth = finalDate.getMonth() - 1 ;
    const finalDay = finalDate.getDate();
    
    let yearDiff = finalYear - currentYear;
    let monthDiff = finalMonth - currentMonth;
    let dayDiff = finalDay - currentDay;
    
    if (dayDiff < 0) {
      const lastMonth = new Date(finalYear, finalMonth, 0);
      dayDiff += lastMonth.getDate();
      monthDiff--;
    }
    
    if (monthDiff < 0) {
      monthDiff += 12;
      yearDiff--;
    }
    this.remainingMonths = monthDiff + yearDiff * 12;
    this.remainingDays = dayDiff;
  }

}
