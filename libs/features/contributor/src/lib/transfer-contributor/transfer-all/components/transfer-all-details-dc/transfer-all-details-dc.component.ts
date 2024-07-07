/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LovList } from '@gosi-ui/core';
import { noop, Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BranchDetails, ContributorCountDetails, TransferAllContributorDetails } from '../../../../shared/models';

@Component({
  selector: 'cnt-transfer-all-details-dc',
  templateUrl: './transfer-all-details-dc.component.html',
  styleUrls: ['./transfer-all-details-dc.component.scss']
})
export class TransferAllDetailsDcComponent implements OnInit, OnChanges, OnDestroy {
  /**Input variables */
  @Input() registrationNoList = [];
  @Input() establishmentNameList = [];
  @Input() branchList: BranchDetails[] = [];
  @Input() establishmentType: LovList;
  @Input() parentForm: FormGroup = new FormGroup({});
  @Input() contributorCount = new Observable<ContributorCountDetails>(null);
  @Input() transferAllDetails: TransferAllContributorDetails;
  @Input() isEditMode: boolean;

  /** Local variables */
  transferAllDetailsForm: FormGroup = new FormGroup({});
  subscription: Subscription;

  /** Output variables */
  @Output() showAlert = new EventEmitter<string>(null);
  @Output() changeInFromEst = new EventEmitter<number>(null);
  /** Method to initialize TransferAllDetailsDcComponent.*/
  constructor(private fb: FormBuilder) {}

  /** Method to initialize the component. */
  ngOnInit(): void {
    if (!this.parentForm.get('transferAllForm')) this.handleTransferForm();
  }

  /**Method to create forms */
  handleTransferForm(): void {
    this.transferAllDetailsForm = this.createTransferAllForm();
    this.parentForm.addControl('transferAllForm', this.transferAllDetailsForm);
  }

  /** Method to identify changes in form. */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.contributorCount && this.contributorCount) {
      this.subscription = this.contributorCount.pipe(tap(res => this.setEngagementCount(res))).subscribe(noop);
    }

    if (changes.transferAllDetails && changes.transferAllDetails.currentValue) {
      if (!this.parentForm.get('transferAllForm')) this.handleTransferForm();
      this.setTransferAllDetails();
    }

    if (changes.establishmentNameList && this.establishmentNameList.length > 0 && this.isEditMode) {
      setTimeout(() => this.setEstDetails(this.transferAllDetails.transferFrom, true), 500);
      setTimeout(() => this.setEstDetails(this.transferAllDetails.transferTo, false), 500);
    }
  }

  /**Method to set workflow details into form */
  setTransferAllDetails(): void {
    this.transferAllDetailsForm.get('registrationNoFrom').setValue(this.transferAllDetails.transferFrom);
    this.transferAllDetailsForm.get('registrationNoTo').setValue(this.transferAllDetails.transferTo);
    this.changeInFromEst.emit(this.transferAllDetails.transferFrom);
  }

  /**
   * Method to set contributor count details for estalishment
   * @param res
   */
  setEngagementCount(res: ContributorCountDetails): void {
    this.transferAllDetailsForm.get('transferable').setValue(res.transferable);
    this.transferAllDetailsForm.get('totalContributor').setValue(res.totalContributors);
    this.transferAllDetailsForm.get('nonTransferable').setValue(res.nonTransferable);
  }

  /**Method to create transfer form */
  createTransferAllForm(): FormGroup {
    return this.fb.group({
      registrationNoFrom: [null, Validators.required],
      establishmentNameFrom: this.fb.group({
        english: [null, Validators.required],
        arabic: [null]
      }),
      establishmentTypeFrom: this.fb.group({
        english: [null, Validators.required],
        arabic: [null, Validators.required]
      }),
      transferDate: this.fb.group({
        gregorian: [{ value: new Date(), disabled: true }],
        hijiri: []
      }),
      totalContributor: [0, Validators.required],
      transferable: [0, Validators.required],
      nonTransferable: [0, Validators.required],
      registrationNoTo: [null, Validators.required],
      establishmentNameTo: this.fb.group({
        english: [null, Validators.required],
        arabic: [null]
      }),
      establishmentTypeTo: this.fb.group({
        english: [null, Validators.required],
        arabic: [null, Validators.required]
      }),
      joiningDate: this.fb.group({
        gregorian: [{ value: new Date(), disabled: true }],
        hijiri: []
      })
    });
  }

  /** Method to set establishment Details for Transfer From.  */
  getEstDetailsFrom(value: string | number): void {
    if (value) {
      this.showAlert.emit(null);
      this.setEstDetails(value, true);
      this.changeInFromEst.emit(this.transferAllDetailsForm.get('registrationNoFrom').value);
    }
  }

  /**
   * Method to establishment details for from and to
   * @param value
   * @param isFrom
   */
  setEstDetails(value: string | number, isFrom = false): void {
    if (typeof value === 'number') {
      this.branchList.forEach(branch => {
        if (branch.registrationNo === value) {
          this.transferAllDetailsForm
            .get(isFrom ? 'establishmentNameFrom.english' : 'establishmentNameTo.english')
            .setValue(branch.name.english ? branch.name.english : branch.name.arabic);
          this.transferAllDetailsForm
            .get(isFrom ? 'establishmentTypeFrom' : 'establishmentTypeTo')
            .setValue(branch.establishmentType);
        }
      });
    } else {
      this.branchList.forEach(branch => {
        if (branch.name.english === value || branch.name.arabic === value) {
          this.transferAllDetailsForm
            .get(isFrom ? 'registrationNoFrom' : 'registrationNoTo')
            .setValue(branch.registrationNo);
          this.transferAllDetailsForm
            .get(isFrom ? 'establishmentTypeFrom' : 'establishmentTypeTo')
            .setValue(branch.establishmentType);
        }
      });
    }
    this.checkSameEst();
  }

  /**Method to check if from and to are same establishment */
  checkSameEst(): void {
    if (
      this.transferAllDetailsForm.get('registrationNoFrom').value ===
      this.transferAllDetailsForm.get('registrationNoTo').value
    )
      this.showAlert.emit('CONTRIBUTOR.TRANSFER-CON.SAME-ESTABLISHMENT-FROM-TO');
  }

  /** Method to set establishment details for transfer To.  */
  getEstDetailsTo(value: string | number): void {
    if (value) {
      this.showAlert.emit(null);
      this.setEstDetails(value);
    }
  }

  /**Method to handle tasks when component is destroyed */
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
