/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BilingualText, convertToStringDDMMYYYY, GosiCalendar, LookupService, LovList, Person } from '@gosi-ui/core';
import { AddressDcComponent } from '@gosi-ui/foundation/form-fragments/lib/address/address-dc/address-dc.component';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { AttorneyDetails, AuthorizerList } from '../../../shared';

@Component({
  selector: 'cnt-add-authorization-attorney-details-dc',
  templateUrl: './add-authorization-attorney-details-dc.component.html',
  styleUrls: ['./add-authorization-attorney-details-dc.component.scss']
})
export class AddAuthorizationAttorneyDetailsDcComponent implements OnInit, OnChanges {
  @Input() isEditMode = false;
  @Input() isAttorney = true;
  @Input() person;
  @Input() attorneyDetails: AttorneyDetails;
  @Input() authorizersBirthDate = new FormArray([]);
  @Input() authPurposeForm = new FormGroup({});
  @Output() onNext: EventEmitter<null> = new EventEmitter();
  @Output() onPrevious: EventEmitter<void> = new EventEmitter();
  @Output() onCancel: EventEmitter<null> = new EventEmitter();
  @Output() reset: EventEmitter<null> = new EventEmitter();

  authSource = { english: 'Ministry of Justice', arabic: 'وزارة العدل' };
  authText;
  authStatus: BilingualText;
  attorneyNumber: Number;
  authIssueDate: GosiCalendar;
  authExpireDate: GosiCalendar;
  authorizerList: AuthorizerList[];
  addressForms = new FormGroup({});
  idValue: string;
  modalRef: BsModalRef;
  systemDate: Date = new Date();

  @ViewChild('addressDetails', { static: false })
  addressDcComponent: AddressDcComponent;
  person$: Observable<Person>;
  personId: number;

  // LovLists
  nationalityList: Observable<LovList>;
  educationList: Observable<LovList>;
  specializationList: Observable<LovList>;
  cityList: Observable<LovList>;
  countryList: Observable<LovList>;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private lookupService: LookupService,
    readonly router: Router
  ) {}

  ngOnInit(): void {
    this.attorneyNumber = this.attorneyDetails.attorneyNumber;
    //this.authPurpose = this.attorneyDetails.attorneyType;
    this.authIssueDate = this.attorneyDetails.issueDate;
    this.authExpireDate = this.attorneyDetails.endDate;
    this.authText = this.fb.control(this.attorneyDetails.attorneyText, [Validators.required]);
    this.authStatus = this.attorneyDetails.attorneyStatus;
    this.authorizerList = this.attorneyDetails.authorizerList;
    this.countryList = this.lookupService.getGccCountryList();
    this.cityList = this.lookupService.getCityList();
  }

  /** Method to detectchanges in input. */
  ngOnChanges() {}
  saveAttorneyDetails(): void {
    if (!this.authPurposeForm.valid) {
      this.authPurposeForm.markAllAsTouched();
      this.authPurposeForm.markAsDirty();
      return;
    }

    if (this.authorizersBirthDate.valid || this.isEditMode) {
      this.onNext.emit();
    } else {
      this.authorizersBirthDate.markAllAsTouched();
      this.authorizersBirthDate.markAsDirty();
    }
  }

  goToPreviousSection() {
    this.onPrevious.emit();
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

  resetForm() {
    // this is to reload the current route.
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  /**
   * Calculate age
   */
  calculatePersonAge(birthDate) {
    const age = moment(new Date()).diff(moment(birthDate.gregorian), 'years');

    const dateOfBirth = {
      english: [convertToStringDDMMYYYY(birthDate.gregorian.toString()), '(Age:', age, 'years)'].join(' '),
      arabic:
        [convertToStringDDMMYYYY(birthDate.gregorian.toString()), '(السن:', age, this.calculateYear(age)].join(' ') +
        ')'
    };

    return dateOfBirth;
  }

  /**
   *
   * @param years Label for years
   * @param years
   */
  calculateYear(years) {
    if (years <= 10) {
      return 'سنوات';
    } else if (years > 10) {
      return 'سنة';
    }
  }
}
