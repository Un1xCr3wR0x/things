import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeEnum, Channel, RoleIdEnum } from '@gosi-ui/core';
import { bindQueryParamsToForm, createDetailForm, createModalForm, UITransactionType } from '../../../shared';
import { TransactionPensionBase } from '../../../shared/component/base/transaction-pension.base';

@Component({
  selector: 'bnt-validator-imprisonment-modify-sc',
  templateUrl: './validator-imprisonment-modify-sc.component.html',
  styleUrls: ['./validator-imprisonment-modify-sc.component.scss']
})
export class ValidatorImprisonmentModifyScComponent extends TransactionPensionBase implements OnInit {
  imprisonmentForm: FormGroup;
  imprisonmentFormModal: FormGroup;
  accessRole = [RoleIdEnum.FC, RoleIdEnum.INSURANCE_BENEFIT_OPERATION_OFFICER];
  rejectAccess = [RoleIdEnum.INSURANCE_BENEFIT_OPERATION_OFFICER];
  Channel = Channel;

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    this.imprisonmentForm = createDetailForm(this.fb);
    this.imprisonmentFormModal = createModalForm(this.fb);
    bindQueryParamsToForm(this.routerData, this.imprisonmentForm);
    this.intialiseTheView(this.routerData);
    super.getRejectionReason(this.imprisonmentForm);
    this.fetchDocumentsForImprisonmentModify();
  }

  /**to fetch documents */
  fetchDocumentsForImprisonmentModify() {
    this.transactionKey = UITransactionType.REQUEST_MODIFY_IMPRISONMENT_TRANSACTION;
    this.transactionType =
      this.channel === Channel.FIELD_OFFICE ? UITransactionType.FO_REQUEST_SANED : UITransactionType.GOL_REQUEST_SANED;
    this.getDocumentsForImprisonmentModify(
      this.transactionKey,
      this.transactionType,
      this.benefitRequestId,
      this.referenceNo
    );
  }

  getDocumentsForImprisonmentModify(
    transactionKey: string,
    transactionType: string,
    benefitRequestId: number,
    referenceNo: number
  ) {
    this.benefitDocumentService
      .getUploadedDocuments(benefitRequestId, transactionKey, transactionType, referenceNo)
      .subscribe(res => {
        this.documentList = res;
      });
  }

  /**
   * Approving by the validator.
   */
  confirmApproveLumpsum() {
    this.confirmApprove(this.imprisonmentForm);
  }
  /**
   * While rejecting from validator
   */
  confirmRejectLumpsum() {
    this.confirmReject(this.imprisonmentForm);
  }
  /**
   * when return to establishment action is performed, comments will be shared
   */
  returnLumpsum() {
    this.confirmReturn(this.imprisonmentForm);
  }
}
