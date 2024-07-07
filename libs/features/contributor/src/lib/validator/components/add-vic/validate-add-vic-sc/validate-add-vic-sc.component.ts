/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService, CalendarTypeEnum,
  Channel,
  DocumentService,
  LookupService, NIN,
  RouterData,
  RouterDataToken,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { noop, Observable, throwError } from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { ContributorRouteConstants } from '../../../../shared/constants';
import {
  DocumentTransactionId,
  DocumentTransactionType,
  PurposeOfRegsitrationEnum,
  ValidatorRoles
} from '../../../../shared/enums';
import {Contributor, RegistrationPurpose, VicEngagementDetails} from '../../../../shared/models';
import {
  AddVicService,
  ContributorService,
  EngagementService,
  EstablishmentService,
  VicService
} from '../../../../shared/services';
@Component({
  selector: 'cnt-validate-add-vic-sc',
  templateUrl: './validate-add-vic-sc.component.html',
  styleUrls: ['./validate-add-vic-sc.component.scss']
})
export class ValidateAddVicScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  /** Local variables */
  vicEngagementDetails: VicEngagementDetails;
  isDoctor: boolean;
  nin: number
  purposeOfEngagement: RegistrationPurpose;

  /** Creates an instance of ValidateAddVicScComponent. */
  constructor(
    readonly addVicService: AddVicService,
    readonly vicService: VicService,
    readonly alertService: AlertService,
    readonly engagementService: EngagementService,
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly workflowService: WorkflowService,
    readonly documentService: DocumentService,
    readonly lookupService: LookupService,
    readonly modalService: BsModalService,
    readonly router: Router,
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

  ngOnInit(): void {
    this.alertService.clearAlerts();
    super.readDataFromToken(this.routerData);
    super.setFlagsForView(this.routerData);
    this.checkDoctorView();
    super.getDefaultLookupValues();
    super.getSystemParameters();
    if (this.socialInsuranceNo && this.engagementId) this.initializeValidatorPage();
  }

  /** Method to check for doctor's view. */
  checkDoctorView() {
    if (this.routerData.assignedRole === ValidatorRoles.DOCTOR) {
      this.isDoctor = true;
      this.canReject = false;
      this.canReturn = false;
    }
  }

  /** Method to initialize the validator view. */
  initializeValidatorPage(): void {
    this.getVicContributorDetails()
      .pipe(
        switchMap(() => {
          return this.getRegisterVicDetails();
        }),
        switchMap(() => {
          return super.getDocuments(
            DocumentTransactionId.REGISTER_VIC_CONTRIBUTOR,
            this.checkDocumentTransactionType(this.vicEngagementDetails.purposeOfRegistration.english),
            this.engagementId,
            this.routerData.transactionId
          );
        }),
        switchMap(() => {
          return this.getPurposeOfEngagement(this.nin).pipe(map( res => {
            this.purposeOfEngagement = res;
          }));
        }),
        catchError(err => {
          super.handleError(err, true);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }

  /** Method to get vic contributor details. */
  getVicContributorDetails(): Observable<Contributor> {
    return this.contributorService
      .getContributorBySin(this.socialInsuranceNo, new Map().set('checkBeneficiaryStatus', true))
      .pipe(tap(res => {
        this.contributor = res
        this.isBeneficiary = this.contributor.isBeneficiary
        this.contributor.person.identity.forEach(id => {
          if (id.idType === "NIN") {
            this.nin = (<NIN>id).newNin
          }
        });
      }));
  }

  /** Method to get register vic details. */
  getRegisterVicDetails(): Observable<VicEngagementDetails> {
    return this.addVicService
      .getVicEngagementDetails(this.socialInsuranceNo, this.engagementId)
      .pipe(tap(res => (this.vicEngagementDetails = res)));
  }

  /** Method to check document transaction type  based on purpose of registration. */
  checkDocumentTransactionType(purposeOfRegistration: string): string[] {
    const documentType: string[] = [];
    switch (purposeOfRegistration) {
      case PurposeOfRegsitrationEnum.WORKING_OUTSIDE_SAUDI:
        documentType.push(DocumentTransactionType.REGISTER_VIC_CONTRIBUTOR_IN_OUTSIDE_SAUDI);
        break;
      case PurposeOfRegsitrationEnum.GOV_EMP_NOT_UNDER_PPA:
        documentType.push(DocumentTransactionType.REGISTER_GOV_VIC_CONTRIBUTOR_NOT_IN_PPA);
        break;
      case PurposeOfRegsitrationEnum.EMP_INT_POL_MIL:
        documentType.push(DocumentTransactionType.REGISTER_VIC_CONTRIBUTOR_IN_MILITORY_OR_POLITICAL_MISSIONS);
        break;
        case PurposeOfRegsitrationEnum.FREELANCER:
          case PurposeOfRegsitrationEnum.PROFESSIONAL:
            if(this.channel === Channel.TAMINATY ) documentType.push(DocumentTransactionType.REGISTER_VIC_CONTRIBUTOR_FREELANCER);
            else documentType.push(DocumentTransactionType.REGISTER_VIC_CONTRIBUTOR_FREELANCER_OR_PROFESSIONAL);
            break;
    }
      documentType.push(DocumentTransactionType.REGISTER_VIC_DOCTOR_MODIFY);
      documentType.push(
      this.channel === Channel.FIELD_OFFICE
        ? DocumentTransactionType.REGISTER_VIC_CONTRIBUTOR_FO
        : DocumentTransactionType.REGISTER_VIC_CONTRIBUTOR_GOL
    );
    return documentType;
  }

  /** Method to navigate to validator edit. */
  navigateToEdit(tab: number) {
    this.routerData.tabIndicator = tab;
    this.router.navigate([ContributorRouteConstants.ROUTE_ADD_VIC_EDIT]);
  }

  /** Method to handle workflow events. */
  handleVicWorkflowEvent(key: number) {
    const action = super.getWorkflowAction(key);
    const data = super.setWorkflowData(this.routerData, action);
    this.saveWorkflow(data);
    super.hideModal();
  }
  /** Method invoked when component is destroyed. */
  ngOnDestroy(): void {
    this.alertService.clearAllErrorAlerts();
  }

  /** Method to get purpose of registration. */
  getPurposeOfEngagement(nin: number) {
    return this.vicService.getPurposeOfEngagement(nin).pipe(tap(res => {
      this.purposeOfEngagement = res
    }));
  }
}
