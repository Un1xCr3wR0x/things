import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  AlertService,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  TransactionService,
  BilingualText,
  Person,
  getPersonArabicName
} from '@gosi-ui/core';
import { ContributorRouteConstants, EngagementDetails } from '../../../shared';
import { DocumentTransactionId, DocumentTransactionType } from '../../../shared/enums';
import { UpdatedWageListResponse } from '../../../shared/models';
import {
  ContributorService,
  EngagementService,
  EstablishmentService,
  ValidateWageUpdateService
} from '../../../shared/services';
import { TransactionBaseScComponent } from '../shared';
import { ChangePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { DashboardSearchService } from '@gosi-ui/foundation-dashboard/src/lib/search/services';
import { Location } from '@angular/common';

@Component({
  selector: 'upload-documents-sc',
  templateUrl: './upload-documents-sc.component.html',
  styleUrls: ['./upload-documents-sc.component.scss']
})
export class UploadDocumentsTransaction extends TransactionBaseScComponent implements OnInit, OnDestroy {
  updatedWageListResponse: UpdatedWageListResponse;
  engagement: EngagementDetails;
  errorMessage: BilingualText = new BilingualText();
  personId: number;
  contributorNameArabic: string;
  contributorNameEnglish: string;
  Nin: any;
  isSaudiPerson: boolean;
  transactionType: DocumentTransactionType;
  personDetails: Person;
  constructor(
    readonly contributorService: ContributorService,
    readonly establishmentService: EstablishmentService,
    readonly engagementService: EngagementService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly transactionService: TransactionService,
    readonly wageUpdateService: ValidateWageUpdateService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    public changePersonService: ChangePersonService,
    readonly dashboardSearchService: DashboardSearchService,
    readonly location: Location,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData
  ) {
    super(
      contributorService,
      establishmentService,
      engagementService,
      lookupService,
      documentService,
      transactionService,
      alertService,
      router
    );
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(param => {
      if (param) this.personId = Number(param.personId);
    });
    this.getTransactionDetails();
    this.getPersonDetails();
    this.fetchDataForView();
  }

  /** Method to retrieve person data for view. */
  getPersonDetails() {
    this.personIdentifier = this.nin || this.iqama || this.socialInsuranceNo;
    this.searchRequest.searchKey = this.personIdentifier.toString();

    if (!this.personIdentifier) {
      this.location.back();
    } else {
      this.dashboardSearchService.searchIndividual(this.searchRequest, false).subscribe(response => {
        this.personDetails = response.listOfPersons.filter(
          x => x.personId == this.changePersonService.getPersonId()
        )[0];

        this.contributorNameEnglish = this.personDetails.name.english.name;
        this.contributorNameArabic = getPersonArabicName(this.personDetails.name.arabic);
        this.isSaudiPerson = this.personDetails.nationality.english == 'Saudi Arabia' ? true : false;

        this.Nin = this.contributorService.NINDetails[0]?.newNin || this.contributorService.IqamaDetails[0]?.iqamaNo;
        this.fetchDataForView();
      });
    }
  }

  /** Method to retrieve data for validator view. */
  fetchDataForView() {
    super
      .getDocuments(
        DocumentTransactionId.UPLOAD_DOCUMENTS,
        DocumentTransactionType.UPLOAD_DOCUMENTS,
        null,
        this.referenceNo
      )
      .subscribe();
  }
  /**
   * Navigate to CSR edit view from validator view
   */
  navigateToCSR() {
    this.router.navigate([ContributorRouteConstants.ROUTE_UPDATE_INDIVIDUAL_WAGE_EDIT]);
  }
}
