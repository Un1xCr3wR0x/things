/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, Inject, HostListener } from '@angular/core';
import { formatDate } from '@angular/common';
import { BsModalRef } from 'ngx-bootstrap/modal/ngx-bootstrap-modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ApplicationTypeEnum, ApplicationTypeToken, BaseComponent, LanguageToken, BilingualText } from '@gosi-ui/core';
import { BenefitDetails } from '../../models';
import { BehaviorSubject } from 'rxjs';

//This component is to get the bank account details of the person

@Component({
  selector: 'bnt-benefit-details-saned-dc',
  templateUrl: './benefit-details-saned-dc.component.html',
  styleUrls: ['./benefit-details-saned-dc.component.scss']
})
export class BenefitDetailsSanedDcComponent extends BaseComponent implements OnInit {
  //Input variables
  @Input() benefitDetails: BenefitDetails;
  @Input() isReopenCase: boolean;
  @Input() eligibleForPensionReform: boolean;
  @Input() benefitType:string;
  //Output Variables
  @Output() editEvent: EventEmitter<void> = new EventEmitter();

  commonModalRef: BsModalRef;
  lang: string;
  isIndividualApp: boolean;
  isSmallScreen: boolean;
  formatDate = formatDate;
  constructor(
    public modalService: BsModalService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {
    super();
  }
  /**
   * This method handles the initialization tasks.
   */
  ngOnInit() {
    this.language.subscribe((lan: string) => {
      this.lang = lan;
    });
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
  }

  // Method to emit edit details

  editEventDetails() {
    this.editEvent.emit();
  }

  showWageCalcDetails(template: TemplateRef<HTMLElement>) {
    this.showModal(template);
  }

  closeModal() {
    this.commonModalRef.hide();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }
  /**
   * To append sufix for numbers eg: 1st, 2nd, 3rd
   * @param number
   */
  getSufixForNum(number: number, lang: string) {
    if (lang === 'ar') {
      return `${number}`;
    }
    let sufix = `${number}th`;
    switch (number) {
      case 0:
        break;
      case 1:
        sufix = `${number}st`;
        break;
      case 2:
        sufix = `${number}nd`;
        break;
      case 3:
        sufix = `${number}rd`;
        break;
      default:
        break;
    }
    return sufix;
  }

  /*
   * This methid is to show Modal
   */
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.commonModalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-xl' }));
  }

  /*
   * This method is to close Modal
   */
  hideModal() {
    this.commonModalRef.hide();
  }
  getIneligibilityReasons(reasons: BilingualText[]): BilingualText {
    return {
      english: reasons.map((reason: BilingualText) => reason.english).join(','),
      arabic: reasons.map((reason: BilingualText) => reason.arabic).join(',')
    };
  }
}
