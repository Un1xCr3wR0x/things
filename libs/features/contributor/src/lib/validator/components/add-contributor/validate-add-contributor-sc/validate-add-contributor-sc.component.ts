/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Channel, InspectionReferenceType, InspectionStatus, InspectionTypeEnum, Role, RouterConstants, RouterData, RouterDataToken, WorkFlowActions,getIdentityByType,CommonIdentity } from '@gosi-ui/core';
import { AlertService, DocumentService, InspectionService, LookupService, WorkflowService } from '@gosi-ui/core/lib/services';
import { BsModalService } from 'ngx-bootstrap/modal';
import { iif, of } from 'rxjs';
import { switchMap, tap, filter, catchError} from 'rxjs/operators';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { ContributorConstants, ContributorRouteConstants } from '../../../../shared/constants';
import { ContributorTypesEnum, DocumentTransactionId, DocumentTransactionType, ValidatorRoles } from '../../../../shared/enums';
import { ContributorBPMRequest, EngagementDetails } from '../../../../shared/models';
import { ContributorService, EngagementService, EstablishmentService } from '../../../../shared/services';
import { getGccIdentity, getTransactionType } from '../../../../shared/utils';

@Component({
  selector: 'cnt-validate-add-contributor-sc',
  templateUrl: './validate-add-contributor-sc.component.html',
  styleUrls: ['./validate-add-contributor-sc.component.scss']
})
export class ValidateAddContributorScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  //Local Variables
  isFCValidator = false;
  canChangePenaltyIndicator = false;
  engagement: EngagementDetails;
  isContractRequired = false;
  legalEntityChanged = false;
  isHrsd = false;
  identifier : CommonIdentity;

  /** Child references. */
  @ViewChild('legalEntityChangeTemplate', { static: false })
  legalEntityChangetTemplate: TemplateRef<HTMLElement>;
  hasInspectionCompleted = false;
  fieldActivityNumber: string;
  canRequestInspection = false;
  disableIconReopen: boolean = false;

  /** Method to initialize AddContributorScComponent*/
  constructor(
    readonly contributorService: ContributorService,
    readonly establishmentService: EstablishmentService,
    readonly engagementService: EngagementService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly modalService: BsModalService,
    readonly workflowService: WorkflowService,
    readonly inspectionService: InspectionService,
    private fb: FormBuilder,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData
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

  /**
   * This method handles the initialization tasks.
   * @memberof  ContributorScComponent
   */
  ngOnInit() {
    this.alertService.clearAlerts();
    super.getDefaultLookupValues();
    this.initializeParameters();
    super.getSystemParameters();
    if(this.isPPA){
      this.validatorForm.addControl('penaltyIndicator', this.fb.control([true]));
      }else this.validatorForm.addControl('penaltyIndicator', this.fb.control([false]));
  }

  /**
   * Metod to initialize edit mode data
   */
  initializeParameters() {
    super.readDataFromToken(this.routerDataToken);
    super.setFlagsForView(this.routerDataToken);
    //Set validator types
    if (this.routerDataToken.assignedRole && this.routerDataToken.assignedRole === Role.CNT_FC_APPROVER) {
      this.isFCValidator = true;
    } else if (this.routerDataToken.assignedRole && this.routerDataToken.assignedRole === Role.VALIDATOR_2) {
      this.canChangePenaltyIndicator = false;
    } else {
      this.canChangePenaltyIndicator = true;
    }
    if (this.channel === Channel.HRSD) {
      this.isFCValidator = true;
    }
    if (
      (this.channel === Channel.HRSD || this.channel === Channel.MASAR || this.channel === Channel.AJEER) &&
      (this.routerDataToken.assignedRole === Role.VALIDATOR_1 || this.routerDataToken.assignedRole === Role.VALIDATOR)
    )
      this.isHrsd = true;
    this.getDataForView();
  }

  /** Method to check whether inspection is required. */
  checkInspectionRequired(role: string) {
    const validatorActions = this.routerDataToken.customActions;
    //console.log("roletoekn", this.reInspectionFlag)
    validatorActions.forEach(action => {
      if (action === WorkFlowActions.SEND_FOR_INSPECTION) {
        this.canRequestInspection = ((role === ValidatorRoles.VALIDATOR_ONE || role === ValidatorRoles.VALIDATOR) &&
            ((role === ValidatorRoles.VALIDATOR_ONE && this.engagement.backdatingIndicator)
            || (role === ValidatorRoles.VALIDATOR && this.engagement.backdatingIndicator && this.channel === Channel.GOSI_ONLINE)
            || this.reInspectionFlag));
      }
    })
  }


  /** Method to retrieve data for view. */
  getDataForView() {
    if (this.registrationNo && this.socialInsuranceNo && this.engagementId)
      super
        .getBasicDetails(new Map().set('checkBeneficiaryStatus', true))
        .pipe(tap(() => (this.contributor = getGccIdentity(this.contributor, this.contributor.contributorType))))
        .pipe(
          switchMap(() => this.getEngagementDetails()),
          switchMap(() => {
            return super.getDocuments(
              DocumentTransactionId.REGISTER_CONTRIBUTOR,
              [
                getTransactionType(
                  this.engagement.establishmentLegalEntity?.english,
                  this.contributor.person,
                  this.contributor.contributorType,
                  this.establishment?.gccEstablishment?.gccCountry
                ),
                DocumentTransactionType.BANK_UPDATE
              ],
              this.engagementId,
              this.routerDataToken.transactionId
            );
          }),
          switchMap(() => iif(() => !this.isPPA, this.checkWhetherInspetionIsCompleted(), of(true))),
          switchMap(() => iif(() => this.hasInspectionCompleted, this.getInspectionDocuments(), of(true))),

        )
        .subscribe({
          complete: () => {
            this.checkContractPreviewRequired();
            this.checkPenaltyIndicator(this.engagement);
            if (this.legalEntityChanged) this.showModal(this.legalEntityChangetTemplate, false, true);
          }
        });
  }

  /** Method to get engagement details. */
  getEngagementDetails() {
    return this.getEngagement(this.contributor.contributorType !== ContributorTypesEnum.SAUDI).pipe(
      tap(res => this.checkChangeInLegalEntity(res.establishmentLegalEntity?.english)),
      switchMap(res =>
        iif(
          () => !this.legalEntityChanged && this.contributor.contributorType === ContributorTypesEnum.SAUDI,
          this.getEngagement(true),
          of(res)
        )
      ),
      tap(res => this.setEngagementDetails(res))
    );
  }

  /** Method to get engagement. */
  getEngagement(isCoverageRequired: boolean) {
    return this.engagementService.getEngagementDetails(
      this.registrationNo,
      this.socialInsuranceNo,
      this.engagementId,
      undefined,
      isCoverageRequired
    );
  }

  /** Method to check change in legal entity of establishment. */
  checkChangeInLegalEntity(legalEntity: string) {
    //To check whether establishment legal entity changed from private to government or semi government
    if (legalEntity && ContributorConstants.GOVERNMENT_LEGAL_ENTITIES.indexOf(legalEntity) === -1) {
      if (
        this.establishment.legalEntity.english !== legalEntity &&
        ContributorConstants.GOVERNMENT_LEGAL_ENTITIES.indexOf(this.establishment.legalEntity.english) !== -1
      )
        this.legalEntityChanged = true;
    }
  }

  /** Method to set engagement details. */
  setEngagementDetails(engagement: EngagementDetails) {
    this.engagement = engagement;
    this.checkInspectionRequired(this.routerDataToken.assignedRole);
    this.engagement.isContributorActive = this.engagement.leavingDate?.gregorian ? false : true; //api removed this property so workaround
  }

  /** Method to check whether contract preview is required. */
  checkContractPreviewRequired() {
    //show contract if contributor contributor is active and establishment legal entity is not govt and semi govt
    //if legal entity changed from private to government and contributor is active show contract
    if (
      this.engagement?.isContributorActive &&
      this.engagement?.skipContract &&
      !this.establishment?.gccEstablishment?.gccCountry &&
      this.contributor?.contributorType === ContributorTypesEnum.SAUDI &&
      ContributorConstants.GOVERNMENT_LEGAL_ENTITIES.indexOf(this.engagement?.establishmentLegalEntity?.english) ===
        -1 &&
      !this.engagement?.backdatingIndicator
    ) {
      this.isContractRequired = true;
    }
  }

  /** Method to set penalty indicator */
  checkPenaltyIndicator(engagement: EngagementDetails) {
    const penaltyIndicator = this.validatorForm.get('penaltyIndicator');
    if (
      this.routerDataToken.assignedRole !== Role.VALIDATOR &&
      this.routerDataToken.assignedRole !== Role.VALIDATOR_1
    ) {
      this.canChangePenaltyIndicator = false;
      if (engagement.penaltyIndicator === null) {
        penaltyIndicator.setValue(true);
      } else {
        penaltyIndicator.setValue(engagement.penaltyIndicator);
      }
    } else {
      this.canChangePenaltyIndicator = true;
      if (engagement?.backdatingIndicator && this.routerDataToken.state === ContributorConstants.TRN_STATE_RETURN)
        penaltyIndicator.setValue(engagement.penaltyIndicator);
      else if (!engagement?.backdatingIndicator) penaltyIndicator.setValue(false);
    }
  }

  /** Method to handle workflow events. */
  handleWorkflowEvents(key: number) {
    const action = super.getWorkflowAction(key);
    const data = super.setWorkflowData(this.routerDataToken, action);
    if (this.validatorForm.get('penaltyIndicator'))
      data.penaltyIndicator = this.validatorForm.get('penaltyIndicator').value ? 1 : 0;
    if (
      (Role.VALIDATOR_1 === this.routerDataToken.assignedRole ||
        Role.VALIDATOR === this.routerDataToken.assignedRole) &&
      this.engagement?.backdatingIndicator
    )
      this.savePenaltyIndicator(data);
    else super.saveWorkflow(data);
    super.hideModal();
  }

  /** Method to dave penalty. */
  savePenaltyIndicator(payload: ContributorBPMRequest) {
    this.engagementService
      .updatePenaltyIndicator(this.registrationNo, this.socialInsuranceNo, this.engagementId, payload.penaltyIndicator)
      .subscribe(
        () => super.saveWorkflow(payload),
        err => this.handleError(err, false)
      );
  }

  /**Method to return to inbox */
  confirmCancel() {
    this.modalRef.hide();
    this.router.navigateByUrl(RouterConstants.ROUTE_INBOX);
  }

  /**
   * This method is used to navigate to csr view on clicking of edit icon
   */
  navigateToCsrView(tabIndex: number) {
    if(!this.engagement.ppaIndicator)
    this.contributorService.setPenaltyIndicator = this.validatorForm.get('penaltyIndicator').value ? 1 : 0;
  else this.contributorService.setPenaltyIndicator =0;
    this.routerDataToken.tabIndicator = tabIndex;
    this.router.navigate([ContributorRouteConstants.ROUTE_ADD_CONTRIBUTOR_EDIT]);
  }
  /*
   * This methode is to View contract details in new tab
   */
  onViewContractsClick() {
    const url = '#' + `/validator/preview/${this.registrationNo}/${this.socialInsuranceNo}/${this.engagementId}`;
    window.open(url, '_blank');
  }

  //if (this.channel === Channel.RASED)
  /** Method to check whether inspection is completed. */
  checkWhetherInspetionIsCompleted() {
      return this.inspectionService.getInspectionByTransactionId(this.referenceNo, this.socialInsuranceNo).pipe(
        filter(res => res && res.length > 0),
        tap(res => {
          this.hasInspectionCompleted = res[0].inspectionTypeInfo?.status === InspectionStatus.COMPLETED;
          this.fieldActivityNumber = res[0].fieldActivityNumber;
        })
      );
  }

  /** Method to get Inspection documents. */
  getInspectionDocuments() {
    this.identifier=getIdentityByType(this.contributor.person.identity,this.contributor.person.nationality.english)
    return this.documentService
      .getRasedDocuments(
        InspectionTypeEnum.EMPLOYEE_AFFAIRS,
        this.identifier.id,
        InspectionReferenceType.NATIONAL,
        this.fieldActivityNumber
      )
      .pipe(
        tap(docs => {
          if (docs.length > 0) this.documents = docs.concat(this.documents);
        }),
        catchError(err => {
          return of(this.documents);
        })
      );
  }


  /** Method to check for  active inspection. */
  checkForActiveInspection() {
    this.inspectionService
      .getInspectionList(this.registrationNo, this.socialInsuranceNo, true)
      .pipe(
        tap(res => {
          if (res.length > 0)
            this.alertService.showErrorByKey(ContributorConstants.VALIDATOR_CANNOT_SEND_FOR_INSPECTION, {
              personFullName: this.getPersonName(),
              transactionId: Number(res[0].transactionTraceId)
            });
          else
            this.initiateInspection(this.routerDataToken, 'CONTRIBUTOR.SUCCESS-MESSAGES.REGISTER-INSPECTION-SUCCESS-MESSAGE');
        })
      )
      .subscribe({ error: err => this.handleError(err, false) });
  }


  /** Method  to handle legal entity change. */
  handleLegalEntityChange() {
    this.hideModal();
    if (this.routerDataToken.assignedRole === Role.VALIDATOR_1) this.navigateToCsrView(1);
  }
  /** Method invoked when component is destroyed. */
  ngOnDestroy(): void {
    this.alertService.clearAllInfoAlerts();
  }
}
