/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApplicationTypeEnum, ApplicationTypeToken, IdentityTypeEnum, Iqama, NIN } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ComplaintConstants } from '../../constants';
import { IdentityTypeLabel } from '../../enums';
import { CustomerSummary } from '../../models';
@Component({
  selector: 'ces-customer-summary-dc',
  templateUrl: './customer-summary-dc.component.html',
  styleUrls: ['./customer-summary-dc.component.scss']
})
export class CustomerSummaryDcComponent implements OnInit, OnChanges {
  //Input variables
  @Input() customerSummary: CustomerSummary;
  @Input() isPreviousTransaction = true;
  @Input() hideCustomerInfoAppealTxn = false;
  /**
   * Output variables
   */
  @Output() showPreviousTransactions: EventEmitter<null> = new EventEmitter();
  /*
   * Local Variables
   */
  heading = ComplaintConstants.CUSTOMER_SUMMARY;
  identificationHeader: string = null;
  identificationNumber: number = null;
  modalRef: BsModalRef;
  isAppPublic: boolean;
  constructor(readonly modalService: BsModalService, @Inject(ApplicationTypeToken) readonly appToken: string) {}

  /**
   * Method to initialise tasks
   */
  ngOnInit(): void {
    this.isAppPublic = this.appToken === ApplicationTypeEnum.PUBLIC ? true : false;
  }

  /**
   * Method to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.customerSummary && changes.customerSummary.currentValue) {
      this.customerSummary = changes.customerSummary.currentValue;
      if (this.customerSummary.customerName.english && !this.customerSummary.customerName.arabic)
        this.customerSummary.customerName.arabic = this.customerSummary.customerName.english;
      if (this.customerSummary.customerName.arabic && !this.customerSummary.customerName.english)
        this.customerSummary.customerName.english = this.customerSummary.customerName.arabic;
      if (this.customerSummary && this.customerSummary.id && this.customerSummary.id.idType) {
        if (this.customerSummary.id.idType === IdentityTypeEnum.NIN) {
          this.identificationNumber = (<NIN>this.customerSummary.id).newNin;
          this.identificationHeader = IdentityTypeLabel.NINLABEL;
        } else if (this.customerSummary.id.idType === IdentityTypeEnum.IQAMA) {
          this.identificationNumber = (<Iqama>this.customerSummary.id).iqamaNo;
          this.identificationHeader = IdentityTypeLabel.IQAMALABEL;
        }
      }
    }
  }
  /** Method to show modal. */
  showModal(): void {
    this.showPreviousTransactions.emit();
  }
}
