/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, HostListener, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AdjustmentCalculationDetails, BenefitDetails } from '../../models';

@Component({
  selector: 'bnt-adjustment-detail-dc',
  templateUrl: './adjustment-detail-dc.component.html',
  styleUrls: ['./adjustment-detail-dc.component.scss']
})
export class AdjustmentDetailDcComponent implements OnInit {
  isSmallScreen: boolean;
  commonModalRef: BsModalRef;

  @Input() adjustmentCalculationDetails: AdjustmentCalculationDetails;
  @Input() heading: string;
  @Input() lang: string;
  @Input() benefitCalculation: BenefitDetails;
  @Input() isRestartBenefit: boolean;

  @Input() isLumpsum: boolean;
  //For card
  @Input() showCard = true;

  readonly Math = Math;
  constructor(readonly modalService: BsModalService) {}

  ngOnInit(): void {}

  showAdjustmentDate(eachAdjustment) {
    return (
      eachAdjustment?.adjustmentStartDate?.hijiri ||
      eachAdjustment?.adjustmentStartDate?.gregorian ||
      eachAdjustment?.adjustmentEndDate?.hijiri ||
      eachAdjustment?.adjustmentEndDate?.gregorian
    );
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
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
}
