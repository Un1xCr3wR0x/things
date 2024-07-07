/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  AlertService,
  bindToObject,
  DocumentItem,
  DocumentService,
  DropdownItem,
  LookupService,
  RouterData,
  RouterDataToken,
  scrollToTop,
  UuidGeneratorService,
  CoreAdjustmentService,
  CoreBenefitService
} from '@gosi-ui/core';
import {
  Adjustment,
  AdjustmentConstants,
  AdjustmentQueryParams,
  AdjustmentService,
  PaymentRoutesEnum,
  PaymentService,
  ThirdpartyAdjustmentService
} from '@gosi-ui/features/payment/lib/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ThirdPartyAdjustmentBaseScComponent } from '../../../base';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'pmt-add-document-sc',
  templateUrl: './add-document-sc.component.html',
  styleUrls: ['./add-document-sc.component.scss']
})
export class AddDocumentScComponent extends ThirdPartyAdjustmentBaseScComponent implements OnInit {
  // Local Varaible
  identifier: number;
  adjustmentId: number;
  adjustment: Adjustment;
  modalRef: BsModalRef;
  documentList: DocumentItem[] = [];
  documentTypes: DocumentItem[];
  actionDropDown: DropdownItem[];
  isScan = true;
  transactionId = AdjustmentConstants.ADD_DOCUMENT_TRANSACTION_ID;
  transactionName = AdjustmentConstants.ADD_DOCUMENT_TRANSACTION_NAME;
  transactionType = AdjustmentConstants.ADD_DOCUMENT_TRANSACTION_TYPE;
  uuid: string;
  form: FormGroup = new FormGroup({});
  adjustmentConstant = AdjustmentConstants;
  sin: number;
  constructor(
    readonly alertService: AlertService,
    readonly adjustmentService: AdjustmentService,
    readonly coreBenefitService: CoreBenefitService,
    readonly tpaService: ThirdpartyAdjustmentService,
    readonly router: Router,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly activatedRoute: ActivatedRoute,
    readonly uuidGeneratorService: UuidGeneratorService,
    readonly lookupService: LookupService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly coreAdjustmentService: CoreAdjustmentService,
    readonly paymentService: PaymentService,
    readonly location: Location
  ) {
    super(
      alertService,
      documentService,
      router,
      paymentService,
      lookupService,
      tpaService,
      modalService,
      routerDataToken,
      coreAdjustmentService,
      coreBenefitService
    );
  }
  // Method to initialise the component
  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.identifier = this.coreAdjustmentService.identifier;
    this.sin = this.coreAdjustmentService?.sin;
    //this.referenceNumber = this.adjustmentService?.referenceNumber;
    this.activatedRoute.queryParams.subscribe(params => {
      this.adjustmentId = params.adjustmentId;
      if (this.identifier && this.adjustmentId) {
        if (params.from === AdjustmentConstants.GOSI_ADJUSTMENT) {
          this.transactionId = AdjustmentConstants.MAINTAIN_ADJUSTMENT_CONSTANT;
          this.transactionName = AdjustmentConstants.MAINTAIN_ADJUSTMENT;
          this.transactionType = AdjustmentConstants.MAINTAIN_ADJUSTMENT_REQUEST;
          this.getGosiAdjustmentDetails();
        } else {
          this.getAdjustmentDetails();
        }
        this.getDocuments();
        this.uuid = this.uuidGeneratorService.getUuid();
      } else {
        this.navigateBack();
      }
    });
  }

  /**
   * method to navigate to previus page
   */
  navigateBack() {
    this.location.back();
  }

  saveDocs() {
    if (this.documentService.checkMandatoryDocuments(this.documents)) {
      if (this.documentList.some(doc => doc?.documentContent !== null)) {
        this.navigateBack();
        this.alertService.showSuccessByKey('ADJUSTMENT.DOCUMENT-UPLOADED');
      } else {
        scrollToTop();
        this.alertService.showErrorByKey('ADJUSTMENT.ATLEAST-ONE_DOC');
      }
    }
  }

  // Method to show modal
  showModal(template) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'modal-md' }));
  }

  /**
   * Method to cancel the transaction
   */
  cancelPage() {
    this.hideModal();
    if (this.documentList.some(doc => doc?.documentContent !== null)) {
      this.tpaService.revertTransaction(this.identifier, null, null, this.sin, this.uuid).subscribe(
        () => {
          this.navigateBack();
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    } else {
      this.navigateBack();
    }
  }
  /** Method to hide modal. */
  hideModal(): void {
    this.modalRef.hide();
  }

  getAdjustmentDetails() {
    const params: AdjustmentQueryParams = new AdjustmentQueryParams();
    params.adjustmentId = this.adjustmentId.toString();
    this.tpaService.getTpaAdjustmentsDetails(this.identifier, params, this.sin).subscribe(
      res => {
        this.adjustment = res.adjustments[0];
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }
  getGosiAdjustmentDetails() {
    this.adjustmentService.getadjustmentBYId(this.identifier, this.adjustmentId, this.sin).subscribe(
      res => {
        this.adjustment = res;
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }
  getDocuments() {
    this.documentService.getRequiredDocuments(this.transactionName, this.transactionType).subscribe(
      docs => {
        this.documentTypes = docs;
        const docsList: DropdownItem[] = [];
        docs.forEach((doc, index) => {
          const actionDropDownitem = new DropdownItem();
          actionDropDownitem.id = doc.documentTypeId;
          actionDropDownitem.value = doc?.name;
          docsList.push(actionDropDownitem);
        });
        this.actionDropDown = docsList;
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }

  addDocument(documentTypeId: number) {
    const doc = this.documentTypes.find(document => document.documentTypeId === documentTypeId);
    doc.required = false;
    //doc.identifier = (this.documentList.length + 1).toString();
    this.documentList.push(bindToObject(new DocumentItem(), doc));
  }

  /**
   * Method to show error messages coming from api
   * @param err
   */
  showErrorMessage(err) {
    if (err?.error?.details && err.error.details.length > 0) {
      this.alertService.showError(null, err.error.details);
    } else {
      this.alertService.showError(err?.error?.message);
    }
  }
}
