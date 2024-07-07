/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, SimpleChanges, OnChanges, Inject, OnInit, TemplateRef } from '@angular/core';
import { PenalityWavier, PreviousInstallment } from '../../../shared/models';
import { FormGroup } from '@angular/forms';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'blg-waiver-account-details-dc',
  templateUrl: './waiver-account-details-dc.component.html',
  styleUrls: ['./waiver-account-details-dc.component.scss']
})
export class WaiverAccountDetailsDcComponent implements OnChanges, OnInit {
  // input variable
  @Input() wavierDetails: PenalityWavier;
  @Input() parentForm: FormGroup;
  @Input() gracePeriodFlag: FormGroup;
  @Input() previousInstallment: PreviousInstallment[];
  @Input() penaltyType: String;
  @Input() isLateFeeViolation:boolean;
  @Input() isPpa:boolean;

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly modalService: BsModalService
  ) {}
  // local variable
  totalAmountDue = '';
  contributionDue = '';
  penaltyDue = '';
  rejectedOhDue = '';
  violationDue = '';
  lang = 'en';
  modalRef: BsModalRef;
  isPenaltyApproved = false;
  isPreviousInstallment = false;
  isVic = false;

  /* Method to instantiate the component. */
  ngOnInit() {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.wavierDetails?.currentValue) {
      if (this.wavierDetails !== undefined) {
        this.totalAmountDue = this.wavierDetails?.dueAmount?.total?.toString();
        this.contributionDue = this.wavierDetails?.dueAmount?.contribution?.toString();
        this.penaltyDue = this.wavierDetails?.dueAmount?.penalty?.toString();
      
        if (this.wavierDetails?.dueAmount?.rejectedOh !== null) {
          this.rejectedOhDue = this.wavierDetails?.dueAmount?.rejectedOh?.toString();
        }
        this.isPenaltyApproved = this.wavierDetails?.previouslyApprovedInd?.english === 'No' ? true : false;
        this.isPreviousInstallment = this.wavierDetails?.previousInstallmentInd?.english === 'No' ? true : false;
      }
    }
    if (changes?.previousInstallment?.currentValue) {
      this.previousInstallment = changes.previousInstallment.currentValue;
    }
    if (changes?.penaltyType?.currentValue) {
      this.penaltyType = changes.penaltyType.currentValue;
      this.isVic = this.penaltyType === 'VIC' ? true : false;
    }
  }
  /** Method to show modal. */
  showDetails(template: TemplateRef<HTMLElement>, size: string): void {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }
  /** This method is to hide the modal reference. */
  hideModal() {
    this.modalRef.hide();
  }
}
