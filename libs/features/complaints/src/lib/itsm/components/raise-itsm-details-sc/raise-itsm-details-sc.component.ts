/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit, SimpleChanges } from '@angular/core';
import { ContactBaseScComponent } from '../../../shared/components';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ValidatorService, ValidatorRoutingService } from '../../../shared/services';
import {
    DocumentService,
    UuidGeneratorService,
    AlertService,
    RouterData,
    RouterDataToken,
    WorkflowService,
    ApplicationTypeToken,
    RouterService,
    LookupService,
    TransactionService,
    MenuService,
    Environment,
    EnvironmentToken,
    AuthTokenService,
    LanguageToken,
    BilingualText,
    scrollToTop
} from '@gosi-ui/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { TypeSubtypeArEnum, TypeSubtypeEngEnum } from '../../../shared/enums/itsm-type-subtype';
@Component({
    selector: 'ces-raise-itsm-details-sc',
    templateUrl: './raise-itsm-details-sc.component.html',
    styleUrls: ['./raise-itsm-details-sc.component.scss']
})
export class RaiseItsmDetailsScComponent extends ContactBaseScComponent implements OnInit {
    /*
     * Local Variables
     */
    lang = 'en';
    typeBil: BilingualText = new BilingualText();
    subtypeBil: BilingualText = new BilingualText();
    id: any;
    serviceName: BilingualText = new BilingualText();
    itsmStatus: BilingualText = new BilingualText();

    /**
    *
    * @param modalService
    * @param validatorService
    * @param documentService
    * @param uuidService
    * @param alertService
    * @param router
    * @param workflowService
    * @param route
    * @param routerData
    * @param appToken
    * @param routerService
    * @param fb
    * @param lookUpService
    */

