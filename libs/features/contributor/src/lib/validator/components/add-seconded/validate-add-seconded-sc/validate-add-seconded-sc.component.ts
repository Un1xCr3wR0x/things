/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  DocumentService,
  LookupService,
  WorkflowService,
  RouterData,
  RouterDataToken
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, noop, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import moment from 'moment-timezone';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { ContributorRouteConstants } from '../../../../shared/constants';
import { ContributorService, EstablishmentService, SecondedService } from '../../../../shared/services';
import { DocumentTransactionId, DocumentTransactionType } from '../../../../shared/enums';
import { Contributor, SecondedDetails, PersonalInformation } from '../../../../shared/models';
@Component({
  selector: 'cnt-validate-add-seconded-sc',
  templateUrl: './validate-add-seconded-sc.component.html',
  styleUrls: ['./validate-add-seconded-sc.component.scss']
})
export class ValidateAddSecondedScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  /* Variables  */
  secondedDetails: SecondedDetails;
  secondedId: number;

  /** Creates an instance of ValidateAddSecondedScComponent. */
  constructor(
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly workflowService: WorkflowService,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly lookupService: LookupService,
    readonly modalService: BsModalService,
    readonly secondedService: SecondedService,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerData: RouterData
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

  ngOnInit(): void {
    this.alertService.clearAlerts();
    super.readDataFromToken(this.routerData);
    this.readTransactionDataFromToken(this.routerData);
    super.setFlagsForView(this.routerData);
    super.getDefaultLookupValues();
    if (this.registrationNo && this.secondedId) this.getDetailsOnPageLoad();
  }

  /** Method to read transaction data from token. */
  readTransactionDataFromToken(token: RouterData) {
    if (token.payload) {
      const payload = JSON.parse(token.payload);
      if (payload.id) this.secondedId = payload.id;
    }
  }

  /** Method to get details on page load. */
  getDetailsOnPageLoad() {
    this.establishmentService
      .getEstablishmentDetails(this.registrationNo)
      .pipe(
        tap(res => (this.establishment = res)),
        switchMap(() => {
          return this.secondedService.getSecondedDetails(this.registrationNo, this.secondedId).pipe(
            tap(res => (this.secondedDetails = res)),
            switchMap(res => {
              this.personId = res.personId;
              return this.getPersonDetails(res.personId);
            })
          );
        }),
        switchMap(() => {
          return super.getDocuments(
            DocumentTransactionId.ADD_SECONDED,
            DocumentTransactionType.ADD_SECONDED_FO,
            this.secondedId,
            this.routerData.transactionId
          );
        }),
        catchError(err => {
          super.handleError(err, true);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }

  /** Method to get person details. */
  getPersonDetails(personId: number): Observable<PersonalInformation> {
    return this.contributorService.getPersonById(personId).pipe(
      tap(res => {
        this.contributor = new Contributor();
        this.contributor.person = res;
        this.age = moment(new Date()).diff(moment(this.contributor.person.birthDate.gregorian), 'year');
      })
    );
  }

  /** Method to handle workflow events. */
  handleWorkflowEvents(key: number) {
    const action = super.getWorkflowAction(key);
    const data = super.setWorkflowData(this.routerData, action);
    this.saveWorkflow(data);
    super.hideModal();
  }

  /** Method to navigate to validator edit. */
  navigateToEdit() {
    this.router.navigate([ContributorRouteConstants.ROUTE_ADD_SECONDED_EDIT]);
  }
  /** Method invoked when component is destroyed. */
  ngOnDestroy(): void {
    this.alertService.clearAllInfoAlerts();
  }
}
