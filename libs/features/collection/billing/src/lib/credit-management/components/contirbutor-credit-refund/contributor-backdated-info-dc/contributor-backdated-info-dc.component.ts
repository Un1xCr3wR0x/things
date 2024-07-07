/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms .
 */

import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { BilingualText, LanguageToken } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { SelectedTerminationPeriodDetails } from '../../../../shared/models/selected-termination-period-details';

@Component({
  selector: 'blg-contributor-backdated-info-dc',
  templateUrl: './contributor-backdated-info-dc.component.html',
  styleUrls: ['./contributor-backdated-info-dc.component.scss']
})
export class ContributorBackdatedInfoDcComponent implements OnInit, OnChanges {
  // Input Variables
  @Input() status: BilingualText;
  @Input() totalCreditBalance: number;
  @Input() contributorShare: number;
  @Input() selectedTerminationPeriod: SelectedTerminationPeriodDetails[];

  // Local Variables
  lang = 'en';
  periodFlagValue = false;
  modalRef: BsModalRef;
  singlePeriodList: SelectedTerminationPeriodDetails;
  multiplePeriodList: SelectedTerminationPeriodDetails[];
  periodList: SelectedTerminationPeriodDetails[];
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly modalService: BsModalService
  ) {}

  /**
   * This method is to get details on intialising the task
   */
  ngOnInit() {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  /**
   * This method to get values on input changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes?.selectedTerminationPeriod?.currentValue) {
      this.periodList = changes?.selectedTerminationPeriod?.currentValue;
      this.getBackdatedPeriodlistDetails(this.periodList);
    }
  }
  /** Method to set backdated period list. */
  getBackdatedPeriodlistDetails(periodList) {
    if (periodList.length > 1) {
      this.periodFlagValue = true;
      this.multiplePeriodList = this.periodList;
    } else {
      this.periodFlagValue = false;
    }
    this.singlePeriodList = this.periodList[0];
  }
  /** Method to show modal. */
  showTerminationPeriodDetModel(template: TemplateRef<HTMLElement>, size: string): void {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }

  /** Method to confirm cancellation of the form. */
  confirmCancel() {
    this.modalRef.hide();
  }
}
