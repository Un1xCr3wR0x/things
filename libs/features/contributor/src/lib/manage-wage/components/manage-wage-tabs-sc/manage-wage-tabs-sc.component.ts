/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterConstants } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ContributorRouteConstants } from '../../../shared/constants';
import { ContributorRoutingService } from '../../../shared/services';
import { BulkWageUpdateScComponent } from '../bulk-wage';
import { MultipleWageUpdateScComponent } from '../multiple-wage';

@Component({
  selector: 'cnt-manage-wage-tabs-sc',
  templateUrl: './manage-wage-tabs-sc.component.html',
  styleUrls: ['./manage-wage-tabs-sc.component.scss']
})
export class ManageWageTabsScComponent implements OnInit {
  /** Local Variables */
  currentTab: number;
  modalRef: BsModalRef;

  /** Child references. */
  @ViewChild('multipleUpdate', { static: false }) multipleUpdate: MultipleWageUpdateScComponent;
  @ViewChild('bulkUpdate', { static: false }) bulkUpdate: BulkWageUpdateScComponent;
  @ViewChild('cancelTemplate', { static: false }) cancelTemplate: TemplateRef<HTMLElement>;

  /** Creates an instance of ManageWageTabsScComponent. */
  constructor(
    readonly contributorRouting: ContributorRoutingService,
    readonly modalService: BsModalService,
    readonly router: Router
  ) {}

  /** Method to initialize the component. */
  ngOnInit(): void {
    if (this.contributorRouting.previousUrl === ContributorRouteConstants.ROUTE_CUSTOM_LIST) this.currentTab = 1;
    else this.currentTab = 0;
  }

  /** Method to set current tab when tabs are switched. */
  toggleTabs(index: number) {
    this.currentTab = index;
  }

  /** Method to check for changes. */
  checkForChanges() {
    if (
      (this.currentTab === 0 && this.checkWageFormStatus()) ||
      (this.currentTab === 1 && this.bulkUpdate.bulkWageForm.get('uploadForm.changed').value)
    )
      this.showModal(this.cancelTemplate);
    else this.navigateBack();
  }

  /** Method to check wage form status. */
  checkWageFormStatus() {
    const wageArray = this.multipleUpdate.parentForm.controls.wageForms as FormArray;
    let isDirty = false;
    let isValid = false;
    if (wageArray) {
      wageArray.controls.forEach((form: FormGroup) => {
        if (form.dirty) isDirty = true;
        if (wageArray.status === 'VALID') isValid = true;
      });
    }
    return (!isValid && isDirty) || (isDirty && isValid);
  }

  /** Method to show modal. */
  showModal(template: TemplateRef<HTMLElement>): void {
    this.modalRef = this.modalService.show(template, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-dialog-centered'
    });
  }

  /** Method to hide modal. */
  hideModal() {
    this.modalRef.hide();
  }

  /** Method to navigate back. */
  navigateBack() {
    if (this.modalRef) this.hideModal();
    this.router.navigate([RouterConstants.ROUTE_DASHBOARD]);
  }
}