    constructor(
        readonly formBuilder: FormBuilder,
        readonly modalService: BsModalService,
        readonly validatorService: ValidatorService,
        readonly documentService: DocumentService,
        readonly uuidService: UuidGeneratorService,
        readonly alertService: AlertService,
        readonly router: Router,
        readonly workflowService: WorkflowService,
        public route: ActivatedRoute,
        @Inject(RouterDataToken) readonly routerData: RouterData,
        @Inject(ApplicationTypeToken) readonly appToken: string,
        readonly routerService: RouterService,
        readonly lookUpService: LookupService,
        readonly validatorRoutingService: ValidatorRoutingService,
        readonly transactionService: TransactionService,
        readonly location: Location,
        readonly menuService: MenuService,
        @Inject(EnvironmentToken) readonly environment: Environment,
        readonly transactionNavigationService: TransactionService,
        readonly authTokenService: AuthTokenService,
        @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    ) {
        super(
            formBuilder,
            modalService,
            validatorService,
            documentService,
            uuidService,
            alertService,
            router,
            workflowService,
            route,
            routerData,
            appToken,
            routerService,
            lookUpService,
            validatorRoutingService,
            location,
            menuService,
            environment,
            transactionNavigationService,
            authTokenService
        );
    }
    /*
     * Method is to initialise tasks
     */
    ngOnInit(): void {
        scrollToTop();
        this.language.subscribe(language => {
            this.lang = language;
        });
        this.route.params.subscribe(params => {
            this.id = params.id;
        });
        this.validatorService.getITSMDetails(this.id).subscribe(res => {
            this.itsmDetails = res;
            this.itsmDetails.category = this.category;
            switch (this.itsmDetails.status) {
                case TypeSubtypeEngEnum.Closed:
                    this.itsmStatus.english = TypeSubtypeEngEnum.Closed,
                        this.itsmStatus.arabic = TypeSubtypeArEnum.Closed
                    break;
                case TypeSubtypeEngEnum.Resolved:
                    this.itsmStatus.english = TypeSubtypeEngEnum.Resolved,
                        this.itsmStatus.arabic = TypeSubtypeArEnum.Resolved
                    break;
                case TypeSubtypeEngEnum.Reopened:
                    this.itsmStatus.english = TypeSubtypeEngEnum.Reopened,
                        this.itsmStatus.arabic = TypeSubtypeArEnum.Reopened
                    break;
                case TypeSubtypeEngEnum.InProgress:
                    this.itsmStatus.english = TypeSubtypeEngEnum.InProgress,
                        this.itsmStatus.arabic = TypeSubtypeArEnum.InProgress
                    break;
                case TypeSubtypeEngEnum.Assigned:
                    this.itsmStatus.english = TypeSubtypeEngEnum.Assigned,
                        this.itsmStatus.arabic = TypeSubtypeArEnum.Assigned
                    break;
            }
            switch (this.itsmDetails.type) {
                case TypeSubtypeEngEnum.Ameen:
                    this.typeBil.arabic=TypeSubtypeArEnum.Ameen,
                        this.typeBil.english=TypeSubtypeEngEnum.Ameen
                    break;
                case TypeSubtypeEngEnum.AmeenBenefits:
                    this.typeBil.arabic = TypeSubtypeArEnum.AmeenBenefits,
                        this.typeBil.english = TypeSubtypeEngEnum.AmeenBenefits
                    break;
                case TypeSubtypeEngEnum.AmeenCRM:
                    this.typeBil.arabic = TypeSubtypeArEnum.AmeenCRM,
                        this.typeBil.english = TypeSubtypeEngEnum.AmeenCRM
                    break;
                case TypeSubtypeEngEnum.AmeenContributionCollection:
                    this.typeBil.arabic = TypeSubtypeArEnum.AmeenContributionCollection,
                        this.typeBil.english = TypeSubtypeEngEnum.AmeenContributionCollection
                    break;
                case TypeSubtypeEngEnum.AmeenContributors:
                    this.typeBil.arabic = TypeSubtypeArEnum.AmeenContributors,
                        this.typeBil.english = TypeSubtypeEngEnum.AmeenContributors
                    break;
                case TypeSubtypeEngEnum.AmeenCore:
                    this.typeBil.arabic = TypeSubtypeArEnum.AmeenCore,
                        this.typeBil.english = TypeSubtypeEngEnum.AmeenCore
                    break;
                case TypeSubtypeEngEnum.AmeenEstablishments:
                    this.typeBil.arabic = TypeSubtypeArEnum.AmeenEstablishments,
                        this.typeBil.english = TypeSubtypeEngEnum.AmeenEstablishments
                    break;
                case TypeSubtypeEngEnum.AmeenOH:
                    this.typeBil.arabic = TypeSubtypeArEnum.AmeenOH,
                        this.typeBil.english = TypeSubtypeEngEnum.AmeenOH
                    break;
                case TypeSubtypeEngEnum.AmeenViolations:
                    this.typeBil.arabic = TypeSubtypeArEnum.AmeenViolations,
                        this.typeBil.english = TypeSubtypeEngEnum.AmeenViolations
                    break;
                case TypeSubtypeEngEnum.AmeenVoluntaryContributors:
                    this.typeBil.arabic = TypeSubtypeArEnum.AmeenVoluntaryContributors,
                        this.typeBil.english = TypeSubtypeEngEnum.AmeenVoluntaryContributors
                    break;
            }
            switch (this.itsmDetails.subType) {
                case TypeSubtypeEngEnum.Establishments:
                    this.subtypeBil.arabic = TypeSubtypeArEnum.Establishments,
                        this.subtypeBil.english = TypeSubtypeEngEnum.Establishments
                    break;
                case TypeSubtypeEngEnum.Contract:
                    this.subtypeBil.arabic = TypeSubtypeArEnum.Contract,
                        this.subtypeBil.english = TypeSubtypeEngEnum.Contract
                    break;
                case TypeSubtypeEngEnum.Contributors:
                    this.subtypeBil.arabic = TypeSubtypeArEnum.Contributors,
                        this.subtypeBil.english = TypeSubtypeEngEnum.Contributors
                    break;
                case TypeSubtypeEngEnum.OccupationHazards:
                    this.subtypeBil.arabic = TypeSubtypeArEnum.OccupationHazards,
                        this.subtypeBil.english = TypeSubtypeEngEnum.OccupationHazards
                    break;
                case TypeSubtypeEngEnum.CRM:
                    this.subtypeBil.arabic = TypeSubtypeArEnum.CRM,
                        this.subtypeBil.english = TypeSubtypeEngEnum.CRM
                    break;
                case TypeSubtypeEngEnum.Coreservices:
                    this.subtypeBil.arabic = TypeSubtypeArEnum.Coreservices,
                        this.subtypeBil.english = TypeSubtypeEngEnum.Coreservices
                    break;
                case TypeSubtypeEngEnum.Violations:
                    this.subtypeBil.arabic = TypeSubtypeArEnum.Violations,
                        this.subtypeBil.english = TypeSubtypeEngEnum.Violations
                    break;
                case TypeSubtypeEngEnum.Heirssupport:
                    this.subtypeBil.arabic = TypeSubtypeArEnum.Heirssupport,
                        this.subtypeBil.english = TypeSubtypeEngEnum.Heirssupport
                    break;
                case TypeSubtypeEngEnum.BeneficiariesSupport:
                    this.subtypeBil.arabic = TypeSubtypeArEnum.BeneficiariesSupport,
                        this.subtypeBil.english = TypeSubtypeEngEnum.BeneficiariesSupport
                    break;
            }

            let serviceName = this.itsmDetails.serviceName;
            switch (serviceName) {
                case TypeSubtypeEngEnum.CustomerPersonalDataManagement:
                    this.serviceName.arabic = TypeSubtypeArEnum.CustomerPersonalDataManagement,
                        this.serviceName.english = TypeSubtypeEngEnum.CustomerPersonalDataManagement
                    break;
                case TypeSubtypeEngEnum.ProActiveEstRegistration:
                    this.serviceName.arabic = TypeSubtypeArEnum.ProActiveEstRegistration,
                        this.serviceName.english = TypeSubtypeEngEnum.ProActiveEstRegistration
                    break;
                case TypeSubtypeEngEnum.EstablishmentInquiry:
                    this.serviceName.arabic = TypeSubtypeArEnum.EstablishmentInquiry,
                        this.serviceName.english = TypeSubtypeEngEnum.EstablishmentInquiry
                    break;
                case TypeSubtypeEngEnum.EstablishmentRegistration:
                    this.serviceName.arabic = TypeSubtypeArEnum.EstablishmentRegistration,
                        this.serviceName.english = TypeSubtypeEngEnum.EstablishmentRegistration
                    break;
                case TypeSubtypeEngEnum.DisplayEstablishmentData:
                    this.serviceName.arabic = TypeSubtypeArEnum.DisplayEstablishmentData,
                        this.serviceName.english = TypeSubtypeEngEnum.DisplayEstablishmentData
                    break;
                case TypeSubtypeEngEnum.UpdateEstablishmentData:
                    this.serviceName.arabic = TypeSubtypeArEnum.UpdateEstablishmentData,
                        this.serviceName.english = TypeSubtypeEngEnum.UpdateEstablishmentData
                    break;
                case TypeSubtypeEngEnum.GOSICertificates:
                    this.serviceName.arabic = TypeSubtypeArEnum.GOSICertificates,
                        this.serviceName.english = TypeSubtypeEngEnum.GOSICertificates
                    break;
                case TypeSubtypeEngEnum.EstablishmentTermination:
                    this.serviceName.arabic = TypeSubtypeArEnum.EstablishmentTermination,
                        this.serviceName.english = TypeSubtypeEngEnum.EstablishmentTermination
                    break;
                case TypeSubtypeEngEnum.SupervisorAuthority:
                    this.serviceName.arabic = TypeSubtypeArEnum.SupervisorAuthority,
                        this.serviceName.english = TypeSubtypeEngEnum.SupervisorAuthority
                    break;
                case TypeSubtypeEngEnum.EstablishmentRelation:
                    this.serviceName.arabic = TypeSubtypeArEnum.EstablishmentRelation,
                        this.serviceName.english = TypeSubtypeEngEnum.EstablishmentRelation
                    break;
                case TypeSubtypeEngEnum.ModifyEstablishmentHQ:
                    this.serviceName.arabic = TypeSubtypeArEnum.ModifyEstablishmentHQ,
                        this.serviceName.english = TypeSubtypeEngEnum.ModifyEstablishmentHQ
                    break;
                case TypeSubtypeEngEnum.ChangeEstablishmentOwner:
                    this.serviceName.arabic = TypeSubtypeArEnum.ChangeEstablishmentOwner,
                        this.serviceName.english = TypeSubtypeEngEnum.ChangeEstablishmentOwner
                    break;
                case TypeSubtypeEngEnum.ModifyContributorPeriod:
                    this.serviceName.arabic = TypeSubtypeArEnum.ModifyContributorPeriod,
                        this.serviceName.english = TypeSubtypeEngEnum.ModifyContributorPeriod
                    break;
                case TypeSubtypeEngEnum.ModifyVoluntaryContributorWages:
                    this.serviceName.arabic = TypeSubtypeArEnum.ModifyContributorsWages,
                        this.serviceName.english = TypeSubtypeEngEnum.ModifyContributorsWages
                    break;
                case TypeSubtypeEngEnum.DisplayContributorsData:
                    this.serviceName.arabic = TypeSubtypeArEnum.DisplayContributorsData,
                        this.serviceName.english = TypeSubtypeEngEnum.DisplayContributorsData
                    break;
                case TypeSubtypeEngEnum.ContributorsRegistrationOrRemoval:
                    this.serviceName.arabic = TypeSubtypeArEnum.ContributorsRegistrationOrRemoval,
                        this.serviceName.english = TypeSubtypeEngEnum.ContributorsRegistrationOrRemoval
                    break;
                case TypeSubtypeEngEnum.ContractsContributorsAgreements:
                    this.serviceName.arabic = TypeSubtypeArEnum.ContractsContributorsAgreements,
                        this.serviceName.english = TypeSubtypeEngEnum.ContractsContributorsAgreements
                    break;
                case TypeSubtypeEngEnum.UpdateContributorsDatawithHRSD:
                    this.serviceName.arabic = TypeSubtypeArEnum.UpdateContributorsDatawithHRSD,
                        this.serviceName.english = TypeSubtypeEngEnum.UpdateContributorsDatawithHRSD
                    break;
                case TypeSubtypeEngEnum.RelocateContributors:
                    this.serviceName.arabic = TypeSubtypeArEnum.RelocateContributors,
                        this.serviceName.english = TypeSubtypeEngEnum.RelocateContributors
                    break;
                case TypeSubtypeEngEnum.VoluntaryContributorRegistrationOrRemoval:
                    this.serviceName.arabic = TypeSubtypeArEnum.VoluntaryContributorRegistrationOrRemoval,
                        this.serviceName.english = TypeSubtypeEngEnum.VoluntaryContributorRegistrationOrRemoval
                    break;
                case TypeSubtypeEngEnum.ModifyVoluntaryContributorPeriod:
                    this.serviceName.arabic = TypeSubtypeArEnum.ModifyVoluntaryContributorPeriod,
                        this.serviceName.english = TypeSubtypeEngEnum.ModifyVoluntaryContributorPeriod
                    break;
                case TypeSubtypeEngEnum.DisplayVoluntaryContributorData:
                    this.serviceName.arabic = TypeSubtypeArEnum.DisplayVoluntaryContributorData,
                        this.serviceName.english = TypeSubtypeEngEnum.DisplayVoluntaryContributorData
                    break;
                case TypeSubtypeEngEnum.BillsAndReceipts:
                    this.serviceName.arabic = TypeSubtypeArEnum.BillsAndReceipts,
                        this.serviceName.english = TypeSubtypeEngEnum.BillsAndReceipts
                    break;
                case TypeSubtypeEngEnum.Notifications:
                    this.serviceName.arabic = TypeSubtypeArEnum.Notifications,
                        this.serviceName.english = TypeSubtypeEngEnum.Notifications
                    break;
                case TypeSubtypeEngEnum.SADADPayments:
                    this.serviceName.arabic = TypeSubtypeArEnum.SADADPayments,
                        this.serviceName.english = TypeSubtypeEngEnum.SADADPayments
                    break;
                case TypeSubtypeEngEnum.ManagingAccountsReceivable:
                    this.serviceName.arabic = TypeSubtypeArEnum.ManagingAccountsReceivable,
                        this.serviceName.english = TypeSubtypeEngEnum.ManagingAccountsReceivable
                    break;
                case TypeSubtypeEngEnum.Bills:
                    this.serviceName.arabic = TypeSubtypeArEnum.Bills,
                        this.serviceName.english = TypeSubtypeEngEnum.Bills
                    break;
                case TypeSubtypeEngEnum.RetirementLumpsumBenefit:
                    this.serviceName.arabic = TypeSubtypeArEnum.RetirementLumpsumBenefit,
                        this.serviceName.english = TypeSubtypeEngEnum.RetirementLumpsumBenefit
                    break;
                case TypeSubtypeEngEnum.RetirementPensionBenefit:
                    this.serviceName.arabic = TypeSubtypeArEnum.RetirementPensionBenefit,
                        this.serviceName.english = TypeSubtypeEngEnum.RetirementPensionBenefit
                    break;
                case TypeSubtypeEngEnum.HeirPensionBenefit:
                    this.serviceName.arabic = TypeSubtypeArEnum.HeirPensionBenefit,
                        this.serviceName.english = TypeSubtypeEngEnum.HeirPensionBenefit
                    break;
                case TypeSubtypeEngEnum.HeirLumpsumBenefit:
                    this.serviceName.arabic = TypeSubtypeArEnum.HeirLumpsumBenefit,
                        this.serviceName.english = TypeSubtypeEngEnum.HeirLumpsumBenefit
                    break;
                case TypeSubtypeEngEnum.SANED:
                    this.serviceName.arabic = TypeSubtypeArEnum.SANED,
                        this.serviceName.english = TypeSubtypeEngEnum.SANED
                    break;
                case TypeSubtypeEngEnum.Occupational:
                    this.serviceName.arabic = TypeSubtypeArEnum.Occupational,
                        this.serviceName.english = TypeSubtypeEngEnum.Occupational
                    break;
                case TypeSubtypeEngEnum.NonOccupational:
                    this.serviceName.arabic = TypeSubtypeArEnum.NonOccupational,
                        this.serviceName.english = TypeSubtypeEngEnum.NonOccupational
                    break;
                case TypeSubtypeEngEnum.Installment:
                    this.serviceName.arabic = TypeSubtypeArEnum.Installment,
                        this.serviceName.english = TypeSubtypeEngEnum.Installment
                    break;
                case TypeSubtypeEngEnum.Exemptionfromfines:
                    this.serviceName.arabic = TypeSubtypeArEnum.Exemptionfromfines,
                        this.serviceName.english = TypeSubtypeEngEnum.Exemptionfromfines
                    break;
                case TypeSubtypeEngEnum.OHClaims:
                    this.serviceName.arabic = TypeSubtypeArEnum.OHClaims,
                        this.serviceName.english = TypeSubtypeEngEnum.OHClaims
                    break;
                case TypeSubtypeEngEnum.PaymentRefund:
                    this.serviceName.arabic = TypeSubtypeArEnum.PaymentRefund,
                        this.serviceName.english = TypeSubtypeEngEnum.PaymentRefund
                    break;
                case TypeSubtypeEngEnum.injuries:
                    this.serviceName.arabic = TypeSubtypeArEnum.injuries,
                        this.serviceName.english = TypeSubtypeEngEnum.injuries
                    break;
                case TypeSubtypeEngEnum.Hospitals:
                    this.serviceName.arabic = TypeSubtypeArEnum.Hospitals,
                        this.serviceName.english = TypeSubtypeEngEnum.Hospitals
                    break;
                case TypeSubtypeEngEnum.Treatment:
                    this.serviceName.arabic = TypeSubtypeArEnum.Treatment,
                        this.serviceName.english = TypeSubtypeEngEnum.Treatment
                    break;
                case TypeSubtypeEngEnum.CRMService:
                    this.serviceName.arabic = TypeSubtypeArEnum.CRMService,
                        this.serviceName.english = TypeSubtypeEngEnum.CRMService
                    break;
                case TypeSubtypeEngEnum.Documents:
                    this.serviceName.arabic = TypeSubtypeArEnum.Documents,
                        this.serviceName.english = TypeSubtypeEngEnum.Documents
                    break;
                case TypeSubtypeEngEnum.Transactions:
                    this.serviceName.arabic = TypeSubtypeArEnum.Transactions,
                        this.serviceName.english = TypeSubtypeEngEnum.Transactions
                    break;
                case TypeSubtypeEngEnum.Login:
                    this.serviceName.arabic = TypeSubtypeArEnum.Login,
                        this.serviceName.english = TypeSubtypeEngEnum.Login
                    break;
                case TypeSubtypeEngEnum.TextMessages:
                    this.serviceName.arabic = TypeSubtypeArEnum.TextMessages,
                        this.serviceName.english = TypeSubtypeEngEnum.TextMessages
                    break;
                case TypeSubtypeEngEnum.Permissions:
                    this.serviceName.arabic = TypeSubtypeArEnum.Permissions,
                        this.serviceName.english = TypeSubtypeEngEnum.Permissions
                    break;
                case TypeSubtypeEngEnum.AddingViolation:
                    this.serviceName.arabic = TypeSubtypeArEnum.AddingViolation,
                        this.serviceName.english = TypeSubtypeEngEnum.AddingViolation
                    break;
                case TypeSubtypeEngEnum.EditingViolation:
                    this.serviceName.arabic = TypeSubtypeArEnum.EditingViolation,
                        this.serviceName.english = TypeSubtypeEngEnum.EditingViolation
                    break;
                case TypeSubtypeEngEnum.CancellationofViolation:
                    this.serviceName.arabic = TypeSubtypeArEnum.CancellationofViolation,
                        this.serviceName.english = TypeSubtypeEngEnum.CancellationofViolation
                    break;
                default:
                    this.serviceName.arabic=serviceName,
                    this.serviceName.english=serviceName

            }
            //this.itsmDetails.resolvedDate = this.ticketHistory[0].resolvedDate;
        })
    }

    onTicketClick() {
        this.onITSMDetails(this.itsmDetails.instanceId);
    }

}
