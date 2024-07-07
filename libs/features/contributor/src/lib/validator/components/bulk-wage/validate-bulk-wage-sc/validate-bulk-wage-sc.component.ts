/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  CsvFile,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin, noop, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { ContributorRouteConstants, ManageWageConstants } from '../../../../shared/constants';
import { BulkWageWorkflowDetails } from '../../../../shared/models';
import { BulkWageService, ContributorService, EstablishmentService } from '../../../../shared/services';

@Component({
  selector: 'cnt-validate-bulk-wage-sc',
  templateUrl: './validate-bulk-wage-sc.component.html',
  styleUrls: ['./validate-bulk-wage-sc.component.scss']
})
export class ValidateBulkWageScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  /** Local variables */
  bulkWageWorkflowDetails: BulkWageWorkflowDetails;
  requestId: number;
  csvDetails: CsvFile;

  /** Creates an instance of ValidateBulkWageScComponent. */
  constructor(
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly bulkWageService: BulkWageService,
    readonly router: Router,
    readonly lookupService: LookupService,
    readonly alertService: AlertService,
    readonly workflowService: WorkflowService,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    @Inject(RouterDataToken) private routerData: RouterData
  ) {
    super(
      establishmentService,
      contributorService,
      lookupService,
      documentService,
      alertService,
      workflowService,
      modalService,
      router
    );
  }

  /** Method to initialize the component. */
  ngOnInit(): void {
    this.alertService.clearAlerts();
    super.readDataFromToken(this.routerData);
    this.readTransactionDataFromToken(this.routerData);
    super.setFlagsForView(this.routerData);
    super.getDefaultLookupValues();
    super.getSystemParameters();
    if (this.registrationNo) this.initializeValidatorView();
  }

  /** Method to read transaction data from token. */
  readTransactionDataFromToken(token: RouterData) {
    if (token.payload) {
      const payload = JSON.parse(token.payload);
      if (payload.id) this.requestId = payload.id;
    }
  }

  /** Method to initialize the validator view. */
  initializeValidatorView() {
    forkJoin([
      this.establishmentService
        .getEstablishmentDetails(this.registrationNo)
        .pipe(tap(res => (this.establishment = res))),
      this.bulkWageService.getBulkWageWorkflowDetails(this.registrationNo, this.requestId).pipe(
        tap(res => {
          this.bulkWageWorkflowDetails = res;
          this.csvDetails = new CsvFile(res.fileName, res.formSubmissionDate.gregorian, res.fileSize);
          this.csvDetails.documentType = 'CONTRIBUTOR.BULK-WAGE.BULK-WAGE-UPDATE-DOCUMENT';
        })
      )
    ])
      .pipe(
        catchError(err => {
          this.handleError(err, true);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }

  /** Method to download updated csv file. */
  downloadUpdatedCsvFile() {
    this.bulkWageService.downloadActiveContributorsCSV(this.registrationNo, null, true).subscribe(
      res => this.saveCsvFile(res),
      err => this.handleError(err, false)
    );
  }

  /** Method to save csv file. */
  saveCsvFile(dataFile: string) {
    const universalBOM = '\ufeff'; //Byte Order Mask to force UTF-8 when csv opened in excel
    const blob = new Blob([dataFile ? universalBOM + dataFile : dataFile], { type: 'text/csv;charset=utf-8;' });
    const dummyLink = document.createElement('a');
    if (dummyLink.download !== undefined) {
      const url = URL.createObjectURL(blob);
      dummyLink.setAttribute('href', url);
      dummyLink.setAttribute('download', ManageWageConstants.WAGE_UPDATE_FILE_NAME);
      dummyLink.style.visibility = 'hidden';
      document.body.appendChild(dummyLink);
      dummyLink.click();
      document.body.removeChild(dummyLink);
      URL.revokeObjectURL(url);
    }
  }

  /** Method to handle validator workflow events. */
  handleBulkWageWorkflow(key: number) {
    const action = super.getWorkflowAction(key);
    const data = super.setWorkflowData(this.routerData, action);
    this.saveWorkflow(data);
    this.hideModal();
  }

  /** Method to navigate to edit mode. */
  navigateToEdit() {
    this.router.navigate([ContributorRouteConstants.ROUTE_BULK_WAGE_UPDATE_EDIT]);
  }
  /** Method invoked when component is destroyed. */
  ngOnDestroy(): void {
    this.alertService.clearAllInfoAlerts();
  }
}
