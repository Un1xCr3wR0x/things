/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { addYears, AlertService, LovList, markFormGroupTouched, scrollToTop } from '@gosi-ui/core';
import { AddressDcComponent } from '@gosi-ui/foundation/form-fragments';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { PersonDetailsSmartForm } from '../../forms';
import { AuthorizerPersonDcComponent } from '../authorizer-person-dc/authorizer-person-dc.component';

@Component({
  selector: 'cnt-add-custom-authorization-details-dc',
  templateUrl: './add-custom-authorization-details-dc.component.html',
  styleUrls: ['./add-custom-authorization-details-dc.component.scss']
})
export class AddCustomAuthorizationDetailsDcComponent implements OnInit {
  @Input() isAttorney = true;
  @Input() person;
  @Input() personDetailsSmartForm;
  @Input() authorizerPersonForm;
  @Input() authPurposeForm = new FormGroup({});
  @Input() customAuthDetailsForm = new FormGroup({});
  @Input() countryList: Observable<LovList>;
  @Input() genderList: Observable<LovList>;
  @Input() nationalityList: Observable<LovList>;
  @Input() authorizerList: Array<{ form: PersonDetailsSmartForm; allowEdit: boolean }> = [];
  @Output() onNext: EventEmitter<null> = new EventEmitter();
  @Output() onPrevious: EventEmitter<void> = new EventEmitter();
  @Output() onCancel: EventEmitter<null> = new EventEmitter();
  @Output() onError: EventEmitter<String> = new EventEmitter();

  @Output() onVerifyAuthorizer = new EventEmitter<PersonDetailsSmartForm>();
  @Output() onDeleteAuthorizer = new EventEmitter<number>();
  @Output() onResetAuthorizer = new EventEmitter<void>();
  @Output() onAddAuthorizer = new EventEmitter<void>();
  @Output() onEditAuthorizer = new EventEmitter<number>();

  modalRef: BsModalRef;
  systemDate: Date = new Date();
  maxAuthExpiryDate = addYears(new Date(), 3);

  @ViewChild('addressDetails', { static: false })
  addressDcComponent: AddressDcComponent;

  @ViewChild('authorizerPersonComponent', { static: false })
  authorizerPersonComponent: AuthorizerPersonDcComponent;

  /**Creates an instance of CancelVicDetailsDcComponent. */
  constructor(readonly alertService: AlertService, private modalService: BsModalService, readonly router: Router) {}

  ngOnInit(): void {
    if (this.isAttorney) this.customAuthDetailsForm.get('authExpiryDate').setValidators([Validators.required]);
  }

  goToPreviousSection() {
    this.onPrevious.emit();
  }

  saveCustomAuthDetails() {
    if (this.isAttorney && !this.authPurposeForm.valid) {
      this.authPurposeForm.markAllAsTouched();
      this.authPurposeForm.markAsDirty();
      scrollToTop();
      return;
    }
    if (!this.customAuthDetailsForm.valid) {
      markFormGroupTouched(this.customAuthDetailsForm);
      scrollToTop();
      return;
    }
    if (this.authorizerList.length === 0) {
      this.onError.emit(
        this.isAttorney
          ? 'CONTRIBUTOR.ADD-AUTHORIZATION.ERROR-MESSAGES.EMPTY-AUTHORIZERS-LIST'
          : 'CONTRIBUTOR.ADD-AUTHORIZATION.ERROR-MESSAGES.EMPTY-MINORS-LIST'
      );
      return;
    }

    this.onNext.emit();
  }
  /**
   * Method to show a confirmation popup for reseting the form.
   * @param template template
   */
  popUp(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }
  /** Method to decline the popUp. */
  decline() {
    this.modalRef.hide();
  }
  /** Method to confirm cancellation of the form. */
  confirmCancel() {
    this.modalRef.hide();
    this.onCancel.emit();
  }
}
